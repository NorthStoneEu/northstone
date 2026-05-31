import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEarlyAccess, MAX_ATTEMPTS } from "@/lib/earlyAccess";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const access = await getEarlyAccess(userId);

  if (!access) {
    // Pas encore joué
    return NextResponse.json({ status: "in_progress", attemptsLeft: MAX_ATTEMPTS });
  }

  return NextResponse.json({
    status: access.status,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - access.attempts_used),
  });
}