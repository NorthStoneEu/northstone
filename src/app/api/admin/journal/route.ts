import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { estOwnerPermanent } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

// GET : liste les logs — OWNER UNIQUEMENT
export async function GET() {
  const email = await emailAppelant();
  if (!estOwnerPermanent(email)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  // On limite aux 500 plus récents (le filtrage fin se fait côté client)
  const { data, error } = await supabaseAdmin
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ logs: data });
}