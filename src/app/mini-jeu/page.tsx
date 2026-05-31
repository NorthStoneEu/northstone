"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

const MAX_ESSAIS = 3;

export default function MiniJeuPage() {
  const [reponse, setReponse] = useState("");
  const [essaisRestants, setEssaisRestants] = useState(MAX_ESSAIS);
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bloque, setBloque] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || bloque || !reponse.trim()) return;

    setErreur(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/verifier-enigme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reponse }),
      });
      const data = await res.json();

      if (data.correct) {
        setSuccess(true);
      } else {
        const restants = essaisRestants - 1;
        setEssaisRestants(restants);
        if (restants <= 0) {
          setBloque(true);
          setErreur("Vous avez épuisé vos tentatives. Revenez plus tard pour réessayer.");
        } else {
          setErreur(
            `Mauvaise réponse. ${restants} essai${restants > 1 ? "s" : ""} restant${restants > 1 ? "s" : ""}.`
          );
        }
        setReponse("");
      }
    } catch {
      setErreur("Une erreur est survenue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <section className="bg-[#0A0A0A] text-white min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16 relative overflow-hidden">
        {/* Halo or discret en fond */}
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
            {!success ? (
              <div className="text-center">
                {/* Ornement or */}
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

                {/* ÉNONCÉ DE L'ÉNIGME (placeholder — à remplacer par ta vraie énigme) */}
                <div className="bg-white/[0.03] border border-[#B8985A]/20 px-6 py-6 mb-8">
                  <p className="text-sm sm:text-[15px] text-white/80 leading-relaxed italic">
                    « Je suis le commencement de tout, gravé dans la pierre des origines.
                    Sans moi, rien ne naît. Quel est mon nom ? »
                  </p>
                </div>

                <p className="text-xs text-white/50 leading-relaxed mb-8 max-w-sm mx-auto">
                  Résolvez l'énigme pour débloquer votre accès anticipé à la pré-commande des
                  <span className="text-[#B8985A]"> 400 pièces</span>. Les places sont limitées.
                </p>

                {/* FORMULAIRE */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    value={reponse}
                    onChange={(e) => setReponse(e.target.value)}
                    disabled={bloque || isLoading}
                    placeholder="Votre réponse..."
                    className="w-full bg-transparent border-b border-white/25 px-1 py-3 text-center text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#B8985A] transition-colors disabled:opacity-40"
                  />

                  {erreur && (
                    <div className="text-[12px] text-[#E8A0A0] bg-[#E8A0A0]/10 border-l-2 border-[#E8A0A0]/50 px-3 py-2.5 text-left">
                      {erreur}
                    </div>
                  )}

                  {!bloque && (
                    <button
                      type="submit"
                      disabled={isLoading || !reponse.trim()}
                      className={`w-full py-4 text-[11px] tracking-[0.3em] uppercase font-semibold transition-all ${
                        isLoading || !reponse.trim()
                          ? "bg-white/10 text-white/40 cursor-not-allowed"
                          : "bg-[#B8985A] text-[#0A0A0A] hover:bg-[#C9A96B]"
                      }`}
                      style={{ border: "none" }}
                    >
                      {isLoading ? "Vérification..." : "Valider ma réponse"}
                    </button>
                  )}

                  {/* Indicateur d'essais */}
                  {!bloque && (
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
                  )}

                  {bloque && (
                    <Link
                      href="/"
                      className="inline-block mt-2 text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-[#B8985A] transition-colors"
                    >
                      Retour à l'accueil
                    </Link>
                  )}
                </form>
              </div>
            ) : (
              // ── ÉCRAN DE VICTOIRE ──
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
            )}
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}