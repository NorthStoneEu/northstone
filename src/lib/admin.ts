import { supabaseAdmin } from "@/lib/supabaseAdmin";

// ── Rôles ──
export type AdminRole = "owner" | "manager" | "editor";

// ── Modules (permissions) disponibles dans le back-office ──
// Ajoute ici un nouveau module quand tu le construis (ex: "ventes", "mail"...)
export const MODULES = [
  { id: "produits", label: "Produits" },
  { id: "dashboard", label: "Tableau de bord & statistiques" },
  { id: "ventes", label: "Ventes & chiffre d'affaires" },
  { id: "mail", label: "Messages clients" },
  { id: "drops", label: "Gestion des drops" },
  { id: "admins", label: "Gestion des accès" },
] as const;

export type ModuleId = (typeof MODULES)[number]["id"];

// ── OWNER PERMANENT (toi) — codé en dur, ne peut JAMAIS être retiré ──
// Accès total à tous les modules, quoi qu'il arrive.
const OWNER_PERMANENT = "ethanmoreau8111@gmail.com";

// Type d'un admin tel que stocké/renvoyé
export type AdminInfo = {
  email: string;
  nom: string;
  role: AdminRole;
  permissions: ModuleId[];
};

// Tous les modules (pour l'owner)
const TOUS_MODULES = MODULES.map((m) => m.id) as ModuleId[];

// ── Récupère les infos admin d'un email (toi en dur, sinon Supabase) ──
export async function getAdminInfo(
  email: string | null | undefined
): Promise<AdminInfo | null> {
  if (!email) return null;
  const e = email.toLowerCase();

  // Owner permanent (toi) : accès total
  if (e === OWNER_PERMANENT) {
    return { email: e, nom: "Fondateur", role: "owner", permissions: TOUS_MODULES };
  }

  // Sinon : on cherche dans la table Supabase
  const { data, error } = await supabaseAdmin
    .from("admins")
    .select("*")
    .eq("email", e)
    .maybeSingle();

  if (error || !data) return null;

  return {
    email: data.email,
    nom: data.nom || "",
    role: (data.role as AdminRole) || "editor",
    permissions: (data.permissions as ModuleId[]) || [],
  };
}

// ── Est admin ? (true si owner permanent OU présent en base) ──
export async function isAdmin(email: string | null | undefined): Promise<boolean> {
  const info = await getAdminInfo(email);
  return info !== null;
}

// ── A accès à un module précis ? ──
export async function aAcces(
  email: string | null | undefined,
  module: ModuleId
): Promise<boolean> {
  const info = await getAdminInfo(email);
  if (!info) return false;
  if (info.role === "owner") return true; // owner = accès total
  return info.permissions.includes(module);
}

// ── Est l'owner permanent (toi) ? ──
export function estOwnerPermanent(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === OWNER_PERMANENT;
}