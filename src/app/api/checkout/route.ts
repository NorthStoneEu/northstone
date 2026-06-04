import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Article reçu du panier — on ne fait CONFIANCE qu'à l'id, la couleur, la taille, la quantité.
// Le prix et le nom sont re-vérifiés depuis la base (jamais le prix du client).
type ItemRecu = {
  productId: number;
  color: string;
  size: string;
  quantity: number;
};

const PAYS_AUTORISES: any[] = [
  "FR", "BE", "LU", "DE", "ES", "IT", "PT", "NL", "AT", "IE",
  "FI", "GR", "SK", "SI", "EE", "LV", "LT", "CY", "MT",
  "PL", "CZ", "HU", "RO", "BG", "HR", "DK", "SE",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: ItemRecu[] = body.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Récupère les vrais produits depuis la base (prix de confiance)
    const ids = [...new Set(items.map((i) => i.productId))];
    const { data: produits, error } = await supabaseAdmin
      .from("catalog_items")
      .select("id, name, price, images_by_color, stock_by_size")
      .in("id", ids);

    if (error) {
      return NextResponse.json({ error: "Erreur lecture produits" }, { status: 500 });
    }

    const line_items: any[] = [];

    for (const item of items) {
      const produit = produits?.find((p) => p.id === item.productId);
      if (!produit) {
        return NextResponse.json(
          { error: `Produit introuvable (id ${item.productId})` },
          { status: 400 }
        );
      }

      // Quantité valide
      const qte = Math.max(1, Math.floor(item.quantity || 1));

      // Image : première image de la couleur choisie, si c'est une URL absolue
      let images: string[] = [];
      const imagesCouleur = (produit.images_by_color || {})[item.color];
      if (Array.isArray(imagesCouleur) && imagesCouleur[0]?.startsWith("http")) {
        images = [imagesCouleur[0]];
      }

      line_items.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: produit.name,
            description: `${item.color} · Taille ${item.size}`,
            images,
          },
          // PRIX DE CONFIANCE (depuis la base, jamais celui du client)
          unit_amount: Math.round(Number(produit.price) * 100),
        },
        quantity: qte,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: {
        allowed_countries: PAYS_AUTORISES,
      },
      billing_address_collection: "auto",
      locale: "fr",
      success_url: `${origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier`,
      // On garde une trace des articles pour le webhook (création commande + stock)
      metadata: {
        articles: JSON.stringify(
          items.map((i) => ({ id: i.productId, color: i.color, size: i.size, qty: i.quantity }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("Erreur création session Stripe:", e);
    return NextResponse.json(
      { error: e.message || "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}