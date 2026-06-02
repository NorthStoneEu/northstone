"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { getProductBySlug, getSimilarProducts, type Product } from "@/data/catalog";
import { useCart } from "@/context/CartContext";

const colorMap: Record<string, string> = {
  "Noir": "#0A0A0A",
  "Blanc": "#FFFFFF",
  "Blanc cassé": "#F5EFE3",
  "Crème": "#F0E6D2",
  "Beige": "#D4C5A9",
  "Marine": "#1A2332",
  "Bleu ciel": "#A4C8E1",
  "Gris": "#9CA3AF",
  "Anthracite": "#3D3D3D",
  "Bordeaux": "#6B1F2E",
  "Kaki": "#5C5D3D",
  "Vert forêt": "#1F3D2E",
  "Cognac": "#8B5A3C",
};

function getColorValue(colorName: string): string {
  const key = Object.keys(colorMap).find(
    (k) => k.toLowerCase() === colorName.toLowerCase()
  );
  return key ? colorMap[key] : "#9CA3AF";
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    let active = true;
    getProductBySlug(slug, "homme").then(async (p) => {
      if (!active) return;
      if (!p) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }
      setProduct(p);
      const sim = await getSimilarProducts(p.id, p.category, "homme", 4);
      if (!active) return;
      setSimilar(sim);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !product) {
    return (
      <>
        <Header />
        <AnnouncementBar />
        <div className="bg-[#F5F1EA] min-h-[60vh] flex items-center justify-center text-[#1A2332]/40 text-sm">
          Chargement...
        </div>
        <Footer />
      </>
    );
  }

  return <ProductDetail product={product} similar={similar} />;
}

function ProductDetail({ product, similar }: { product: Product; similar: Product[] }) {
  const { addItem, openCart, items } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantite, setQuantite] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const currentImages = product.imagesByColor[selectedColor] || product.imagesByColor[product.colors[0]] || [];

  // Stock par taille (vient de la base). Si non défini → 0 (épuisé).
  const stockBySize = product.stockBySize || {};
  const getStock = (size: string) => stockBySize[size] ?? 0;

  // Combien de cette taille (ce produit + couleur) est déjà dans le panier
  const dejaDansPanier = (size: string) =>
    items
      .filter((it) => it.productId === product.id && it.color === selectedColor && it.size === size)
      .reduce((sum, it) => sum + it.quantity, 0);

  // Stock restant réellement ajoutable pour la taille sélectionnée
  const stockRestant = selectedSize
    ? getStock(selectedSize) - dejaDansPanier(selectedSize)
    : 0;

  // Est-ce que TOUT le produit est épuisé (toutes tailles à 0) ?
  const toutEpuise = product.sizes.every((s) => getStock(s) <= 0);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedColor]);

  // Si la taille sélectionnée devient épuisée, on la désélectionne
  useEffect(() => {
    if (selectedSize && getStock(selectedSize) <= 0) {
      setSelectedSize(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor]);

  // Quand on change de taille, on remet la quantité à 1
  useEffect(() => {
    setQuantite(1);
  }, [selectedSize]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    if (stockRestant <= 0) return;
    const qteAjout = Math.min(quantite, stockRestant);
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        gender: "homme",
        name: product.name,
        price: product.price,
        color: selectedColor,
        size: selectedSize,
        image: currentImages[0] || "",
      },
      qteAjout
    );
    openCart();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Texte + état du bouton ajouter
  let boutonTexte = "Ajouter au panier";
  let boutonActif = true;
  if (toutEpuise) {
    boutonTexte = "Produit épuisé";
    boutonActif = false;
  } else if (!selectedSize) {
    boutonTexte = "Sélectionnez une taille";
    boutonActif = false;
  } else if (stockRestant <= 0) {
    boutonTexte = "Stock maximum atteint";
    boutonActif = false;
  }

  return (
    <>
      <Header />
      <AnnouncementBar />

      <div className="bg-[#F5F1EA] px-4 sm:px-6 pt-6 pb-2">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#1A2332]/60">
            <Link href="/" className="hover:text-[#B8985A] transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/homme" className="hover:text-[#B8985A] transition-colors">Homme</Link>
            <span>/</span>
            <span className="text-[#1A2332]">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="bg-[#F5F1EA] px-4 sm:px-6 py-6 md:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

            <div>
              <div className="flex gap-3 md:gap-4">
                <div className="hidden md:flex flex-col gap-3 w-20">
                  {currentImages.map((img: string, i: number) => (
                    <button
                      key={`${selectedColor}-${i}`}
                      onClick={() => setSelectedImage(i)}
                      className={`relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9DC] border-2 transition-colors ${
                        selectedImage === i ? "border-[#B8985A]" : "border-transparent hover:border-[#1A2332]/20"
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${img}')` }}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>

                <div className="flex-1">
                  <div
                    className="relative aspect-[3/4] w-full max-h-[55vh] md:max-h-none mx-auto overflow-hidden bg-[#EFE9DC] group"
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={() => setIsZooming(false)}
                    onMouseMove={handleMouseMove}
                  >
                    <div
                      key={`${selectedColor}-${selectedImage}`}
                      className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                      style={{
                        backgroundImage: `url('${currentImages[selectedImage] || ""}')`,
                        transform: isZooming ? "scale(1.5)" : "scale(1)",
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }}
                      aria-hidden="true"
                    />

                    {product.isNew && (
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#1A2332] text-[#F5F1EA] px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold z-10">
                        Nouveau
                      </div>
                    )}

                    {toutEpuise && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                        <span className="bg-[#1A2332] text-white px-4 py-2 text-xs tracking-[0.2em] uppercase font-semibold">
                          Épuisé
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10"
                      aria-label="Ajouter aux favoris"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={isFavorite ? "#B8985A" : "none"}
                        stroke={isFavorite ? "#B8985A" : "#1A2332"}
                        strokeWidth="1.5"
                        className="transition-colors"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>

                    {currentImages.length > 1 && (
                      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] tracking-[0.2em] font-semibold z-10">
                        {selectedImage + 1} / {currentImages.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:hidden grid grid-cols-4 gap-2 mt-3">
                {currentImages.map((img: string, i: number) => (
                  <button
                    key={`m-${selectedColor}-${i}`}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-[3/4] overflow-hidden bg-[#EFE9DC] border-2 transition-colors ${
                      selectedImage === i ? "border-[#B8985A]" : "border-transparent"
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${img}')` }}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FadeIn direction="up">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] mb-2">
                  {product.category}
                </p>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#1A2332] mb-3 leading-tight">
                  {product.name}
                </h1>
                <div className="w-10 h-px bg-[#B8985A] mb-4" />
                <p className="text-lg sm:text-xl font-semibold text-[#1A2332] mb-6">
                  {product.price} €
                </p>

                <p className="text-sm text-[#1A2332]/70 leading-relaxed mb-8">
                  {product.description}
                </p>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332] font-semibold">
                      Couleur
                    </p>
                    <p className="text-xs text-[#1A2332]/60">{selectedColor}</p>
                  </div>
                  <div className="flex gap-3">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        aria-label={color}
                        className={`relative w-9 h-9 rounded-full border transition-all ${
                          selectedColor === color
                            ? "border-[#1A2332] ring-2 ring-[#B8985A] ring-offset-2 ring-offset-[#F5F1EA]"
                            : "border-[#1A2332]/30 hover:border-[#1A2332]"
                        }`}
                        style={{ backgroundColor: getColorValue(color) }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332] font-semibold">
                      Taille
                    </p>
                    <button className="text-[10px] tracking-[0.1em] uppercase text-[#1A2332]/60 hover:text-[#B8985A] transition-colors underline underline-offset-2">
                      Guide des tailles
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((size: string) => {
                      const stock = getStock(size);
                      const epuise = stock <= 0;
                      return (
                        <button
                          key={size}
                          onClick={() => !epuise && setSelectedSize(size)}
                          disabled={epuise}
                          className={`relative py-2.5 border text-xs font-semibold transition-colors ${
                            epuise
                              ? "bg-[#1A2332]/5 text-[#1A2332]/30 border-[#1A2332]/10 cursor-not-allowed line-through"
                              : selectedSize === size
                              ? "bg-[#1A2332] text-[#F5F1EA] border-[#1A2332]"
                              : "bg-transparent text-[#1A2332] border-[#1A2332]/30 hover:border-[#1A2332]"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {/* Légende tailles épuisées */}
                  {product.sizes.some((s) => getStock(s) <= 0) && !toutEpuise && (
                    <p className="text-[10px] mt-3 text-[#1A2332]/40">
                      Les tailles barrées sont en rupture de stock.
                    </p>
                  )}

                  {/* Indication de stock pour la taille sélectionnée */}
                  {selectedSize && !toutEpuise && (
                    <p className="text-[11px] mt-2 text-[#1A2332]/60">
                      {getStock(selectedSize) <= 5 ? (
                        <span className="text-[#B8985A] font-semibold">
                          Plus que {getStock(selectedSize)} en stock
                        </span>
                      ) : (
                        <span>En stock</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Sélecteur de quantité (si taille choisie et stock dispo) */}
                {selectedSize && stockRestant > 0 && (
                  <div className="mb-6">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332] font-semibold mb-3">
                      Quantité
                    </p>
                    <div className="flex items-center border border-[#1A2332]/20 w-fit">
                      <button
                        onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                        disabled={quantite <= 1}
                        className="w-10 h-10 flex items-center justify-center text-[#1A2332] hover:text-[#B8985A] transition-colors disabled:opacity-30"
                        style={{ background: "transparent", border: "none", cursor: quantite <= 1 ? "not-allowed" : "pointer" }}
                        aria-label="Diminuer"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="w-12 text-center text-sm font-semibold text-[#1A2332]">
                        {quantite}
                      </span>
                      <button
                        onClick={() => setQuantite((q) => Math.min(stockRestant, q + 1))}
                        disabled={quantite >= stockRestant}
                        className="w-10 h-10 flex items-center justify-center text-[#1A2332] hover:text-[#B8985A] transition-colors disabled:opacity-30"
                        style={{ background: "transparent", border: "none", cursor: quantite >= stockRestant ? "not-allowed" : "pointer" }}
                        aria-label="Augmenter"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                    {quantite >= stockRestant && (
                      <p className="text-[10px] text-[#1A2332]/40 mt-2">
                        Quantité maximale disponible atteinte.
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={!boutonActif}
                  className={`w-full py-4 text-[11px] tracking-[0.3em] uppercase font-semibold transition-all mb-8 ${
                    boutonActif
                      ? "bg-black text-[#B8985A] border border-black hover:bg-[#1F1F1F]"
                      : "bg-[#1A2332]/20 text-[#1A2332]/40 border border-[#1A2332]/20 cursor-not-allowed"
                  }`}
                >
                  {boutonTexte}
                </button>

                <div className="border-t border-[#1A2332]/10">
                  {[
                    { id: "composition", title: "Composition & Origine", content: product.composition },
                    { id: "care", title: "Entretien", content: product.care },
                    { id: "delivery", title: "Livraison & Retours", content: product.delivery },
                  ].map((acc) => (
                    <div key={acc.id} className="border-b border-[#1A2332]/10">
                      <button
                        onClick={() => toggleAccordion(acc.id)}
                        className="w-full flex items-center justify-between py-4 text-left"
                      >
                        <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#1A2332]">
                          {acc.title}
                        </span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`text-[#B8985A] transition-transform duration-300 ${
                            openAccordion === acc.id ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openAccordion === acc.id ? "max-h-40 pb-4" : "max-h-0"
                        }`}
                      >
                        <p className="text-xs text-[#1A2332]/70 leading-relaxed">
                          {acc.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="bg-[#EFE9DC] py-10 md:py-14 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <FadeIn direction="up">
              <div className="text-center mb-6 md:mb-8">
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-2">
                  À découvrir
                </p>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-[#1A2332] uppercase">
                  Vous aimerez aussi
                </h2>
                <div className="w-8 h-px bg-[#B8985A] mx-auto mt-3" />
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {similar.map((p) => (
                <Link key={p.id} href={`/homme/${p.slug}`} className="group block">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F1EA] mb-2 sm:mb-3">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url('${p.imagesByColor[p.colors[0]]?.[0] || ""}')` }}
                      aria-hidden="true"
                    />
                    {p.isNew && (
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#1A2332] text-[#F5F1EA] px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[7px] sm:text-[9px] tracking-[0.2em] uppercase font-semibold">
                        Nouveau
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B]">
                      {p.category}
                    </p>
                    <h3 className="text-[11px] sm:text-sm font-semibold text-[#1A2332] group-hover:text-[#B8985A] transition-colors leading-tight">
                      {p.name}
                    </h3>
                    <p className="text-[11px] sm:text-sm font-semibold text-[#1A2332]">
                      {p.price} €
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}