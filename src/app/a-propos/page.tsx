import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "Notre Maison — Northstone",
  description:
    "Northstone : la quête du meilleur savoir-faire mondial, des pièces d'exception en édition limitée, et une communauté récompensée.",
};

const savoirFaire = [
  { num: "01", specialite: "L'exigence d'abord", detail: "Pour chaque pièce, nous identifions le meilleur atelier au monde pour cette pièce précise." },
  { num: "02", specialite: "Sans frontières", detail: "Maille, tailoring, broderie : chaque savoir-faire a son berceau. Nous y allons, où qu'il soit." },
  { num: "03", specialite: "Aucun compromis", detail: "Jamais \"tout au même endroit\" pour réduire les coûts. La qualité dicte le lieu, pas l'inverse." },
];

const activation = [
  { num: "01", titre: "Scan unique", detail: "Le QR code de la carte n'est utilisable qu'une seule fois." },
  { num: "02", titre: "Activation au compte", detail: "La pièce est liée à votre espace personnel, à vie." },
  { num: "03", titre: "Transfert sécurisé", detail: "En cas de revente, la propriété passe au nouvel acquéreur." },
];

export default function AProposPage() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative bg-[#0A0A0A] text-white min-h-[70vh] flex items-center px-6 py-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(184,152,90,0.12), transparent 60%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span style={{ width: "24px", height: "1px", backgroundColor: "#B8985A" }} />
              <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
              <span style={{ width: "24px", height: "1px", backgroundColor: "#B8985A" }} />
            </div>
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-6">
              La Maison
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-8">
              LE MEILLEUR,
              <br />
              <span className="text-white/35">OÙ QU'IL SOIT.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              Northstone ne connaît pas de frontières. Nous cherchons l'excellence
              partout dans le monde, et nous la réunissons en pièces que l'on ne porte
              pas par hasard.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* MANIFESTE */}
      <section className="bg-[#F5F1EA] py-20 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-6">
              Notre vision
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A2332] leading-[1.05] mb-8">
              UNE PIÈCE QUI SE REMARQUE,
              <br />
              <span className="text-[#1A2332]/40">UNE QUALITÉ QUI SE RESSENT.</span>
            </h2>
            <div className="w-16 h-px bg-[#B8985A] mx-auto mb-8" />
            <p className="text-base sm:text-lg text-[#1A2332]/70 leading-relaxed">
              Nous créons pour ce moment précis : celui où l'on enfile une pièce et où
              l'on sait, immédiatement, qu'elle change tout. Le regard des autres, la
              tenue d'un tissu, la justesse d'une broderie. Northstone existe pour ce
              frisson-là — porter quelque chose d'exceptionnel, et le savoir.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SAVOIR-FAIRE MONDIAL */}
      <section className="bg-[#0A0A0A] text-white py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn direction="up">
            <div className="text-center mb-12 md:mb-20">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">
                Le savoir-faire
              </p>
              <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]">
                CHAQUE PIÈCE NAÎT
                <br />
                <span className="text-white/40">LÀ OÙ ELLE EST LA MEILLEURE.</span>
              </h2>
              <div className="w-16 h-px bg-[#B8985A] mx-auto mt-8 mb-6" />
              <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
                Nous refusons le compromis du "tout au même endroit". Un t-shirt n'a pas
                le même berceau qu'un pantalon. Nous allons chercher, pays par pays, la
                main la plus juste pour chaque vêtement.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savoirFaire.map((item, index) => (
              <FadeIn key={item.num} delay={index * 100} direction="up">
                <div className="border border-white/10 p-8 h-full hover:border-[#B8985A] transition-colors">
                  <div className="text-3xl font-black text-[#B8985A] mb-4">{item.num}</div>
                  <h3 className="text-xl font-black tracking-tight mb-3">{item.specialite}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{item.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="text-[10px] text-white/40 text-center mt-10 max-w-xl mx-auto leading-relaxed">
            Cette carte s'enrichit à chaque pièce. Notre seule règle : l'excellence, peu
            importe la frontière.
          </p>
        </div>
      </section>

      {/* LES DROPS */}
      <section className="bg-[#EFE9DC] py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-6">
              Les drops
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A2332] leading-[1.05] mb-8">
              DES PIÈCES RARES,
              <br />
              <span className="text-[#1A2332]/40">UNE COMMUNAUTÉ RÉCOMPENSÉE.</span>
            </h2>
            <div className="w-16 h-px bg-[#B8985A] mx-auto mb-8" />
            <p className="text-base text-[#1A2332]/70 leading-relaxed mb-12 max-w-2xl mx-auto">
              Une à deux fois par an, parfois plus, Northstone libère une collection en
              édition strictement limitée. Numérotées, jamais rééditées, ces pièces
              prennent de la valeur avec le temps. Et surtout : à chaque drop, une partie
              de notre communauté repart avec des gains — accessoires, récompenses, ou
              argent. Personne ne fait ça. Nous, si.
            </p>
          </FadeIn>

          <FadeIn direction="up">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto pt-8 border-t border-[#1A2332]/10">
              {[
                { value: "1—2", label: "Drops par an" },
                { value: "Limité", label: "Jamais réédité" },
                { value: "Gagnants", label: "À chaque drop" },
              ].map((stat, index) => (
                <FadeIn key={stat.label} delay={index * 100} direction="up">
                  <div>
                    <div className="text-2xl sm:text-4xl font-black text-[#1A2332]">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1A2332]/60 mt-2">
                      {stat.label}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* AUTHENTICITÉ */}
      <section className="bg-[#0A0A0A] text-white py-20 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">
                Activation & Propriété
              </p>
              <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]">
                UNE PIÈCE,
                <br />
                <span className="text-white/40">UN PROPRIÉTAIRE.</span>
              </h2>
              <div className="w-16 h-px bg-[#B8985A] mx-auto mt-8 mb-6" />
              <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
                Chaque pièce intègre une puce d'authentification et un numéro unique. Le
                QR code de votre carte n'est valable qu'une seule fois : il lie votre
                pièce à votre compte, à vie.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activation.map((item, index) => (
              <FadeIn key={item.num} delay={index * 100} direction="up">
                <div className="border border-white/10 p-8 h-full hover:border-[#B8985A] transition-colors">
                  <div className="text-3xl font-black text-[#B8985A] mb-4">{item.num}</div>
                  <h3 className="text-lg font-black tracking-tight mb-3">{item.titre}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{item.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <p className="text-[10px] text-white/40 text-center mt-10 max-w-xl mx-auto leading-relaxed">
            Triple vérification : puce sécurisée, numéro de série, et référence en base.
            La contrefaçon n'a aucune chance.
          </p>
        </div>
      </section>

      {/* LA PERMANENCE */}
      <section className="bg-[#F5F1EA] py-20 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-6">
              La collection permanente
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A2332] leading-[1.05] mb-8">
              LE LUXE AU QUOTIDIEN,
              <br />
              <span className="text-[#1A2332]/40">SANS ATTENDRE LE DROP.</span>
            </h2>
            <div className="w-16 h-px bg-[#B8985A] mx-auto mb-8" />
            <p className="text-base sm:text-lg text-[#1A2332]/70 leading-relaxed">
              En parallèle des drops, Northstone propose une collection permanente :
              les essentiels, disponibles toute l'année, avec la même exigence de
              qualité. Le meilleur des deux mondes — l'accessible du quotidien, et
              l'exception des éditions limitées.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CLÔTURE / CTA */}
      <section className="bg-[#0A0A0A] text-white py-24 md:py-32 px-6 text-center">
        <FadeIn direction="up">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[0.95] mb-8 max-w-3xl mx-auto">
            BIENVENUE
            <br />
            <span className="text-white/35">CHEZ NORTHSTONE.</span>
          </h2>
          <div className="w-12 h-px bg-[#B8985A] mx-auto mb-10" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/drops"
              className="px-10 py-4 bg-[#B8985A] text-[#0A0A0A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#C9A96B] transition-all"
            >
              Découvrir le drop
            </Link>
            <Link
              href="/homme"
              className="px-10 py-4 border border-white/25 text-white text-[11px] tracking-[0.3em] uppercase font-semibold hover:border-[#B8985A] hover:text-[#B8985A] transition-all"
            >
              La collection
            </Link>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </>
  );
}