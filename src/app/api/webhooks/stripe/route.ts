import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Stripe from "stripe";
import { envoyerEmailConfirmation } from "@/lib/emails";

// Génère un numéro de commande lisible : NS-2026-XXXX
async function genererNumero(): Promise<string> {
  const annee = new Date().getFullYear();
  // Compte les commandes existantes pour incrémenter
  const { count } = await supabaseAdmin
    .from("commandes")
    .select("*", { count: "exact", head: true });
  const numero = (count || 0) + 1;
  return `NS-${annee}-${String(numero).padStart(4, "0")}`;
}

// Décrémente le stock d'un produit pour une taille donnée
async function decrementerStock(productId: number, size: string, qty: number) {
  const { data: produit } = await supabaseAdmin
    .from("catalog_items")
    .select("stock_by_size")
    .eq("id", productId)
    .maybeSingle();

  if (!produit) return;

  const stock = { ...(produit.stock_by_size || {}) };
  const actuel = Number(stock[size]) || 0;
  stock[size] = Math.max(0, actuel - qty); // jamais en dessous de 0

  await supabaseAdmin
    .from("catalog_items")
    .update({ stock_by_size: stock })
    .eq("id", productId);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;

  // Vérifie que la requête vient bien de Stripe (sécurité)
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature invalide:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // On ne traite que les paiements réussis
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Évite les doublons : si cette session est déjà enregistrée, on s'arrête
      const { data: existante } = await supabaseAdmin
        .from("commandes")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (existante) {
        return NextResponse.json({ received: true, deja_traitee: true });
      }

      // Récupère les articles depuis les metadata
      let articles: any[] = [];
      try {
        articles = JSON.parse(session.metadata?.articles || "[]");
      } catch {
        articles = [];
      }

      // Type de commande : 'drop' ou 'permanente' (défaut)
      const typeCommande = session.metadata?.type === "drop" ? "drop" : "permanente";
      const dropId = session.metadata?.drop_id || null;

      // Récupère le détail complet de la session (pour l'adresse, le client)
      const sessionComplete = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items"],
      });

      const numero = await genererNumero();

      // Crée la commande
      const { error: errInsert } = await supabaseAdmin.from("commandes").insert({
        numero,
        clerk_user_id: session.client_reference_id || null,
        email_client: session.customer_details?.email || session.customer_email || "",
        articles,
        montant_total: session.amount_total || 0,
        devise: session.currency || "eur",
        statut: "payee",
        adresse_livraison: session.customer_details?.address || sessionComplete.collected_information?.shipping_details || null,
        stripe_session_id: session.id,
        stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
        type: typeCommande,
        drop_id: typeCommande === "drop" ? dropId : null,
      });

      if (errInsert) {
        console.error("⚠️ Erreur création commande:", errInsert);
        // On renvoie 500 pour que Stripe réessaie
        return NextResponse.json({ error: "Erreur création commande" }, { status: 500 });
      }

      // Décrémente le stock UNIQUEMENT pour les commandes boutique
      // (les drops n'ont pas de stock par taille — fabrication après commande)
      if (typeCommande === "permanente") {
        for (const art of articles) {
          await decrementerStock(art.id, art.size, art.qty);
        }
        console.log(`✅ Commande ${numero} créée + stock décrémenté`);
      } else {
        console.log(`✅ Commande DROP ${numero} créée (pas de décrément stock)`);
      }

      // Envoi de l'email de confirmation (n'interrompt pas le webhook si erreur)
      await envoyerEmailConfirmation({
        numero,
        emailClient: session.customer_details?.email || session.customer_email || "",
        articles,
        montantTotal: session.amount_total || 0,
        devise: session.currency || "eur",
        adresseLivraison: session.customer_details?.address || sessionComplete.collected_information?.shipping_details || null,
        type: typeCommande,
      });
    } catch (e: any) {
      console.error("⚠️ Erreur traitement webhook:", e);
      return NextResponse.json({ error: "Erreur traitement" }, { status: 500 });
    }
  }

  // Toujours répondre 200 à Stripe pour confirmer la réception
  return NextResponse.json({ received: true });
}