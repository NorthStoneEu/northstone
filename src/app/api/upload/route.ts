import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function verifierAdmin() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  return isAdmin(email);
}

export async function POST(req: NextRequest) {
  if (!(await verifierAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
  }

  // Nom de fichier unique : timestamp + nom original nettoyé
  const ext = file.name.split(".").pop() || "jpg";
  const cleanName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()
    .slice(0, 40);
  const fileName = `${Date.now()}-${cleanName}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Récupérer l'URL publique
  const { data: urlData } = supabaseAdmin.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl });
}