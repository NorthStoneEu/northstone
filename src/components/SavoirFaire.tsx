import Link from "next/link";

export default function SavoirFaire() {
  return (
    <section className="bg-[#F5F1EA] py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Colonne gauche : Image close-up broderie */}
          <div className="relative aspect-[4/5] w-full overflow-hidden order-2 lg:order-1">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop')",
              }}
              aria-hidden="true"
            />
            {/* Petit badge "Détail" */}
            <div className="absolute top-6 left-6 bg-[#F5F1EA] text-[#1A2332] px-4 py-2 text-[10px] tracking-[0.3em] uppercase font-semibold">
              Le détail
            </div>
          </div>

          {/* Colonne droite : Texte éditorial */}
          <div className="flex flex-col order-1 lg:order-2">
            {/* Label */}
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-6">
              Savoir-faire
            </p>

            {/* Titre */}
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-[#1A2332] leading-[0.95] mb-8">
              L'EXCELLENCE
              <br />
              <span className="text-[#1A2332]/40">N'A PAS DE FRONTIÈRES.</span>
            </h2>

            {/* Paragraphes */}
            <div className="space-y-6 text-[#1A2332]/80 leading-relaxed text-base sm:text-lg max-w-xl">
              <p>
                Northstone est une maison française qui croit en une vérité
                simple : chaque pièce mérite d'être produite là où le
                savoir-faire est le plus exigeant. Un t-shirt n'a pas la même
                histoire qu'un polo, ni les mêmes mains pour le faire naître.
              </p>

              <p>
                Nous sélectionnons nos ateliers à travers le monde — France,
                Portugal, Italie, Japon — non pas par hasard, mais parce que
                chaque culture textile possède son génie propre. La broderie y
                est traitée comme un héritage, le tissu comme une promesse.
              </p>

              <p className="text-[#1A2332] font-semibold">
                Ce que nous portons, nous le portons longtemps. Et ce qui
                dure, mérite l'excellence.
              </p>
            </div>

            {/* Stats / Détails */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 pt-8 border-t border-[#1A2332]/10">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#1A2332]">
                  4
                </div>
                <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1A2332]/60 mt-2">
                  Pays partenaires
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#1A2332]">
                  100%
                </div>
                <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1A2332]/60 mt-2">
                  Broderie main
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#1A2332]">
                  ∞
                </div>
                <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1A2332]/60 mt-2">
                  Détails
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <Link
                href="/savoir-faire"
                className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-semibold text-[#1A2332] border-b border-[#1A2332] pb-1 hover:gap-5 hover:text-[#B8985A] hover:border-[#B8985A] transition-all duration-300"
              >
                Découvrir notre histoire
                <svg
                  width="16"
                  height="12"
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
          </div>
        </div>
      </div>
    </section>
  );
}