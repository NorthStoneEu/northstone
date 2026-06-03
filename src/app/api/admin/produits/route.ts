import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { aAcces, getAdminInfo } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { enregistrerLog, contexteRequete } from "@/lib/logs";

// Récupère l'email de l'appelant (via auth() = fiable)
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

// Email + nom de l'acteur (pour les logs)
async function infosActeur(): Promise<{ email: string | null; nom: string }> {
  const email = await emailAppelant();
  const info = await getAdminInfo(email);
  const nom = info ? (info.nom || `${info.prenom} ${info.nomFamille}`.trim()) : "";
  return { email, nom };
}

// Vérifie que l'appelant a le droit d'effectuer une action précise sur "produits"
async function verifierAcces(action: string): Promise<boolean> {
  const email = await emailAppelant();
  return await aAcces(email, "produits", action);
}

// GET : liste tous les produits (pour l'admin) — nécessite "voir"
export async function GET() {
  if (!(await verifierAcces("voir"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("catalog_items")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ products: data });
}

// POST : créer un nouveau produit — nécessite "creer"
export async function POST(req: NextRequest) {
  if (!(await verifierAcces("creer"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("catalog_items")
    .insert({
      slug: body.slug,
      name: body.name,
      category: body.category,
      gender: body.gender,
      price: body.price,
      description: body.description || "",
      composition: body.composition || "",
      care: body.care || "",
      delivery: body.delivery || "",
      is_new: body.isNew || false,
      colors: body.colors || [],
      sizes: body.sizes || [],
      images_by_color: body.imagesByColor || {},
      stock_by_size: body.stockBySize || {},
    })
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
    module: "produits",
    action: "creer",
    cible: data?.name || body.name || "",
    details: { id: data?.id, slug: data?.slug },
    etatAvant: null,
    etatApres: data,
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });

  return NextResponse.json({ product: data });
}

// PUT : modifier un produit existant — nécessite "modifier"
export async function PUT(req: NextRequest) {
  if (!(await verifierAcces("modifier"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  // État AVANT (le produit complet, toutes colonnes)
  const { data: avant } = await supabaseAdmin
    .from("catalog_items")
    .select("*")
    .eq("id", body.id)
    .maybeSingle();

  const { data, error } = await supabaseAdmin
    .from("catalog_items")
    .update({
      slug: body.slug,
      name: body.name,
      category: body.category,
      gender: body.gender,
      price: body.price,
      description: body.description || "",
      composition: body.composition || "",
      care: body.care || "",
      delivery: body.delivery || "",
      is_new: body.isNew || false,
      colors: body.colors || [],
      sizes: body.sizes || [],
      images_by_color: body.imagesByColor || {},
      stock_by_size: body.stockBySize || {},
      updated_at: new Date().toISOString(),
    })
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
    module: "produits",
    action: "modifier",
    cible: data?.name || body.name || "",
    details: { id: body.id, slug: body.slug },
    etatAvant: avant ?? null,
    etatApres: data,
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });

  return NextResponse.json({ product: data });
}

// DELETE : supprimer un produit — nécessite "supprimer"
export async function DELETE(req: NextRequest) {
  if (!(await verifierAcces("supprimer"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  // État AVANT (le produit complet, toutes colonnes) — sert au log et à la cible
  const { data: produit } = await supabaseAdmin
    .from("catalog_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabaseAdmin
    .from("catalog_items")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log
  const acteur = await infosActeur();
  const ctx = contexteRequete(req);
  await enregistrerLog({
    acteurEmail: acteur.email,
    acteurNom: acteur.nom,
    module: "produits",
    action: "supprimer",
    cible: produit?.name || `Produit #${id}`,
    details: { id, slug: produit?.slug },
    etatAvant: produit ?? null,
    etatApres: null,
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });

  return NextResponse.json({ success: true });
}