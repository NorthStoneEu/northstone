"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

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

const navLinksMain = [
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
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export default function Header() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

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

  // Fermer le menu compte quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Récupérer les initiales du user
  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "?";
  };

  const handleSignOut = async () => {
    setIsAccountMenuOpen(false);
    setIsMenuOpen(false);
    await signOut({ redirectUrl: "/" });
  };

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
            {navLinksMain.map((link) => (
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

            {/* === BOUTON COMPTE (non connecté) === */}
            {!isSignedIn && (
              <Link
                href="/sign-in"
                className="text-xs tracking-[0.2em] uppercase text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                onMouseEnter={() => setHoveredMenu(null)}
              >
                Compte
              </Link>
            )}

            {/* === BOUTON COMPTE (connecté) === */}
            {isSignedIn && (
              <div
                ref={accountMenuRef}
                className="relative"
                onMouseEnter={() => setHoveredMenu(null)}
              >
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                >
                  {/* Icône profil silhouette */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Compte</span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`transition-transform duration-300 ${
                      isAccountMenuOpen ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Menu déroulant */}
                <div
                  className={`absolute right-0 top-full mt-3 w-64 bg-[#F5F1EA] border border-[#D9D2C5] shadow-2xl transition-all duration-200 ${
                    isAccountMenuOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  {/* Filet or signature */}
                  <div className="h-[2px] bg-[#B8985A]" />

                  {/* En-tête user */}
                  <div className="px-5 py-4 border-b border-[#1A2332]/10">
                    <p className="text-[9px] tracking-[0.3em] uppercase text-[#B8985A] mb-1 font-semibold">
                      Bonjour
                    </p>
                    <p className="text-sm font-semibold text-[#1A2332] tracking-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-[#1A2332]/50 mt-0.5 truncate">
                      {user?.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>

                  {/* Liens du menu */}
                  <nav className="py-2">
                    <Link
                      href="/compte"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-xs tracking-[0.15em] uppercase text-[#1A2332] hover:bg-[#B8985A]/10 hover:text-[#B8985A] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Mon profil
                    </Link>
                    <Link
                      href="/commandes"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-xs tracking-[0.15em] uppercase text-[#1A2332] hover:bg-[#B8985A]/10 hover:text-[#B8985A] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      Mes commandes
                    </Link>
                    <Link
                      href="/favoris"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-xs tracking-[0.15em] uppercase text-[#1A2332] hover:bg-[#B8985A]/10 hover:text-[#B8985A] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Mes favoris
                    </Link>
                  </nav>

                  {/* Bouton déconnexion */}
                  <div className="border-t border-[#1A2332]/10 py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-xs tracking-[0.15em] uppercase text-[#1A2332] hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            )}
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
          navLinksMain
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

            {/* === BLOC USER CONNECTÉ (mobile) === */}
            {isSignedIn && (
              <div className="mb-6 pb-6 border-b border-[#1A2332]/10">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-[#1A2332] text-[#B8985A] flex items-center justify-center text-xs font-semibold">
                    {getInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] tracking-[0.3em] uppercase text-[#B8985A] font-semibold">
                      Bonjour
                    </p>
                    <p className="text-sm font-semibold text-[#1A2332] tracking-tight truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation principale avec accordéons */}
            <nav className="flex flex-col">
              {navLinksMain.map((link) => (
                <div key={link.href} className="border-b border-[#1A2332]/10">
                  {link.hasMegaMenu ? (
                    <>
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

              {/* === COMPTE MOBILE (non connecté) === */}
              {!isSignedIn && (
                <div className="border-b border-[#1A2332]/10">
                  <Link
                    href="/sign-in"
                    className="block py-4 text-2xl font-black tracking-tight text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    COMPTE
                  </Link>
                </div>
              )}

              {/* === COMPTE MOBILE (connecté) === */}
              {isSignedIn && (
                <>
                  <div className="border-b border-[#1A2332]/10">
                    <Link
                      href="/compte"
                      className="flex items-center gap-3 py-4 text-base text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Mon profil
                    </Link>
                  </div>
                  <div className="border-b border-[#1A2332]/10">
                    <Link
                      href="/commandes"
                      className="flex items-center gap-3 py-4 text-base text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      Mes commandes
                    </Link>
                  </div>
                  <div className="border-b border-[#1A2332]/10">
                    <Link
                      href="/favoris"
                      className="flex items-center gap-3 py-4 text-base text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Mes favoris
                    </Link>
                  </div>
                  <div className="border-b border-[#1A2332]/10">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 py-4 text-base text-[#1A2332] hover:text-red-700 transition-colors duration-300"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
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