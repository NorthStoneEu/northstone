"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

const categories = [
  {
    titre: "Commandes & Livraison",
    questions: [
      {
        q: "Quels sont les délais de livraison ?",
        a: "Vos commandes sont expédiées sous 3 à 7 jours ouvrés depuis la France. Comptez 5 à 10 jours pour l'Europe, et jusqu'à 10 à 20 jours pour le reste du monde.",
      },
      {
        q: "[REVOIR] Quels sont les frais de livraison ?",
        a: "La livraison est offerte dès 80€ en France, 100€ en Europe, et 200€ pour le reste du monde. En dessous de ces montants, les frais sont calculés selon la destination au moment du paiement.",
      },
      {
        q: "Livrez-vous à l'international ?",
        a: "Oui, nous livrons dans le monde entier. Les frais et délais sont calculés automatiquement selon votre pays au moment du paiement.",
      },
      {
        q: "Comment ma commande est-elle expédiée ?",
        a: "Les commandes standard sont expédiées en point relais ou à domicile. Les pièces de drop, numérotées et uniques, sont livrées avec remise contre signature. Une option express est disponible au moment de la commande.",
      },
      {
        q: "Comment suivre ma commande ?",
        a: "Suivez votre commande à tout moment depuis le tableau de bord de votre compte Northstone.",
      },
    ],
  },
  {
    titre: "Les Drops",
    questions: [
      {
        q: "Qu'est-ce qu'un drop Northstone ?",
        a: "Une collection en édition strictement limitée, numérotée et jamais rééditée. Chaque pièce est traçable via sa puce et tend à prendre de la valeur avec le temps — vous suivez son authenticité en temps réel depuis votre compte. Et à chaque drop, une partie de la communauté repart avec de belles récompenses.",
      },
      {
        q: "Comment accéder à un drop ?",
        a: "Inscrivez-vous à la newsletter pour être prévenu. L'accès anticipé peut être débloqué via nos épreuves exclusives. À l'ouverture publique, les pièces partent en premier arrivé, premier servi. Limité à une pièce par personne.",
      },
      {
        q: "[REVOIR] Comment fonctionne le système de gagnants ?",
        a: "Pour le premier drop, sur 400 pièces vendues, 130 personnes sont tirées au sort et reçoivent une récompense : accessoires uniques et traçables, ou gains en argent.",
      },
      {
        q: "[REVOIR] Qui réalise le tirage, et que se passe-t-il si je gagne ?",
        a: "Le tirage est réalisé par un huissier officiel — jamais par nous — et les gagnants sont révélés publiquement. Si vous gagnez, vous accédez gratuitement au tirage du drop suivant, sans rien acheter. Tant que vous gagnez, vous continuez gratuitement. Si vous ne gagnez pas, il suffit d'acquérir une nouvelle pièce pour retenter votre chance.",
      },
      {
        q: "Les pièces de drop sont-elles rééditées ?",
        a: "Jamais. Une fois le drop écoulé, les pièces ne sont plus jamais reproduites. C'est ce qui garantit leur rareté et leur valeur dans le temps.",
      },
    ],
  },
  {
    titre: "Authenticité & Puce",
    questions: [
      {
        q: "Qu'est-ce que la puce et comment fonctionne-t-elle ?",
        a: "Chaque pièce intègre une puce NFC NTAG 424 DNA, scellée dans l'étiquette tissée. Résistante au lavage, elle génère une signature non clonable et relie votre pièce à notre registre sécurisé. Avec le numéro brodé (001 à 400) et le QR code de votre carte, elle forme un système d'authentification infalsifiable.",
      },
      {
        q: "Comment activer ma pièce ?",
        a: "À la réception, votre pièce est accompagnée d'une carte avec un QR code à usage unique. Depuis la rubrique dédiée de votre compte Northstone, scannez ce QR code : votre pièce est alors liée à votre compte à vie, avec sa photo et son numéro. Le QR code se désactive ensuite définitivement.",
      },
      {
        q: "Comment vérifier que ma pièce est authentique ?",
        a: "Depuis votre compte, ouvrez votre pièce et lancez la vérification. Approchez votre téléphone de l'étiquette : notre système lit la puce et confirme en temps réel si la pièce est authentique et bien enregistrée dans nos registres.",
      },
      {
        q: "Faut-il télécharger une application ?",
        a: "Non. Tout se fait directement depuis le site, via votre compte. Aucune application à installer.",
      },
      {
        q: "Puis-je perdre mon certificat d'authenticité ?",
        a: "Non. Une fois votre pièce activée, elle est liée à votre compte à vie — votre téléphone et la puce suffisent à tout moment. Une carte physique est fournie, mais même en cas de perte, votre pièce reste enregistrée sur votre compte.",
      },
      {
        q: "Une pièce peut-elle être copiée ou contrefaite ?",
        a: "Non. Un imitateur peut copier le tissu et la broderie, mais pas reproduire la puce NFC ni la clé secrète liée à votre numéro de série. Trois facteurs doivent correspondre simultanément — toute vérification démasque une contrefaçon en quelques secondes.",
      },
    ],
  },
  {
    titre: "Retours & Revente",
    questions: [
      {
        q: "[REVOIR] Puis-je retourner ou échanger un article de la collection permanente ?",
        a: "Oui. Les pièces de la collection permanente sont retournables sous 14 jours, à condition de ne pas avoir été portées ni lavées, et de conserver leurs étiquettes. Vous avez le choix entre un échange ou un remboursement. En cas de défaut de fabrication (broderie, couture), la pièce est remplacée par une neuve.",
      },
      {
        q: "[REVOIR] Les pièces de drop sont-elles retournables ?",
        a: "Non, sauf en cas de problème : perte du QR code ou défaut de fabrication. La pièce est alors renvoyée pour qu'un nouveau certificat lui soit lié, ou pour être remplacée. Si une reproduction est nécessaire et prend du temps, un geste vous est offert pour votre patience.",
      },
      {
        q: "Comment revendre ma pièce ?",
        a: "Depuis votre compte, vous initiez un transfert sécurisé. L'acheteur scanne la puce, la propriété bascule sur son compte et quitte le vôtre. Sans intermédiaire, et avec les vérifications nécessaires pour éviter toute fraude.",
      },
      {
        q: "La revente est-elle garantie authentique pour l'acheteur ?",
        a: "Oui. Au transfert, la propriété passe sur le compte du nouvel acquéreur et quitte celui de l'ancien. L'acheteur dispose ainsi d'une pièce dont l'authenticité et la propriété sont vérifiables en temps réel.",
      },
      {
        q: "Que se passe-t-il si ma pièce est volée ?",
        a: "Sur présentation d'un dépôt de plainte, nous désactivons la puce de nos registres et vous reproduisons une pièce. La pièce volée devient alors une contrefaçon, inutilisable et invérifiable.",
      },
    ],
  },
];

function Question({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1A2332]/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        style={{ background: "none", cursor: "pointer" }}
      >
        <span className="text-sm sm:text-base font-semibold text-[#1A2332]">
          {q.startsWith("[REVOIR]") && (
            <span className="text-red-600 font-black mr-2">[REVOIR]</span>
          )}
          {q.replace("[REVOIR]", "").trim()}
        </span>
        <span
          className="text-[#B8985A] text-xl flex-shrink-0 transition-transform"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      {open && (
        <p className="text-sm text-[#1A2332]/70 leading-relaxed pb-5 pr-8">{a}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
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
              Questions fréquentes
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[0.95] mb-4">
              TOUT CE QU'IL FAUT
              <br />
              <span className="text-white/35">SAVOIR.</span>
            </h1>
            <div className="w-12 h-px bg-[#B8985A] mx-auto" />
          </FadeIn>
        </div>
      </section>

      {/* CONTENU */}
      <main className="bg-[#F5F1EA] px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          {categories.map((cat) => (
            <FadeIn key={cat.titre} direction="up">
              <div>
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] mb-2">
                  {cat.titre}
                </h2>
                <div className="w-8 h-px bg-[#B8985A] mb-2" />
                <div>
                  {cat.questions.map((item) => (
                    <Question key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Renvoi vers contact */}
          <FadeIn direction="up">
            <div className="text-center pt-8">
              <p className="text-sm text-[#1A2332]/60 mb-4">
                Vous ne trouvez pas votre réponse ?
              </p>
              <button onClick={() => { window.location.href = "/contact"; }} className="inline-block px-10 py-4 bg-black text-[#B8985A] border border-black text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all" style={{ cursor: "pointer" }}>Nous contacter</button>
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </>
  );
}