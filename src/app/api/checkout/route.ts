import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Type d'un article reçu du panier (côté client)
type ItemRecu = {
  productId: number;
  name: string;
  price: number;
  color: string;
  size: string;
  image: string;
  quantity: number;
};

// Pays de livraison autorisés (France + Europe)
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

    // Transforme chaque article du panier en "line item" Stripe
    const line_items = items.map((item) => {
      // Image : Stripe veut une URL absolue (http...). On filtre les images locales/relatives.
      const images =
        item.image && item.image.startsWith("http") ? [item.image] : [];

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: `${item.color} · Taille ${item.size}`,
            images,
          },
          // Stripe travaille en centimes : 70 € → 7000
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      // Collecte de l'adresse de livraison (France + Europe)
      shipping_address_collection: {
        allowed_countries: PAYS_AUTORISES,
      },
      billing_address_collection: "auto",
      locale: "fr",
      success_url: `${origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier`,
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