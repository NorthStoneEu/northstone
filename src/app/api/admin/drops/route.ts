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
  return await aAcces(email, "drops", action);
}

// GET : liste tous les drops — nécessite "voir"
export async function GET() {
  if (!(await verifierAcces("voir"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { data, error } = await supabaseAdmin
    .from("drops")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ drops: data });
}

// POST : créer un nouveau drop — nécessite "creer"
export async function POST(req: NextRequest) {
  if (!(await verifierAcces("creer"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("drops")
    .insert({
      name: body.name || "",
      sous_titre: body.sous_titre || "",
      titre_principal: body.titre_principal || "",
      description: body.description || "",
      release_date: body.release_date || null,
      total_pieces: body.total_pieces || 0,
      total_winners: body.total_winners || 0,
      image_url: body.image_url || "",
      lots: body.lots || [],
      is_active: body.is_active || false,
      visible_accueil: body.visible_accueil || false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const acteur = await infosActeur();
  const ctx = contexteRequete(req);
  await enregistrerLog({
    acteurEmail: acteur.email,
    acteurNom: acteur.nom,
    module: "drops",
    action: "creer",
    cible: data?.name || body.name || "",
    etatAvant: null,
    etatApres: data,
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });

  return NextResponse.json({ drop: data });
}

// PUT : modifier un drop — nécessite "modifier"
export async function PUT(req: NextRequest) {
  if (!(await verifierAcces("modifier"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  // État avant
  const { data: avant } = await supabaseAdmin
    .from("drops")
    .select("*")
    .eq("id", body.id)
    .maybeSingle();

  const { data, error } = await supabaseAdmin
    .from("drops")
    .update({
      name: body.name || "",
      sous_titre: body.sous_titre || "",
      titre_principal: body.titre_principal || "",
      description: body.description || "",
      release_date: body.release_date || null,
      total_pieces: body.total_pieces || 0,
      total_winners: body.total_winners || 0,
      image_url: body.image_url || "",
      lots: body.lots || [],
      is_active: body.is_active || false,
      visible_accueil: body.visible_accueil || false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const acteur = await infosActeur();
  const ctx = contexteRequete(req);
  await enregistrerLog({
    acteurEmail: acteur.email,
    acteurNom: acteur.nom,
    module: "drops",
    action: "modifier",
    cible: data?.name || body.name || "",
    etatAvant: avant ?? null,
    etatApres: data,
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });

  return NextResponse.json({ drop: data });
}

// DELETE : supprimer un drop — nécessite "supprimer"
export async function DELETE(req: NextRequest) {
  if (!(await verifierAcces("supprimer"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const { data: avant } = await supabaseAdmin
    .from("drops")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabaseAdmin.from("drops").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const acteur = await infosActeur();
  const ctx = contexteRequete(req);
  await enregistrerLog({
    acteurEmail: acteur.email,
    acteurNom: acteur.nom,
    module: "drops",
    action: "supprimer",
    cible: avant?.name || `Drop #${id}`,
    etatAvant: avant ?? null,
    etatApres: null,
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });

  return NextResponse.json({ success: true });
}