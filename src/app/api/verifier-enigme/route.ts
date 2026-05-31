import { NextRequest, NextResponse } from "next/server";

// Normalise une réponse : minuscules, sans espaces ni accents
function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reponse = typeof body?.reponse === "string" ? body.reponse : "";

    const bonneReponse = process.env.ENIGME_REPONSE || "";

    if (!bonneReponse) {
      return NextResponse.json(
        { error: "Configuration manquante côté serveur." },
        { status: 500 }
      );
    }

    const correct = normalize(reponse) === normalize(bonneReponse);

    return NextResponse.json({ correct });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }
}