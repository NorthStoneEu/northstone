import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Vérifie que l'appelant est bien un admin
async function verifierAdmin() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  return isAdmin(email);
}

// GET : liste tous les produits (pour l'admin)
export async function GET() {
  if (!(await verifierAdmin())) {
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

// POST : créer un nouveau produit
export async function POST(req: NextRequest) {
  if (!(await verifierAdmin())) {
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
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ product: data });
}

// PUT : modifier un produit existant
export async function PUT(req: NextRequest) {
  if (!(await verifierAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

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
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ product: data });
}

// DELETE : supprimer un produit
export async function DELETE(req: NextRequest) {
  if (!(await verifierAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("catalog_items")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}