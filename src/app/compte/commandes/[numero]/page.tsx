"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Article = { id: number; name?: string; price?: number; color: string; size: string; qty: number; image?: string };

type Commande = {
  numero: string;
  articles: Article[];
  montant_total: number;
  statut: string;
  created_at: string;
  adresse_livraison: any;
};

// Les 4 étapes du suivi
const ETAPES = ["Confirmée", "En préparation", "Expédiée", "Livrée"];

// Mappe le statut DB vers l'index d'étape atteint
function indexEtape(statut: string): number {
  switch (statut) {
    case "payee": return 1;       // Confirmée + En préparation
    case "expediee": return 2;    // + Expédiée
    case "livree": return 3;      // + Livrée
    default: return 0;
  }
}

const LIVRAISON_OFFERTE_SEUIL = 100; // €

export default function DetailCommandePage() {
  const params = useParams();
  const numero = params.numero as string;
  const { isLoaded, isSignedIn } = useUser();

  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    fetch(`/api/mes-commandes/${numero}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.commande) setCommande(data.commande);
        else setErreur(data.error || "Commande introuvable");
        setLoading(false);
      })
      .catch(() => {
        setErreur("Erreur de chargement");
        setLoading(false);
      });
  }, [isLoaded, isSignedIn, numero]);

  const formatPrix = (centimes: number) => `${(centimes / 100).toLocaleString("fr-FR")} €`;
  const formatPrixEuro = (euros: number) => `${euros.toLocaleString("fr-FR")} €`;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return iso;
    }
  };

  const formatAdresse = (adr: any): string[] => {
    if (!adr) return ["Non renseignée"];
    return [
      adr.line1,
      adr.line2,
      [adr.postal_code, adr.city].filter(Boolean).join(" "),
      adr.country,
    ].filter(Boolean);
  };

  const estAnnulee = commande?.statut === "annulee";
  const etapeActuelle = commande ? indexEtape(commande.statut) : 0;

  // Calcul du sous-total articles (somme price * qty)
  const sousTotal = commande
    ? (commande.articles || []).reduce((s, a) => s + (Number(a.price) || 0) * (a.qty || 0), 0)
    : 0;
  const livraisonOfferte = sousTotal >= LIVRAISON_OFFERTE_SEUIL;

  return (
    <>
      <Header />

      <section className="bg-[#F5F1EA] px-4 sm:px-6 pt-8 pb-16 min-h-[60vh]">
        <div className="max-w-3xl mx-auto">
          {/* Fil d'ariane */}
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#1A2332]/60 mb-6 flex-wrap">
            <Link href="/" className="hover:text-[#B8985A] transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/compte" className="hover:text-[#B8985A] transition-colors">Compte</Link>
            <span>/</span>
            <Link href="/compte/commandes" className="hover:text-[#B8985A] transition-colors">Mes commandes</Link>
            <span>/</span>
            <span className="text-[#1A2332]">{numero}</span>
          </nav>

          {loading || !isLoaded ? (
            <p className="text-sm text-[#1A2332]/40 py-10 text-center">Chargement...</p>
          ) : !isSignedIn ? (
            <div className="text-center py-16">
              <p className="text-sm text-[#1A2332]/60 mb-6">Connectez-vous pour voir cette commande.</p>
              <Link href={`/sign-in?redirect_url=/compte/commandes/${numero}`} className="inline-block px-10 py-3.5 bg-black text-[#B8985A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all">
                Se connecter
              </Link>
            </div>
          ) : erreur || !commande ? (
            <div className="text-center py-16">
              <p className="text-sm text-[#1A2332]/60 mb-6">{erreur || "Commande introuvable."}</p>
              <Link href="/compte/commandes" className="inline-block px-10 py-3.5 bg-black text-[#B8985A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all">
                Retour à mes commandes
              </Link>
            </div>
          ) : (
            <>
              {/* En-tête commande */}
              <div className="mb-8">
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-2">Commande</p>
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332]">{commande.numero}</h1>
                  <p className="text-sm text-[#1A2332]/55">Passée le {formatDate(commande.created_at)}</p>
                </div>
                <div className="w-10 h-px bg-[#B8985A] mt-3" />
              </div>

              {/* SUIVI DE LIVRAISON */}
              <div className="bg-white border border-[#1A2332]/10 p-6 sm:p-8 mb-6">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#1A2332]/45 mb-6">Suivi de commande</p>

                {estAnnulee ? (
                  <div className="flex items-center gap-3 text-red-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <span className="text-sm font-semibold">Commande annulée</span>
                  </div>
                ) : (
                  <div className="flex items-start justify-between relative">
                    {/* Ligne de fond */}
                    <div className="absolute top-[11px] left-0 right-0 h-px bg-[#1A2332]/15" style={{ marginLeft: "5%", marginRight: "5%" }} />
                    {/* Ligne de progression or */}
                    <div
                      className="absolute top-[11px] left-0 h-px bg-[#B8985A] transition-all duration-500"
                      style={{ marginLeft: "5%", width: `${(etapeActuelle / (ETAPES.length - 1)) * 90}%` }}
                    />
                    {ETAPES.map((etape, i) => {
                      const atteinte = i <= etapeActuelle;
                      return (
                        <div key={etape} className="flex flex-col items-center gap-2 relative z-10" style={{ width: "25%" }}>
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                            style={{
                              backgroundColor: atteinte ? "#B8985A" : "#F5F1EA",
                              borderColor: atteinte ? "#B8985A" : "rgba(26,35,50,0.2)",
                            }}
                          >
                            {atteinte && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-[10px] tracking-[0.1em] uppercase text-center ${atteinte ? "text-[#1A2332] font-semibold" : "text-[#1A2332]/40"}`}>
                            {etape}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ARTICLES */}
              <div className="bg-white border border-[#1A2332]/10 p-6 sm:p-8 mb-6">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#1A2332]/45 mb-5">Articles</p>
                <div className="space-y-5">
                  {(commande.articles || []).map((a, i) => (
                    <div key={i} className="flex gap-4 pb-5 border-b border-[#1A2332]/10 last:border-0 last:pb-0">
                      <div className="w-20 h-24 bg-[#EFE9DC] overflow-hidden flex-shrink-0">
                        {a.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.image} alt={a.name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "#EFE9DC" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <p className="text-sm font-semibold text-[#1A2332]">{a.name || `Produit #${a.id}`}</p>
                        <p className="text-[11px] text-[#1A2332]/50 mt-1">{a.color} · Taille {a.size}</p>
                        <p className="text-[11px] text-[#1A2332]/50 mt-0.5">Quantité : {a.qty}</p>
                        <p className="text-sm font-semibold text-[#1A2332] mt-auto">{a.price ? formatPrixEuro(Number(a.price) * a.qty) : "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RÉCAP MONTANTS + ADRESSE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Adresse */}
                <div className="bg-white border border-[#1A2332]/10 p-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#1A2332]/45 mb-4">Livraison</p>
                  <div className="text-sm text-[#1A2332] space-y-0.5">
                    {formatAdresse(commande.adresse_livraison).map((ligne, i) => (
                      <p key={i}>{ligne}</p>
                    ))}
                  </div>
                </div>

                {/* Montants */}
                <div className="bg-white border border-[#1A2332]/10 p-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#1A2332]/45 mb-4">Récapitulatif</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-[#1A2332]/70">
                      <span>Sous-total</span>
                      <span>{formatPrixEuro(sousTotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#1A2332]/70">
                      <span>Livraison</span>
                      <span>{livraisonOfferte ? <span className="text-[#B8985A]">Offerte</span> : "—"}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#1A2332]/10 font-black text-[#1A2332]">
                      <span>Total</span>
                      <span>{formatPrix(commande.montant_total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="bg-[#EFE9DC] p-6 sm:p-8">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#1A2332]/45 mb-4">Besoin d'aide ?</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => alert("Le système de retours arrive bientôt.")}
                    className="flex-1 text-center py-3.5 border border-[#1A2332]/25 text-[#1A2332] text-[11px] tracking-[0.2em] uppercase font-semibold hover:border-[#B8985A] hover:text-[#B8985A] transition-all"
                    style={{ background: "none", cursor: "pointer" }}
                  >
                    Demander un retour
                  </button>
                  <button
                    onClick={() => alert("La messagerie support arrive bientôt.")}
                    className="flex-1 text-center py-3.5 border border-[#1A2332]/25 text-[#1A2332] text-[11px] tracking-[0.2em] uppercase font-semibold hover:border-[#B8985A] hover:text-[#B8985A] transition-all"
                    style={{ background: "none", cursor: "pointer" }}
                  >
                    Contacter le support
                  </button>
                </div>
                <p className="text-[10px] text-[#1A2332]/45 mt-4 leading-relaxed italic">
                  Retours gratuits sous 30 jours. Notre équipe vous répond sous 24h.
                </p>
              </div>

              {/* Retour liste */}
              <div className="mt-8">
                <Link href="/compte/commandes" className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#1A2332] hover:text-[#B8985A] transition-colors">
                  <svg width="14" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="16" y1="6" x2="2" y2="6" />
                    <polyline points="6 2 2 6 6 10" />
                  </svg>
                  Retour à mes commandes
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}