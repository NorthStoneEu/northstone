"use client";

import { useState } from "react";

type Props = {
  longueur: number; // nombre de molettes
  onSubmit: (code: string) => void;
  disabled?: boolean;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Cadenas({ longueur, onSubmit, disabled = false }: Props) {
  // index de la lettre affichée pour chaque molette (0 = A)
  const [molettes, setMolettes] = useState<number[]>(
    Array.from({ length: longueur }, () => 0)
  );

  const tourner = (index: number, direction: 1 | -1) => {
    if (disabled) return;
    setMolettes((prev) => {
      const next = [...prev];
      next[index] = (next[index] + direction + 26) % 26;
      return next;
    });
  };

  const code = molettes.map((i) => ALPHABET[i]).join("");

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Les molettes */}
      <div className="flex gap-2 sm:gap-3">
        {molettes.map((letterIndex, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            {/* Flèche haut */}
            <button
              onClick={() => tourner(i, 1)}
              disabled={disabled}
              aria-label="Lettre suivante"
              className="text-[#B8985A]/50 hover:text-[#B8985A] transition-colors disabled:opacity-30"
              style={{ background: "transparent", border: "none", cursor: disabled ? "default" : "pointer" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>

            {/* Molette (lettre affichée) */}
            <div
              className="flex items-center justify-center"
              style={{
                width: "44px",
                height: "60px",
                backgroundColor: "rgba(184,152,90,0.06)",
                border: "1px solid rgba(184,152,90,0.4)",
                borderRadius: "4px",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              <span
                className="font-black"
                style={{
                  fontSize: "26px",
                  color: "#B8985A",
                  letterSpacing: "0",
                }}
              >
                {ALPHABET[letterIndex]}
              </span>
            </div>

            {/* Flèche bas */}
            <button
              onClick={() => tourner(i, -1)}
              disabled={disabled}
              aria-label="Lettre précédente"
              className="text-[#B8985A]/50 hover:text-[#B8985A] transition-colors disabled:opacity-30"
              style={{ background: "transparent", border: "none", cursor: disabled ? "default" : "pointer" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Bouton valider */}
      <button
        onClick={() => onSubmit(code)}
        disabled={disabled}
        className={`px-12 py-4 text-[11px] tracking-[0.3em] uppercase font-semibold transition-all ${
          disabled
            ? "bg-white/10 text-white/40 cursor-not-allowed"
            : "bg-[#B8985A] text-[#0A0A0A] hover:bg-[#C9A96B]"
        }`}
        style={{ border: "none" }}
      >
        Déverrouiller
      </button>
    </div>
  );
}