import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { peutAcheterLeDrop } from "@/lib/dropLimite";

const PAYS_AUTORISES: any[] = [
  "FR", "BE", "LU", "DE", "ES", "IT", "PT", "NL", "AT", "IE",
  "FI", "GR", "SK", "SI", "EE", "LV", "LT", "CY", "MT",
  "PL", "CZ", "HU", "RO", "BG", "HR", "DK", "SE",
];

export async function POST(req: NextRequest) {
  try {
    // 1. Connexion OBLIGATOIRE pour un drop (limite 1 pièce/compte)
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Vous devez être connecté pour commander." }, { status: 401 });
    }

    const body = await req.json();
    const dropId: string = body.dropId;
    const taille: string = body.taille;

    if (!dropId || !taille) {
      return NextResponse.json({ error: "Informations manquantes." }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 2. Lire le drop depuis la base (prix de confiance, jamais celui du client)
    const { data: drop, error } = await supabaseAdmin
      .from("drops")
      .select("*")
      .eq("id", dropId)
      .maybeSingle();

    if (error || !drop) {
      return NextResponse.json({ error: "Drop introuvable." }, { status: 404 });
    }

    // 3. Le drop doit être actif
    if (!drop.is_active) {
      return NextResponse.json({ error: "Ce drop n'est pas disponible." }, { status: 400 });
    }

    // 4. Le drop doit être ouvert (date d'ouverture passée)
    if (drop.release_date && new Date().getTime() < new Date(drop.release_date).getTime()) {
      return NextResponse.json({ error: "Le drop n'est pas encore ouvert." }, { status: 400 });
    }

    // 5. La taille choisie doit exister dans le drop
    const taillesDispo: string[] = Array.isArray(drop.tailles) ? drop.tailles : [];
    if (!taillesDispo.includes(taille)) {
      return NextResponse.json({ error: "Taille indisponible." }, { status: 400 });
    }

    // 6. LIMITE : une seule pièce par compte pour ce drop
    const peut = await peutAcheterLeDrop(userId, dropId);
    if (!peut) {
      return NextResponse.json(
        { error: "Vous avez déjà commandé votre pièce de ce drop. Une seule pièce par personne." },
        { status: 400 }
      );
    }

    // 7. Prix de confiance (centimes) depuis la base
    const prixCentimes = Math.round(Number(drop.prix) || 0);
    if (prixCentimes <= 0) {
      return NextResponse.json({ error: "Prix indisponible." }, { status: 400 });
    }

    // Image du drop si URL absolue
    let images: string[] = [];
    if (typeof drop.image_url === "string" && drop.image_url.startsWith("http")) {
      images = [drop.image_url];
    }

    // 8. Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: drop.name || "Pièce de drop",
              description: `Édition limitée · Taille ${taille}`,
              images,
            },
            unit_amount: prixCentimes,
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        allowed_countries: PAYS_AUTORISES,
      },
      billing_address_collection: "auto",
      locale: "fr",
      success_url: `${origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/drops/commander`,
      client_reference_id: userId,
      metadata: {
        // Identifie cette commande comme un DROP (lu par le webhook)
        type: "drop",
        drop_id: dropId,
        // Même format que le checkout boutique pour que le webhook crée la commande
        articles: JSON.stringify([
          {
            id: dropId,
            name: drop.name || "Pièce de drop",
            price: prixCentimes / 100,
            color: "Édition limitée",
            size: taille,
            qty: 1,
            image: images[0] || "",
          },
        ]),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("Erreur création session Stripe drop:", e);
    return NextResponse.json(
      { error: e.message || "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}