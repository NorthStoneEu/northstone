import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5F1EA]/80 backdrop-blur-md border-b border-[#D9D2C5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        {/* Logo à gauche */}
        <Link
          href="/"
          className="text-base sm:text-lg font-black tracking-[0.2em] text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
        >
          NORTHSTONE
        </Link>

        {/* Navigation à droite */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/homme"
            className="text-xs tracking-[0.2em] uppercase text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
          >
            Homme
          </Link>
          <Link
            href="/femme"
            className="text-xs tracking-[0.2em] uppercase text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
          >
            Femme
          </Link>
          <Link
            href="/drops"
            className="text-xs tracking-[0.2em] uppercase text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
          >
            Drops
          </Link>
          <Link
            href="/compte"
            className="text-xs tracking-[0.2em] uppercase text-[#1A2332] hover:text-[#B8985A] transition-colors duration-300"
          >
            Compte
          </Link>
        </nav>

        {/* Bouton burger mobile */}
        <button
          className="md:hidden text-[#1A2332]"
          aria-label="Ouvrir le menu"
        >
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
        </button>
      </div>
    </header>
  );
}