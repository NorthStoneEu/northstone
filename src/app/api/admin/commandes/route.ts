import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { aAcces, getAdminInfo } from "@/lib/admin";
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

async function infosActeur(): Promise<{ email: string | null; nom: string }> {
  const email = await emailAppelant();
  const info = await getAdminInfo(email);
  const nom = info ? (info.nom || `${info.prenom} ${info.nomFamille}`.trim()) : "";
  return { email, nom };
}

async function verifierAcces(action: string): Promise<boolean> {
  const email = await emailAppelant();
  return await aAcces(email, "commandes", action);
}

// Statuts autorisés
const STATUTS_VALIDES = ["payee", "en_preparation", "expediee", "livree", "annulee"];

// GET : liste toutes les commandes — nécessite "voir"
export async function GET() {
  if (!(await verifierAcces("voir"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("commandes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ commandes: data });
}

// PUT : changer le statut d'une commande — nécessite "modifier_statut"
export async function PUT(req: NextRequest) {
  if (!(await verifierAcces("modifier_statut"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.id || !body.statut) {
    return NextResponse.json({ error: "ID ou statut manquant" }, { status: 400 });
  }

  if (!STATUTS_VALIDES.includes(body.statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  // État avant (pour le log)
  const { data: avant } = await supabaseAdmin
    .from("commandes")
    .select("*")
    .eq("id", body.id)
    .maybeSingle();

  const { data, error } = await supabaseAdmin
    .from("commandes")
    .update({ statut: body.statut })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log
  const acteur = await infosActeur();
  const ctx = contexteRequete(req);
  await enregistrerLog({
    acteurEmail: acteur.email,
    acteurNom: acteur.nom,
    module: "commandes",
    action: "modifier_statut",
    cible: data?.numero || `Commande ${body.id}`,
    etatAvant: avant ?? null,
    etatApres: data,
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });

  return NextResponse.json({ commande: data });
}