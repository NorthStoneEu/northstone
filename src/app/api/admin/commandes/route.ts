import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { aAcces, getAdminInfo } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
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

async function infosActeur(): Promise<{ email: string | null; nom: string }> {
  const email = await emailAppelant();
  const info = await getAdminInfo(email);
  const nom = info ? (info.nom || `${info.prenom} ${info.nomFamille}`.trim()) : "";
  return { email, nom };
}

async function verifierAcces(action: string): Promise<boolean> {
  const email = await emailAppelant();
  return await aAcces(email, "commandes", action);
}

const STATUTS_VALIDES = ["payee", "en_preparation", "expediee", "livree", "annulee", "remboursee"];

// GET : liste les commandes (filtrables par type), enrichies du profil client + nom Clerk + nb commandes
export async function GET(req: NextRequest) {
  if (!(await verifierAcces("voir"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 'permanente', 'drop', ou null (tout)

  let query = supabaseAdmin
    .from("commandes")
    .select("*")
    .order("created_at", { ascending: false });

  if (type === "permanente" || type === "drop") {
    query = query.eq("type", type);
  }

  const { data: commandes, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Récupère tous les profils Supabase d'un coup
  const userIds = [...new Set((commandes || []).map((c) => c.clerk_user_id).filter(Boolean))];

  const profils: Record<string, any> = {};
  if (userIds.length > 0) {
    const { data: profilsData } = await supabaseAdmin
      .from("user_profiles")
      .select("clerk_user_id, civility, phone, birthday, newsletter_opted_in")
      .in("clerk_user_id", userIds);
    (profilsData || []).forEach((p) => {
      profils[p.clerk_user_id] = p;
    });
  }

  // Nombre de commandes par client (pour l'historique)
  const nbCommandesParClient: Record<string, number> = {};
  (commandes || []).forEach((c) => {
    if (c.clerk_user_id) {
      nbCommandesParClient[c.clerk_user_id] = (nbCommandesParClient[c.clerk_user_id] || 0) + 1;
    }
  });

  // Récupère le nom/prénom depuis Clerk pour chaque client
  const nomsClerk: Record<string, { nom: string; email: string }> = {};
  try {
    const client = await clerkClient();
    await Promise.all(
      userIds.map(async (uid) => {
        try {
          const u = await client.users.getUser(uid as string);
          const nom = `${u.firstName || ""} ${u.lastName || ""}`.trim();
          nomsClerk[uid as string] = {
            nom,
            email: u.emailAddresses?.[0]?.emailAddress || "",
          };
        } catch {
          // utilisateur introuvable côté Clerk, on ignore
        }
      })
    );
  } catch {
    // clerkClient indisponible, on continue sans
  }

  // Enrichit chaque commande
  const enrichies = (commandes || []).map((c) => ({
    ...c,
    client_profil: c.clerk_user_id ? profils[c.clerk_user_id] || null : null,
    client_nom: c.clerk_user_id ? nomsClerk[c.clerk_user_id]?.nom || "" : "",
    client_nb_commandes: c.clerk_user_id ? nbCommandesParClient[c.clerk_user_id] || 1 : 1,
  }));

  return NextResponse.json({ commandes: enrichies });
}

// PUT : changer le statut
export async function PUT(req: NextRequest) {
  if (!(await verifierAcces("modifier_statut"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.id || !body.statut) {
    return NextResponse.json({ error: "ID ou statut manquant" }, { status: 400 });
  }

  if (!STATUTS_VALIDES.includes(body.statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const { data: avant } = await supabaseAdmin
    .from("commandes")
    .select("*")
    .eq("id", body.id)
    .maybeSingle();

  const { data, error } = await supabaseAdmin
    .from("commandes")
    .update({ statut: body.statut })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const acteur = await infosActeur();
  const ctx = contexteRequete(req);
  await enregistrerLog({
    acteurEmail: acteur.email,
    acteurNom: acteur.nom,
    module: "commandes",
    action: "modifier_statut",
    cible: data?.numero || `Commande ${body.id}`,
    etatAvant: avant ?? null,
    etatApres: data,
    adresseIp: ctx.adresseIp,
    userAgent: ctx.userAgent,
  });

  return NextResponse.json({ commande: data });
}