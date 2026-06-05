import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  // On ne renvoie QUE les commandes de ce client (sécurité)
  const { data, error } = await supabaseAdmin
    .from("commandes")
    .select("numero, articles, montant_total, statut, created_at")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ commandes: data });
}