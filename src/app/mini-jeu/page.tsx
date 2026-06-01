"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Cadenas from "@/components/Cadenas";
import Revelateur from "@/components/Revelateur";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

const MAX_ESSAIS = 3;

export default function MiniJeuPage() {
  const { isSignedIn, isLoaded } = useUser();

  const [essaisRestants, setEssaisRestants] = useState(MAX_ESSAIS);
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  // Au chargement (si connecté), on récupère l'état actuel depuis le serveur
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/etat-enigme")
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "unlocked") {
          setSuccess(true);
        } else if (data.status === "failed") {
          setFailed(true);
          setEssaisRestants(0);
        } else if (typeof data.attemptsLeft === "number") {
          setEssaisRestants(data.attemptsLeft);
        }
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn]);

  const handleSubmit = async (code: string) => {
    if (isLoading || failed) return;

    setErreur(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/verifier-enigme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reponse: code }),
      });
      const data = await res.json();

      if (data.correct) {
        setSuccess(true);
      } else if (data.status === "failed") {
        setFailed(true);
        setEssaisRestants(0);
        setErreur("Vous avez épuisé vos tentatives pour ce drop.");
      } else {
        setEssaisRestants(data.attemptsLeft);
        setErreur(
          `Mauvaise réponse. ${data.attemptsLeft} essai${data.attemptsLeft > 1 ? "s" : ""} restant${data.attemptsLeft > 1 ? "s" : ""}.`
        );
      }
    } catch {
      setErreur("Une erreur est survenue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  // === ÉTAT : chargement Clerk ===
  if (!isLoaded) {
    return (
      <>
        <Header />
        <section className="bg-[#0A0A0A] text-white min-h-[80vh] flex items-center justify-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40">Chargement...</p>
        </section>
        <Footer />
      </>
    );
  }

  // === ÉTAT : NON CONNECTÉ ===
  if (!isSignedIn) {
    return (
      <>
        <Header />
        <section className="bg-[#0A0A0A] text-white min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16">
          <div className="w-full max-w-lg text-center">
            <FadeIn direction="up">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
                <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
              </div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-4 font-medium">
                Drop 01 · Accès anticipé
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-[0.95] mb-5">
                CONNEXION
                <br />
                <span className="text-white/35">REQUISE.</span>
              </h1>
              <div className="w-12 h-px bg-[#B8985A] mx-auto mb-6" />
              <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-sm mx-auto">
                L'énigme est réservée aux membres. Connectez-vous pour tenter de débloquer votre
                accès anticipé à la pré-commande.
              </p>
              <Link
                href="/sign-in"
                className="inline-block px-10 py-4 bg-[#B8985A] text-[#0A0A0A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#C9A96B] transition-all"
              >
                Se connecter
              </Link>
              <p className="text-[11px] text-white/40 mt-5">
                Pas encore de compte ?{" "}
                <Link href="/sign-up" className="text-[#B8985A] hover:underline">
                  Créer un compte
                </Link>
              </p>
            </FadeIn>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // === ÉTAT : CONNECTÉ (jeu) ===
  return (
    <>
      <Header />

      <section className="bg-[#0A0A0A] text-white min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(184,152,90,0.12), transparent 60%)",
          }}
        />

        <div className="relative w-full max-w-lg">
          <FadeIn direction="up">
            {success ? (
              // ── VICTOIRE ──
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                  <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
                  <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                </div>
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(184, 152, 90, 0.12)", border: "1px solid #B8985A" }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B8985A" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-4 font-medium">
                  Énigme résolue
                </p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-[0.95] mb-5">
                  ACCÈS
                  <br />
                  <span className="text-white/35">DÉBLOQUÉ.</span>
                </h1>
                <div className="w-12 h-px bg-[#B8985A] mx-auto mb-6" />
                <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-sm mx-auto">
                  Félicitations. Vous faites partie des rares à accéder à la pré-commande en
                  avant-première.
                </p>
                <Link
                  href="/precommande"
                  className="inline-block px-10 py-4 bg-[#B8985A] text-[#0A0A0A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#C9A96B] transition-all"
                >
                  Accéder à la pré-commande
                </Link>
              </div>
            ) : failed ? (
              // ── ÉCHEC (3 essais épuisés) ──
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                  <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
                  <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                </div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-4 font-medium">
                  Tentatives épuisées
                </p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-[0.95] mb-5">
                  CE SERA
                  <br />
                  <span className="text-white/35">POUR LA PROCHAINE.</span>
                </h1>
                <div className="w-12 h-px bg-[#B8985A] mx-auto mb-6" />
                <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-sm mx-auto">
                  Vous n'avez pas trouvé l'énigme cette fois. Pas d'inquiétude : vous pourrez tout
                  de même commander à l'ouverture publique du drop, dans la limite des stocks
                  disponibles.
                </p>
                <Link
                  href="/drops"
                  className="inline-block px-10 py-4 border border-white/25 text-white text-[11px] tracking-[0.3em] uppercase font-semibold hover:border-[#B8985A] hover:text-[#B8985A] transition-all"
                >
                  Voir le drop
                </Link>
              </div>
            ) : (
              // ── JEU ──
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                  <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
                  <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                </div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-4 font-medium">
                  Drop 01 · Accès anticipé
                </p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-[0.95] mb-5">
                  L'ÉNIGME
                  <br />
                  <span className="text-white/35">DE LA GENÈSE.</span>
                </h1>
                <div className="w-12 h-px bg-[#B8985A] mx-auto mb-6" />

                <p className="text-xs text-white/50 leading-relaxed mb-6 max-w-sm mx-auto">
                  Résolvez l'énigme pour débloquer votre accès anticipé à la pré-commande des
                  <span className="text-[#B8985A]"> 400 pièces</span>. Les places sont limitées.
                </p>

                {/* L'énigme cryptique */}
                <div className="bg-white/[0.03] border border-[#B8985A]/20 px-6 py-6 mb-8">
                  <p className="text-sm sm:text-[15px] text-white/80 leading-relaxed italic mb-3">
                    « Je suis une constellation, le Chasseur du ciel d'hiver.
                    Trois étoiles alignées forment ma ceinture, et Bételgeuse
                    brûle à mon épaule. »
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Éclairez les ténèbres pour révéler les lettres de mon nom,
                    puis composez-le sur le cadenas.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Le révélateur (lampe torche) */}
                  <Revelateur />

                  <p className="text-[11px] text-white/40 tracking-wide">
                    Promenez la lumière sur l'obscurité pour révéler les lettres dispersées,
                    puis composez le nom sur le cadenas.
                  </p>

                  <Cadenas longueur={5} onSubmit={handleSubmit} disabled={isLoading} />

                  {erreur && (
                    <div className="text-[12px] text-[#E8A0A0] bg-[#E8A0A0]/10 border-l-2 border-[#E8A0A0]/50 px-3 py-2.5 text-left max-w-sm mx-auto">
                      {erreur}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 pt-1">
                    {Array.from({ length: MAX_ESSAIS }).map((_, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full transition-colors"
                        style={{
                          backgroundColor:
                            i < essaisRestants ? "#B8985A" : "rgba(255,255,255,0.15)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}