"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MODULES } from "@/lib/modules";

type Log = {
  id: number;
  created_at: string;
  acteur_email: string;
  acteur_nom: string;
  module: string;
  action: string;
  cible: string;
  details: Record<string, any>;
  etat_avant: Record<string, any> | null;
  etat_apres: Record<string, any> | null;
  adresse_ip: string;
  user_agent: string;
};

export default function JournalView() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [ouvert, setOuvert] = useState<number | null>(null);

  // Filtres
  const [filtreActeur, setFiltreActeur] = useState("tous");
  const [filtreModule, setFiltreModule] = useState("tous");
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    fetch("/api/admin/journal", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Liste unique des acteurs (pour le menu déroulant)
  const acteurs = Array.from(
    new Set(logs.map((l) => l.acteur_email).filter(Boolean))
  );

  // Application des filtres
  const logsFiltres = logs.filter((l) => {
    if (filtreActeur !== "tous" && l.acteur_email !== filtreActeur) return false;
    if (filtreModule !== "tous" && l.module !== filtreModule) return false;
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      const texte = `${l.acteur_nom} ${l.acteur_email} ${l.cible} ${l.action} ${l.module}`.toLowerCase();
      if (!texte.includes(q)) return false;
    }
    return true;
  });

  // ── Helpers affichage ──
  const labelModule = (id: string) => MODULES.find((m) => m.id === id)?.label || id;
  const labelAction = (moduleId: string, actionId: string) => {
    const mod = MODULES.find((m) => m.id === moduleId);
    return mod?.actions.find((a) => a.id === actionId)?.label || actionId;
  };

  const formatDateHeure = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const formatDatePrecise = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  // Couleur du badge action
  const couleurAction = (action: string) => {
    if (action === "supprimer" || action === "retirer") return "text-red-600 border-red-200 bg-red-50";
    if (action === "creer" || action === "ajouter") return "text-green-700 border-green-200 bg-green-50";
    return "text-[#1A2332]/70 border-[#1A2332]/15 bg-[#EFE9DC]";
  };

  // Transforme une valeur en texte lisible
  const afficherValeur = (v: any): string => {
    if (v === null || v === undefined) return "—";
    if (typeof v === "object") return JSON.stringify(v);
    if (typeof v === "boolean") return v ? "oui" : "non";
    return String(v);
  };

  // Calcule la liste des champs qui ont changé entre avant et après
  const calculerDiff = (avant: Record<string, any> | null, apres: Record<string, any> | null) => {
    const champsIgnores = ["updated_at", "created_at"];
    const changements: { champ: string; avant: any; apres: any }[] = [];

    if (avant && apres) {
      // Modification : on compare champ par champ
      const tousChamps = new Set([...Object.keys(avant), ...Object.keys(apres)]);
      tousChamps.forEach((champ) => {
        if (champsIgnores.includes(champ)) return;
        const va = JSON.stringify(avant[champ]);
        const vp = JSON.stringify(apres[champ]);
        if (va !== vp) {
          changements.push({ champ, avant: avant[champ], apres: apres[champ] });
        }
      });
    }
    return changements;
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
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332] mb-2">
          Journal d'activité
        </h1>
        <p className="text-sm text-[#1A2332]/60 mb-8">
          Historique de toutes les actions effectuées dans l'administration. Cliquez sur une ligne pour voir le détail complet.
        </p>

        {/* Filtres */}
        <div className="bg-white border border-[#1A2332]/10 p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/50 mb-1">Personne</label>
            <select className={inputClass} value={filtreActeur} onChange={(e) => setFiltreActeur(e.target.value)}>
              <option value="tous">Toutes</option>
              {acteurs.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/50 mb-1">Module</label>
            <select className={inputClass} value={filtreModule} onChange={(e) => setFiltreModule(e.target.value)}>
              <option value="tous">Tous</option>
              {MODULES.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/50 mb-1">Recherche</label>
            <input
              className={inputClass}
              placeholder="Nom, cible, action..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
        </div>

        {/* Compteur */}
        <p className="text-[11px] text-[#1A2332]/40 mb-3">
          {loading ? "Chargement..." : `${logsFiltres.length} action(s)`}
        </p>

        {/* Liste */}
        {loading ? (
          <p className="text-center py-10 text-[#1A2332]/40 text-sm">Chargement...</p>
        ) : logsFiltres.length === 0 ? (
          <p className="text-sm text-[#1A2332]/40 py-4">Aucune action trouvée.</p>
        ) : (
          <div className="space-y-2">
            {logsFiltres.map((l) => {
              const estOuvert = ouvert === l.id;
              const diff = calculerDiff(l.etat_avant, l.etat_apres);
              return (
                <div key={l.id} className="bg-white border border-[#1A2332]/10">
                  {/* En-tête cliquable */}
                  <button
                    onClick={() => setOuvert(estOuvert ? null : l.id)}
                    className="w-full text-left p-4 flex items-start justify-between gap-4 flex-wrap hover:bg-[#F5F1EA]/50 transition-colors"
                    style={{ background: "none", cursor: "pointer" }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] tracking-[0.15em] uppercase border px-2 py-0.5 ${couleurAction(l.action)}`}>
                          {labelAction(l.module, l.action)}
                        </span>
                        <span className="text-[9px] tracking-[0.1em] uppercase text-[#1A2332]/50 bg-[#EFE9DC] px-2 py-0.5">
                          {labelModule(l.module)}
                        </span>
                      </div>
                      <p className="text-sm text-[#1A2332] mt-2">
                        {l.cible && <span className="font-semibold">{l.cible}</span>}
                      </p>
                      <p className="text-xs text-[#1A2332]/50 mt-1">
                        {l.acteur_nom || l.acteur_email}
                        {l.acteur_nom && l.acteur_email && ` · ${l.acteur_email}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <p className="text-[11px] text-[#1A2332]/40 whitespace-nowrap">
                        {formatDateHeure(l.created_at)}
                      </p>
                      <span className="text-[#1A2332]/30 text-xs">{estOuvert ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {/* Détail déplié */}
                  {estOuvert && (
                    <div className="border-t border-[#1A2332]/10 p-4 bg-[#F5F1EA]/30 space-y-4">
                      {/* Contexte technique */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        <div>
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Date précise</span>
                          <p className="text-[#1A2332] mt-0.5">{formatDatePrecise(l.created_at)}</p>
                        </div>
                        <div>
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Acteur</span>
                          <p className="text-[#1A2332] mt-0.5">{l.acteur_nom || "—"} · {l.acteur_email}</p>
                        </div>
                        <div>
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Adresse IP</span>
                          <p className="text-[#1A2332] mt-0.5">{l.adresse_ip || "— (locale)"}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Navigateur</span>
                          <p className="text-[#1A2332] mt-0.5 break-all">{l.user_agent || "—"}</p>
                        </div>
                      </div>

                      {/* Diff (modification) */}
                      {l.etat_avant && l.etat_apres && (
                        <div>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-[#1A2332]/40 mb-2">
                            Champs modifiés
                          </p>
                          {diff.length === 0 ? (
                            <p className="text-xs text-[#1A2332]/40 italic">Aucun champ modifié (ou seulement la date de mise à jour).</p>
                          ) : (
                            <div className="space-y-1.5">
                              {diff.map((d) => (
                                <div key={d.champ} className="text-xs bg-white border border-[#1A2332]/10 p-2">
                                  <span className="font-semibold text-[#1A2332]">{d.champ}</span>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="text-red-600 line-through break-all">{afficherValeur(d.avant)}</span>
                                    <span className="text-[#1A2332]/30">→</span>
                                    <span className="text-green-700 break-all">{afficherValeur(d.apres)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Création : état créé */}
                      {!l.etat_avant && l.etat_apres && (
                        <div>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-green-700/60 mb-2">
                            Élément créé
                          </p>
                          <pre className="text-[11px] text-[#1A2332]/70 bg-white border border-[#1A2332]/10 p-3 overflow-x-auto whitespace-pre-wrap break-all">
                            {JSON.stringify(l.etat_apres, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Suppression : état supprimé */}
                      {l.etat_avant && !l.etat_apres && (
                        <div>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-red-600/60 mb-2">
                            Élément supprimé
                          </p>
                          <pre className="text-[11px] text-[#1A2332]/70 bg-white border border-[#1A2332]/10 p-3 overflow-x-auto whitespace-pre-wrap break-all">
                            {JSON.stringify(l.etat_avant, null, 2)}
                          </pre>
                        </div>
                      )}
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