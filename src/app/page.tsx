export default function Home() {
  return (
    <div className="bg-black text-white">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
          <h1 className="text-5xl sm:text-8xl md:text-[10rem] font-bold tracking-wider sm:tracking-widest uppercase leading-none">
            Northstone
          </h1>

          <p className="text-sm md:text-base tracking-[0.35em] md:tracking-[0.45em] text-zinc-400 uppercase">
            Limited drops. Authentic pieces.
          </p>

          <p className="text-zinc-300 text-sm md:text-lg leading-relaxed max-w-xl">
            Chaque pièce Northstone est une édition limitée numérotée.
            Authentifiée par QR code unique, traçable de la fabrication
            au porteur final. Le streetwear repensé : rareté, transparence,
            propriété.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 w-full sm:w-auto">
            <a
              href="#drop-01"
              className="px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.25em] uppercase hover:bg-zinc-100 transition-colors"
            >
              Découvrir le Drop 01
            </a>
            <a
              href="/verify"
              className="px-8 py-4 border border-white text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors"
            >
              Vérifier un produit
            </a>
          </div>
        </div>
      </section>

      {/* ── DROP 01 ───────────────────────────────────────────── */}
      <section id="drop-01" className="py-16 md:py-36 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 md:gap-12">

          <div className="animate-on-scroll flex flex-col gap-3 md:gap-4">
            <p className="text-xs tracking-[0.45em] text-zinc-500 uppercase">
              Drop 01
            </p>
            <h2 className="text-4xl md:text-6xl font-bold uppercase leading-tight">
              400 pièces.<br />130 surprises.
            </h2>
          </div>

          <p className="animate-on-scroll text-zinc-400 text-sm md:text-lg leading-relaxed max-w-2xl">
            À chaque achat, scannez le QR code imprimé sur votre t-shirt.
            Une partie des codes sont gagnants — de l'argent viré directement,
            plus un accès gratuit au prochain drop. Personne ne sait lesquels.
            C'est ça, le jeu.
          </p>

          {/* Stats grid */}
          <div className="animate-on-scroll w-full grid grid-cols-1 sm:grid-cols-3 border border-zinc-800">
            <div className="flex flex-col items-center gap-2 py-7 sm:py-10 px-6 sm:border-r border-zinc-800">
              <span className="text-4xl sm:text-5xl font-bold">400</span>
              <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase">
                Pièces numérotées
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 py-7 sm:py-10 px-6 border-t sm:border-t-0 sm:border-r border-zinc-800">
              <span className="text-4xl sm:text-5xl font-bold">130</span>
              <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase">
                Gagnants
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 py-7 sm:py-10 px-6 border-t sm:border-t-0 border-zinc-800">
              <span className="text-4xl sm:text-5xl font-bold">1/3</span>
              <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase">
                Chance de gagner
              </span>
            </div>
          </div>

          <div className="animate-on-scroll flex flex-col gap-2">
            <p className="text-xs tracking-[0.45em] text-zinc-600 uppercase">
              Date de sortie
            </p>
            <p className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase">
              Bientôt
            </p>
          </div>
        </div>
      </section>

      {/* ── LE CONCEPT ────────────────────────────────────────── */}
      <section className="py-16 md:py-36 px-6 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto flex flex-col gap-10 md:gap-16">

          <div className="animate-on-scroll text-center flex flex-col gap-3 md:gap-4">
            <p className="text-xs tracking-[0.45em] text-zinc-500 uppercase">
              Le concept
            </p>
            <h2 className="text-3xl md:text-5xl font-bold uppercase">
              Repenser la possession
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-zinc-900">

            {/* Authentification */}
            <div className="animate-on-scroll flex flex-col gap-5 md:gap-6 p-8 md:p-10 md:border-r border-zinc-900 border-b md:border-b-0">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7L12 2z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase">
                  Authentification
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Chaque pièce a un QR code unique, infalsifiable.
                  Vérifiable à vie sur notre site.
                </p>
              </div>
            </div>

            {/* Jeu intégré */}
            <div className="animate-on-scroll flex flex-col gap-5 md:gap-6 p-8 md:p-10 md:border-r border-zinc-900 border-b md:border-b-0">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase">
                  Jeu intégré
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Une partie des QR codes contient des gains.
                  Tentez votre chance à chaque achat.
                </p>
              </div>
            </div>

            {/* Propriété transférable */}
            <div className="animate-on-scroll flex flex-col gap-5 md:gap-6 p-8 md:p-10">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 16V4m0 0L3 8m4-4l4 4" />
                <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase">
                  Propriété transférable
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Revendez votre pièce ? Le certificat numérique
                  suit le nouvel acheteur.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MANIFESTE ─────────────────────────────────────────── */}
      <section className="py-16 md:py-40 px-6 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6 md:gap-8 animate-on-scroll">
          <p className="text-xs tracking-[0.45em] text-zinc-600 uppercase">
            Manifeste
          </p>
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed text-zinc-200 italic">
            &ldquo;Northstone n&apos;est pas une marque. C&apos;est un protocole.
            Nous fabriquons des pièces rares, nous les certifions,
            nous les rendons vivantes. Chaque t-shirt a une histoire,
            un propriétaire, un destin.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 py-12 md:py-16 px-6">
        <div className="max-w-5xl mx-auto">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
              <p className="font-bold tracking-widest uppercase text-lg">
                Northstone
              </p>
              <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase leading-relaxed">
                Limited drops.<br />Authentic pieces.
              </p>
            </div>

            {/* Naviguer */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Naviguer
              </p>
              <ul className="flex flex-col gap-3 text-sm text-zinc-400">
                <li>
                  <a href="#drop-01" className="hover:text-white transition-colors">
                    Drop 01
                  </a>
                </li>
                <li>
                  <a href="/verify" className="hover:text-white transition-colors">
                    Authenticité
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    À propos
                  </a>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Légal
              </p>
              <ul className="flex flex-col gap-3 text-sm text-zinc-400">
                <li>
                  <a href="/cgv" className="hover:text-white transition-colors">
                    CGV
                  </a>
                </li>
                <li>
                  <a href="/mentions-legales" className="hover:text-white transition-colors">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="/confidentialite" className="hover:text-white transition-colors">
                    Confidentialité
                  </a>
                </li>
              </ul>
            </div>

            {/* Suivre */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Suivre
              </p>
              <ul className="flex flex-col gap-3 text-sm text-zinc-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-8">
            <p className="text-xs text-zinc-700 tracking-widest uppercase">
              © 2026 Northstone. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
