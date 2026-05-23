# Base de données Northstone — Guide de configuration

## 1. Créer le projet Supabase

1. Va sur [supabase.com](https://supabase.com) et connecte-toi
2. Clique sur **New project**
3. Remplis :
   - **Name** : `northstone`
   - **Database Password** : génère un mot de passe fort et **note-le**
   - **Region** : choisis la plus proche (ex: `West EU (Ireland)`)
4. Clique **Create new project** et attends ~2 minutes

---

## 2. Récupérer les clés API

Dans le dashboard Supabase, va dans **Project Settings > API** :

| Variable | Où la trouver |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Champ **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Champ **anon public** (sous *Project API keys*) |
| `SUPABASE_SERVICE_ROLE_KEY` | Champ **service_role** (sous *Project API keys*, cliquer "Reveal") |

> **Important** : La `service_role` key bypass toutes les règles RLS.
> Ne jamais l'exposer côté client ou dans le code front-end.

---

## 3. Remplir le fichier `.env.local`

Ouvre `.env.local` à la racine du projet et colle tes valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Ce fichier est déjà dans `.gitignore` (règle `.env*`). Il ne sera jamais commité.

---

## 4. Exécuter le schéma SQL

1. Dans le dashboard Supabase, clique sur **SQL Editor** dans la barre latérale
2. Clique sur **New query**
3. Ouvre le fichier `supabase/schema.sql` de ce projet
4. Copie tout le contenu et colle-le dans l'éditeur
5. Clique **Run** (ou `Ctrl+Enter`)

Tu devrais voir : `Success. No rows returned` pour chaque bloc.

### Vérifier que tout est en place

Dans **Table Editor**, tu dois voir ces tables :
- `drops`
- `users`
- `products`
- `ownership_history`
- `transfer_codes`
- `scan_logs`

Dans **Database > Views**, tu dois voir :
- `products_public`

Dans **Database > Functions**, tu dois voir :
- `handle_new_user`

---

## 5. Activer l'authentification (optionnel pour l'instant)

Dans **Authentication > Providers** :
- **Email** est activé par défaut ✓
- Tu pourras ajouter Google/Apple plus tard

Dans **Authentication > URL Configuration** :
- **Site URL** : `http://localhost:3000` (dev) puis ton domaine en prod

---

## Architecture de sécurité

```
Client (navigateur)
  └── anon key → RLS appliqué → lecture publique seulement
  
Serveur (API Routes Next.js)
  └── service_role → RLS bypassé → toutes les opérations sensibles
      (claim QR code, marquer gagnant, enregistrer scan_log, etc.)
```

### Ce que voit le public (via `products_public`)
- Numéro de série, statut, drop name, date de claim
- **Pas** de `is_winner`, `prize_amount`, `qr_token`, ni d'identité du propriétaire

### Ce que voit le propriétaire (via API Route authentifiée)
- Tout ce qui précède + `is_winner` + `prize_amount`
- Uniquement après vérification `auth.uid() === current_owner_id` côté serveur

---

## Générer les types TypeScript depuis Supabase (après configuration)

Une fois tes clés en place, tu pourras remplacer le fichier `src/types/database.ts`
par des types auto-générés :

```bash
npx supabase gen types typescript --project-id <ton-project-id> > src/types/database.ts
```

Trouve ton `project-id` dans **Project Settings > General**.
