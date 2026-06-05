"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Article = { id: number; color: string; size: string; qty: number };

type Commande = {
  id: string;
  numero: string;
  clerk_user_id: string | null;
  email_client: string;
  articles: Article[];
  montant_total: number;
  devise: string;
  statut: string;
  adresse_livraison: any;
  stripe_session_id: string;
  created_at: string;
};

const STATUTS: Record<string, { label: string; classe: string }> = {
  payee: { label: "Payée", classe: "text-blue-700 border-blue-200 bg-blue-50" },
  expediee: { label: "Expédiée", classe: "text-[#8a6d35] border-[#B8985A]/30 bg-[#B8985A]/10" },
  livree: { label: "Livrée", classe: "text-green-700 border-green-200 bg-green-50" },
  annulee: { label: "Annulée", classe: "text-red-600 border-red-200 bg-red-50" },
};

export default function CommandesManager() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [majEnCours, setMajEnCours] = useState<string | null>(null);

  const charger = () => {
    setLoading(true);
    fetch("/api/admin/commandes", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setCommandes(data.commandes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    charger();
  }, []);

  const commandesFiltrees = commandes.filter((c) => {
    if (filtreStatut !== "tous" && c.statut !== filtreStatut) return false;
    return true;
  });

  const changerStatut = async (id: string, statut: string) => {
    setMajEnCours(id);
    const res = await fetch("/api/admin/commandes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, statut }),
    });
    setMajEnCours(null);
    if (res.ok) {
      charger();
    } else {
      const data = await res.json();
      alert("Erreur : " + (data.error || "inconnue"));
    }
  };

  const formatPrix = (centimes: number) => `${(centimes / 100).toLocaleString("fr-FR")} €`;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const formatAdresse = (adr: any): string => {
    if (!adr) return "Non renseignée";
    const parts = [
      adr.line1,
      adr.line2,
      [adr.postal_code, adr.city].filter(Boolean).join(" "),
      adr.country,
    ].filter(Boolean);
    return parts.join(", ") || "Non renseignée";
  };

  const inputClass =
    "bg-transparent border border-[#1A2332]/20 px-3 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors";

  return (
    <div className="min-h-screen bg-[#F5F1EA]">
      <header className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-lg font-black tracking-[0.2em] hover:text-[#B8985A] transition-colors">
            NORTHSTONE
          </Link>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] border border-[#B8985A]/40 px-2 py-0.5">
            Admin
          </span>
        </div>
        <Link href="/admin" className="text-xs text-white/70 hover:text-white transition-colors">
          ← Tableau de bord
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#1A2332]/40 mb-2">Boutique</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A2332]">Commandes</h1>
          <p className="text-sm text-[#1A2332]/55 mt-2">
            Toutes les commandes passées sur la boutique. Cliquez pour voir le détail et changer le statut.
          </p>
        </div>

        {/* Filtres statut */}
        <div className="bg-white border border-[#1A2332]/10 border-t-2 border-t-[#B8985A] p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/50 mb-1">Statut</label>
            <select className={inputClass} value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
              <option value="tous">Tous</option>
              <option value="payee">Payée</option>
              <option value="expediee">Expédiée</option>
              <option value="livree">Livrée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>
        </div>

        <p className="text-[11px] text-[#1A2332]/40 mb-3">
          {loading ? "Chargement..." : `${commandesFiltrees.length} commande(s)`}
        </p>

        {loading ? (
          <p className="text-center py-10 text-[#1A2332]/40 text-sm">Chargement...</p>
        ) : commandesFiltrees.length === 0 ? (
          <p className="text-sm text-[#1A2332]/40 py-4">Aucune commande.</p>
        ) : (
          <div className="space-y-3">
            {commandesFiltrees.map((c) => {
              const estOuvert = ouvert === c.id;
              const statutInfo = STATUTS[c.statut] || { label: c.statut, classe: "text-[#1A2332]/70 border-[#1A2332]/15 bg-[#EFE9DC]" };
              return (
                <div key={c.id} className="bg-white border border-[#1A2332]/10">
                  <button
                    onClick={() => setOuvert(estOuvert ? null : c.id)}
                    className="w-full text-left p-4 flex items-start justify-between gap-4 flex-wrap hover:bg-[#F5F1EA]/50 transition-colors"
                    style={{ background: "none", cursor: "pointer" }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#1A2332]">{c.numero}</span>
                        <span className={`text-[9px] tracking-[0.15em] uppercase border px-2 py-0.5 ${statutInfo.classe}`}>
                          {statutInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#1A2332]/50 mt-1.5">{c.email_client}</p>
                      <p className="text-[11px] text-[#1A2332]/45 mt-1">
                        {(c.articles || []).reduce((s, a) => s + (a.qty || 0), 0)} article(s) · {formatDate(c.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <p className="text-base font-black text-[#1A2332] whitespace-nowrap">{formatPrix(c.montant_total)}</p>
                      <span className="text-[#1A2332]/30 text-xs">{estOuvert ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {estOuvert && (
                    <div className="border-t border-[#1A2332]/10 p-4 bg-[#F5F1EA]/30 space-y-4">
                      {/* Articles */}
                      <div>
                        <p className="text-[9px] tracking-[0.15em] uppercase text-[#1A2332]/40 mb-2">Articles</p>
                        <div className="space-y-1.5">
                          {(c.articles || []).map((a: any, i) => (
                            <div key={i} className="text-xs bg-white border border-[#1A2332]/10 p-2 flex justify-between">
                              <span className="text-[#1A2332]">
                                {a.name || `Produit #${a.id}`} · {a.color} · Taille {a.size}
                                {a.price ? ` · ${a.price} €` : ""}
                              </span>
                              <span className="font-semibold text-[#1A2332]">× {a.qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Infos client + livraison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        <div>
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Email</span>
                          <p className="text-[#1A2332] mt-0.5">{c.email_client || "—"}</p>
                        </div>
                        <div>
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Compte client</span>
                          <p className="text-[#1A2332] mt-0.5 break-all">{c.clerk_user_id || "— (invité)"}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Adresse de livraison</span>
                          <p className="text-[#1A2332] mt-0.5">{formatAdresse(c.adresse_livraison)}</p>
                        </div>
                      </div>

                      {/* Changer le statut */}
                      <div>
                        <p className="text-[9px] tracking-[0.15em] uppercase text-[#1A2332]/40 mb-2">Changer le statut</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(STATUTS).map((s) => (
                            <button
                              key={s}
                              onClick={() => changerStatut(c.id, s)}
                              disabled={majEnCours === c.id || c.statut === s}
                              className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors disabled:opacity-40 ${
                                c.statut === s
                                  ? "border-[#1A2332] bg-[#1A2332] text-white"
                                  : "border-[#1A2332]/20 text-[#1A2332] hover:border-[#1A2332]"
                              }`}
                              style={{ background: c.statut === s ? "" : "none", cursor: c.statut === s ? "default" : "pointer" }}
                            >
                              {STATUTS[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}