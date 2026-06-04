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

// Détermine si une IP est locale/privée (pas géolocalisable)
function estIPLocale(ip: string): boolean {
  if (!ip) return true;
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("fe80:") ||
    ip === "localhost"
  );
}

// Géolocalise une IP via ip-api.com (gratuit, sans clé).
// Renvoie "Ville, Pays" ou "" si impossible. Ne lève jamais d'erreur.
async function geolocaliserIP(ip: string): Promise<string> {
  if (estIPLocale(ip)) return "";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s max
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,city&lang=fr`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!res.ok) return "";
    const data = await res.json();
    if (data.status !== "success") return "";
    const ville = data.city || "";
    const pays = data.country || "";
    if (ville && pays) return `${ville}, ${pays}`;
    return pays || ville || "";
  } catch {
    return "";
  }
}

// Enregistre une action admin dans le journal.
// Ne bloque JAMAIS l'action principale : si le log échoue, on log l'erreur en console mais on continue.
export async function enregistrerLog(entry: LogEntry): Promise<void> {
  try {
    const localisation = await geolocaliserIP(entry.adresseIp || "");
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
      localisation: localisation || "",
    });
  } catch (e) {
    console.error("⚠️ Échec d'enregistrement du log :", e);
  }
}