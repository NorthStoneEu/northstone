import { createClient } from "@supabase/supabase-js";

// Client ADMIN : utilise la clé secrète (service_role).
// À N'UTILISER QUE CÔTÉ SERVEUR (jamais dans un composant "use client").
// La clé n'a pas de préfixe NEXT_PUBLIC_ donc elle reste invisible au navigateur.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});