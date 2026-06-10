"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type Drop = {
  id: string;
  name: string;
  sous_titre: string;
  titre_principal: string;
  description: string;
  prix: number;
  tailles: string[];
  image_url: string;
  total_pieces: number;
  is_active: boolean;
  release_date: string | null;
};

export default function CommanderDropPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [drop, setDrop] = useState<Drop | null>(null);
  const [loading, setLoading] = useState(true);
  const [tailleChoisie, setTailleChoisie] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // Charge le drop actif
  useEffect(() => {
    const charger = async () => {
      const { data } = await supabase
        .from("drops")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setDrop((data as Drop) || null);
      setLoading(false);
    };
    charger();
  }, []);

  const prixEuros = drop ? (drop.prix / 100).toLocaleString("fr-FR") : "0";

  // Le drop est-il réellement ouvert (date passée) ?
  const estOuvert = drop?.release_date
    ? new Date().getTime() >= new Date(drop.release_date).getTime()
    : false;

  const payer = async () => {
    if (!drop || !tailleChoisie) return;
    setErreur(null);

    if (!isSignedIn) {
      window.location.href = "/sign-in?redirect_url=/drops/commander";
      return;
    }

    setEnCours(true);
    try {
      const res = await fetch("/api/checkout-drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dropId: drop.id, taille: tailleChoisie }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErreur(data.error || "Une erreur est survenue. Réessayez.");
        setEnCours(false);
      }
    } catch {
      setErreur("Une erreur est survenue. Réessayez.");
      setEnCours(false);
    }
  };

  return (
    <>
      <Header />

      <main style={{ minHeight: "70vh", backgroundColor: "#F5F1EA" }} className="px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <p className="text-center py-20 text-[#1A2332]/50 text-sm">Chargement…</p>
          ) : !drop ? (
            <p className="text-center py-20 text-[#1A2332]/50 text-sm">Aucun drop disponible.</p>
          ) : !estOuvert ? (
            <div className="text-center py-20">
              <p className="text-[#1A2332]/60 text-sm mb-4">Le drop n'est pas encore ouvert.</p>
              <Link href="/drops" className="text-[#B8985A] text-sm underline">Voir le compte à rebours</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              {/* Image */}
              <div className="flex">
                <div
                  className="w-full bg-[#EFE9DC] bg-cover bg-center border border-[#1A2332]/10"
                  style={{ backgroundImage: `url('${drop.image_url}')` }}
                  aria-hidden="true"
                />
              </div>

              {/* Détails + commande */}
              <div className="flex flex-col justify-center">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] mb-3">{drop.sous_titre}</p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A2332] leading-tight mb-3">
                  {drop.titre_principal}
                </h1>
                <p className="text-sm text-[#1A2332]/65 leading-relaxed mb-6">{drop.description}</p>

                <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-[#1A2332]/10">
                  <span className="text-2xl font-black text-[#1A2332]">{prixEuros} €</span>
                  <span className="text-[11px] text-[#1A2332]/50">· Pièce numérotée · Édition limitée</span>
                </div>

                {/* Sélecteur de taille */}
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/60 mb-3">Votre taille</p>
                  {drop.tailles && drop.tailles.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {drop.tailles.map((t) => {
                        const actif = tailleChoisie === t;
                        return (
                          <button
                            key={t}
                            onClick={() => setTailleChoisie(t)}
                            style={{
                              minWidth: "52px", padding: "12px 16px", fontSize: "14px", fontWeight: 600,
                              border: actif ? "2px solid #1A2332" : "1px solid rgba(26,35,50,0.25)",
                              backgroundColor: actif ? "#1A2332" : "transparent",
                              color: actif ? "#fff" : "#1A2332", cursor: "pointer",
                            }}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-[#1A2332]/50 italic">Aucune taille disponible.</p>
                  )}
                </div>

                {/* Récap */}
                <div className="bg-white border border-[#1A2332]/10 p-5 mb-6">
                  <p className="text-[9px] tracking-[0.25em] uppercase text-[#B8985A] mb-3 font-semibold">Récapitulatif</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-[#1A2332]/70">
                      <span>Pièce</span>
                      <span className="text-[#1A2332] font-medium">{drop.name}</span>
                    </div>
                    <div className="flex justify-between text-[#1A2332]/70">
                      <span>Taille</span>
                      <span className="text-[#1A2332] font-medium">{tailleChoisie || "—"}</span>
                    </div>
                    <div className="flex justify-between text-[#1A2332]/70">
                      <span>Quantité</span>
                      <span className="text-[#1A2332] font-medium">1 (max par personne)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#1A2332]/10 font-black text-[#1A2332] text-base">
                      <span>Total</span>
                      <span>{prixEuros} €</span>
                    </div>
                  </div>
                </div>

                {erreur && (
                  <p className="text-sm text-red-600 mb-4 bg-red-50 border border-red-200 px-4 py-2.5">{erreur}</p>
                )}

                <button
                  onClick={payer}
                  disabled={!tailleChoisie || enCours || (drop.tailles?.length || 0) === 0}
                  style={{
                    width: "100%", padding: "16px", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
                    backgroundColor: "#0A0A0A",
                    color: "#B8985A", border: "none",
                    cursor: !tailleChoisie || enCours ? "not-allowed" : "pointer",
                    opacity: !tailleChoisie || enCours ? 0.55 : 1,
                  }}
                >
                  {enCours ? "Redirection vers le paiement…" : !isLoaded ? "Chargement…" : tailleChoisie ? "Procéder au paiement" : "Sélectionnez une taille"}
                </button>

                <p className="text-[10px] text-[#1A2332]/45 text-center mt-3 leading-relaxed">
                  Paiement sécurisé via Stripe · Pièce numérotée et certifiée · Une seule pièce par personne · Non remboursable
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}