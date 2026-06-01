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
  images_by_color: Record<string, string[]>;
  colors: string[];
};

const categoriesHomme = ["Polos", "T-shirts", "Chemises", "Sweats", "Pulls", "Pantalons", "Vestes"];
const categoriesFemme = ["Robes", "T-shirts", "Chemisiers", "Pulls", "Pantalons", "Vestes", "Accessoires"];

export default function ProduitsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreGenre, setFiltreGenre] = useState<"tous" | "homme" | "femme">("tous");
  const [filtreCategorie, setFiltreCategorie] = useState<string>("Toutes");

  const chargerProduits = () => {
    setLoading(true);
    fetch("/api/admin/produits")
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
  };

  const supprimer = async (id: number, nom: string) => {
    if (!confirm(`Supprimer "${nom}" ? Cette action est définitive.`)) return;
    const res = await fetch(`/api/admin/produits?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Erreur lors de la suppression.");
    }
  };

  const categoriesDisponibles =
    filtreGenre === "homme" ? categoriesHomme : filtreGenre === "femme" ? categoriesFemme : [];

  const produitsFiltres = products.filter((p) => {
    if (filtreGenre !== "tous" && p.gender !== filtreGenre) return false;
    if (filtreCategorie !== "Toutes" && p.category !== filtreCategorie) return false;
    return true;
  });

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332]">
              Produits
            </h1>
            <p className="text-sm text-[#1A2332]/60 mt-1">
              {loading ? "Chargement..." : `${produitsFiltres.length} produit(s)`}
            </p>
          </div>
          <Link
            href="/admin/produits/nouveau"
            className="inline-block bg-black text-[#B8985A] border border-black px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all text-center"
          >
            + Nouveau produit
          </Link>
        </div>

        {/* Filtre genre */}
        <div className="flex gap-2 mb-4">
          {(["tous", "homme", "femme"] as const).map((g) => (
            <button
              key={g}
              onClick={() => changerGenre(g)}
              className={`px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-semibold transition-all border ${
                filtreGenre === g
                  ? "bg-[#1A2332] text-white border-[#1A2332]"
                  : "bg-transparent text-[#1A2332]/60 border-[#1A2332]/20 hover:border-[#1A2332]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Filtre catégorie */}
        {filtreGenre !== "tous" && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFiltreCategorie("Toutes")}
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
                onClick={() => setFiltreCategorie(cat)}
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

        {loading ? (
          <p className="text-center py-20 text-[#1A2332]/40 text-sm">Chargement des produits...</p>
        ) : produitsFiltres.length === 0 ? (
          <p className="text-center py-20 text-[#1A2332]/40 text-sm">Aucun produit dans cette sélection.</p>
        ) : (
          <div className="bg-white border border-[#1A2332]/10 overflow-hidden">
            {produitsFiltres.map((p, i) => {
              const firstImage = p.images_by_color?.[p.colors?.[0]]?.[0] || "";
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-4 px-4 py-3 ${
                    i !== produitsFiltres.length - 1 ? "border-b border-[#1A2332]/10" : ""
                  }`}
                >
                  <div
                    className="w-12 h-16 bg-[#EFE9DC] bg-cover bg-center flex-shrink-0"
                    style={firstImage ? { backgroundImage: `url('${firstImage}')` } : {}}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A2332] truncate">{p.name}</p>
                    <p className="text-xs text-[#1A2332]/50">
                      {p.category} · {p.gender} · {p.price}€ {p.is_new && "· Nouveau"}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/admin/produits/${p.id}`}
                      className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#1A2332] border border-[#1A2332]/20 hover:border-[#1A2332] transition-colors"
                    >
                      Modifier
                    </Link>
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