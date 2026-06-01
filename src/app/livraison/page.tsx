import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "Livraison & Retours — Northstone",
  description:
    "Délais, frais de livraison, expédition sécurisée des drops, et conditions de retour des pièces Northstone.",
};

const livraison = [
  {
    titre: "Délais d'expédition",
    texte:
      "Vos commandes sont expédiées sous 3 à 7 jours ouvrés depuis la France. Comptez 5 à 10 jours pour l'Europe, et jusqu'à 10 à 20 jours pour le reste du monde.",
  },
  {
    titre: "Frais de livraison",
    texte:
      "La livraison est offerte dès 80€ en France, 100€ en Europe, et 200€ pour le reste du monde. En dessous de ces montants, les frais sont calculés selon la destination au moment du paiement.",
  },
  {
    titre: "Expédition des pièces de drop",
    texte:
      "Les pièces de drop, numérotées et uniques, sont expédiées avec remise contre signature pour garantir leur bonne réception. Une option express est disponible au moment de la commande.",
  },
  {
    titre: "Suivi de commande",
    texte:
      "Suivez votre commande à tout moment depuis le tableau de bord de votre compte Northstone.",
  },
];

const retours = [
  {
    titre: "Collection permanente",
    texte:
      "Les pièces de la collection permanente sont retournables sous 14 jours, à condition de ne pas avoir été portées ni lavées, et de conserver leurs étiquettes. Vous avez le choix entre un échange ou un remboursement.",
  },
  {
    titre: "Défaut de fabrication",
    texte:
      "En cas de défaut (broderie, couture), la pièce est remplacée par une neuve. Aucune réparation : nous reproduisons ou renvoyons au fabricant.",
  },
  {
    titre: "Pièces de drop",
    texte:
      "Les pièces de drop ne sont pas retournables, sauf en cas de problème : perte du QR code ou défaut de fabrication. La pièce est alors renvoyée pour qu'un nouveau certificat lui soit lié, ou pour être remplacée. Si une reproduction prend du temps, un geste vous est offert pour votre patience.",
  },
  {
    titre: "En cas de vol",
    texte:
      "Sur présentation d'un dépôt de plainte, nous désactivons la puce de nos registres et vous reproduisons une pièce. La pièce volée devient alors une contrefaçon, inutilisable et invérifiable.",
  },
];

export default function LivraisonPage() {
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
              Informations
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[0.95] mb-4">
              LIVRAISON
              <br />
              <span className="text-white/35">& RETOURS.</span>
            </h1>
            <div className="w-12 h-px bg-[#B8985A] mx-auto" />
          </FadeIn>
        </div>
      </section>

      {/* CONTENU */}
      <main className="bg-[#F5F1EA] px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* LIVRAISON */}
          <FadeIn direction="up">
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#1A2332] uppercase mb-6">
                Livraison
              </h2>
              <div className="space-y-6">
                {livraison.map((item) => (
                  <div key={item.titre} className="border-l-2 border-[#B8985A] pl-5">
                    <h3 className="text-sm font-semibold text-[#1A2332] mb-1">
                      {item.titre}
                    </h3>
                    <p className="text-sm text-[#1A2332]/70 leading-relaxed">
                      {item.texte}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* RETOURS */}
          <FadeIn direction="up">
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#1A2332] uppercase mb-6">
                Retours & Échanges
              </h2>
              <div className="space-y-6">
                {retours.map((item) => (
                  <div key={item.titre} className="border-l-2 border-[#B8985A] pl-5">
                    <h3 className="text-sm font-semibold text-[#1A2332] mb-1">
                      {item.titre}
                    </h3>
                    <p className="text-sm text-[#1A2332]/70 leading-relaxed">
                      {item.texte}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* CONTACT */}
          <FadeIn direction="up">
            <div className="text-center pt-4">
              <p className="text-sm text-[#1A2332]/60 mb-4">
                Une question sur votre commande ?
              </p>
              <Link href="/contact" className="inline-block px-10 py-4 bg-black text-[#B8985A] border border-black text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all">Nous contacter</Link>
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </>
  );
}