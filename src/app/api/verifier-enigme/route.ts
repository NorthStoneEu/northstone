import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getEarlyAccess,
  ensureEarlyAccessRow,
  updateEarlyAccess,
  MAX_ATTEMPTS,
} from "@/lib/earlyAccess";

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
    // 1. Vérifier la connexion
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "not_authenticated" },
        { status: 401 }
      );
    }

    // 2. Récupérer ou créer l'état de l'utilisateur
    let access = await getEarlyAccess(userId);
    if (!access) {
      access = await ensureEarlyAccessRow(userId);
    }
    if (!access) {
      return NextResponse.json(
        { error: "server_error" },
        { status: 500 }
      );
    }

    // 3. Déjà débloqué ?
    if (access.status === "unlocked") {
      return NextResponse.json({ correct: true, status: "unlocked", attemptsLeft: 0 });
    }

    // 4. Déjà échoué (3 essais épuisés) ?
    if (access.status === "failed" || access.attempts_used >= MAX_ATTEMPTS) {
      return NextResponse.json({ correct: false, status: "failed", attemptsLeft: 0 });
    }

    // 5. Vérifier la réponse
    const body = await req.json();
    const reponse = typeof body?.reponse === "string" ? body.reponse : "";
    const bonneReponse = process.env.ENIGME_REPONSE || "";

    if (!bonneReponse) {
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }

    const correct = normalize(reponse) === normalize(bonneReponse);
    const newAttempts = access.attempts_used + 1;

    if (correct) {
      // Réussite : on débloque
      await updateEarlyAccess(userId, {
        status: "unlocked",
        attempts_used: newAttempts,
        unlocked_at: new Date().toISOString(),
      });
      return NextResponse.json({ correct: true, status: "unlocked", attemptsLeft: 0 });
    } else {
      // Échec : on incrémente, et on marque "failed" si plus d'essais
      const failed = newAttempts >= MAX_ATTEMPTS;
      await updateEarlyAccess(userId, {
        status: failed ? "failed" : "in_progress",
        attempts_used: newAttempts,
      });
      return NextResponse.json({
        correct: false,
        status: failed ? "failed" : "in_progress",
        attemptsLeft: Math.max(0, MAX_ATTEMPTS - newAttempts),
      });
    }
  } catch (e) {
    console.error("verifier-enigme error:", e);
    return NextResponse.json({ error: "server_error" }, { status: 400 });
  }
}