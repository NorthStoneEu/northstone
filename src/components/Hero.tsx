import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero.jpg')",
        }}
        aria-hidden="true"
      />

      {/* Overlay sombre pour lisibilité */}
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
      />

      {/* Contenu centré */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/80 mb-6">
          Maison française · Depuis 2026
        </p>

        <h1 className="text-3xl sm:text-5xl lg:text-8xl font-black tracking-tight text-white leading-[0.95]">
          L'EXCELLENCE
          <br />
          EN HÉRITAGE.
        </h1>

        <p className="mt-8 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
          Vêtements brodés en éditions limitées.
          <br className="hidden sm:block" />
          Chaque pièce est une promesse de rareté et d'authenticité.
        </p>

        {/* Boutons CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/homme"
            className="px-8 py-4 bg-[#F5F1EA] text-[#1A2332] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#B8985A] hover:text-white transition-colors duration-300 text-center"
          >
            Découvrir l'homme
          </Link>
          <Link
            href="/femme"
            className="px-8 py-4 border border-[#F5F1EA] text-[#F5F1EA] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#F5F1EA] hover:text-[#1A2332] transition-colors duration-300 text-center"
          >
            Découvrir la femme
          </Link>
        </div>
      </div>

      {/* Flèche scroll en bas */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <line x1="12" y1="4" x2="12" y2="20" />
          <polyline points="6 14 12 20 18 14" />
        </svg>
      </div>
    </section>
  );
}