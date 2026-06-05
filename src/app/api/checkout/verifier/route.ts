import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ paye: false, error: "Session manquante" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // payment_status vaut "paid" quand le paiement a réussi
    const paye = session.payment_status === "paid";
    return NextResponse.json({ paye });
  } catch (e: any) {
    return NextResponse.json({ paye: false, error: e.message }, { status: 500 });
  }
}