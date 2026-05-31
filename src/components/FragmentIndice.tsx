"use client";

import { useState } from "react";

type Props = {
  fragment: string; // le morceau du code (ex: "POL")
  ordre: number; // position dans la séquence (1, 2, 3)
};

export default function FragmentIndice({ fragment, ordre }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      onMouseEnter={() => setRevealed(true)}
      onClick={() => setRevealed(true)}
      title="..."
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        cursor: "help",
        userSelect: "none",
        padding: "2px 8px",
        border: "1px solid rgba(184,152,90,0.35)",
        borderRadius: "2px",
        fontSize: "10px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#B8985A",
        transition: "all 0.3s ease",
        backgroundColor: revealed ? "rgba(184,152,90,0.08)" : "transparent",
      }}
    >
      {/* Petite étoile (clin d'œil à Polaris) */}
      <svg width="9" height="9" viewBox="0 0 24 24" fill="#B8985A" aria-hidden="true">
        <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2-6.3-4.6-6.3 4.6L7.9 13.8 2 9.4h7.6z" />
      </svg>
      {revealed ? (
        <span style={{ fontWeight: 600 }}>
          Fragment {ordre} · {fragment}
        </span>
      ) : (
        <span style={{ opacity: 0.7 }}>Fragment {ordre}</span>
      )}
    </span>
  );
}