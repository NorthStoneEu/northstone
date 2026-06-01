import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "Savoir-faire — Northstone",
  description:
    "Le processus Northstone : sélection des meilleurs ateliers, matières d'exception, broderie de précision et contrôle qualité absolu.",
};

const etapes = [
  {
    num: "01",
    titre: "La matière",
    texte:
      "Tout commence par le choix de la matière. Nous sélectionnons des étoffes nobles, durables, agréables à porter — sans compromis sur la qualité.",
  },
  {
    num: "02",
    titre: "L'atelier",
    texte:
      "Pour chaque pièce, nous identifions l'atelier le plus juste — celui dont le savoir-faire est le meilleur pour ce vêtement précis, où qu'il soit dans le monde.",
  },
  {
    num: "03",
    titre: "La broderie",
    texte:
      "La broderie est notre signature. Réalisée avec une précision absolue, elle distingue chaque pièce et porte l'identité de la Maison.",
  },
  {
    num: "04",
    titre: "Le contrôle",
    texte:
      "Chaque pièce est vérifiée avant l'envoi. Une broderie imparfaite, une couture fragile : la pièce est écartée. Seul l'irréprochable porte le nom Northstone.",
  },
  {
    num: "05",
    titre: "L'authentification",
    texte:
      "Avant l'expédition, chaque pièce reçoit sa puce NFC et son numéro. Elle devient unique, traçable et infalsifiable — prête à vous rejoindre.",
  },
];

export default function SavoirFairePage() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative bg-[#0A0A0A] text-white px-6 pt-12 pb-12 md:pt-14 md:pb-14 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(184,152,90,0.12), transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">
              L'exigence
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[0.95] mb-4">
              NOTRE
              <br />
              <span className="text-white/35">SAVOIR-FAIRE.</span>
            </h1>
            <div className="w-12 h-px bg-[#B8985A] mx-auto" />
          </FadeIn>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-[#F5F1EA] pt-16 md:pt-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn direction="up">
            <p className="text-base sm:text-lg text-[#1A2332]/70 leading-relaxed">
              Une pièce Northstone ne naît pas par hasard. Du choix de la matière
              à la dernière vérification, chaque étape obéit à une seule règle :
              l'excellence, sans compromis.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* LES ÉTAPES */}
      <main className="bg-[#F5F1EA] px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div
              className="absolute left-5 sm:left-7 top-0 bottom-0 w-px bg-[#B8985A]/20"
              aria-hidden="true"
            />
            <div className="space-y-10">
              {etapes.map((etape, index) => (
                <FadeIn key={etape.num} delay={index * 100} direction="up">
                  <div className="flex gap-5 sm:gap-8 items-start">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#0A0A0A] flex items-center justify-center relative z-10">
                        <span className="text-[#B8985A] font-black text-xs sm:text-base">
                          {etape.num}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 pt-1 sm:pt-3">
                      <h3 className="text-base sm:text-lg font-black tracking-tight text-[#1A2332] uppercase mb-2">
                        {etape.titre}
                      </h3>
                      <p className="text-sm text-[#1A2332]/70 leading-relaxed">
                        {etape.texte}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* CITATION */}
      <section className="bg-[#1A2332] text-white py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight mb-6">
              Le meilleur, où qu'il soit.
              <br />
              <span className="text-white/40">C'est notre seule frontière.</span>
            </p>
            <div className="w-12 h-px bg-[#B8985A] mx-auto" />
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A0A0A] text-white py-16 md:py-24 px-6 text-center">
        <FadeIn direction="up">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/authenticite" className="px-10 py-4 bg-[#B8985A] text-[#0A0A0A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#C9A96B] transition-all">L'authenticité</Link>
            <Link href="/homme" className="px-10 py-4 border border-white/25 text-white text-[11px] tracking-[0.3em] uppercase font-semibold hover:border-[#B8985A] hover:text-[#B8985A] transition-all">La collection</Link>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </>
  );
}