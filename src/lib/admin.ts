// Liste des administrateurs et leurs rôles.
// Pour ajouter un admin : ajoute son email ici avec son rôle.
// Rôles possibles : "owner" (accès total) | "editor" (accès limité, à venir)

export type AdminRole = "owner" | "editor";

export const ADMINS: Record<string, AdminRole> = {
  "ethanmoreau8111@gmail.com": "owner",
  // "email-associe@exemple.com": "owner",   // <- à décommenter quand tu auras l'email
  // "employe@exemple.com": "editor",        // <- exemple d'accès limité futur
};

// Vérifie si un email est admin
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() in ADMINS;
}

// Récupère le rôle d'un email (ou null si pas admin)
export function getAdminRole(email: string | null | undefined): AdminRole | null {
  if (!email) return null;
  return ADMINS[email.toLowerCase()] ?? null;
}