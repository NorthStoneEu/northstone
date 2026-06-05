import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { aAcces, getAdminInfo } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { enregistrerLog, contexteRequete } from "@/lib/logs";
import { stripe } from "@/lib/stripe";

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

// Remet le stock d'un produit pour une taille donnée
async function reincrementerStock(productId: number, size: string, qty: number) {
  const { data: produit } = await supabaseAdmin
    .from("catalog_items")
    .select("stock_by_size")
    .eq("id", productId)
    .maybeSingle();

  if (!produit) return;

  const stock = { ...(produit.stock_by_size || {}) };
  const actuel = Number(stock[size]) || 0;
  stock[size] = actuel + qty; // on remet les articles

  await supabaseAdmin
    .from("catalog_items")
    .update({ stock_by_size: stock })
    .eq("id", productId);
}

export async function POST(req: NextRequest) {
  const email = await emailAppelant();
  // Permission : on réutilise "annuler" du module commandes
  if (!(await aAcces(email, "commandes", "annuler"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  // Récupère la commande
  const { data: commande } = await supabaseAdmin
    .from("commandes")
    .select("*")
    .eq("id", body.id)
    .maybeSingle();

  if (!commande) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  // Déjà remboursée ?
  if (commande.statut === "remboursee") {
    return NextResponse.json({ error: "Commande déjà remboursée" }, { status: 400 });
  }

  // Il faut le payment_intent pour rembourser
  if (!commande.stripe_payment_intent) {
    return NextResponse.json(
      { error: "Aucun paiement Stripe associé à cette commande" },
      { status: 400 }
    );
  }

  // 1. Rembourser via Stripe
  try {
    await stripe.refunds.create({
      payment_intent: commande.stripe_payment_intent,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Erreur Stripe : " + (e.message || "remboursement échoué") },
      { status: 500 }
    );
  }

  // 2. Remettre le stock
  const articles = Array.isArray(commande.articles) ? commande.articles : [];
  for (const art of articles) {
    if (art.id && art.size && art.qty) {
      await reincrementerStock(art.id, art.size, art.qty);
    }
  }

  // 3. Passer le statut à "remboursee"
  const { data: maj, error: errMaj } = await supabaseAdmin
    .from("commandes")
    .update({ statut: "remboursee" })
    .eq("id", body.id)
    .select()
    .single();

  if (errMaj) {
    return NextResponse.json({ error: errMaj.message }, { status: 500 });
  }

  // 4. Log
  const info = await getAdminInfo(email);
  const nom = info ? (info.nom || `${info.prenom} ${info.nomFamille}`.trim()) : "";
  const ctx = contexteRequete(req);
  await enregistrerLog({
    acteurEmail: email,
    acteurNom: nom,
    module: "commandes",
    action: "rembourser",
    cible: commande.numero,
    etatAvant: commande,
    etatApres: maj,
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });

  return NextResponse.json({ commande: maj });
}