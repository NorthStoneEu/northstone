import Link from "next/link";
import FadeIn from "./FadeIn";

const pillars = [
  {
    number: "01",
    title: "Numéro",
    description: "Brodé à la main, unique et inaltérable.",
  },
  {
    number: "02",
    title: "Carte",
    description: "Certificat physique signé, scellé avec la pièce.",
  },
  {
    number: "03",
    title: "Empreinte",
    description: "Signature cryptographique infalsifiable.",
  },
];

const activationSteps = [
  {
    step: "01",
    title: "Scan unique",
    description: "Le QR code de la carte n'est utilisable qu'une seule fois.",
  },
  {
    step: "02",
    title: "Activation au compte",
    description: "La pièce est liée à votre espace personnel à vie.",
  },
  {
    step: "03",
    title: "Transfert sécurisé",
    description: "En cas de revente, la propriété passe au nouvel acquéreur.",
  },
];

export default function TriangulationTeaser() {
  return (
    <section className="relative bg-[#0A0A0A] text-white py-8 md:py-14 px-4 sm:px-6 overflow-hidden">
      {/* Lueur or champagne en fond, très subtile */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(184, 152, 90, 0.15), transparent 60%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* En-tête */}
        <FadeIn direction="up">
          <div className="text-center mb-10 md:mb-14">
            {/* Badge "Réservé aux drops" */}
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 border border-[#B8985A]/40">
              <span className="w-1.5 h-1.5 bg-[#B8985A] rounded-full animate-pulse" />
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#B8985A] font-semibold">
                Réservé aux pièces de drop
              </span>
            </div>

            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-[0.95]">
              CHAQUE DROP,
              <br />
              <span className="text-white/40">UNE EMPREINTE.</span>
            </h2>
            <div className="w-10 h-px bg-[#B8985A] mx-auto mt-6" />
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto mt-6 leading-relaxed">
              Une triangulation de sécurité mathématiquement infalsifiable,
              appliquée exclusivement aux pièces numérotées en édition limitée.
            </p>
          </div>
        </FadeIn>

        {/* Les 3 piliers - 3 colonnes même en mobile */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5 mb-12 md:mb-16">
          {pillars.map((pillar, index) => (
            <FadeIn key={pillar.number} direction="up" delay={index * 100}>
              <div className="group relative border border-white/10 hover:border-[#B8985A]/50 transition-colors duration-500 p-3 sm:p-5 md:p-8 h-full">
                {/* Numéro en filigrane */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-5 text-2xl sm:text-4xl md:text-6xl font-black text-white/[0.04] leading-none pointer-events-none">
                  {pillar.number}
                </div>

                {/* Contenu */}
                <div className="relative">
                  <p className="text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#B8985A] mb-2 sm:mb-3">
                    Pilier {pillar.number}
                  </p>
                  <h3 className="text-sm sm:text-lg md:text-2xl font-black tracking-tight mb-2 sm:mb-3 uppercase">
                    {pillar.title}
                  </h3>
                  <div className="w-6 sm:w-8 h-px bg-[#B8985A] mb-2 sm:mb-3 group-hover:w-12 transition-all duration-500" />
                  <p className="text-[10px] sm:text-xs md:text-sm text-white/60 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* SECTION ACTIVATION QR CODE */}
        <FadeIn direction="up">
          <div className="border-t border-white/10 pt-10 md:pt-14 mb-10 md:mb-12">
            <div className="text-center mb-8 md:mb-10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-3">
                Activation & Propriété
              </p>
              <h3 className="text-xl sm:text-xl lg:text-2xl font-black tracking-tight leading-[0.95]">
                UNE PIÈCE,
                <br />
                <span className="text-white/40">UN PROPRIÉTAIRE.</span>
              </h3>
              <div className="w-10 h-px bg-[#B8985A] mx-auto mt-5" />
              <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto mt-5 leading-relaxed">
                Le QR code de votre carte n'est valable qu'une seule fois.
                Il lie votre pièce à votre compte, à vie.
              </p>
            </div>

            {/* 3 étapes du processus */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {activationSteps.map((item, index) => (
                <FadeIn key={item.step} direction="up" delay={index * 100}>
                  <div className="flex items-start gap-4">
                    {/* Cercle avec numéro */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[#B8985A]/40 flex items-center justify-center">
                      <span className="text-[11px] font-black text-[#B8985A] tracking-tight">
                        {item.step}
                      </span>
                    </div>

                    {/* Texte */}
                    <div className="flex-1 pt-1">
                      <h4 className="text-sm md:text-base font-semibold mb-1 uppercase tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-white/60 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Note d'explication subtile */}
        <FadeIn direction="up">
          <p className="text-center text-[11px] text-white/40 max-w-2xl mx-auto mb-8 leading-relaxed italic">
            Les pièces de la boutique permanente conservent le savoir-faire Northstone
            sans le système de traçabilité réservé aux éditions limitées.
          </p>
        </FadeIn>

        {/* CTA final */}
        <FadeIn direction="up">
          <div className="text-center">
            <Link
              href="/authenticite"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B8985A] border-b border-[#B8985A] pb-1 hover:gap-5 hover:text-[#D4B574] hover:border-[#D4B574] transition-all duration-300"
            >
              Découvrir le système complet
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
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}