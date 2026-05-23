-- ============================================================
--  NORTHSTONE — Schéma de base de données Supabase
--  Exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================


-- ── TYPES ENUM ─────────────────────────────────────────────

CREATE TYPE product_status AS ENUM (
  'available',      -- jamais scanné/réclamé
  'claimed',        -- propriétaire enregistré, pas gagnant
  'prize_pending',  -- gagnant, gain non encore versé
  'prize_paid'      -- gagnant, gain versé
);

CREATE TYPE transfer_method AS ENUM (
  'initial_claim',  -- premier scan par l'acheteur original
  'transfer'        -- revente / transfert de propriété
);


-- ── TABLE : drops ───────────────────────────────────────────

CREATE TABLE drops (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text          NOT NULL,                        -- ex: "Drop 01"
  description   text,
  total_pieces  int           NOT NULL CHECK (total_pieces > 0),
  total_winners int           NOT NULL CHECK (total_winners >= 0),
  release_date  timestamptz,
  is_active     boolean       NOT NULL DEFAULT false,
  created_at    timestamptz   NOT NULL DEFAULT now(),

  CONSTRAINT winners_lte_pieces CHECK (total_winners <= total_pieces)
);


-- ── TABLE : users ───────────────────────────────────────────
-- Profil public lié à auth.users (géré par Supabase Auth)

CREATE TABLE users (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text        NOT NULL,
  full_name   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Trigger : crée automatiquement le profil à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── TABLE : products ────────────────────────────────────────
-- Un enregistrement par t-shirt physique

CREATE TABLE products (
  id                uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id           uuid            NOT NULL REFERENCES drops(id) ON DELETE RESTRICT,
  serial_number     int             NOT NULL CHECK (serial_number > 0),
  qr_token          text            NOT NULL UNIQUE,           -- token brut (dans le QR code)
  qr_token_hash     text            NOT NULL UNIQUE,           -- SHA-256 du token (pour lookup API)
  is_winner         boolean         NOT NULL DEFAULT false,
  prize_amount      decimal(10, 2)  CHECK (prize_amount > 0), -- null si non gagnant
  is_claimed        boolean         NOT NULL DEFAULT false,
  claimed_at        timestamptz,
  current_owner_id  uuid            REFERENCES users(id) ON DELETE SET NULL,
  status            product_status  NOT NULL DEFAULT 'available',
  created_at        timestamptz     NOT NULL DEFAULT now(),

  UNIQUE (drop_id, serial_number),
  -- Cohérence : prize_amount exige is_winner = true
  CONSTRAINT prize_requires_winner CHECK (
    prize_amount IS NULL OR is_winner = true
  ),
  -- Cohérence : claimed_at exige is_claimed = true
  CONSTRAINT claimed_at_requires_is_claimed CHECK (
    claimed_at IS NULL OR is_claimed = true
  )
);

CREATE INDEX idx_products_qr_token      ON products(qr_token);
CREATE INDEX idx_products_qr_token_hash ON products(qr_token_hash);
CREATE INDEX idx_products_drop_id       ON products(drop_id);
CREATE INDEX idx_products_owner         ON products(current_owner_id);
CREATE INDEX idx_products_status        ON products(status);


-- ── TABLE : ownership_history ───────────────────────────────
-- Trace immuable de tous les transferts de propriété

CREATE TABLE ownership_history (
  id                  uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          uuid            NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  previous_owner_id   uuid            REFERENCES users(id) ON DELETE SET NULL, -- null = premier claim
  new_owner_id        uuid            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  transferred_at      timestamptz     NOT NULL DEFAULT now(),
  transfer_method     transfer_method NOT NULL
);

CREATE INDEX idx_ownership_product   ON ownership_history(product_id);
CREATE INDEX idx_ownership_new_owner ON ownership_history(new_owner_id);


-- ── TABLE : transfer_codes ──────────────────────────────────
-- Codes temporaires générés par le propriétaire pour transférer un article

CREATE TABLE transfer_codes (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  code        text        NOT NULL UNIQUE,                      -- 10 caractères alphanumériques
  created_by  uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '48 hours',
  used        boolean     NOT NULL DEFAULT false,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT used_at_requires_used CHECK (used_at IS NULL OR used = true)
);

CREATE INDEX idx_transfer_codes_code       ON transfer_codes(code);
CREATE INDEX idx_transfer_codes_product    ON transfer_codes(product_id);
CREATE INDEX idx_transfer_codes_created_by ON transfer_codes(created_by);
CREATE INDEX idx_transfer_codes_expires    ON transfer_codes(expires_at) WHERE used = false;


-- ── TABLE : scan_logs ──────────────────────────────────────
-- Journalisation de chaque tentative de scan (anti-fraude)

CREATE TABLE scan_logs (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          uuid        REFERENCES products(id) ON DELETE SET NULL, -- null si token invalide
  qr_token_attempted  text        NOT NULL,                    -- token tel que reçu (pour audit)
  scanned_at          timestamptz NOT NULL DEFAULT now(),
  ip_address          text,
  user_agent          text,
  was_valid           boolean     NOT NULL,
  user_id             uuid        REFERENCES users(id) ON DELETE SET NULL -- null si non connecté
);

CREATE INDEX idx_scan_logs_product    ON scan_logs(product_id);
CREATE INDEX idx_scan_logs_scanned_at ON scan_logs(scanned_at);
CREATE INDEX idx_scan_logs_ip         ON scan_logs(ip_address);
CREATE INDEX idx_scan_logs_valid      ON scan_logs(was_valid);


-- ── VUE PUBLIQUE : products_public ─────────────────────────
-- Expose uniquement les champs non-sensibles pour la page /verify
-- N'inclut PAS : is_winner, prize_amount, qr_token, current_owner_id

CREATE OR REPLACE VIEW products_public AS
  SELECT
    p.id,
    p.drop_id,
    d.name  AS drop_name,
    p.serial_number,
    p.qr_token_hash,
    p.is_claimed,
    p.claimed_at,
    p.status,
    p.created_at
  FROM products p
  JOIN drops d ON p.drop_id = d.id;


-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE drops            ENABLE ROW LEVEL SECURITY;
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ownership_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_codes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_logs        ENABLE ROW LEVEL SECURITY;


-- ── DROPS : lecture publique ────────────────────────────────
CREATE POLICY "drops: lecture publique"
  ON drops FOR SELECT
  USING (true);

-- Aucune politique INSERT/UPDATE/DELETE → seul le service_role peut modifier


-- ── PRODUCTS : lecture publique (champs non-sensibles via la vue) ──
-- Les routes API filtrent is_winner / prize_amount pour les non-propriétaires
CREATE POLICY "products: lecture publique"
  ON products FOR SELECT
  USING (true);

-- Aucune politique INSERT/UPDATE/DELETE → seul le service_role peut modifier


-- ── USERS : chaque utilisateur gère son propre profil ───────
CREATE POLICY "users: lecture propre"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users: insertion propre"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users: mise à jour propre"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ── OWNERSHIP_HISTORY : lecture par les parties concernées ──
CREATE POLICY "ownership_history: lecture propriétaires"
  ON ownership_history FOR SELECT
  USING (
    auth.uid() = new_owner_id OR
    auth.uid() = previous_owner_id
  );

-- Aucune politique d'écriture → seul le service_role insère


-- ── TRANSFER_CODES : propriétaire uniquement ────────────────
CREATE POLICY "transfer_codes: accès propriétaire"
  ON transfer_codes FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "transfer_codes: création propriétaire"
  ON transfer_codes FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "transfer_codes: suppression propriétaire"
  ON transfer_codes FOR DELETE
  USING (auth.uid() = created_by AND used = false);

-- UPDATE géré uniquement par service_role (marquer comme utilisé)


-- ── SCAN_LOGS : aucun accès direct utilisateur ──────────────
-- Pas de SELECT policy → inaccessible via anon/authenticated
-- Toutes les écritures passent par service_role côté serveur


-- ============================================================
--  DONNÉES INITIALES
-- ============================================================

INSERT INTO drops (name, description, total_pieces, total_winners, is_active)
VALUES (
  'Drop 01',
  'Premier drop Northstone. 400 t-shirts numérotés, chacun porteur d''un QR code unique.',
  400,
  130,
  false
);
