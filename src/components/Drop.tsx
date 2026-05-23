import Link from "next/link";

export default function Drop() {
  return (
    <section className="relative bg-[#0A0A0A] text-white py-20 md:py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Colonne gauche : Texte */}
        <div className="flex flex-col">
          {/* Label */}
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/60">
              Drop à venir · Automne 2026
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-8">
            DROP 01
            <br />
            <span className="text-white/40">— LA GENÈSE</span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-10 max-w-xl">
            400 pièces numérotées. Chacune authentifiée par un certificat
            numérique unique. Une partie d'entre elles cache un privilège —
            argent, accès, expériences. À vous de découvrir laquelle est la
            vôtre.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-10 border-t border-b border-white/10 py-8">
            <div>
              <div className="text-2xl sm:text-3xl font-black">400</div>
              <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/50 mt-2">
                Pièces
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black">130</div>
              <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/50 mt-2">
                Gagnants
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black">∞</div>
              <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/50 mt-2">
                Histoires
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/drops"
              className="px-8 py-4 bg-white text-[#0A0A0A] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors text-center"
            >
              Être prévenu·e
            </Link>
            <Link
              href="/drops"
              className="px-8 py-4 border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:border-white hover:bg-white/5 transition-all text-center"
            >
              En savoir plus
            </Link>
          </div>
        </div>

        {/* Colonne droite : Image */}
        <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 lg:ml-auto overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop')",
            }}
            aria-hidden="true"
          />
          {/* Badge sur l'image */}
          <div className="absolute top-6 left-6 bg-white text-[#0A0A0A] px-4 py-2 text-[10px] tracking-[0.3em] uppercase font-semibold">
            Édition limitée
          </div>
          {/* Numéro en bas */}
          <div className="absolute bottom-6 right-6 text-white text-[10px] tracking-[0.3em] uppercase">
            01 / 400
          </div>
        </div>
      </div>
    </section>
  );
}