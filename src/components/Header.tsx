"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const categoriesHomme = [
  { label: "Tous", href: "/homme" },
  { label: "Polos", href: "/homme?cat=polos" },
  { label: "T-shirts", href: "/homme?cat=tshirts" },
  { label: "Chemises", href: "/homme?cat=chemises" },
  { label: "Sweats", href: "/homme?cat=sweats" },
  { label: "Pulls", href: "/homme?cat=pulls" },
  { label: "Pantalons", href: "/homme?cat=pantalons" },
  { label: "Vestes", href: "/homme?cat=vestes" },
];

const categoriesFemme = [
  { label: "Tous", href: "/femme" },
  { label: "Robes", href: "/femme?cat=robes" },
  { label: "T-shirts", href: "/femme?cat=tshirts" },
  { label: "Chemisiers", href: "/femme?cat=chemisiers" },
  { label: "Pulls", href: "/femme?cat=pulls" },
  { label: "Pantalons", href: "/femme?cat=pantalons" },
  { label: "Vestes", href: "/femme?cat=vestes" },
  { label: "Accessoires", href: "/femme?cat=accessoires" },
];

const navLinks = [
  {
    label: "Homme",
    href: "/homme",
    hasMegaMenu: true,
    categories: categoriesHomme,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Femme",
    href: "/femme",
    hasMegaMenu: true,
    categories: categoriesFemme,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop",
  },
  { label: "Drops", href: "/drops", hasMegaMenu: false },
  { label: "Compte", href: "/compte", hasMegaMenu: false },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);

  // Bloquer le scroll body quand le menu mobile est ouvert
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

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Header principal */}
      <header
        className={`sticky left-0 right-0 z-40 bg-[#F5F1EA]/80 backdrop-blur-md border-b border-[#D9D2C5] transition-all duration-300 top-0`}
        onMouseLeave={() => setHoveredMenu(null)}
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
              <div
                key={link.href}
                onMouseEnter={() => link.hasMegaMenu && setHoveredMenu(link.label)}
              >
                <Link
                  href={link.href}
                  className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                    hoveredMenu === link.label
                      ? "text-[#B8985A]"
                      : "text-[#1A2332] hover:text-[#B8985A]"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
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

        {/* MEGA MENU DESKTOP */}
        {hoveredMenu &&
          navLinks
            .filter((l) => l.label === hoveredMenu && l.hasMegaMenu)
            .map((link) => (
              <div
                key={link.label}
                className="hidden md:block absolute left-0 right-0 top-full bg-[#F5F1EA] border-t border-[#D9D2C5] shadow-lg"
                onMouseEnter={() => setHoveredMenu(link.label)}
              >
                <div className="max-w-7xl mx-auto px-10 py-10">
                  <div className="grid grid-cols-[1fr_400px] gap-12">
                    {/* Catégories */}
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] mb-4">
                        Collection {link.label}
                      </p>
                      <div className="w-10 h-px bg-[#B8985A] mb-6" />
                      <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
                        {link.categories?.map((cat) => (
                          <li key={cat.label}>
                            <Link
                              href={cat.href}
                              className="text-sm text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                              onClick={() => setHoveredMenu(null)}
                            >
                              {cat.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Image promo */}
                    <Link
                      href={link.href}
                      className="group relative aspect-[4/3] overflow-hidden block"
                      onClick={() => setHoveredMenu(null)}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url('${link.image}')` }}
                        aria-hidden="true"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                        aria-hidden="true"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] mb-1">
                          Découvrir
                        </p>
                        <h3 className="text-2xl font-black tracking-tight mb-3">
                          {link.label.toUpperCase()}
                        </h3>
                        <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold border-b border-white pb-1 group-hover:gap-4 transition-all duration-300">
                          Voir la collection
                          <svg
                            width="14"
                            height="10"
                            viewBox="0 0 16 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            aria-hidden="true"
                          >
                            <line x1="0" y1="6" x2="14" y2="6" />
                            <polyline points="10 2 14 6 10 10" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </header>

      {/* MENU MOBILE PLEIN ÉCRAN */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay sombre */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Panneau */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[#F5F1EA] shadow-2xl transition-transform duration-500 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="pt-24 px-8 pb-8 h-full flex flex-col overflow-y-auto">
            {/* Navigation principale avec accordéons */}
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <div key={link.href} className="border-b border-[#1A2332]/10">
                  {link.hasMegaMenu ? (
                    <>
                      {/* Bouton accordéon */}
                      <button
                        onClick={() =>
                          setOpenMobileAccordion(
                            openMobileAccordion === link.label ? null : link.label
                          )
                        }
                        className="w-full flex items-center justify-between py-4 text-2xl font-black tracking-tight text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                      >
                        <span>{link.label.toUpperCase()}</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`transition-transform duration-300 ${
                            openMobileAccordion === link.label ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {/* Sous-catégories */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openMobileAccordion === link.label
                            ? "max-h-96 pb-4"
                            : "max-h-0"
                        }`}
                      >
                        <ul className="space-y-3 pl-2">
                          {link.categories?.map((cat) => (
                            <li key={cat.label}>
                              <Link
                                href={cat.href}
                                className="text-sm text-[#1A2332]/80 hover:text-[#B8985A] transition-colors duration-300 block"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {cat.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="block py-4 text-2xl font-black tracking-tight text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label.toUpperCase()}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Liens sociaux */}
            <div className="flex flex-col gap-3 mt-8">
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

            {/* Footer du menu */}
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