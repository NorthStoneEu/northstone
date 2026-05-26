import Link from "next/link";

const universes = [
  {
    title: "HOMME",
    subtitle: "Pièces brodées · Coupes contemporaines",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1600&auto=format&fit=crop",
    href: "/homme",
  },
  {
    title: "FEMME",
    subtitle: "Élégance moderne · Savoir-faire français",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    href: "/femme",
  },
];

export default function Universes() {
  return (
    <section className="bg-[#EFE9DC] py-12 md:py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-[10px] sm:text-[10px] tracking-[0.4em] uppercase text-[#6B6B6B] mb-3">
            Les Collections
          </p>
          <h2 className="text-2xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#1A2332] leading-[0.95]">
            DEUX UNIVERS,
            <br />
            UNE MÊME EXIGENCE.
          </h2>
          <div className="w-10 h-px bg-[#B8985A] mx-auto mt-5" />
        </div>

        {/* Grille des univers */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5">
          {universes.map((universe) => (
            <Link
              key={universe.title}
              href={universe.href}
              className="group relative aspect-[3/4] overflow-hidden block"
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${universe.image}')` }}
                aria-hidden="true"
              />

              {/* Overlay dégradé en bas pour lisibilité */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                aria-hidden="true"
              />

              {/* Texte en bas */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-4 md:p-5 text-white">
                <h3 className="text-xl sm:text-xl lg:text-2xl font-black tracking-tight mb-1">
                  {universe.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white/80 mb-3 leading-tight">
                  {universe.subtitle}
                </p>
                <div className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold border-b border-white pb-1 group-hover:gap-4 transition-all duration-300">
                  Découvrir la collection
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
          ))}
        </div>
      </div>
    </section>
  );
}