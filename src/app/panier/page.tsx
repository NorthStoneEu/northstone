"use client";

import Link from "next/link";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { useCart } from "@/context/CartContext";

const FREE_SHIPPING_THRESHOLD = 100;

export default function PanierPage() {
  const {
    items,
    totalItems,
    subtotal,
    removeItem,
    updateQuantity,
  } = useCart();

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <>
      <Header />
      <AnnouncementBar />

      {/* FIL D'ARIANE */}
      <div className="bg-[#F5F1EA] px-4 sm:px-6 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#1A2332]/60">
            <Link href="/" className="hover:text-[#B8985A] transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-[#1A2332]">Panier</span>
          </nav>
        </div>
      </div>

      {/* CONTENU */}
      <section className="bg-[#F5F1EA] px-4 sm:px-6 pt-4 pb-10 md:pb-14 min-h-[50vh]">
        <div className="max-w-7xl mx-auto">

          {/* TITRE */}
          <FadeIn direction="up">
            <div className="mb-6 md:mb-8">
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-2">
                Votre sélection
              </p>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332]">
                MON PANIER
                {totalItems > 0 && (
                  <span className="text-[#1A2332]/35 font-medium"> · {totalItems} article{totalItems > 1 ? "s" : ""}</span>
                )}
              </h1>
              <div className="w-10 h-px bg-[#B8985A] mt-3" />
            </div>
          </FadeIn>

          {items.length === 0 ? (
            // ── ÉTAT VIDE ──
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
                <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
              </div>
              <p className="text-sm text-[#1A2332]/60 mb-8 leading-relaxed">
                Votre panier est vide pour le moment.
              </p>
              <Link
                href="/homme"
                className="px-10 py-3.5 bg-black text-[#B8985A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all"
              >
                Découvrir la collection
              </Link>
            </div>
          ) : (
            // ── PANIER REMPLI ──
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">

              {/* COLONNE GAUCHE : ARTICLES */}
              <div>
                <div className="border-t border-[#1A2332]/10">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      className="flex gap-4 sm:gap-6 py-6 border-b border-[#1A2332]/10"
                    >
                      {/* Image */}
                      <Link
                        href={`/${item.gender}/${item.slug}`}
                        className="block w-24 h-32 sm:w-28 sm:h-36 bg-[#EFE9DC] flex-shrink-0 overflow-hidden"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Link>

                      {/* Infos */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <Link
                              href={`/${item.gender}/${item.slug}`}
                              className="text-sm sm:text-base font-semibold text-[#1A2332] hover:text-[#B8985A] transition-colors leading-tight"
                            >
                              {item.name}
                            </Link>
                            <p className="text-[11px] sm:text-xs text-[#1A2332]/50 mt-1.5 tracking-wide">
                              {item.color} · Taille {item.size}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId, item.color, item.size)}
                            className="text-[#1A2332]/40 hover:text-red-700 transition-colors flex-shrink-0"
                            aria-label="Supprimer l'article"
                            style={{ background: "transparent", border: "none", cursor: "pointer" }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <line x1="6" y1="6" x2="18" y2="18" />
                              <line x1="18" y1="6" x2="6" y2="18" />
                            </svg>
                          </button>
                        </div>

                        {/* Quantité + prix */}
                        <div className="flex justify-between items-end mt-auto pt-4">
                          <div className="flex items-center border border-[#1A2332]/20">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.color, item.size, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-[#1A2332] hover:text-[#B8985A] transition-colors"
                              aria-label="Diminuer la quantité"
                              style={{ background: "transparent", border: "none", cursor: "pointer" }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>
                            <span className="w-9 text-center text-xs font-semibold text-[#1A2332]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.color, item.size, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-[#1A2332] hover:text-[#B8985A] transition-colors"
                              aria-label="Augmenter la quantité"
                              style={{ background: "transparent", border: "none", cursor: "pointer" }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm sm:text-base font-semibold text-[#1A2332]">
                              {item.price * item.quantity} €
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-[10px] text-[#1A2332]/45 mt-0.5">
                                {item.price} € l'unité
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lien continuer */}
                <Link
                  href="/homme"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 border border-[#1A2332]/25 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#1A2332] hover:border-[#B8985A] hover:text-[#B8985A] transition-all"
                >
                  <svg width="14" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="16" y1="6" x2="2" y2="6" />
                    <polyline points="6 2 2 6 6 10" />
                  </svg>
                  Continuer mes achats
                </Link>
              </div>

              {/* COLONNE DROITE : RÉCAP */}
              <div>
                <div className="lg:sticky lg:top-20 bg-[#EFE9DC] p-6 sm:p-8">
                  {/* Filet or */}
                  <div className="h-[2px] bg-[#B8985A] mb-6" />

                  <h2 className="text-[11px] tracking-[0.3em] uppercase font-semibold text-[#1A2332] mb-6">
                    Récapitulatif
                  </h2>

                  {/* Sous-total */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-[#1A2332]/70">Sous-total</span>
                    <span className="text-sm font-semibold text-[#1A2332]">{subtotal} €</span>
                  </div>

                  {/* Livraison */}
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#1A2332]/10">
                    <span className="text-xs text-[#1A2332]/70">Livraison</span>
                    <span className="text-sm font-semibold text-[#1A2332]">
                      {hasFreeShipping ? (
                        <span className="text-[#B8985A]">Offerte</span>
                      ) : (
                        "Calculée à l'étape suivante"
                      )}
                    </span>
                  </div>

                  {/* Barre progression livraison offerte */}
                  {!hasFreeShipping && (
                    <div className="mb-5">
                      <p className="text-[11px] text-[#1A2332]/70 mb-2 leading-relaxed">
                        Plus que <span className="text-[#B8985A] font-semibold">{remainingForFreeShipping} €</span> pour bénéficier de la livraison offerte.
                      </p>
                      <div className="h-1 bg-[#1A2332]/10 overflow-hidden">
                        <div
                          className="h-full bg-[#B8985A] transition-all duration-500"
                          style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm tracking-[0.1em] uppercase font-semibold text-[#1A2332]">Total</span>
                    <span className="text-xl font-black text-[#1A2332]">{subtotal} €</span>
                  </div>

                  {/* Boutons */}
                  <button
                    disabled
                    className="block w-full text-center py-4 bg-[#1A2332]/15 text-[#1A2332]/40 text-[11px] tracking-[0.3em] uppercase font-semibold cursor-not-allowed mb-3"
                    style={{ border: "none" }}
                    title="Bientôt disponible"
                  >
                    Commander · Bientôt
                  </button>

                  <p className="text-[10px] text-[#1A2332]/45 text-center leading-relaxed italic">
                    Paiement sécurisé · Retour gratuit sous 30 jours
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}