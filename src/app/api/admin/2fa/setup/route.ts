import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getAdminInfo } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { genererSecret, genererQRCode } from "@/lib/twofa";

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

// POST : démarre la configuration 2FA → génère un secret + QR code
// (ne l'active PAS encore : l'activation se fait après vérification d'un 1er code)
export async function POST() {
  const email = await emailAppelant();
  const info = await getAdminInfo(email);
  if (!email || !info) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  // Si déjà active, on ne régénère pas (sécurité : éviter d'écraser une 2FA en place)
  const { data: existant } = await supabaseAdmin
    .from("admin_2fa")
    .select("active")
    .eq("email", email)
    .maybeSingle();

  if (existant?.active) {
    return NextResponse.json({ error: "2FA déjà configurée." }, { status: 400 });
  }

  // Génère un nouveau secret + upsert (active reste false jusqu'à vérification)
  const secret = genererSecret();
  const { error } = await supabaseAdmin
    .from("admin_2fa")
    .upsert(
      { email, secret, active: false, codes_secours: [] },
      { onConflict: "email" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const qrCode = await genererQRCode(email, secret);
  return NextResponse.json({ qrCode });
}