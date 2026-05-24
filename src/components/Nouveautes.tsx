import Link from "next/link";

// Données des 8 produits placeholder
const products = [
  {
    id: 1,
    name: "Polo brodé Northstone",
    category: "Polo",
    price: "120 €",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=900&auto=format&fit=crop",
    href: "/homme/polo-brode",
    isNew: true,
  },
  {
    id: 2,
    name: "Sweat à capuche kaki",
    category: "Sweat",
    price: "180 €",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=900&auto=format&fit=crop",
    href: "/homme/sweat-kaki",
    isNew: true,
  },
  {
    id: 3,
    name: "Chemise oxford blanche",
    category: "Chemise",
    price: "150 €",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=900&auto=format&fit=crop",
    href: "/homme/chemise-oxford",
    isNew: false,
  },
  {
    id: 4,
    name: "Casquette navy",
    category: "Accessoire",
    price: "45 €",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=900&auto=format&fit=crop",
    href: "/accessoires/casquette-navy",
    isNew: false,
  },
  {
    id: 5,
    name: "T-shirt blanc cassé",
    category: "T-shirt",
    price: "75 €",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop",
    href: "/homme/tshirt-blanc",
    isNew: false,
  },
  {
    id: 6,
    name: "Pull col rond vert forêt",
    category: "Pull",
    price: "220 €",
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop",
    href: "/homme/pull-vert",
    isNew: true,
  },
  {
    id: 7,
    name: "Pantalon chino beige",
    category: "Pantalon",
    price: "160 €",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=900&auto=format&fit=crop",
    href: "/homme/chino-beige",
    isNew: false,
  },
  {
    id: 8,
    name: "Veste matelassée navy",
    category: "Veste",
    price: "320 €",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=900&auto=format&fit=crop",
    href: "/homme/veste-navy",
    isNew: true,
  },
];

export default function Nouveautes() {
  return (
    <section className="bg-[#F5F1EA] py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-6">
          <div>
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">
              Nouvelle Collection
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A2332] leading-[0.95]">
              DERNIERS
              <br />
              ARRIVAGES.
            </h2>
          </div>

          {/* Lien "Voir tout" version desktop */}
          <Link
            href="/homme"
            className="hidden md:inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-semibold text-[#1A2332] border-b border-[#1A2332] pb-1 hover:gap-5 hover:text-[#B8985A] hover:border-[#B8985A] transition-all duration-300 self-start md:self-end"
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

        {/* Grille de produits */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group block"
            >
              {/* Image produit */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9DC] mb-4">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${product.image}')` }}
                  aria-hidden="true"
                />

                {/* Badge "Nouveau" si applicable */}
                {product.isNew && (
                  <div className="absolute top-3 left-3 bg-[#1A2332] text-[#F5F1EA] px-3 py-1 text-[9px] tracking-[0.2em] uppercase font-semibold">
                    Nouveau
                  </div>
                )}

                {/* Bouton "Voir le produit" qui apparaît au hover (desktop seulement) */}
                <div className="hidden md:flex absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <div className="w-full bg-[#F5F1EA] text-[#1A2332] py-3 text-center text-[10px] tracking-[0.2em] uppercase font-semibold">
                    Voir le produit
                  </div>
                </div>
              </div>

              {/* Infos produit */}
              <div className="flex flex-col gap-1">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B]">
                  {product.category}
                </p>
                <h3 className="text-sm sm:text-base font-semibold text-[#1A2332] group-hover:text-[#B8985A] transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-[#1A2332]">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Lien "Voir tout" version mobile (en bas) */}
        <div className="md:hidden mt-12 text-center">
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