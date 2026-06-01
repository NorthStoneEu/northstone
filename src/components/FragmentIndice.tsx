"use client";

import { useState } from "react";

type Props = {
  indice: string;
};

export default function FragmentIndice({ indice }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      onClick={() => setRevealed((v) => !v)}
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "26px",
        height: "26px",
        cursor: "pointer",
        userSelect: "none",
        position: "relative",
        verticalAlign: "middle",
      }}
    >
      {/* Pastille ronde toujours visible (bordure or sur fond sombre) */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          backgroundColor: "rgba(10,10,10,0.7)",
          border: "1px solid rgba(184,152,90,0.7)",
          boxShadow: revealed
            ? "0 0 12px rgba(184,152,90,0.6)"
            : "0 0 6px rgba(184,152,90,0.25)",
          transition: "box-shadow 0.4s ease",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="#B8985A"
          style={{
            opacity: revealed ? 1 : 0.85,
            transition: "opacity 0.3s ease",
          }}
        >
          <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2-6.3-4.6-6.3 4.6L7.9 13.8 2 9.4h7.6z" />
        </svg>
      </span>

      {/* L'indice */}
      {revealed && (
        <span
          style={{
            position: "absolute",
            left: "50%",
            bottom: "34px",
            transform: "translateX(-50%)",
            backgroundColor: "#0A0A0A",
            color: "#B8985A",
            border: "1px solid rgba(184,152,90,0.5)",
            padding: "9px 13px",
            fontSize: "11px",
            lineHeight: "1.4",
            fontStyle: "italic",
            width: "210px",
            textAlign: "center",
            whiteSpace: "normal",
            pointerEvents: "none",
            zIndex: 9999,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {indice}
        </span>
      )}
    </span>
  );
}