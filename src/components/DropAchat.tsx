"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import BoutonPrevenuDrop from "./BoutonPrevenuDrop";

type DropAchatProps = {
  dateOuverture: string;
  dateExacte: string;
  lienComment?: string;
  compact?: boolean;
};

export default function DropAchat({
  dateOuverture,
  dateExacte,
  lienComment = "#comment",
  compact = false,
}: DropAchatProps) {
  const [estOuvert, setEstOuvert] = useState<boolean | null>(null);

  useEffect(() => {
    const verifier = () => {
      setEstOuvert(new Date().getTime() >= new Date(dateOuverture).getTime());
    };
    verifier();
    const interval = setInterval(verifier, 1000);
    return () => clearInterval(interval);
  }, [dateOuverture]);

  // ÉTAT : avant ouverture (countdown)
  if (estOuvert === null || !estOuvert) {
    return (
      <>
        <div className="mb-3 sm:mb-8 lg:mb-10">
          <p className="text-[7px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/40 mb-2 sm:mb-4">
            Ouverture des ventes — {dateExacte}
          </p>
          <CountdownTimer targetDate={dateOuverture} />
          {!compact && (
            <p className="text-[9px] sm:text-xs text-[#B8985A] mt-3 sm:mt-4 tracking-[0.1em]">
              Le {dateExacte}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          <BoutonPrevenuDrop />
          <a href={lienComment} className="px-3 sm:px-8 py-2 sm:py-4 border border-white/30 text-white text-[8px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold hover:border-white hover:bg-white/5 transition-all text-center">
            Comment ça marche ?
          </a>
        </div>
      </>
    );
  }

  // ÉTAT : drop ouvert
  return (
    <>
      <div className="mb-3 sm:mb-8 lg:mb-10">
        <div className="inline-flex items-center gap-2 border border-[#B8985A] bg-[#B8985A]/10 px-4 py-2 sm:px-5 sm:py-2.5">
          <span className="w-2 h-2 bg-[#B8985A] rounded-full animate-pulse" />
          <span className="text-[9px] sm:text-sm tracking-[0.25em] uppercase text-[#B8985A] font-semibold">
            Le drop est ouvert
          </span>
        </div>
        <p className="text-[10px] sm:text-sm text-white/60 mt-3 sm:mt-4 max-w-md">
          Les ventes sont ouvertes. Une seule pièce par personne. Premier arrivé, premier servi.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        <Link
          href="/drops/commander"
          className="px-3 sm:px-8 py-2 sm:py-4 bg-[#B8985A] text-[#0A0A0A] text-[8px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold hover:bg-[#D4B574] transition-colors text-center"
        >
          Commander ma pièce
        </Link>
        <a href={lienComment} className="px-3 sm:px-8 py-2 sm:py-4 border border-white/30 text-white text-[8px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold hover:border-white hover:bg-white/5 transition-all text-center">
          Comment ça marche ?
        </a>
      </div>
    </>
  );
}