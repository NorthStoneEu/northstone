"use client";

import { useState } from "react";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import FadeIn from "./FadeIn";
import NewsletterModal from "./NewsletterModal";

const NEXT_DROP_DATE = "2026-11-15T18:00:00";

export default function DropHero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative bg-[#0A0A0A] text-white flex items-center px-4 sm:px-6 py-10 sm:py-14 overflow-hidden border-b border-[#B8985A]/30">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-16 items-stretch lg:items-center">
            {/* Colonne gauche : Image */}
            <FadeIn direction="left" duration={900} className="h-full">
              <div className="relative w-full h-full overflow-hidden aspect-[3/4] lg:aspect-auto">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/drop-01.jpg')" }}
                  aria-hidden="true"
                />
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#B8985A] text-[#0A0A0A] px-2 py-1 sm:px-4 sm:py-2 text-[7px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-semibold">
                  Drop 01
                </div>
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-white text-[7px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase bg-black/50 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1">
                  001 / 400
                </div>
              </div>
            </FadeIn>

            {/* Colonne droite : Texte + countdown */}
            <FadeIn direction="right" duration={900} className="h-full">
              <div className="flex flex-col justify-center h-full">
                <div className="inline-flex items-center gap-2 mb-3 sm:mb-6">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#B8985A] rounded-full animate-pulse" />
                  <span className="text-[7px] sm:text-xs tracking-[0.2em] sm:tracking-[0.4em] uppercase text-[#B8985A]">
                    Drop 01 — La Genèse
                  </span>
                </div>

                <h2 className="text-xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-3 sm:mb-6">
                  LA PIÈCE
                  <br />
                  <span className="text-white/40">DE LA RAISON.</span>
                </h2>

                <p className="text-[10px] sm:text-base text-white/70 leading-snug sm:leading-relaxed mb-3 sm:mb-8 max-w-lg">
                  400 pièces. 130 gagnants. Une seule chance.
                </p>

                <div className="mb-3 sm:mb-8 lg:mb-10">
                  <p className="text-[7px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/40 mb-2 sm:mb-4">
                    Ouverture des ventes dans
                  </p>
                  <CountdownTimer targetDate={NEXT_DROP_DATE} />
                </div>

                <div className="flex flex-col gap-2 sm:gap-3">
                  {/* Bouton "Être prévenu·e" → ouvre la modale */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 sm:px-8 py-2 sm:py-4 bg-[#B8985A] text-[#0A0A0A] text-[8px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold hover:bg-[#D4B574] transition-colors text-center"
                  >
                    Être prévenu·e
                  </button>
                  <Link
                    href="/drops"
                    className="px-3 sm:px-8 py-2 sm:py-4 border border-white/30 text-white text-[8px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold hover:border-white hover:bg-white/5 transition-all text-center"
                  >
                    Voir le drop
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* MODALE NEWSLETTER */}
      <NewsletterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}