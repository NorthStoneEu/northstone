"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function MiniJeuPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/etat-enigme")
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "unlocked") setSuccess(true);
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn]);

  const handleUnlock = async () => {
    if (isLoading) return;
    setErreur(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/verifier-enigme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reponse: process.env.NEXT_PUBLIC_TEMP_CODE ?? "ORION" }),
      });
      const data = await res.json();
      if (data.correct) setSuccess(true);
      else setErreur("Accès non débloqué.");
    } catch {
      setErreur("Une erreur est survenue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!isSignedIn) {
    return (
      <>
        <Header />
        <section className="bg-[#0A0A0A] text-white min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16">
          <div className="w-full max-w-lg text-center">
            <FadeIn direction="up">
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
                L'accès anticipé est réservé aux membres. Connectez-vous pour continuer.
              </p>
              <Link
                href="/sign-in"
                className="inline-block px-10 py-4 bg-[#B8985A] text-[#0A0A0A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#C9A96B] transition-all"
              >
                Se connecter
              </Link>
            </FadeIn>
          </div>
        </section>
        <Footer />
      </>
    );
  }

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
        <div className="relative w-full max-w-lg text-center">
          <FadeIn direction="up">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-4 font-medium">
              Drop 01 · Accès anticipé
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-[0.95] mb-5">
              {success ? "ACCÈS" : "L'ÉPREUVE"}
              <br />
              <span className="text-white/35">{success ? "DÉBLOQUÉ." : "ARRIVE BIENTÔT."}</span>
            </h1>
            <div className="w-12 h-px bg-[#B8985A] mx-auto mb-6" />

            {success ? (
              <>
                <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-sm mx-auto">
                  Votre accès anticipé à la pré-commande est actif.
                </p>
                <Link
                  href="/precommande"
                  className="inline-block px-10 py-4 bg-[#B8985A] text-[#0A0A0A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#C9A96B] transition-all"
                >
                  Accéder à la pré-commande
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-sm mx-auto">
                  Le jeu d'accès anticipé est en préparation. Débloquez votre accès en attendant.
                </p>
                <button
                  onClick={handleUnlock}
                  disabled={isLoading}
                  className="inline-block px-10 py-4 bg-[#B8985A] text-[#0A0A0A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#C9A96B] transition-all disabled:opacity-50"
                  style={{ border: "none", cursor: isLoading ? "default" : "pointer" }}
                >
                  {isLoading ? "..." : "Débloquer mon accès"}
                </button>
                {erreur && (
                  <p className="text-[12px] text-[#E8A0A0] mt-5">{erreur}</p>
                )}
              </>
            )}
          </FadeIn>
        </div>
      </section>
      <Footer />
    </>
  );
}