import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getAdminInfo, estOwnerPermanent } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { enregistrerLog, contexteRequete } from "@/lib/logs";

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

async function nomActeur(email: string | null): Promise<string> {
  const info = await getAdminInfo(email);
  return info ? (info.nom || `${info.prenom} ${info.nomFamille}`.trim()) : "";
}

// POST : réinitialise la 2FA d'un collaborateur — OWNER UNIQUEMENT
// body: { email: string }
export async function POST(req: NextRequest) {
  const emailApp = await emailAppelant();
  if (!estOwnerPermanent(emailApp)) {
    return NextResponse.json({ error: "Seul l'administrateur principal peut réinitialiser une 2FA." }, { status: 403 });
  }

  const body = await req.json();
  const cible = (body.email || "").trim().toLowerCase();

  if (!cible || !cible.includes("@")) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // Sécurité : l'owner ne se réinitialise pas lui-même via ce bouton
  if (estOwnerPermanent(cible)) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas réinitialiser votre propre 2FA ici (utilisez vos codes de secours)." },
      { status: 400 }
    );
  }

  // Supprime la config 2FA de la cible → elle reconfigurera au prochain accès
  const { error } = await supabaseAdmin.from("admin_2fa").delete().eq("email", cible);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log
  const ctx = contexteRequete(req);
  await enregistrerLog({
    acteurEmail: emailApp,
    acteurNom: await nomActeur(emailApp),
    module: "admins",
    action: "modifier",
    cible: cible,
    details: { operation: "reinitialisation_2fa" },
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });

  return NextResponse.json({ success: true });
}