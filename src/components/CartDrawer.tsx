"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    totalItems,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  // Bloquer le scroll body quand le drawer est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99998,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      aria-hidden={!isOpen}
    >
      <style jsx>{`
        @keyframes drawerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Overlay sombre */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(10, 10, 10, 0.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.4s ease-out",
        }}
      />

      {/* Panneau qui slide depuis la droite */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#F5F1EA",
          boxShadow: "-25px 0 80px -12px rgba(0, 0, 0, 0.5)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Filet or signature en haut */}
        <div style={{ height: "3px", backgroundColor: "#B8985A", flexShrink: 0 }} />

        {/* EN-TÊTE */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-[#1A2332]/10 flex-shrink-0">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#B8985A] mb-1 font-semibold">
              Votre sélection
            </p>
            <h2 className="text-lg font-black tracking-tight text-[#1A2332]">
              PANIER
              {totalItems > 0 && (
                <span className="text-[#1A2332]/35 font-medium"> · {totalItems}</span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="text-[#1A2332] hover:text-[#B8985A] transition-colors"
            aria-label="Fermer le panier"
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* CORPS : liste ou état vide */}
        {items.length === 0 ? (
          // ── État vide ──
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
              <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
              <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
            </div>
            <p className="text-sm text-[#1A2332]/60 mb-8 leading-relaxed">
              Votre panier est vide.
            </p>
            <Link
              href="/homme"
              onClick={closeCart}
              className="px-10 py-3.5 bg-black text-[#B8985A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all"
            >
              Découvrir la collection
            </Link>
          </div>
        ) : (
          // ── Liste des articles ──
          <div className="flex-1 overflow-y-auto px-7 py-6">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="flex gap-4"
                >
                  {/* Image */}
                  <Link
                    href={`/${item.gender}/${item.slug}`}
                    onClick={closeCart}
                    className="block w-20 h-24 bg-[#EFE9DC] flex-shrink-0 overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Link>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/${item.gender}/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-[#1A2332] hover:text-[#B8985A] transition-colors leading-tight"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId, item.color, item.size)}
                        className="text-[#1A2332]/40 hover:text-red-700 transition-colors flex-shrink-0"
                        aria-label="Supprimer l'article"
                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <line x1="6" y1="6" x2="18" y2="18" />
                          <line x1="18" y1="6" x2="6" y2="18" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[11px] text-[#1A2332]/50 mt-1 tracking-wide">
                      {item.color} · Taille {item.size}
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      {/* Sélecteur quantité */}
                      <div className="flex items-center border border-[#1A2332]/20">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.color, item.size, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#1A2332] hover:text-[#B8985A] transition-colors"
                          aria-label="Diminuer la quantité"
                          style={{ background: "transparent", border: "none", cursor: "pointer" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#1A2332]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.color, item.size, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#1A2332] hover:text-[#B8985A] transition-colors"
                          aria-label="Augmenter la quantité"
                          style={{ background: "transparent", border: "none", cursor: "pointer" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>

                      {/* Prix ligne */}
                      <p className="text-sm font-semibold text-[#1A2332]">
                        {item.price * item.quantity} €
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER (uniquement si articles) */}
        {items.length > 0 && (
          <div className="border-t border-[#1A2332]/10 px-7 py-6 flex-shrink-0">
            {/* Sous-total */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs tracking-[0.2em] uppercase text-[#1A2332]/70 font-semibold">
                Sous-total
              </span>
              <span className="text-lg font-black text-[#1A2332]">{subtotal} €</span>
            </div>
            <p className="text-[10px] text-[#1A2332]/45 mb-5 italic">
              Frais de livraison calculés à l'étape suivante.
            </p>

            {/* Boutons */}
            <Link
              href="/panier"
              onClick={closeCart}
              className="block w-full text-center py-3.5 mb-3 border border-[#1A2332]/25 text-[#1A2332] text-[11px] tracking-[0.3em] uppercase font-semibold hover:border-[#B8985A] hover:text-[#B8985A] transition-all"
            >
              Voir le panier
            </Link>
            <button
              disabled
              className="block w-full text-center py-4 bg-[#1A2332]/15 text-[#1A2332]/40 text-[11px] tracking-[0.3em] uppercase font-semibold cursor-not-allowed"
              style={{ border: "none" }}
              title="Bientôt disponible"
            >
              Commander · Bientôt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}