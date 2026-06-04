import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getAdminInfo } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifierCode, genererCodesSecours, hacherCodesSecours, verifierCodeSecours } from "@/lib/twofa";
import { marquerSession2faValide } from "@/lib/twofaSession";
import { enregistrerLog, contexteRequete } from "@/lib/logs";

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

// POST : vérifie un code 2FA (ou un code de secours)
// body: { code: string, estCodeSecours?: boolean }
export async function POST(req: NextRequest) {
  const email = await emailAppelant();
  const info = await getAdminInfo(email);
  if (!email || !info) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const nomActeur = info.nom || `${info.prenom} ${info.nomFamille}`.trim();
  const ctx = contexteRequete(req);

  const body = await req.json();
  const code = (body.code || "").trim();
  const estCodeSecours = !!body.estCodeSecours;

  // Récupère la 2FA de l'utilisateur
  const { data: ligne } = await supabaseAdmin
    .from("admin_2fa")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (!ligne || !ligne.secret) {
    return NextResponse.json({ error: "2FA non configurée." }, { status: 400 });
  }

  // ── Cas 1 : code de secours ──
  if (estCodeSecours) {
    const codesHaches: string[] = Array.isArray(ligne.codes_secours) ? ligne.codes_secours : [];
    const index = verifierCodeSecours(code, codesHaches);
    if (index === -1) {
      await enregistrerLog({
        acteurEmail: email,
        acteurNom: nomActeur,
        module: "securite",
        action: "echec_2fa",
        cible: "Code de secours invalide",
        adresseIp: ctx.adresseIp,
        userAgent: ctx.userAgent,
      });
      return NextResponse.json({ error: "Code de secours invalide." }, { status: 400 });
    }
    // Code de secours valide → on le retire (usage unique)
    const restants = codesHaches.filter((_, i) => i !== index);
    await supabaseAdmin
      .from("admin_2fa")
      .update({ codes_secours: restants, derniere_verif: new Date().toISOString() })
      .eq("email", email);

    await marquerSession2faValide(email);
    await enregistrerLog({
      acteurEmail: email,
      acteurNom: nomActeur,
      module: "securite",
      action: "connexion",
      cible: "Connexion via code de secours",
      details: { codesRestants: restants.length },
      adresseIp: ctx.adresseIp,
      userAgent: ctx.userAgent,
    });
    return NextResponse.json({ success: true, codesRestants: restants.length });
  }

  // ── Cas 2 : code TOTP normal ──
  const valide = verifierCode(email, ligne.secret, code);
  if (!valide) {
    await enregistrerLog({
      acteurEmail: email,
      acteurNom: nomActeur,
      module: "securite",
      action: "echec_2fa",
      cible: "Code incorrect",
      adresseIp: ctx.adresseIp,
      userAgent: ctx.userAgent,
    });
    return NextResponse.json({ error: "Code incorrect." }, { status: 400 });
  }

  // Si la 2FA n'était pas encore active → c'est la config initiale : on l'active + génère les codes de secours
  if (!ligne.active) {
    const codesSecours = genererCodesSecours(10);
    const codesHaches = hacherCodesSecours(codesSecours);
    await supabaseAdmin
      .from("admin_2fa")
      .update({
        active: true,
        codes_secours: codesHaches,
        derniere_verif: new Date().toISOString(),
      })
      .eq("email", email);

    await marquerSession2faValide(email);
    await enregistrerLog({
      acteurEmail: email,
      acteurNom: nomActeur,
      module: "securite",
      action: "activation_2fa",
      cible: "Double authentification activée",
      adresseIp: ctx.adresseIp,
      userAgent: ctx.userAgent,
    });
    // On renvoie les codes de secours EN CLAIR une seule fois (à noter par l'utilisateur)
    return NextResponse.json({ success: true, premierActivation: true, codesSecours });
  }

  // Sinon : simple validation de session (connexion)
  await supabaseAdmin
    .from("admin_2fa")
    .update({ derniere_verif: new Date().toISOString() })
    .eq("email", email);

  await marquerSession2faValide(email);
  await enregistrerLog({
    acteurEmail: email,
    acteurNom: nomActeur,
    module: "securite",
    action: "connexion",
    cible: "Connexion à l'administration",
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });
  return NextResponse.json({ success: true });
}