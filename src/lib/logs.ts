import { supabaseAdmin } from "@/lib/supabaseAdmin";

type LogEntry = {
  acteurEmail: string | null | undefined;
  acteurNom?: string;
  module: string;
  action: string;
  cible?: string;
  details?: Record<string, any>;
  etatAvant?: Record<string, any> | null;
  etatApres?: Record<string, any> | null;
  adresseIp?: string;
  userAgent?: string;
};

// Extrait l'adresse IP et le user-agent depuis une requête entrante.
// Note : en local (localhost) l'IP est souvent vide ou "::1" — c'est normal.
// En production (site déployé), l'IP réelle apparaît via les en-têtes du proxy.
export function contexteRequete(req: Request): { adresseIp: string; userAgent: string } {
  const h = req.headers;
  const adresseIp =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "";
  const userAgent = h.get("user-agent") || "";
  return { adresseIp, userAgent };
}

// Enregistre une action admin dans le journal.
// Ne bloque JAMAIS l'action principale : si le log échoue, on log l'erreur en console mais on continue.
export async function enregistrerLog(entry: LogEntry): Promise<void> {
  try {
    await supabaseAdmin.from("admin_logs").insert({
      acteur_email: (entry.acteurEmail || "").toLowerCase(),
      acteur_nom: entry.acteurNom || "",
      module: entry.module || "",
      action: entry.action || "",
      cible: entry.cible || "",
      details: entry.details || {},
      etat_avant: entry.etatAvant ?? null,
      etat_apres: entry.etatApres ?? null,
      adresse_ip: entry.adresseIp || "",
      user_agent: entry.userAgent || "",
    });
  } catch (e) {
    console.error("⚠️ Échec d'enregistrement du log :", e);
  }
}