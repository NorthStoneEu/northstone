"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
};

const STATUTS: Record<string, { label: string; classe: string }> = {
  payee: { label: "Confirmée", classe: "text-blue-700 border-blue-200 bg-blue-50" },
  en_preparation: { label: "En préparation", classe: "text-purple-700 border-purple-200 bg-purple-50" },
  expediee: { label: "Expédiée", classe: "text-[#8a6d35] border-[#B8985A]/30 bg-[#B8985A]/10" },
  livree: { label: "Livrée", classe: "text-green-700 border-green-200 bg-green-50" },
  annulee: { label: "Annulée", classe: "text-red-600 border-red-200 bg-red-50" },
};

export default function MesCommandesPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    fetch("/api/mes-commandes", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setCommandes(data.commandes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isLoaded, isSignedIn]);

  const formatPrix = (centimes: number) => `${(centimes / 100).toLocaleString("fr-FR")} €`;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return iso;
    }
  };

  return (
    <>
      <Header />

      <section className="bg-[#F5F1EA] px-4 sm:px-6 pt-8 pb-16 min-h-[60vh]">
        <div className="max-w-3xl mx-auto">
          {/* Fil d'ariane */}
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#1A2332]/60 mb-6">
            <Link href="/" className="hover:text-[#B8985A] transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/compte" className="hover:text-[#B8985A] transition-colors">Compte</Link>
            <span>/</span>
            <span className="text-[#1A2332]">Mes commandes</span>
          </nav>

          {/* Titre */}
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-2">Historique</p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332]">MES COMMANDES</h1>
            <div className="w-10 h-px bg-[#B8985A] mt-3" />
          </div>

          {!isLoaded || loading ? (
            <p className="text-sm text-[#1A2332]/40 py-10 text-center">Chargement...</p>
          ) : !isSignedIn ? (
            <div className="text-center py-16">
              <p className="text-sm text-[#1A2332]/60 mb-6">Connectez-vous pour voir vos commandes.</p>
              <Link
                href="/sign-in?redirect_url=/compte/commandes"
                className="inline-block px-10 py-3.5 bg-black text-[#B8985A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all"
              >
                Se connecter
              </Link>
            </div>
          ) : commandes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-[#1A2332]/60 mb-6">Vous n'avez pas encore passé de commande.</p>
              <Link
                href="/homme"
                className="inline-block px-10 py-3.5 bg-black text-[#B8985A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all"
              >
                Découvrir la collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {commandes.map((c) => {
                const statutInfo = STATUTS[c.statut] || { label: c.statut, classe: "text-[#1A2332]/70 border-[#1A2332]/15 bg-[#EFE9DC]" };
                const nbArticles = (c.articles || []).reduce((s, a) => s + (a.qty || 0), 0);
                return (
                  <Link
                    key={c.numero}
                    href={`/compte/commandes/${c.numero}`}
                    className="block bg-white border border-[#1A2332]/10 hover:border-[#B8985A] hover:shadow-md transition-all"
                  >
                    {/* En-tête commande */}
                    <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-[#1A2332]/10">
                      <div>
                        <p className="text-sm font-semibold text-[#1A2332]">{c.numero}</p>
                        <p className="text-[11px] text-[#1A2332]/50 mt-1">
                          {formatDate(c.created_at)} · {nbArticles} article{nbArticles > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-block text-[9px] tracking-[0.15em] uppercase border px-2 py-0.5 mb-2 ${statutInfo.classe}`}>
                          {statutInfo.label}
                        </span>
                        <p className="text-base font-black text-[#1A2332]">{formatPrix(c.montant_total)}</p>
                      </div>
                    </div>

                    {/* Aperçu photos articles */}
                    <div className="flex items-center gap-3 p-5 sm:p-6">
                      <div className="flex gap-2">
                        {(c.articles || []).slice(0, 4).map((a, i) => (
                          <div key={i} className="w-14 h-16 bg-[#EFE9DC] overflow-hidden flex-shrink-0">
                            {a.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={a.image} alt={a.name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: "100%", height: "100%", background: "#EFE9DC" }} />
                            )}
                          </div>
                        ))}
                        {(c.articles || []).length > 4 && (
                          <div className="w-14 h-16 bg-[#EFE9DC] flex items-center justify-center text-[11px] text-[#1A2332]/50 flex-shrink-0">
                            +{(c.articles || []).length - 4}
                          </div>
                        )}
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-[11px] tracking-[0.15em] uppercase text-[#B8985A] font-semibold">
                        Voir le détail
                        <svg width="14" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <line x1="0" y1="6" x2="14" y2="6" />
                          <polyline points="10 2 14 6 10 10" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}