"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  gender: string;
  price: number;
  is_new: boolean;
  description?: string;
  composition?: string;
  care?: string;
  delivery?: string;
  images_by_color: Record<string, string[]>;
  colors: string[];
  sizes: string[];
  stock_by_size: Record<string, number>;
};

const categoriesHomme = ["Polos", "T-shirts", "Chemises", "Sweats", "Pulls", "Pantalons", "Vestes"];
const categoriesFemme = ["Robes", "T-shirts", "Chemisiers", "Pulls", "Pantalons", "Vestes", "Accessoires"];

export default function ProduitsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreGenre, setFiltreGenre] = useState<"tous" | "homme" | "femme">("tous");
  const [filtreCategorie, setFiltreCategorie] = useState<string>("Toutes");
  const [recherche, setRecherche] = useState("");
  const [tri, setTri] = useState("id");
  const [selection, setSelection] = useState<Set<number>>(new Set());
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  const chargerProduits = () => {
    setLoading(true);
    fetch("/api/admin/produits", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    chargerProduits();
  }, []);

  const changerGenre = (g: "tous" | "homme" | "femme") => {
    setFiltreGenre(g);
    setFiltreCategorie("Toutes");
    setSelection(new Set());
  };

  const supprimerUn = async (id: number): Promise<boolean> => {
    const res = await fetch(`/api/admin/produits?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.ok;
  };

  const supprimer = async (id: number, nom: string) => {
    if (!confirm(`Supprimer "${nom}" ? Cette action est définitive.`)) return;
    const ok = await supprimerUn(id);
    if (ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelection((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      alert("Erreur lors de la suppression.");
    }
  };

  const dupliquer = async (p: Product) => {
    if (!confirm(`Dupliquer "${p.name}" ?`)) return;

    let nouveauSlug = `${p.slug}-copie`;
    let n = 2;
    while (products.some((x) => x.slug === nouveauSlug)) {
      nouveauSlug = `${p.slug}-copie-${n}`;
      n++;
    }

    const copie = {
      slug: nouveauSlug,
      name: `${p.name} (copie)`,
      category: p.category,
      gender: p.gender,
      price: p.price,
      description: p.description || "",
      composition: p.composition || "",
      care: p.care || "",
      delivery: p.delivery || "",
      isNew: p.is_new || false,
      colors: p.colors || [],
      sizes: p.sizes || [],
      imagesByColor: p.images_by_color || {},
      stockBySize: p.stock_by_size || {},
    };

    const res = await fetch("/api/admin/produits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(copie),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.product) {
        setProducts((prev) => [...prev, data.product]);
      } else {
        chargerProduits();
      }
    } else {
      alert("Erreur lors de la duplication.");
    }
  };

  const supprimerSelection = async () => {
    if (selection.size === 0) return;
    if (!confirm(`Supprimer ${selection.size} produit(s) ? Cette action est définitive.`)) return;

    setSuppressionEnCours(true);
    const ids = Array.from(selection);
    const echecs: number[] = [];

    for (const id of ids) {
      const ok = await supprimerUn(id);
      if (!ok) echecs.push(id);
    }

    const supprimes = ids.filter((id) => !echecs.includes(id));
    setProducts((prev) => prev.filter((p) => !supprimes.includes(p.id)));
    setSelection(new Set());
    setSuppressionEnCours(false);

    if (echecs.length > 0) {
      alert(`${echecs.length} produit(s) n'ont pas pu être supprimés. Réessaie.`);
    }
  };

  const categoriesDisponibles =
    filtreGenre === "homme" ? categoriesHomme : filtreGenre === "femme" ? categoriesFemme : [];

  const produitsFiltres = products.filter((p) => {
    if (filtreGenre !== "tous" && p.gender !== filtreGenre) return false;
    if (filtreCategorie !== "Toutes" && p.category !== filtreCategorie) return false;
    if (recherche.trim()) {
      const q = recherche.trim().toLowerCase();
      const dansNom = p.name.toLowerCase().includes(q);
      const dansCategorie = p.category.toLowerCase().includes(q);
      const dansSlug = p.slug.toLowerCase().includes(q);
      if (!dansNom && !dansCategorie && !dansSlug) return false;
    }
    return true;
  });

  const stockDe = (p: Product) =>
    Object.values(p.stock_by_size || {}).reduce((sum, q) => sum + (Number(q) || 0), 0);

  const produitsTries = [...produitsFiltres].sort((a, b) => {
    switch (tri) {
      case "nom-az":
        return a.name.localeCompare(b.name);
      case "nom-za":
        return b.name.localeCompare(a.name);
      case "prix-croissant":
        return a.price - b.price;
      case "prix-decroissant":
        return b.price - a.price;
      case "stock-croissant":
        return stockDe(a) - stockDe(b);
      case "stock-decroissant":
        return stockDe(b) - stockDe(a);
      default:
        return a.id - b.id;
    }
  });

  const toggleSelection = (id: number) => {
    setSelection((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleToutSelectionner = () => {
    const idsAffichés = produitsTries.map((p) => p.id);
    const tousSélectionnés = idsAffichés.every((id) => selection.has(id));
    if (tousSélectionnés) {
      setSelection(new Set());
    } else {
      setSelection(new Set(idsAffichés));
    }
  };

  const tousAffichésSelectionnes =
    produitsTries.length > 0 && produitsTries.every((p) => selection.has(p.id));

  const stockTotal = (p: Product) =>
    Object.values(p.stock_by_size || {}).reduce((sum, q) => sum + (Number(q) || 0), 0);

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

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#1A2332]/40 mb-2">Collection</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A2332]">
              Produits
            </h1>
            <p className="text-sm text-[#1A2332]/55 mt-2">
              {loading ? "Chargement..." : `${produitsTries.length} pièce(s)`}
            </p>
          </div>
          <Link
            href="/admin/produits/nouveau"
            className="inline-block bg-black text-[#B8985A] border border-black px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all text-center"
          >
            + Nouveau produit
          </Link>
        </div>

        {/* Barre de recherche */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un produit (nom, catégorie...)"
              className="w-full bg-white border border-[#1A2332]/15 px-4 py-2.5 pl-10 text-sm text-[#1A2332] placeholder:text-[#1A2332]/40 focus:outline-none focus:border-[#B8985A] transition-colors"
            />
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A2332]/40"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {recherche && (
              <button
                onClick={() => setRecherche("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A2332]/40 hover:text-[#1A2332]"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-label="Effacer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tri + filtre genre sur une ligne */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/50 font-semibold">
              Trier :
            </label>
            <select
              value={tri}
              onChange={(e) => setTri(e.target.value)}
              className="bg-white border border-[#1A2332]/15 px-3 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors"
            >
              <option value="id">Ordre d'ajout</option>
              <option value="nom-az">Nom (A → Z)</option>
              <option value="nom-za">Nom (Z → A)</option>
              <option value="prix-croissant">Prix (croissant)</option>
              <option value="prix-decroissant">Prix (décroissant)</option>
              <option value="stock-croissant">Stock (faible → élevé)</option>
              <option value="stock-decroissant">Stock (élevé → faible)</option>
            </select>
          </div>

          <div className="flex border border-[#1A2332]/15">
            {(["tous", "homme", "femme"] as const).map((g) => (
              <button
                key={g}
                onClick={() => changerGenre(g)}
                className={`px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-semibold transition-all ${
                  filtreGenre === g
                    ? "bg-[#1A2332] text-white"
                    : "bg-transparent text-[#1A2332]/55 hover:text-[#1A2332]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Filtre catégorie */}
        {filtreGenre !== "tous" && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => { setFiltreCategorie("Toutes"); setSelection(new Set()); }}
              className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all border ${
                filtreCategorie === "Toutes"
                  ? "bg-[#B8985A] text-white border-[#B8985A]"
                  : "bg-transparent text-[#1A2332]/60 border-[#1A2332]/20 hover:border-[#1A2332]"
              }`}
            >
              Toutes
            </button>
            {categoriesDisponibles.map((cat) => (
              <button
                key={cat}
                onClick={() => { setFiltreCategorie(cat); setSelection(new Set()); }}
                className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all border ${
                  filtreCategorie === cat
                    ? "bg-[#B8985A] text-white border-[#B8985A]"
                    : "bg-transparent text-[#1A2332]/60 border-[#1A2332]/20 hover:border-[#1A2332]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Barre de sélection */}
        {produitsTries.length > 0 && (
          <div className="flex items-center justify-between mb-3 px-4 py-2.5 bg-[#EFE9DC] border border-[#1A2332]/10">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] tracking-[0.15em] uppercase text-[#1A2332] font-semibold">
              <input
                type="checkbox"
                checked={tousAffichésSelectionnes}
                onChange={toggleToutSelectionner}
              />
              Tout sélectionner
            </label>
            {selection.size > 0 && (
              <button
                onClick={supprimerSelection}
                disabled={suppressionEnCours}
                className="px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                style={{ cursor: suppressionEnCours ? "not-allowed" : "pointer" }}
              >
                {suppressionEnCours ? "Suppression..." : `Supprimer la sélection (${selection.size})`}
              </button>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-center py-20 text-[#1A2332]/40 text-sm">Chargement des produits...</p>
        ) : produitsTries.length === 0 ? (
          <p className="text-center py-20 text-[#1A2332]/40 text-sm">Aucun produit dans cette sélection.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {produitsTries.map((p) => {
              const firstImage = p.images_by_color?.[p.colors?.[0]]?.[0] || "";
              const estSelectionne = selection.has(p.id);
              const stock = stockTotal(p);
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-4 px-4 py-3.5 bg-white border transition-colors ${
                    estSelectionne ? "border-[#B8985A] bg-[#B8985A]/[0.04]" : "border-[#1A2332]/10 hover:border-[#1A2332]/25"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={estSelectionne}
                    onChange={() => toggleSelection(p.id)}
                    className="flex-shrink-0"
                    style={{ cursor: "pointer" }}
                  />
                  <div
                    className="w-14 h-14 bg-[#EFE9DC] bg-cover bg-center flex-shrink-0 flex items-center justify-center"
                    style={firstImage ? { backgroundImage: `url('${firstImage}')` } : {}}
                  >
                    {!firstImage && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A2332" strokeWidth="1.5" className="opacity-20">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <p className="text-sm font-semibold text-[#1A2332] truncate">{p.name}</p>
                      {stock === 0 && (
                        <span className="inline-block px-2 py-0.5 text-[9px] tracking-[0.12em] uppercase font-semibold bg-red-50 text-red-600">
                          Épuisé
                        </span>
                      )}
                      {p.is_new && (
                        <span className="inline-block px-2 py-0.5 text-[9px] tracking-[0.12em] uppercase font-semibold bg-[#B8985A]/10 text-[#8a6d35]">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#1A2332]/50 mt-1">
                      {p.category} · <span className="capitalize">{p.gender}</span> · <span className="text-[#B8985A] font-semibold">{p.price.toLocaleString("fr-FR")} €</span>
                    </p>
                    {/* Stock détaillé par taille */}
                    {stock > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(p.sizes || []).map((taille) => {
                          const q = Number(p.stock_by_size?.[taille]) || 0;
                          return (
                            <span
                              key={taille}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold border ${
                                q === 0
                                  ? "border-red-200 bg-red-50 text-red-500"
                                  : q <= 2
                                  ? "border-[#B8985A]/40 bg-[#B8985A]/10 text-[#8a6d35]"
                                  : "border-[#1A2332]/15 bg-[#EFE9DC] text-[#1A2332]"
                              }`}
                              title={q === 0 ? "Épuisé" : `${q} en stock`}
                            >
                              <span className="uppercase tracking-wide">{taille}</span>
                              <span className="opacity-60">·</span>
                              <span>{q}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/admin/produits/${p.id}`}
                      className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#1A2332] border border-[#1A2332]/20 hover:border-[#1A2332] transition-colors"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => dupliquer(p)}
                      className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#1A2332] border border-[#1A2332]/20 hover:border-[#B8985A] hover:text-[#B8985A] transition-colors"
                      style={{ background: "none", cursor: "pointer" }}
                    >
                      Dupliquer
                    </button>
                    <button
                      onClick={() => supprimer(p.id, p.name)}
                      className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-red-600 border border-red-200 hover:border-red-600 transition-colors"
                      style={{ background: "none", cursor: "pointer" }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}