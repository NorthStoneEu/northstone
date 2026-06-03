import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getAdminInfo } from "@/lib/admin";

// GET : indique si l'utilisateur connecté a un accès admin (et lequel).
// Utilisé par le Header pour afficher (ou non) le raccourci "Espace admin".
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ estAdmin: false });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;

    const info = await getAdminInfo(email);
    if (!info) {
      return NextResponse.json({ estAdmin: false });
    }

    return NextResponse.json({
      estAdmin: true,
      role: info.role,
      estOwner: info.role === "owner",
    });
  } catch {
    return NextResponse.json({ estAdmin: false });
  }
}