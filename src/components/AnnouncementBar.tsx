"use client";

import Link from "next/link";

// Le message qui défile en boucle
const MESSAGE = "DROP 01 · MINI-JEU EXCLUSIF · TROUVEZ LE CODE · ACCÉDEZ À LA PRÉ-COMMANDE EN EXCLUSIVITÉ";

export default function AnnouncementBar() {
  // On répète le message plusieurs fois pour assurer un défilement fluide sans coupure
  const items = Array.from({ length: 6 });

  return (
    <div className="relative bg-[#0A0A0A] text-white border-y border-[#B8985A]/40 overflow-hidden animate-border-pulse">
      {/* Shimmer doré qui balaye en permanence */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#B8985A]/20 to-transparent animate-shimmer" />
      </div>

      {/* Conteneur défilant */}
      <div className="relative flex overflow-hidden py-2.5 sm:py-3">
        <div className="flex animate-ticker whitespace-nowrap">
          {items.map((_, i) => (
            <div
              key={`a-${i}`}
              className="flex items-center gap-3 sm:gap-6 px-4 sm:px-8"
            >
              <span className="relative flex w-1.5 h-1.5 sm:w-2 sm:h-2 flex-shrink-0">
                <span className="absolute inset-0 bg-[#B8985A] rounded-full animate-ping opacity-75" />
                <span className="relative w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#B8985A] rounded-full" />
              </span>
              <span className="text-[10px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/90 font-semibold">
                {MESSAGE}
              </span>
              <span className="text-[10px] sm:text-[12px] tracking-[0.2em] uppercase text-[#B8985A] font-bold inline-flex items-center gap-2">
                Tenter ma chance
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 16 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <line x1="0" y1="6" x2="14" y2="6" />
                  <polyline points="10 2 14 6 10 10" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lien cliquable invisible par-dessus tout le bandeau */}
      <Link
        href="/mini-jeu"
        className="absolute inset-0 z-10"
        aria-label="Tenter ma chance au mini-jeu"
      />
    </div>
  );
}