import { currentUser } from "@clerk/nextjs/server";
import { getAdminInfo } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { session2faValide } from "@/lib/twofaSession";

// Résultat possible :
// - "ok"          → admin + 2FA validée pour la session → on laisse passer
// - "pas-admin"   → pas admin → rediriger vers "/"
// - "2fa-requise" → admin mais 2FA non configurée ou session non validée → rediriger vers "/admin/2fa"
export async function verifier2fa(): Promise<"ok" | "pas-admin" | "2fa-requise"> {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const info = await getAdminInfo(email);

  if (!info || !email) return "pas-admin";

  // La 2FA est-elle active pour ce compte ?
  const { data } = await supabaseAdmin
    .from("admin_2fa")
    .select("active")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  const configuree = !!data?.active;

  // Session validée ?
  const sessionOk = await session2faValide(email);

  // Il faut À LA FOIS que la 2FA soit configurée ET que la session soit validée
  if (!configuree || !sessionOk) return "2fa-requise";

  return "ok";
}