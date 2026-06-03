import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { MODULES, type ModuleId, type Permissions } from "@/lib/modules";

// ── Rôles ──
export type AdminRole = "owner" | "manager" | "editor";

// Ré-export pour que les fichiers qui importaient depuis admin.ts continuent de marcher
export { MODULES };
export type { ModuleId, Permissions };

// ── OWNER PERMANENT (toi) — codé en dur, ne peut JAMAIS être retiré ──
const OWNER_PERMANENT = "ethanmoreau8111@gmail.com";

// Type d'un admin tel que stocké/renvoyé
export type AdminInfo = {
  email: string;
  nom: string;           // nom d'affichage (existant)
  prenom: string;
  nomFamille: string;
  poste: string;
  role: AdminRole;
  permissions: Permissions;
  ajoutePar: string;
};

// ── Helpers actions ──

// Toutes les actions d'un module donné (ids)
export function actionsDuModule(moduleId: ModuleId): string[] {
  const m = MODULES.find((mod) => mod.id === moduleId);
  return m ? m.actions.map((a) => a.id) : [];
}

// Objet "all permissions" : toutes les actions de tous les modules
export const TOUTES_PERMISSIONS: Permissions = MODULES.reduce((acc, m) => {
  acc[m.id] = m.actions.map((a) => a.id);
  return acc;
}, {} as Permissions);

// L'admin a-t-il TOUTES les permissions de tous les modules ?
export function aToutesPermissions(permissions: Permissions): boolean {
  return MODULES.every((m) => {
    const accordees = permissions[m.id] || [];
    return m.actions.every((a) => accordees.includes(a.id));
  });
}

// ── Récupère les infos admin d'un email (toi en dur, sinon Supabase) ──
export async function getAdminInfo(
  email: string | null | undefined
): Promise<AdminInfo | null> {
  if (!email) return null;
  const e = email.toLowerCase();

  // Owner permanent (toi) : accès total
  if (e === OWNER_PERMANENT) {
    return {
      email: e,
      nom: "Fondateur",
      prenom: "",
      nomFamille: "",
      poste: "Fondateur",
      role: "owner",
      permissions: TOUTES_PERMISSIONS,
      ajoutePar: "",
    };
  }

  // Sinon : on cherche dans la table Supabase
  const { data, error } = await supabaseAdmin
    .from("admins")
    .select("*")
    .eq("email", e)
    .maybeSingle();

  if (error || !data) return null;

  // permissions peut être null/objet selon l'état de la base → on normalise
  let permissions: Permissions = {};
  if (data.permissions && typeof data.permissions === "object" && !Array.isArray(data.permissions)) {
    permissions = data.permissions as Permissions;
  }

  return {
    email: data.email,
    nom: data.nom || "",
    prenom: data.prenom || "",
    nomFamille: data.nom_famille || "",
    poste: data.poste || "",
    role: (data.role as AdminRole) || "editor",
    permissions,
    ajoutePar: data.ajoute_par || "",
  };
}

// ── Est admin ? (true si owner permanent OU présent en base) ──
export async function isAdmin(email: string | null | undefined): Promise<boolean> {
  const info = await getAdminInfo(email);
  return info !== null;
}

// ── A accès ? ──
// - aAcces(email, "produits")            → a-t-il accès au module produits ?
// - aAcces(email, "produits", "supprimer") → a-t-il le droit de supprimer ?
export async function aAcces(
  email: string | null | undefined,
  module: ModuleId,
  action?: string
): Promise<boolean> {
  const info = await getAdminInfo(email);
  if (!info) return false;
  if (info.role === "owner") return true; // owner = accès total

  const actionsAccordees = info.permissions[module] || [];
  if (actionsAccordees.length === 0) return false; // aucun accès au module

  // Pas d'action précise demandée → il suffit d'avoir au moins une action sur ce module
  if (!action) return true;

  return actionsAccordees.includes(action);
}

// ── Est l'owner permanent (toi) ? ──
export function estOwnerPermanent(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === OWNER_PERMANENT;
}