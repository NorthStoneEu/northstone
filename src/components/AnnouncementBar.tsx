"use client";

import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="sticky top-16 z-30 bg-[#0A0A0A] text-white border-b border-white/10 overflow-hidden">
      {/* Shimmer doré qui balaye en permanence */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#B8985A]/15 to-transparent animate-shimmer" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-3 flex items-center justify-center gap-3 sm:gap-6">
        {/* Indicateur pulsant or champagne */}
        <span className="hidden sm:inline-flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 bg-[#B8985A] rounded-full animate-ping opacity-75" />
            <span className="relative w-2 h-2 bg-[#B8985A] rounded-full" />
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] font-semibold">
            Drop 01
          </span>
        </span>

        {/* Séparateur */}
        <span className="hidden sm:block w-px h-3 bg-white/20" />

        {/* Texte principal */}
        <p className="text-[11px] sm:text-[12px] tracking-[0.15em] uppercase text-white/90 text-center font-medium">
          <span className="hidden sm:inline">Mini-jeu exclusif · </span>
          Trouvez le code · Accédez à la pré-commande
        </p>

        {/* Séparateur */}
        <span className="hidden md:block w-px h-3 bg-white/20" />

        {/* CTA */}
        <Link
          href="/mini-jeu"
          className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B8985A] hover:text-[#D4B574] transition-colors group"
        >
          Tenter ma chance
          <svg
            width="14"
            height="10"
            viewBox="0 0 16 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            className="animate-nudge group-hover:animate-none group-hover:translate-x-1 transition-transform"
          >
            <line x1="0" y1="6" x2="14" y2="6" />
            <polyline points="10 2 14 6 10 10" />
          </svg>
        </Link>
      </div>
    </div>
  );
}