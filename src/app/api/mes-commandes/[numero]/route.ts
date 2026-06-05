import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ numero: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const { numero } = await params;

  // On récupère la commande PAR numéro ET clerk_user_id (sécurité : que la sienne)
  const { data, error } = await supabaseAdmin
    .from("commandes")
    .select("numero, articles, montant_total, statut, created_at, adresse_livraison")
    .eq("numero", numero)
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  return NextResponse.json({ commande: data });
}