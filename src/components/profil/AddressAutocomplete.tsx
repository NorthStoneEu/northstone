"use client";

import { useState, useEffect, useRef } from "react";

type AddressFeature = {
  properties: {
    label: string;
    name: string;
    postcode: string;
    city: string;
    context: string;
  };
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: { line1: string; postal_code: string; city: string }) => void;
  placeholder?: string;
  style?: React.CSSProperties;
};

export default function AddressAutocomplete({ value, onChange, onSelect, placeholder, style }: Props) {
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Si on vient de sélectionner une suggestion, on ne relance pas la recherche
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (value.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5&autocomplete=1`
        );
        const data = await res.json();
        setSuggestions(data.features || []);
        setIsOpen(true);
      } catch (err) {
        console.error("Erreur autocomplete:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (feature: AddressFeature) => {
    const { name, postcode, city } = feature.properties;
    skipNextSearchRef.current = true; // empêche la prochaine recherche auto
    onSelect({ line1: name, postal_code: postcode, city });
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        style={style}
        autoComplete="off"
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid rgba(26,35,50,0.18)",
            borderRadius: "6px",
            boxShadow: "0 8px 24px rgba(26,35,50,0.12)",
            zIndex: 50,
            listStyle: "none",
            margin: 0,
            padding: "4px 0",
            maxHeight: "280px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((feature, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(feature)}
              style={{
                padding: "10px 14px",
                fontSize: "13px",
                color: "#1A2332",
                cursor: "pointer",
                borderBottom: idx < suggestions.length - 1 ? "1px solid rgba(26,35,50,0.06)" : "none",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(184,152,90,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div style={{ fontWeight: 500 }}>{feature.properties.name}</div>
              <div style={{ fontSize: "11px", color: "#6B6B6B", marginTop: "2px" }}>
                {feature.properties.postcode} {feature.properties.city}
              </div>
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "14px",
            height: "14px",
            border: "2px solid rgba(184,152,90,0.3)",
            borderTopColor: "#B8985A",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}