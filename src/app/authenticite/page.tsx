import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "Authenticité — Northstone",
  description:
    "Chaque pièce Northstone est mathématiquement infalsifiable. Un système d'authentification propriétaire qui transforme chaque vêtement en actif certifié.",
};

const pillars = [
  {
    number: "01",
    title: "Le numéro",
    subtitle: "Visible",
    description:
      "Brodé sur l'étiquette. De 001 à 400. Votre référence publique, unique au monde.",
  },
  {
    number: "02",
    title: "La carte",
    subtitle: "Tangible",
    description:
      "Certificat physique avec QR code à usage unique. Active votre pièce sur votre compte.",
  },
  {
    number: "03",
    title: "L'empreinte",
    subtitle: "Invisible",
    description:
      "Une signature cryptographique scellée dans le tissu. Mathématiquement infalsifiable.",
  },
];

const journey = [
  {
    step: "01",
    title: "Réception",
    description:
      "Vous recevez votre pièce, accompagnée de sa carte d'authenticité personnelle.",
  },
  {
    step: "02",
    title: "Activation",
    description:
      "Scan du QR code de la carte. Votre pièce est liée à votre compte Northstone. À vie.",
  },
  {
    step: "03",
    title: "Vérification",
    description:
      "À tout moment, approchez votre téléphone de la pièce. Authenticité confirmée en temps réel.",
  },
  {
    step: "04",
    title: "Transmission",
    description:
      "Pour revendre, un transfert sécurisé garantit que la propriété passe à l'acheteur. Sans intermédiaire.",
  },
];

const guarantees = [
  {
    title: "Clonage impossible",
    description:
      "Notre système génère une signature différente à chaque vérification. Ce qui fonctionne aujourd'hui ne fonctionnera plus demain pour un imitateur.",
  },
  {
    title: "Corrélation triple",
    description:
      "Trois éléments doivent correspondre simultanément. Même en possédant l'un, les deux autres restent inaccessibles.",
  },
  {
    title: "Registre souverain",
    description:
      "Northstone est l'unique gardien du registre. Aucune information sensible n'est jamais imprimée, partagée ou exposée.",
  },
];

const faqs = [
  {
    q: "Que se passe-t-il si je perds ma carte d'authenticité ?",
    a: "Une fois activée sur votre compte, la pièce est définitivement liée à vous. La carte n'est plus nécessaire pour prouver l'authenticité — votre téléphone suffit.",
  },
  {
    q: "Et si je veux revendre ma pièce ?",
    a: "Vous initiez un transfert sécurisé depuis votre compte. L'acheteur scanne la pièce, la propriété change de mains. Aucun intermédiaire, aucune contestation possible.",
  },
  {
    q: "Et si quelqu'un copie ma pièce ?",
    a: "Un imitateur peut copier le tissu et la broderie. Il ne peut pas copier l'empreinte. Toute tentative de vérification dévoile l'imitation en quelques secondes.",
  },
  {
    q: "Mon iPhone est-il compatible ?",
    a: "Oui. Tous les iPhone et Android récents reconnaissent nos pièces. Aucune application à installer.",
  },
];

export default function AuthenticitePage() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Texture marbre en fond */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/hero.jpg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-[#B8985A] rounded-full" />
              <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A]">
                Le système Northstone
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8">
              L&apos;AUTHENTICITÉ
              <br />
              <span className="text-white/40">N&apos;EST PAS</span>
              <br />
              UNE PROMESSE.
            </h1>

            <div className="w-24 h-px bg-[#B8985A] mx-auto mb-8" />

            <p className="text-base sm:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              C&apos;est une preuve mathématique.
            </p>
          </FadeIn>

          {/* Flèche scroll en bas */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.5"
              aria-hidden="true"
            >
              <line x1="12" y1="4" x2="12" y2="20" />
              <polyline points="6 14 12 20 18 14" />
            </svg>
          </div>
        </div>
      </section>

      {/* SECTION LES 3 PILIERS */}
      <section className="bg-[#F5F1EA] py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">
                La triangulation
              </p>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1A2332] leading-[0.95]">
                TROIS PILIERS.
                <br />
                <span className="text-[#1A2332]/40">UNE SEULE VÉRITÉ.</span>
              </h2>
              <div className="w-16 h-px bg-[#B8985A] mx-auto mt-8" />
              <p className="text-base text-[#1A2332]/70 max-w-2xl mx-auto mt-8 leading-relaxed">
                Chaque pièce Northstone repose sur trois éléments uniques.
                Ensemble, ils rendent la contrefaçon mathématiquement
                impossible.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pillars.map((pillar, index) => (
              <FadeIn key={pillar.number} delay={index * 150} direction="up">
                <div className="relative bg-[#0A0A0A] text-white aspect-[3/4] p-8 md:p-10 flex flex-col justify-between group hover:bg-[#1A2332] transition-colors duration-500">
                  {/* Numéro énorme en haut */}
                  <div className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#B8985A]">
                    {pillar.number}
                  </div>

                  {/* Contenu en bas */}
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A]/60 mb-2">
                      {pillar.subtitle}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase mb-4">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION LE PARCOURS */}
      <section className="bg-[#0A0A0A] text-white py-20 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">
                Le parcours
              </p>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]">
                DE LA RÉCEPTION
                <br />
                <span className="text-white/40">À LA TRANSMISSION.</span>
              </h2>
              <div className="w-16 h-px bg-[#B8985A] mx-auto mt-8" />
            </div>
          </FadeIn>

          <div className="space-y-8 md:space-y-12">
            {journey.map((item, index) => (
              <FadeIn key={item.step} delay={index * 100} direction="up">
                <div className="grid grid-cols-12 gap-4 md:gap-8 items-start py-6 md:py-8 border-b border-white/10">
                  {/* Numéro */}
                  <div className="col-span-2 md:col-span-1">
                    <div className="text-2xl sm:text-3xl font-black text-[#B8985A]">
                      {item.step}
                    </div>
                  </div>

                  {/* Titre */}
                  <div className="col-span-10 md:col-span-3">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="col-span-12 md:col-span-8">
                    <p className="text-base text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION POURQUOI INFALSIFIABLE */}
      <section className="relative bg-[#EFE9DC] py-20 md:py-32 px-6 overflow-hidden">
        {/* Texture marbre subtile */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "url('/hero.jpg')" }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">
                Pourquoi c&apos;est infalsifiable
              </p>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1A2332] leading-[0.95]">
                LA CONTREFAÇON
                <br />
                <span className="text-[#1A2332]/40">N&apos;A PAS DE LIEU ICI.</span>
              </h2>
              <div className="w-16 h-px bg-[#B8985A] mx-auto mt-8" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {guarantees.map((guarantee, index) => (
              <FadeIn key={guarantee.title} delay={index * 150} direction="up">
                <div className="text-center">
                  {/* Icône bouclier */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#B8985A]/30 mb-6">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#B8985A"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#1A2332] uppercase mb-4">
                    {guarantee.title}
                  </h3>
                  <p className="text-base text-[#1A2332]/70 leading-relaxed max-w-sm mx-auto">
                    {guarantee.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION CITATION / PHILOSOPHIE */}
      <section className="bg-[#1A2332] text-white py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="#B8985A"
              className="mx-auto mb-8"
              aria-hidden="true"
            >
              <path d="M0 24V12c0-6.6 5.4-12 12-12v6c-3.3 0-6 2.7-6 6h6v12H0zm20 0V12c0-6.6 5.4-12 12-12v6c-3.3 0-6 2.7-6 6h6v12H20z" />
            </svg>

            <p className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-8">
              Nous ne vendons pas des vêtements.
              <br />
              <span className="text-white/40">
                Nous vendons des actifs certifiés.
              </span>
            </p>

            <div className="w-16 h-px bg-[#B8985A] mx-auto" />
          </FadeIn>
        </div>
      </section>

      {/* SECTION FAQ */}
      <section className="bg-[#F5F1EA] py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">
                Questions fréquentes
              </p>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1A2332] leading-[0.95]">
                LES RÉPONSES
                <br />
                <span className="text-[#1A2332]/40">SANS DÉTOUR.</span>
              </h2>
              <div className="w-16 h-px bg-[#B8985A] mx-auto mt-8" />
            </div>
          </FadeIn>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <FadeIn key={faq.q} delay={index * 100} direction="up">
                <div className="border-b border-[#1A2332]/10 pb-6">
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-[#1A2332] mb-3 uppercase">
                    {faq.q}
                  </h3>
                  <p className="text-base text-[#1A2332]/70 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION CTA FINAL */}
      <section className="bg-[#0A0A0A] text-white py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-6">
              Découvrez le drop 01
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] mb-8">
              UNE PIÈCE.
              <br />
              <span className="text-white/40">UNE EMPREINTE.</span>
              <br />
              UN HÉRITAGE.
            </h2>
            <div className="w-16 h-px bg-[#B8985A] mx-auto mb-10" />

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/drops"
                className="px-8 py-4 bg-[#B8985A] text-[#0A0A0A] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#D4B574] transition-colors text-center"
              >
                Voir le drop
              </Link>
              <Link
                href="/"
                className="px-8 py-4 border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:border-white hover:bg-white/5 transition-all text-center"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}