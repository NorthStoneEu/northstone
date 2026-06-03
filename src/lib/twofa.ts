import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import crypto from "crypto";

// Nom affiché dans l'app d'authentification (Google Authenticator, etc.)
const ISSUER = "Northstone Admin";

// ── Génère un nouveau secret TOTP ──
export function genererSecret(): string {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

// ── Construit l'objet TOTP pour un email + secret donnés ──
function creerTotp(email: string, secret: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
}

// ── Génère l'URL otpauth:// + l'image QR code (data URL) ──
export async function genererQRCode(email: string, secret: string): Promise<string> {
  const totp = creerTotp(email, secret);
  const uri = totp.toString(); // otpauth://totp/...
  return await QRCode.toDataURL(uri);
}

// ── Vérifie un code à 6 chiffres ──
// window:1 tolère un petit décalage d'horloge (code précédent/suivant)
export function verifierCode(email: string, secret: string, code: string): boolean {
  if (!code || !/^\d{6}$/.test(code.trim())) return false;
  const totp = creerTotp(email, secret);
  const delta = totp.validate({ token: code.trim(), window: 1 });
  return delta !== null;
}

// ── Codes de secours ──

// Génère N codes de secours lisibles (ex: "A3F9-K2P7")
export function genererCodesSecours(n = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < n; i++) {
    const brut = crypto.randomBytes(4).toString("hex").toUpperCase(); // 8 caractères
    codes.push(`${brut.slice(0, 4)}-${brut.slice(4, 8)}`);
  }
  return codes;
}

// Hache un code de secours (irréversible) pour le stockage
export function hacherCode(code: string): string {
  return crypto.createHash("sha256").update(code.replace(/-/g, "").toUpperCase()).digest("hex");
}

// Hache une liste de codes de secours (pour stockage en base)
export function hacherCodesSecours(codes: string[]): string[] {
  return codes.map(hacherCode);
}

// Vérifie si un code de secours saisi correspond à un des codes hachés.
// Retourne l'index du code utilisé (pour le retirer ensuite), ou -1 si invalide.
export function verifierCodeSecours(codeSaisi: string, codesHaches: string[]): number {
  if (!codeSaisi) return -1;
  const hache = hacherCode(codeSaisi);
  return codesHaches.indexOf(hache);
}