import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "ns_2fa_ok";
// Clé pour signer le cookie. Idéalement dans .env, mais fallback sur la clé service.
const SECRET = process.env.TWOFA_COOKIE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback-secret";

// Signe une valeur (email) pour empêcher la falsification du cookie
function signer(valeur: string): string {
  const hmac = crypto.createHmac("sha256", SECRET).update(valeur).digest("hex");
  return `${valeur}.${hmac}`;
}

function verifierSignature(signe: string): string | null {
  const idx = signe.lastIndexOf(".");
  if (idx === -1) return null;
  const valeur = signe.slice(0, idx);
  const sig = signe.slice(idx + 1);
  const attendu = crypto.createHmac("sha256", SECRET).update(valeur).digest("hex");
  // Comparaison à temps constant
  if (sig.length !== attendu.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(attendu))) return null;
  return valeur;
}

// Marque la session comme "2FA validée" pour cet email
export async function marquerSession2faValide(email: string): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_NAME, signer(email.toLowerCase()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // pas de maxAge → cookie de session (expire à la fermeture du navigateur)
  });
}

// La session est-elle validée pour cet email ?
export async function session2faValide(email: string): Promise<boolean> {
  const c = await cookies();
  const cookie = c.get(COOKIE_NAME);
  if (!cookie) return false;
  const valeur = verifierSignature(cookie.value);
  return valeur === email.toLowerCase();
}

// Efface la validation (déconnexion 2FA)
export async function effacerSession2fa(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}