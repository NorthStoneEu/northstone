"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Lot = { amount: string; count: string };

type Drop = {
  id: string;
  name: string;
  sous_titre: string;
  titre_principal: string;
  description: string;
  release_date: string | null;
  total_pieces: number;
  total_winners: number;
  image_url: string;
  lots: Lot[];
  is_active: boolean;
  visible_accueil: boolean;
};

export default function DropsManager() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edition, setEdition] = useState<Drop | null>(null);

  const charger = () => {
    setLoading(true);
    fetch("/api/admin/drops", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setDrops(data.drops || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    charger();
  }, []);

  // Convertit une date ISO en valeur pour input datetime-local
  const isoVersInput = (iso: string | null) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  };

  const nouveauDrop = (): Drop => ({
    id: "",
    name: "",
    sous_titre: "",
    titre_principal: "",
    description: "",
    release_date: null,
    total_pieces: 0,
    total_winners: 0,
    image_url: "",
    lots: [],
    is_active: false,
    visible_accueil: false,
  });

  const set = (champ: keyof Drop, valeur: any) => {
    setEdition((prev) => (prev ? { ...prev, [champ]: valeur } : prev));
  };

  const setLot = (index: number, champ: keyof Lot, valeur: string) => {
    setEdition((prev) => {
      if (!prev) return prev;
      const lots = [...prev.lots];
      lots[index] = { ...lots[index], [champ]: valeur };
      return { ...prev, lots };
    });
  };

  const ajouterLot = () => {
    setEdition((prev) => (prev ? { ...prev, lots: [...prev.lots, { amount: "", count: "" }] } : prev));
  };

  const retirerLot = (index: number) => {
    setEdition((prev) => (prev ? { ...prev, lots: prev.lots.filter((_, i) => i !== index) } : prev));
  };

  const enregistrer = async () => {
    if (!edition) return;
    if (!edition.name.trim()) {
      alert("Le nom du drop est obligatoire.");
      return;
    }
    setSaving(true);
    const method = edition.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/drops", {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...edition,
        release_date: edition.release_date || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setEdition(null);
      charger();
    } else {
      const data = await res.json();
      alert("Erreur : " + (data.error || "inconnue"));
    }
  };

  const supprimer = async (d: Drop) => {
    if (!confirm(`Supprimer le drop "${d.name}" ? Cette action est définitive.`)) return;
    const res = await fetch(`/api/admin/drops?id=${d.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      charger();
    } else {
      const data = await res.json();
      alert("Erreur : " + (data.error || "inconnue"));
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Date non définie";
    try {
      return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  };

  const inputClass =
    "w-full bg-transparent border border-[#1A2332]/20 px-3 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors";
  const labelClass = "block text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/50 mb-2";

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

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#1A2332]/40 mb-2">Collection</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A2332]">Drops</h1>
            <p className="text-sm text-[#1A2332]/55 mt-2">Créez et gérez vos drops. Le drop visible sur l'accueil apparaît automatiquement quand il est activé.</p>
          </div>
          {!edition && (
            <button
              onClick={() => setEdition(nouveauDrop())}
              className="inline-block bg-black text-[#B8985A] border border-black px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all text-center"
              style={{ cursor: "pointer" }}
            >
              + Nouveau drop
            </button>
          )}
        </div>

        {/* Formulaire d'édition */}
        {edition && (
          <div className="bg-white border border-[#1A2332]/10 border-t-2 border-t-[#B8985A] p-6 sm:p-8 space-y-6 mb-10">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#1A2332]/50 font-semibold">
                {edition.id ? "Modifier le drop" : "Nouveau drop"}
              </h2>
              <button
                onClick={() => setEdition(null)}
                className="text-[10px] tracking-[0.15em] uppercase text-[#1A2332]/50 hover:text-[#1A2332]"
                style={{ background: "none", cursor: "pointer" }}
              >
                Annuler
              </button>
            </div>

            <div>
              <label className={labelClass}>Nom interne du drop</label>
              <input className={inputClass} placeholder="Ex : Drop 01" value={edition.name} onChange={(e) => set("name", e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Sous-titre (badge doré)</label>
                <input className={inputClass} placeholder="Ex : Drop 01 — La Genèse" value={edition.sous_titre} onChange={(e) => set("sous_titre", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Titre principal</label>
                <input className={inputClass} placeholder="Ex : LA PIÈCE DE LA RAISON." value={edition.titre_principal} onChange={(e) => set("titre_principal", e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description (sous le titre)</label>
              <input className={inputClass} placeholder="Ex : 400 pièces. 130 gagnants. Une seule chance." value={edition.description} onChange={(e) => set("description", e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Date d'ouverture</label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={isoVersInput(edition.release_date)}
                  onChange={(e) => set("release_date", e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>
              <div>
                <label className={labelClass}>Nb de pièces</label>
                <input type="number" className={inputClass} value={edition.total_pieces} onChange={(e) => set("total_pieces", Number(e.target.value))} />
              </div>
              <div>
                <label className={labelClass}>Nb de gagnants</label>
                <input type="number" className={inputClass} value={edition.total_winners} onChange={(e) => set("total_winners", Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Image (chemin ou URL)</label>
              <input className={inputClass} placeholder="Ex : /drop-01.jpg" value={edition.image_url} onChange={(e) => set("image_url", e.target.value)} />
            </div>

            {/* Lots */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelClass} style={{ marginBottom: 0 }}>Lots de la loterie</label>
                <button onClick={ajouterLot} className="text-[10px] tracking-[0.15em] uppercase text-[#B8985A] border border-[#B8985A]/40 px-3 py-1.5 hover:bg-[#B8985A]/10" style={{ background: "none", cursor: "pointer" }}>
                  + Ajouter un lot
                </button>
              </div>
              <div className="space-y-2">
                {edition.lots.map((lot, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input className={inputClass} placeholder="Montant (ex: 50€)" value={lot.amount} onChange={(e) => setLot(i, "amount", e.target.value)} />
                    <input className={inputClass} placeholder="Nb gagnants (ex: 80 gagnants)" value={lot.count} onChange={(e) => setLot(i, "count", e.target.value)} />
                    <button onClick={() => retirerLot(i)} className="text-red-500 font-bold text-lg flex-shrink-0 px-2" style={{ cursor: "pointer" }}>×</button>
                  </div>
                ))}
                {edition.lots.length === 0 && <p className="text-xs text-[#1A2332]/40 italic">Aucun lot. Ajoutez-en avec le bouton ci-dessus.</p>}
              </div>
            </div>

            {/* Statut + visibilité */}
            <div className="space-y-3 pt-2 border-t border-[#1A2332]/10">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={edition.is_active} onChange={(e) => set("is_active", e.target.checked)} />
                <span className="text-sm text-[#1A2332]">Drop actif (compte à rebours lancé)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={edition.visible_accueil} onChange={(e) => set("visible_accueil", e.target.checked)} />
                <span className="text-sm text-[#1A2332]">Afficher sur la page d'accueil</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2 border-t border-[#1A2332]/10">
              <button
                onClick={enregistrer}
                disabled={saving}
                className="bg-black text-[#B8985A] border border-black px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all disabled:opacity-40"
                style={{ cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? "Enregistrement..." : edition.id ? "Enregistrer les modifications" : "Créer le drop"}
              </button>
            </div>
          </div>
        )}

        {/* Liste des drops */}
        {!edition && (
          <>
            {loading ? (
              <p className="text-center py-10 text-[#1A2332]/40 text-sm">Chargement...</p>
            ) : drops.length === 0 ? (
              <p className="text-sm text-[#1A2332]/40 py-4">Aucun drop pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {drops.map((d) => (
                  <div key={d.id} className="bg-white border border-[#1A2332]/10 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-semibold text-[#1A2332]">{d.name}</p>
                          {d.is_active && <span className="text-[9px] tracking-[0.15em] uppercase bg-green-50 text-green-700 px-2 py-0.5">Actif</span>}
                          {d.visible_accueil && <span className="text-[9px] tracking-[0.15em] uppercase bg-[#B8985A]/10 text-[#8a6d35] px-2 py-0.5">Sur l'accueil</span>}
                          {!d.is_active && <span className="text-[9px] tracking-[0.15em] uppercase bg-[#EFE9DC] text-[#1A2332]/60 px-2 py-0.5">Inactif</span>}
                        </div>
                        {d.sous_titre && <p className="text-xs text-[#1A2332]/50">{d.sous_titre}</p>}
                        <p className="text-[11px] text-[#1A2332]/45 mt-1.5">
                          {d.total_pieces} pièces · {d.total_winners} gagnants · Ouverture : {formatDate(d.release_date)}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => setEdition({ ...d, lots: Array.isArray(d.lots) ? d.lots : [] })}
                          className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#1A2332] border border-[#1A2332]/20 hover:border-[#1A2332] transition-colors"
                          style={{ background: "none", cursor: "pointer" }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => supprimer(d)}
                          className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-red-600 border border-red-200 hover:border-red-600 transition-colors"
                          style={{ background: "none", cursor: "pointer" }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}