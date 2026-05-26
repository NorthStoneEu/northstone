"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Homme", href: "/homme" },
  { label: "Femme", href: "/femme" },
  { label: "Drops", href: "/drops" },
  { label: "Compte", href: "/compte" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export default function Header() {
  // État du menu mobile : true = ouvert, false = fermé
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // État du scroll : true si on a scrollé plus de 40px (= bandeau dépassé)
  const [isScrolled, setIsScrolled] = useState(false);

  // Bloquer le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Détecter le scroll pour savoir si le bandeau est dépassé
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Header principal (sticky, se positionne sous le bandeau ou en haut selon scroll) */}
      <header
        className={`sticky left-0 right-0 z-40 bg-[#F5F1EA]/80 backdrop-blur-md border-b border-[#D9D2C5] transition-all duration-300 ${
          isScrolled ? "top-0" : "top-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-base sm:text-lg font-black tracking-[0.2em] text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            NORTHSTONE
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-[0.2em] uppercase text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bouton burger / X (mobile uniquement) */}
          <button
            className="md:hidden text-[#1A2332] z-50 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="3" y1="8" x2="21" y2="8" />
                <line x1="3" y1="16" x2="21" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Menu mobile plein écran (slide-in depuis la droite) */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay sombre derrière */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Panneau du menu */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[#F5F1EA] shadow-2xl transition-transform duration-500 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Espace pour ne pas chevaucher le header */}
          <div className="pt-24 px-8 pb-8 h-full flex flex-col">
            {/* Navigation principale */}
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-2xl font-black tracking-tight text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label.toUpperCase()}
                </Link>
              ))}
            </nav>

            {/* Séparateur */}
            <div className="my-8 border-t border-[#1A2332]/10" />

            {/* Liens sociaux */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#1A2332]/50 mb-2">
                Suivre
              </p>
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Footer du menu (en bas) */}
            <div className="mt-auto pt-8 border-t border-[#1A2332]/10">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/40">
                © 2026 Northstone
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}