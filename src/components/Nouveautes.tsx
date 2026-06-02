"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts, type Product } from "@/data/catalog";

type CardProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  href: string;
  isNew: boolean;
};

export default function Nouveautes() {
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts().then((all: Product[]) => {
      // On ne garde que les produits marqués "Nouveau", max 8
      const nouveaux = all
        .filter((p) => p.isNew)
        .slice(0, 8)
        .map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          image: p.imagesByColor[p.colors[0]]?.[0] || "",
          href: `/${p.gender}/${p.slug}`,
          isNew: p.isNew,
        }));
      setProducts(nouveaux);
      setLoading(false);
    });
  }, []);

  return (
    <section className="bg-[#F5F1EA] py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-10 gap-4 md:gap-6">
          <div>
            <p className="text-[10px] sm:text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-3">
              Nouvelle Collection
            </p>
            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#1A2332] leading-[0.95]">
              DERNIERS
              <br />
              ARRIVAGES.
            </h2>
          </div>

          <Link
            href="/homme"
            className="hidden md:inline-flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1A2332] border-b border-[#1A2332] pb-1 hover:gap-5 hover:text-[#B8985A] hover:border-[#B8985A] transition-all duration-300 self-start md:self-end"
          >
            Voir toute la collection
            <svg
              width="14"
              height="10"
              viewBox="0 0 16 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <line x1="0" y1="6" x2="14" y2="6" />
              <polyline points="10 2 14 6 10 10" />
            </svg>
          </Link>
        </div>

        {/* Grille de produits */}
        {loading ? (
          <p className="text-center py-16 text-[#1A2332]/40 text-sm">Chargement...</p>
        ) : products.length === 0 ? (
          <p className="text-center py-16 text-[#1A2332]/40 text-sm">
            Aucune nouveauté pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-5">
            {products.map((product) => (
              <Link key={product.id} href={product.href} className="group block">
                {/* Image produit */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9DC] mb-2 sm:mb-3">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${product.image}')` }}
                    aria-hidden="true"
                  />

                  {product.isNew && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#1A2332] text-[#F5F1EA] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-semibold">
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
                  <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B]">
                    {product.category}
                  </p>
                  <h3 className="text-xs sm:text-sm font-semibold text-[#1A2332] group-hover:text-[#B8985A] transition-colors leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#1A2332]">
                    {product.price} €
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Lien "Voir tout" version mobile (en bas) */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/homme"
            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-semibold text-[#1A2332] border-b border-[#1A2332] pb-1 hover:gap-5 hover:text-[#B8985A] hover:border-[#B8985A] transition-all duration-300"
          >
            Voir toute la collection
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <line x1="0" y1="6" x2="14" y2="6" />
              <polyline points="10 2 14 6 10 10" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}