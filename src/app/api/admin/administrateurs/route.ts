import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getAdminInfo, estOwnerPermanent, aAcces, MODULES } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Récupère l'email de l'appelant via auth() (fiable)
async function emailAppelant(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || null;
  } catch {
    return null;
  }
}

// Vérifie que l'appelant a une action précise sur le module "admins"
async function aActionAdmins(action: string): Promise<boolean> {
  const email = await emailAppelant();
  return await aAcces(email, "admins", action);
}

// Valide les permissions envoyées et reconstruit un objet propre.
// - ne garde que les modules + actions qui existent vraiment dans MODULES
// - force "voir" si au moins une autre action est cochée (cohérence)
function nettoyerPermissions(perms: any): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  if (!perms || typeof perms !== "object" || Array.isArray(perms)) return result;

  for (const mod of MODULES) {
    const recues = perms[mod.id];
    if (!Array.isArray(recues)) continue;

    const actionsValides = mod.actions.map((a) => a.id);
    let gardees = recues.filter((a: any) => actionsValides.includes(a));

    if (gardees.length === 0) continue; // pas d'action sur ce module → on l'ignore

    // Cohérence : si une action est accordée, "voir" l'est forcément
    if (!gardees.includes("voir") && actionsValides.includes("voir")) {
      gardees = ["voir", ...gardees];
    }

    // Dédoublonnage + ordre stable selon MODULES
    result[mod.id] = actionsValides.filter((a) => gardees.includes(a));
  }

  return result;
}

// GET : liste les admins additionnels — nécessite "voir"
export async function GET() {
  if (!(await aActionAdmins("voir"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { data, error } = await supabaseAdmin
    .from("admins")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ admins: data });
}

// POST : ajouter ou modifier un admin — nécessite "ajouter" OU "modifier"
export async function POST(req: NextRequest) {
  const email_appelant = await emailAppelant();
  const peutAjouter = await aAcces(email_appelant, "admins", "ajouter");
  const peutModifier = await aAcces(email_appelant, "admins", "modifier");
  if (!peutAjouter && !peutModifier) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  const email = (body.email || "").trim().toLowerCase();
  const nom = (body.nom || "").trim();
  const prenom = (body.prenom || "").trim();
  const nomFamille = (body.nomFamille || "").trim();
  const poste = (body.poste || "").trim();
  const role = body.role === "manager" ? "manager" : "editor"; // jamais "owner" via l'interface
  const permissions = nettoyerPermissions(body.permissions);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // On ne peut pas créer/modifier l'owner permanent via l'interface
  if (estOwnerPermanent(email)) {
    return NextResponse.json(
      { error: "Cet utilisateur est l'administrateur principal (non modifiable)." },
      { status: 400 }
    );
  }

  // Qui crée/modifie cet accès (pour la traçabilité)
  const ajoutePar = email_appelant || "";

  // upsert : insère ou met à jour selon l'email (unique)
  const { data, error } = await supabaseAdmin
    .from("admins")
    .upsert(
      {
        email,
        nom,
        prenom,
        nom_famille: nomFamille,
        poste,
        role,
        permissions,
        ajoute_par: ajoutePar,
      },
      { onConflict: "email" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ admin: data });
}

// DELETE : retirer un admin — nécessite "retirer"
export async function DELETE(req: NextRequest) {
  if (!(await aActionAdmins("retirer"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email manquant" }, { status: 400 });
  }

  // Sécurité : impossible de retirer l'owner permanent
  if (estOwnerPermanent(email)) {
    return NextResponse.json(
      { error: "Impossible de retirer l'administrateur principal." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.from("admins").delete().eq("email", email);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}