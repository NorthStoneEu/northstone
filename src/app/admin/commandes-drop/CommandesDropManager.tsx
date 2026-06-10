"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Article = { id: number; name?: string; price?: number; color: string; size: string; qty: number; image?: string; numero_serie?: string };
type ProfilClient = { civility?: string; phone?: string; birthday?: string; newsletter_opted_in?: boolean };
type Commande = {
  id: string; numero: string; clerk_user_id: string | null; email_client: string;
  articles: Article[]; montant_total: number; devise: string; statut: string;
  adresse_livraison: any; stripe_session_id: string; stripe_payment_intent?: string; created_at: string;
  client_profil?: ProfilClient | null; client_nom?: string; client_nb_commandes?: number;
};

const STATUTS: Record<string, { label: string; couleur: string; bg: string }> = {
  payee: { label: "Confirmée", couleur: "#2C5282", bg: "rgba(44,82,130,0.08)" },
  en_preparation: { label: "En préparation", couleur: "#6B46C1", bg: "rgba(107,70,193,0.08)" },
  expediee: { label: "Expédiée", couleur: "#8a6d35", bg: "rgba(184,152,90,0.12)" },
  livree: { label: "Livrée", couleur: "#2F6F4E", bg: "rgba(47,111,78,0.1)" },
  annulee: { label: "Annulée", couleur: "#A03030", bg: "rgba(160,48,48,0.08)" },
  remboursee: { label: "Remboursée", couleur: "#B5651D", bg: "rgba(181,101,29,0.1)" },
};

const ETAPES = [
  { cle: "payee", label: "Confirmée" },
  { cle: "en_preparation", label: "En préparation" },
  { cle: "expediee", label: "Expédiée" },
  { cle: "livree", label: "Livrée" },
];
const ORDRE_ETAPE: Record<string, number> = { payee: 0, en_preparation: 1, expediee: 2, livree: 3 };

const Icone = ({ d, size = 14 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONES = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0",
  mail: "M4 4h16v16H4z M22 6l-10 7L2 6",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0",
  box: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96 12 12.01l8.73-5.05 M12 22.08V12",
  euro: "M4 10h12 M4 14h9 M19 6a7.5 7.5 0 1 0 0 12",
  truck: "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 18.5 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0 M18.5 18.5 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0",
  cal: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
  star: "M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6-6.3 4.6L8 14 2 9.4h7.6z",
};

export default function CommandesDropManager() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [selId, setSelId] = useState<string | null>(null);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [majEnCours, setMajEnCours] = useState<string | null>(null);

  const charger = () => {
    setLoading(true);
    fetch("/api/admin/commandes?type=drop", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setCommandes(data.commandes || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);
  useEffect(() => {
    document.body.style.overflow = selId ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selId]);

  const commandesFiltrees = commandes.filter((c) => {
    if (filtreStatut !== "tous" && c.statut !== filtreStatut) return false;
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      if (!c.numero?.toLowerCase().includes(q) && !c.email_client?.toLowerCase().includes(q) && !(c.client_nom || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const selectionnee = commandes.find((c) => c.id === selId) || null;

  const gererDefaut = (numero: string) => {
    alert(
      `Gestion d'un défaut — ${numero}\n\n` +
      `Procédure pièce de drop :\n` +
      `1. Le client renvoie la pièce défectueuse\n` +
      `2. Une nouvelle pièce est reconfectionnée (avec certificat)\n` +
      `3. La pièce défectueuse est détruite\n\n` +
      `Aucun remboursement : les pièces de drop sont uniques et numérotées.\n\n` +
      `Le suivi complet des remplacements sera disponible prochainement.`
    );
  };

  const changerStatut = async (id: string, statut: string) => {
    setMajEnCours(id);
    const res = await fetch("/api/admin/commandes", {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ id, statut }),
    });
    setMajEnCours(null);
    if (res.ok) { charger(); }
    else { const data = await res.json(); alert("Erreur : " + (data.error || "inconnue")); }
  };

  const genererEtiquette = () => {
    alert("Génération d'étiquette — bientôt disponible.\n\nLes pièces de drop sont expédiées en Colissimo avec signature. Cette fonction sera branchée avec Sendcloud une fois votre compte transporteur actif.");
  };

  const formatPrix = (centimes: number) => `${(centimes / 100).toLocaleString("fr-FR")} €`;
  const formatPrixEuro = (euros: number) => `${euros.toLocaleString("fr-FR")} €`;
  const formatDate = (iso: string) => { try { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }); } catch { return iso; } };
  const formatDateLong = (iso: string) => { try { return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }); } catch { return iso; } };
  const formatAdresse = (adr: any): string[] => {
    if (!adr) return ["Non renseignée"];
    return [adr.line1, adr.line2, [adr.postal_code, adr.city].filter(Boolean).join(" "), adr.country].filter(Boolean);
  };
  const compteur = (s: string) => commandes.filter((c) => c.statut === s).length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F1EA" }}>
      {/* EN-TÊTE — accent doré pour distinguer du module boutique */}
      <header style={{ backgroundColor: "#0A0A0A", color: "#fff", borderBottom: "1px solid rgba(184,152,90,0.4)" }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: "56px" }}>
          <div className="flex items-center gap-3">
            <Link href="/admin" style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "0.2em", color: "#fff" }}>NORTHSTONE</Link>
            <span style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#0A0A0A", backgroundColor: "#B8985A", padding: "2px 8px", fontWeight: 700 }}>Drops</span>
          </div>
          <Link href="/admin" style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }} className="hover:text-white transition-colors">← Tableau de bord</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#B8985A", marginBottom: "4px" }}>Édition limitée</p>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1A2332", letterSpacing: "-0.01em" }}>Commandes Drop</h1>
            <p style={{ fontSize: "12.5px", color: "rgba(26,35,50,0.6)", marginTop: "4px" }}>Pièces numérotées · 1 exemplaire par client · expédition signature</p>
          </div>
          <div className="flex gap-5">
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "22px", fontWeight: 800, color: "#1A2332", lineHeight: 1 }}>{compteur("payee") + compteur("en_preparation") + compteur("expediee") + compteur("livree")}</p>
              <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(26,35,50,0.5)", marginTop: "3px" }}>Pièces vendues</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "22px", fontWeight: 800, color: "#8a6d35", lineHeight: 1 }}>{compteur("payee") + compteur("en_preparation")}</p>
              <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(26,35,50,0.5)", marginTop: "3px" }}>À expédier</p>
            </div>
            {(compteur("annulee") + compteur("remboursee")) > 0 && (
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "22px", fontWeight: 800, color: "#A03030", lineHeight: 1 }}>{compteur("annulee") + compteur("remboursee")}</p>
                <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(26,35,50,0.5)", marginTop: "3px" }}>Annulées</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(26,35,50,0.35)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </span>
            <input placeholder="Rechercher (numéro, email, nom)" value={recherche} onChange={(e) => setRecherche(e.target.value)}
              style={{ width: "100%", background: "#fff", border: "1px solid rgba(26,35,50,0.15)", padding: "10px 12px 10px 36px", fontSize: "13px", color: "#1A2332", outline: "none" }} />
          </div>
          <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} style={{ background: "#fff", border: "1px solid rgba(26,35,50,0.15)", padding: "10px 12px", fontSize: "13px", color: "#1A2332", outline: "none", cursor: "pointer" }}>
            <option value="tous">Tous les statuts ({commandes.length})</option>
            <option value="payee">Confirmée ({compteur("payee")})</option>
            <option value="en_preparation">En préparation ({compteur("en_preparation")})</option>
            <option value="expediee">Expédiée ({compteur("expediee")})</option>
            <option value="livree">Livrée ({compteur("livree")})</option>
            <option value="annulee">Annulée ({compteur("annulee")})</option>
            <option value="remboursee">Remboursée ({compteur("remboursee")})</option>
          </select>
        </div>

        <div style={{ backgroundColor: "#fff", border: "1px solid rgba(26,35,50,0.12)" }}>
          <div className="hidden sm:grid" style={{ gridTemplateColumns: "2.2fr 2fr 1.2fr 1.3fr 1fr 32px", gap: "12px", padding: "12px 18px", borderBottom: "1px solid rgba(26,35,50,0.12)", backgroundColor: "rgba(245,241,234,0.5)" }}>
            {["Commande", "Client", "Date", "Statut", "Montant", ""].map((h, i) => (
              <span key={i} style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,35,50,0.5)", fontWeight: 600, textAlign: i === 4 ? "right" : "left" }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <p className="text-center py-14" style={{ color: "rgba(26,35,50,0.5)", fontSize: "13px" }}>Chargement…</p>
          ) : commandesFiltrees.length === 0 ? (
            <div className="text-center py-16">
              <p style={{ color: "rgba(26,35,50,0.5)", fontSize: "13px", marginBottom: "6px" }}>Aucune commande de drop pour le moment.</p>
              <p style={{ color: "rgba(26,35,50,0.4)", fontSize: "12px" }}>Les commandes apparaîtront ici lors du prochain drop.</p>
            </div>
          ) : (
            commandesFiltrees.map((c) => {
              const st = STATUTS[c.statut] || { label: c.statut, couleur: "#666", bg: "rgba(0,0,0,0.04)" };
              return (
                <button key={c.id} onClick={() => setSelId(c.id)} className="w-full grid items-center hover:bg-[#F5F1EA]/60 transition-colors"
                  style={{ gridTemplateColumns: "2.2fr 2fr 1.2fr 1.3fr 1fr 32px", gap: "12px", padding: "14px 18px", borderBottom: "1px solid rgba(26,35,50,0.07)", background: "none", cursor: "pointer", textAlign: "left" }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div style={{ width: "38px", height: "46px", backgroundColor: "#EFE9DC", overflow: "hidden", flexShrink: 0 }}>
                      {c.articles?.[0]?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.articles[0].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#1A2332" }}>{c.numero}</p>
                      <p style={{ fontSize: "11px", color: "#8a6d35" }}>Pièce de drop</p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p style={{ fontSize: "13px", color: "#1A2332", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.client_nom || "—"}</p>
                    <p style={{ fontSize: "11px", color: "rgba(26,35,50,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email_client}</p>
                  </div>
                  <span style={{ fontSize: "12px", color: "rgba(26,35,50,0.7)" }}>{formatDate(c.created_at)}</span>
                  <div>
                    <span style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: st.couleur, backgroundColor: st.bg, padding: "4px 9px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: st.couleur }} />
                      {st.label}
                    </span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A2332", textAlign: "right" }}>{formatPrix(c.montant_total)}</span>
                  <span style={{ color: "rgba(26,35,50,0.3)", textAlign: "right" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  </span>
                </button>
              );
            })
          )}
        </div>
        <p style={{ fontSize: "11px", color: "rgba(26,35,50,0.45)", marginTop: "10px" }}>{commandesFiltrees.length} pièce(s) affichée(s)</p>
      </main>

      {/* PANNEAU LATÉRAL */}
      <div style={{ position: "fixed", inset: 0, zIndex: 100, pointerEvents: selId ? "auto" : "none" }}>
        <div onClick={() => setSelId(null)} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(10,10,10,0.4)", backdropFilter: "blur(2px)", opacity: selId ? 1 : 0, transition: "opacity 0.3s" }} />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: "520px", backgroundColor: "#F5F1EA", boxShadow: "-20px 0 60px rgba(0,0,0,0.3)", transform: selId ? "translateX(0)" : "translateX(100%)", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)", display: "flex", flexDirection: "column" }}>
          {selectionnee && (() => {
            const c = selectionnee;
            const st = STATUTS[c.statut] || { label: c.statut, couleur: "#666", bg: "rgba(0,0,0,0.04)" };
            const estFinale = c.statut === "remboursee" || c.statut === "annulee";
            const etapeActuelle = ORDRE_ETAPE[c.statut] ?? -1;
            const sousTotal = (c.articles || []).reduce((s, a) => s + (Number(a.price) || 0) * (a.qty || 0), 0);
            const profil = c.client_profil;
            return (
              <>
                <div style={{ flexShrink: 0, borderBottom: "1px solid rgba(26,35,50,0.1)" }}>
                  <div style={{ height: "3px", backgroundColor: "#B8985A" }} />
                  <div className="flex items-center justify-between" style={{ padding: "18px 24px" }}>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#1A2332" }}>{c.numero}</h2>
                        <span style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: st.couleur, backgroundColor: st.bg, padding: "4px 9px", fontWeight: 600 }}>{st.label}</span>
                      </div>
                      <p style={{ fontSize: "11px", color: "#8a6d35", marginTop: "4px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Pièce de drop · édition limitée</p>
                      <p style={{ fontSize: "12px", color: "rgba(26,35,50,0.55)", marginTop: "2px" }}>{formatDateLong(c.created_at)}</p>
                    </div>
                    <button onClick={() => setSelId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1A2332", padding: "4px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "24px" }} className="space-y-7">
                  {!estFinale ? (
                    <div>
                      <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(26,35,50,0.5)", marginBottom: "18px" }}>Suivi</p>
                      <div className="flex items-start justify-between relative" style={{ padding: "0 6px" }}>
                        <div style={{ position: "absolute", top: "9px", left: "11%", right: "11%", height: "2px", backgroundColor: "rgba(26,35,50,0.12)" }} />
                        <div style={{ position: "absolute", top: "9px", left: "11%", height: "2px", backgroundColor: "#B8985A", width: `${(Math.max(0, etapeActuelle) / 3) * 78}%`, transition: "width 0.5s" }} />
                        {ETAPES.map((e, i) => {
                          const atteinte = i <= etapeActuelle;
                          return (
                            <div key={e.cle} className="flex flex-col items-center relative z-10" style={{ width: "25%", gap: "8px" }}>
                              <div style={{ width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: atteinte ? "#B8985A" : "#F5F1EA", border: atteinte ? "none" : "1.5px solid rgba(26,35,50,0.2)" }}>
                                {atteinte && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                              </div>
                              <span style={{ fontSize: "8.5px", letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "center", color: atteinte ? "#1A2332" : "rgba(26,35,50,0.45)", fontWeight: atteinte ? 700 : 400 }}>{e.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "14px", backgroundColor: c.statut === "remboursee" ? "rgba(181,101,29,0.08)" : "rgba(160,48,48,0.07)", textAlign: "center" }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: c.statut === "remboursee" ? "#B5651D" : "#A03030" }}>
                        {c.statut === "remboursee" ? "Commande remboursée" : "Commande annulée"}
                      </p>
                    </div>
                  )}

                  <div style={{ backgroundColor: "#fff", border: "1px solid rgba(26,35,50,0.1)", padding: "16px" }}>
                    <p className="flex items-center gap-2" style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8985A", marginBottom: "12px" }}>
                      <span style={{ color: "#B8985A" }}><Icone d={ICONES.user} size={13} /></span> Client
                    </p>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#1A2332" }}>{profil?.civility ? `${profil.civility} ` : ""}{c.client_nom || "—"}</p>
                    <div className="space-y-1.5" style={{ marginTop: "10px" }}>
                      <p className="flex items-center gap-2" style={{ fontSize: "12.5px", color: "rgba(26,35,50,0.75)" }}><span style={{ color: "rgba(26,35,50,0.4)" }}><Icone d={ICONES.mail} size={13} /></span> {c.email_client}</p>
                      {profil?.phone && <p className="flex items-center gap-2" style={{ fontSize: "12.5px", color: "rgba(26,35,50,0.75)" }}><span style={{ color: "rgba(26,35,50,0.4)" }}><Icone d={ICONES.phone} size={13} /></span> {profil.phone}</p>}
                      {profil?.birthday && <p className="flex items-center gap-2" style={{ fontSize: "12.5px", color: "rgba(26,35,50,0.75)" }}><span style={{ color: "rgba(26,35,50,0.4)" }}><Icone d={ICONES.cal} size={13} /></span> {formatDate(profil.birthday)}</p>}
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#fff", border: "1px solid rgba(26,35,50,0.1)", padding: "16px" }}>
                    <p className="flex items-center gap-2" style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8985A", marginBottom: "12px" }}>
                      <span style={{ color: "#B8985A" }}><Icone d={ICONES.pin} size={13} /></span> Livraison (signature)
                    </p>
                    <div style={{ fontSize: "13px", color: "#1A2332", lineHeight: 1.6 }}>
                      {formatAdresse(c.adresse_livraison).map((l, i) => <p key={i}>{l}</p>)}
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#fff", border: "1px solid rgba(26,35,50,0.1)", padding: "16px" }}>
                    <p className="flex items-center gap-2" style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8985A", marginBottom: "12px" }}>
                      <span style={{ color: "#B8985A" }}><Icone d={ICONES.star} size={13} /></span> Pièce
                    </p>
                    {(c.articles || []).map((a, i) => (
                      <div key={i} className="flex gap-3 items-center" style={{ padding: "10px 0", borderBottom: i < c.articles.length - 1 ? "1px solid rgba(26,35,50,0.08)" : "none" }}>
                        <div style={{ width: "42px", height: "50px", backgroundColor: "#EFE9DC", overflow: "hidden", flexShrink: 0 }}>
                          {a.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={a.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A2332" }}>{a.name || `Produit #${a.id}`}</p>
                          <p style={{ fontSize: "11.5px", color: "rgba(26,35,50,0.6)" }}>{a.color} · Taille {a.size}{a.numero_serie ? ` · N° ${a.numero_serie}` : ""}</p>
                        </div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A2332" }}>{a.price ? formatPrixEuro(Number(a.price) * a.qty) : "—"}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ backgroundColor: "#fff", border: "1px solid rgba(26,35,50,0.1)", padding: "16px" }}>
                    <p className="flex items-center gap-2" style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8985A", marginBottom: "12px" }}>
                      <span style={{ color: "#B8985A" }}><Icone d={ICONES.euro} size={13} /></span> Montants
                    </p>
                    <div className="space-y-2" style={{ fontSize: "13px" }}>
                      <div className="flex justify-between" style={{ color: "rgba(26,35,50,0.7)" }}><span>Sous-total</span><span>{formatPrixEuro(sousTotal)}</span></div>
                      <div className="flex justify-between" style={{ color: "rgba(26,35,50,0.7)" }}><span>Livraison</span><span>{(c.montant_total / 100 - sousTotal) > 0 ? formatPrixEuro(c.montant_total / 100 - sousTotal) : "Offerte"}</span></div>
                      <div className="flex justify-between" style={{ paddingTop: "10px", borderTop: "1px solid rgba(26,35,50,0.12)", fontWeight: 800, color: "#1A2332", fontSize: "15px" }}><span>Total payé</span><span>{formatPrix(c.montant_total)}</span></div>
                      <p style={{ fontSize: "10px", color: "rgba(26,35,50,0.45)" }}>TVA incluse · {c.devise?.toUpperCase() || "EUR"}</p>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(26,35,50,0.5)", marginBottom: "10px" }}>Faire évoluer le statut</p>
                    {estFinale ? (
                      <p style={{ fontSize: "12px", color: "rgba(26,35,50,0.6)", fontStyle: "italic" }}>Statut verrouillé — commande {c.statut === "remboursee" ? "remboursée" : "annulée"}.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(STATUTS).filter((s) => s !== "remboursee").map((s) => {
                          const actif = c.statut === s;
                          return (
                            <button key={s} onClick={() => changerStatut(c.id, s)} disabled={majEnCours === c.id || actif}
                              style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 13px", border: actif ? "1px solid #1A2332" : "1px solid rgba(26,35,50,0.25)", backgroundColor: actif ? "#1A2332" : "transparent", color: actif ? "#fff" : "#1A2332", cursor: actif ? "default" : "pointer", opacity: majEnCours === c.id ? 0.4 : 1 }}>
                              {STATUTS[s].label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ flexShrink: 0, borderTop: "1px solid rgba(26,35,50,0.1)", padding: "16px 24px", backgroundColor: "#fff" }}>
                  <div className="flex gap-3">
                    <button onClick={genererEtiquette} style={{ flex: 1, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px", border: "none", backgroundColor: "#1A2332", color: "#B8985A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                      <Icone d={ICONES.truck} size={14} /> Étiquette signature
                    </button>
                    <button onClick={() => gererDefaut(c.numero)} style={{ flex: 1, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px", border: "1px solid rgba(26,35,50,0.25)", backgroundColor: "transparent", color: "#1A2332", cursor: "pointer" }}>
                      Gérer un défaut
                    </button>
                  </div>
                  <p style={{ fontSize: "9.5px", color: "rgba(26,35,50,0.45)", fontStyle: "italic", marginTop: "8px", textAlign: "center" }}>Colissimo signature · Pièce unique, non remboursable</p>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}