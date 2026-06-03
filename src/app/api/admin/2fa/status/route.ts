import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getAdminInfo } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { session2faValide } from "@/lib/twofaSession";

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

// GET : où en est l'utilisateur vis-à-vis de la 2FA ?
export async function GET() {
  const email = await emailAppelant();
  const info = await getAdminInfo(email);
  if (!email || !info) {
    return NextResponse.json({ estAdmin: false });
  }

  const { data } = await supabaseAdmin
    .from("admin_2fa")
    .select("active")
    .eq("email", email)
    .maybeSingle();

  const configuree = !!data?.active;
  const sessionValide = await session2faValide(email);

  return NextResponse.json({
    estAdmin: true,
    configuree,            // la 2FA est-elle déjà activée pour ce compte ?
    sessionValide,         // a-t-il passé la 2FA pour cette session ?
  });
}