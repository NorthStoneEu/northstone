"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

// ============================================
// PRODUITS HOMME (placeholders)
// ============================================
const products = [
  // ===== POLOS =====
  {
    id: 1,
    name: "Polo brodé Northstone",
    category: "Polos",
    price: 120,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=900&auto=format&fit=crop",
    href: "/homme/polo-brode",
    isNew: true,
    colors: ["Noir", "Marine"],
  },
  {
    id: 2,
    name: "Polo manches longues",
    category: "Polos",
    price: 145,
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=900&auto=format&fit=crop",
    href: "/homme/polo-ml",
    isNew: false,
    colors: ["Noir", "Bordeaux"],
  },
  {
    id: 3,
    name: "Polo piqué crème",
    category: "Polos",
    price: 110,
    image: "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?q=80&w=900&auto=format&fit=crop",
    href: "/homme/polo-pique",
    isNew: false,
    colors: ["Crème", "Marine"],
  },

  // ===== T-SHIRTS =====
  {
    id: 4,
    name: "T-shirt blanc cassé",
    category: "T-shirts",
    price: 75,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop",
    href: "/homme/tshirt-blanc",
    isNew: false,
    colors: ["Blanc cassé", "Noir"],
  },
  {
    id: 5,
    name: "T-shirt brodé noir",
    category: "T-shirts",
    price: 85,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop",
    href: "/homme/tshirt-brode-noir",
    isNew: true,
    colors: ["Noir"],
  },
  {
    id: 6,
    name: "T-shirt col rond gris",
    category: "T-shirts",
    price: 70,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=900&auto=format&fit=crop",
    href: "/homme/tshirt-gris",
    isNew: false,
    colors: ["Gris", "Blanc"],
  },

  // ===== CHEMISES =====
  {
    id: 7,
    name: "Chemise oxford blanche",
    category: "Chemises",
    price: 150,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=900&auto=format&fit=crop",
    href: "/homme/chemise-oxford",
    isNew: false,
    colors: ["Blanc", "Bleu ciel"],
  },
  {
    id: 8,
    name: "Chemise lin beige",
    category: "Chemises",
    price: 175,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900&auto=format&fit=crop",
    href: "/homme/chemise-lin",
    isNew: true,
    colors: ["Beige", "Blanc"],
  },
  {
    id: 9,
    name: "Chemise carreaux marine",
    category: "Chemises",
    price: 165,
    image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=900&auto=format&fit=crop",
    href: "/homme/chemise-carreaux",
    isNew: false,
    colors: ["Marine"],
  },

  // ===== SWEATS =====
  {
    id: 10,
    name: "Sweat à capuche kaki",
    category: "Sweats",
    price: 180,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=900&auto=format&fit=crop",
    href: "/homme/sweat-kaki",
    isNew: true,
    colors: ["Kaki"],
  },
  {
    id: 11,
    name: "Sweatshirt brodé",
    category: "Sweats",
    price: 195,
    image: "https://images.unsplash.com/photo-1542406775-ade58c52d2e4?q=80&w=900&auto=format&fit=crop",
    href: "/homme/sweat-brode",
    isNew: false,
    colors: ["Gris", "Noir"],
  },
  {
    id: 12,
    name: "Sweat col rond crème",
    category: "Sweats",
    price: 165,
    image: "https://images.unsplash.com/photo-1572495641004-28421ae29ed4?q=80&w=900&auto=format&fit=crop",
    href: "/homme/sweat-creme",
    isNew: false,
    colors: ["Crème", "Marine"],
  },

  // ===== PULLS =====
  {
    id: 13,
    name: "Pull col rond vert forêt",
    category: "Pulls",
    price: 220,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop",
    href: "/homme/pull-vert",
    isNew: true,
    colors: ["Vert forêt"],
  },
  {
    id: 14,
    name: "Pull cachemire marine",
    category: "Pulls",
    price: 290,
    image: "https://images.unsplash.com/photo-1580331451062-99ff652288d7?q=80&w=900&auto=format&fit=crop",
    href: "/homme/pull-cachemire",
    isNew: true,
    colors: ["Marine", "Anthracite"],
  },
  {
    id: 15,
    name: "Pull torsadé beige",
    category: "Pulls",
    price: 245,
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=900&auto=format&fit=crop",
    href: "/homme/pull-torsade",
    isNew: false,
    colors: ["Beige", "Crème"],
  },

  // ===== PANTALONS =====
  {
    id: 16,
    name: "Pantalon chino beige",
    category: "Pantalons",
    price: 160,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=900&auto=format&fit=crop",
    href: "/homme/chino-beige",
    isNew: false,
    colors: ["Beige", "Marine"],
  },
  {
    id: 17,
    name: "Pantalon laine gris",
    category: "Pantalons",
    price: 210,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=900&auto=format&fit=crop",
    href: "/homme/pantalon-laine",
    isNew: true,
    colors: ["Gris", "Anthracite"],
  },
  {
    id: 18,
    name: "Pantalon coton noir",
    category: "Pantalons",
    price: 175,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=900&auto=format&fit=crop",
    href: "/homme/pantalon-coton",
    isNew: false,
    colors: ["Noir"],
  },

  // ===== VESTES =====
  {
    id: 19,
    name: "Veste matelassée navy",
    category: "Vestes",
    price: 320,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=900&auto=format&fit=crop",
    href: "/homme/veste-navy",
    isNew: true,
    colors: ["Marine"],
  },
  {
    id: 20,
    name: "Blazer laine anthracite",
    category: "Vestes",
    price: 480,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&auto=format&fit=crop",
    href: "/homme/blazer-anthracite",
    isNew: false,
    colors: ["Anthracite", "Marine"],
  },
  {
    id: 21,
    name: "Veste perfecto cuir",
    category: "Vestes",
    price: 590,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=900&auto=format&fit=crop",
    href: "/homme/veste-perfecto",
    isNew: true,
    colors: ["Noir"],
  },
];

const categories = ["Tous", "Polos", "T-shirts", "Chemises", "Sweats", "Pulls", "Pantalons", "Vestes"];
const sortOptions = ["Nouveautés", "Prix croissant", "Prix décroissant"];

// ============================================
// COMPOSANT PANNEAU DE FILTRES (réutilisable)
// ============================================
function FilterPanel({
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  minPriceInput,
  setMinPriceInput,
  maxPriceInput,
  setMaxPriceInput,
  appliedMinPrice,
  appliedMaxPrice,
  handleApplyPrice,
  handleResetPrice,
}: any) {
  return (
    <div className="space-y-5">
      {/* Catégories */}
      <div>
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#1A2332] font-semibold mb-3">
          Catégorie
        </h3>
        <div className="w-8 h-px bg-[#B8985A] mb-4" />
        <ul className="space-y-2.5">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs tracking-tight uppercase transition-colors text-left ${
                  selectedCategory === cat
                    ? "text-[#B8985A] font-semibold"
                    : "text-[#1A2332]/70 hover:text-[#1A2332]"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Prix */}
      <div className="pt-4 border-t border-[#1A2332]/10">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#1A2332] font-semibold mb-3">
          Prix
        </h3>
        <div className="w-8 h-px bg-[#B8985A] mb-4" />

        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-full bg-transparent border border-[#1A2332]/20 px-2 py-1.5 pr-5 text-xs text-[#1A2332] placeholder:text-[#1A2332]/40 focus:outline-none focus:border-[#B8985A] transition-colors"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#1A2332]/50">€</span>
          </div>
          <span className="text-[#1A2332]/40 text-xs">—</span>
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-full bg-transparent border border-[#1A2332]/20 px-2 py-1.5 pr-5 text-xs text-[#1A2332] placeholder:text-[#1A2332]/40 focus:outline-none focus:border-[#B8985A] transition-colors"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#1A2332]/50">€</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApplyPrice}
            className="flex-1 bg-black text-[#B8985A] border border-black py-2 text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] hover:border-[#1F1F1F] transition-all"
          >
            Appliquer
          </button>
          {(appliedMinPrice > 0 || appliedMaxPrice < 9999) && (
            <button
              onClick={handleResetPrice}
              className="px-3 text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/60 hover:text-[#1A2332] transition-colors border border-[#1A2332]/20 hover:border-[#1A2332]"
              aria-label="Réinitialiser"
            >
              ✕
            </button>
          )}
        </div>

        {(appliedMinPrice > 0 || appliedMaxPrice < 9999) && (
          <p className="text-[10px] text-[#B8985A] mt-2">
            {appliedMinPrice}€ — {appliedMaxPrice === 9999 ? "∞" : `${appliedMaxPrice}€`}
          </p>
        )}
      </div>

      {/* Tri */}
      <div className="pt-4 border-t border-[#1A2332]/10">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#1A2332] font-semibold mb-3">
          Trier par
        </h3>
        <div className="w-8 h-px bg-[#B8985A] mb-4" />
        <ul className="space-y-2.5">
          {sortOptions.map((opt) => (
            <li key={opt}>
              <button
                onClick={() => setSortBy(opt)}
                className={`text-xs tracking-tight transition-colors text-left ${
                  sortBy === opt
                    ? "text-[#B8985A] font-semibold"
                    : "text-[#1A2332]/70 hover:text-[#1A2332]"
                }`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export default function HommePage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("Nouveautés");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(9999);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Bloquer le scroll body quand le drawer mobile est ouvert
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  const handleApplyPrice = () => {
    const min = minPriceInput === "" ? 0 : Number(minPriceInput);
    const max = maxPriceInput === "" ? 9999 : Number(maxPriceInput);
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
  };

  const handleResetPrice = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setAppliedMinPrice(0);
    setAppliedMaxPrice(9999);
  };

  // Filtrage
  let filteredProducts = products.filter((p) => {
    if (selectedCategory !== "Tous" && p.category !== selectedCategory) return false;
    if (p.price < appliedMinPrice || p.price > appliedMaxPrice) return false;
    return true;
  });

  // Tri
  if (sortBy === "Prix croissant") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "Prix décroissant") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  const filterProps = {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    minPriceInput,
    setMinPriceInput,
    maxPriceInput,
    setMaxPriceInput,
    appliedMinPrice,
    appliedMaxPrice,
    handleApplyPrice,
    handleResetPrice,
  };

  return (
    <>
      <Header />
      <AnnouncementBar />

      {/* HERO SECTION */}
      <section className="relative bg-[#0A0A0A] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2000&auto=format&fit=crop')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[#0A0A0A]" aria-hidden="true" />

        <div className="relative max-w-5xl mx-auto px-6 py-8 sm:py-14 md:py-24 text-center">
          <FadeIn direction="up">
            <p className="text-[9px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-3 sm:mb-4">
              Collection Homme
            </p>
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] mb-4 sm:mb-6">
              L'HÉRITAGE
              <br />
              <span className="text-white/40">AU MASCULIN.</span>
            </h1>
            <div className="w-10 h-px bg-[#B8985A] mx-auto mb-4 sm:mb-6" />
            <p className="text-xs sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
              Pièces brodées, coupes contemporaines, savoir-faire européen.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CONTENU PRINCIPAL : FILTRES + GRILLE */}
      <section className="bg-[#F5F1EA] py-8 md:py-16 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">

            {/* SIDEBAR DESKTOP UNIQUEMENT */}
            <aside className="hidden lg:block lg:sticky lg:top-20 lg:self-start">
              <FadeIn direction="up">
                <FilterPanel {...filterProps} />
              </FadeIn>
            </aside>

            {/* GRILLE PRODUITS */}
            <div>
              {/* Barre du haut : compteur + bouton filtre mobile */}
              <div className="flex justify-between items-center mb-4 md:mb-8">
                <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1A2332]/60">
                  {filteredProducts.length} pièce{filteredProducts.length > 1 ? "s" : ""}
                </p>

                {/* Bouton "Filtrer" mobile uniquement */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 bg-black text-[#B8985A] border border-black px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="7" y1="12" x2="17" y2="12" />
                    <line x1="10" y1="18" x2="14" y2="18" />
                  </svg>
                  Filtrer
                </button>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-[#1A2332]/40 text-sm">
                  Aucune pièce ne correspond à votre sélection.
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={product.href}
                      className="group block"
                    >
                      {/* Image produit */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9DC] mb-2 sm:mb-3">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                          style={{ backgroundImage: `url('${product.image}')` }}
                          aria-hidden="true"
                        />

                        {product.isNew && (
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#1A2332] text-[#F5F1EA] px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[7px] sm:text-[9px] tracking-[0.2em] uppercase font-semibold">
                            Nouveau
                          </div>
                        )}

                        <div className="hidden md:flex absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <div className="w-full bg-[#F5F1EA] text-[#1A2332] py-2.5 text-center text-[9px] tracking-[0.2em] uppercase font-semibold">
                            Voir le produit
                          </div>
                        </div>
                      </div>

                      {/* Infos produit */}
                      <div className="flex flex-col gap-0.5 sm:gap-1">
                        <p className="text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B]">
                          {product.category}
                        </p>
                        <h3 className="text-[11px] sm:text-sm font-semibold text-[#1A2332] group-hover:text-[#B8985A] transition-colors leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-[11px] sm:text-sm font-semibold text-[#1A2332]">
                          {product.price} €
                        </p>
                        {product.colors.length > 1 && (
                          <p className="text-[8px] sm:text-[10px] text-[#6B6B6B] mt-0.5">
                            {product.colors.length} coloris
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* DRAWER MOBILE DES FILTRES */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-in-out ${
          isMobileFilterOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay sombre */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${
            isMobileFilterOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileFilterOpen(false)}
          aria-hidden="true"
        />

        {/* Panneau */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[#F5F1EA] shadow-2xl transition-transform duration-500 ease-in-out ${
            isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col`}
        >
          {/* Header du drawer */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2332]/10">
            <h2 className="text-xs tracking-[0.3em] uppercase font-semibold text-[#1A2332]">
              Filtres
            </h2>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="text-[#1A2332] hover:text-[#B8985A] transition-colors"
              aria-label="Fermer les filtres"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <FilterPanel {...filterProps} />
          </div>

          {/* Footer du drawer : bouton voir résultats */}
          <div className="px-6 py-4 border-t border-[#1A2332]/10">
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-black text-[#B8985A] border border-black py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all"
            >
              Voir {filteredProducts.length} pièce{filteredProducts.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}