"use client";

import { useState, useRef } from "react";

// Les lettres cachées : les bonnes (avec leur ordre) + des leurres
// position en % (x, y) dans la zone
type LettreCachee = {
  char: string;
  x: number; // %
  y: number; // %
  ordre?: number; // si défini = bonne lettre, sinon leurre
};

const LETTRES: LettreCachee[] = [
  // Les bonnes lettres d'ORION (sans ordre affiché)
  { char: "O", x: 18, y: 30 },
  { char: "R", x: 72, y: 22 },
  { char: "I", x: 40, y: 68 },
  { char: "O", x: 85, y: 60 },
  { char: "N", x: 30, y: 80 },
  // Des leurres (pièges)
  { char: "A", x: 55, y: 40 },
  { char: "S", x: 10, y: 65 },
  { char: "T", x: 62, y: 78 },
  { char: "E", x: 48, y: 15 },
  { char: "L", x: 90, y: 35 },
  { char: "M", x: 25, y: 50 },
  { char: "U", x: 78, y: 85 },
];

export default function Revelateur() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleTouch = (e: React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;
    setPos({
      x: ((e.touches[0].clientX - rect.left) / rect.width) * 100,
      y: ((e.touches[0].clientY - rect.top) / rect.height) * 100,
    });
  };

  // Rayon du halo en % (distance en dessous de laquelle une lettre est visible)
  const RAYON = 16;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos(null)}
      onTouchMove={handleTouch}
      onTouchEnd={() => setPos(null)}
      style={{
        position: "relative",
        width: "100%",
        height: "320px",
        backgroundColor: "#050505",
        border: "1px solid rgba(184,152,90,0.3)",
        overflow: "hidden",
        cursor: "none",
        touchAction: "none",
        borderRadius: "4px",
      }}
    >
      {/* Halo lumineux qui suit la souris */}
      {pos && (
        <div
          style={{
            position: "absolute",
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: "220px",
            height: "220px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(184,152,90,0.18) 0%, rgba(184,152,90,0.06) 40%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Les lettres cachées */}
      {LETTRES.map((lettre, i) => {
        // Distance entre la souris et la lettre
        let visible = 0;
        if (pos) {
          const dx = pos.x - lettre.x;
          const dy = pos.y - lettre.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Plus c'est proche, plus c'est visible
          visible = Math.max(0, 1 - dist / RAYON);
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${lettre.x}%`,
              top: `${lettre.y}%`,
              transform: "translate(-50%, -50%)",
              opacity: visible,
              transition: "opacity 0.15s ease",
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <span
              style={{
                fontSize: "34px",
                fontWeight: 900,
                color: "#B8985A",
                lineHeight: 1,
              }}
            >
              {lettre.char}
            </span>
          </div>
        );
      })}

      {/* Petit hint au centre si la souris n'est pas dans la zone */}
      {!pos && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(184,152,90,0.4)",
            fontSize: "12px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          Explorez l'obscurité
        </div>
      )}
    </div>
  );
}