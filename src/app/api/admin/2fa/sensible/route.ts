import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getAdminInfo } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifierCode, verifierCodeSecours } from "@/lib/twofa";

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

// POST : vérifie un code 2FA pour déverrouiller une zone sensible (ré-authentification).
// Ne pose aucun cookie : la validation vit uniquement le temps de la visite côté client.
// body: { code: string, estCodeSecours?: boolean }
export async function POST(req: NextRequest) {
  const email = await emailAppelant();
  const info = await getAdminInfo(email);
  if (!email || !info) {
    return NextResponse.json({ ok: false, error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  const code = (body.code || "").trim();
  const estCodeSecours = !!body.estCodeSecours;

  const { data: ligne } = await supabaseAdmin
    .from("admin_2fa")
    .select("secret, codes_secours, active")
    .eq("email", email)
    .maybeSingle();

  if (!ligne || !ligne.active || !ligne.secret) {
    return NextResponse.json({ ok: false, error: "2FA non configurée." }, { status: 400 });
  }

  // Code de secours
  if (estCodeSecours) {
    const codesHaches: string[] = Array.isArray(ligne.codes_secours) ? ligne.codes_secours : [];
    const index = verifierCodeSecours(code, codesHaches);
    if (index === -1) {
      return NextResponse.json({ ok: false, error: "Code de secours invalide." }, { status: 400 });
    }
    // Usage unique : on retire le code utilisé
    const restants = codesHaches.filter((_, i) => i !== index);
    await supabaseAdmin.from("admin_2fa").update({ codes_secours: restants }).eq("email", email);
    return NextResponse.json({ ok: true });
  }

  // Code TOTP normal
  const valide = verifierCode(email, ligne.secret, code);
  if (!valide) {
    return NextResponse.json({ ok: false, error: "Code incorrect." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}