import Link from "next/link";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { supabase } from "@/lib/supabase";
import BoutonPrevenuDrop from "@/components/BoutonPrevenuDrop";
import DropAchat from "@/components/DropAchat";

export const metadata = {
  title: "Drops — Northstone",
  description:
    "Pièces numérotées en édition limitée. Authentification NFC. Cryptographiquement infalsifiables.",
};

export const dynamic = "force-dynamic";

type Lot = { amount: string; count: string };

type Drop = {
  id: string;
  name: string;
  sous_titre: string;
  titre_principal: string;
  description: string;
  release_date: string | null;
  total_pieces: number;
  total_winners: number;
  prix: number;
  tailles: string[];
  image_url: string;
  lots: Lot[];
  is_active: boolean;
  visible_accueil: boolean;
};

const FALLBACK = {
  sous_titre: "Drop 01 — La Genèse",
  titre_principal: "LA PIÈCE DE LA RAISON.",
  description: "400 pièces. 130 gagnants. Une seule chance.",
  release_date: "2026-11-15T18:00:00",
  total_pieces: 400,
  total_winners: 130,
  image_url: "/drop-01.jpg",
  lots: [
    { amount: "50€", count: "80 gagnants" },
    { amount: "100€", count: "30 gagnants" },
    { amount: "500€", count: "15 gagnants" },
    { amount: "1000€", count: "5 gagnants" },
  ] as Lot[],
};

const steps = [
  { number: "01", title: "Inscription", description: "Newsletter. Soyez prévenu·e du drop." },
  { number: "02", title: "Mini-jeu", description: "Quatre jours avant. Trouvez le code. Accédez à la pré-commande." },
  { number: "03", title: "Achat", description: "Jour J, 18h. Premier arrivé, premier servi." },
  { number: "04", title: "Enregistrement", description: "Scannez votre pièce. Activez votre compte. Entrez dans le tirage." },
  { number: "05", title: "Révélation", description: "Live Instagram avec huissier. Découverte publique des gagnants." },
  { number: "06", title: "Collection", description: "Pièce unique, jamais rééditée. Revente sécurisée." },
];

function formatDateExacte(iso: string): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    const heure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h");
    return `${date} à ${heure}`;
  } catch {
    return "";
  }
}

async function getDrop(): Promise<Drop | null> {
  const { data: actif } = await supabase
    .from("drops")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (actif) return actif as Drop;

  const { data: recent } = await supabase
    .from("drops")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (recent as Drop) || null;
}

export default async function DropsPage() {
  const drop = await getDrop();

  const sousTitre = drop?.sous_titre || FALLBACK.sous_titre;
  const titrePrincipal = drop?.titre_principal || FALLBACK.titre_principal;
  const description = drop?.description || FALLBACK.description;
  const dateOuverture = drop?.release_date || FALLBACK.release_date;
  const nbPieces = drop?.total_pieces || FALLBACK.total_pieces;
  const nbGagnants = drop?.total_winners || FALLBACK.total_winners;
  const imageUrl = drop?.image_url || FALLBACK.image_url;
  const lots = (drop?.lots && Array.isArray(drop.lots) && drop.lots.length > 0) ? drop.lots : FALLBACK.lots;
  const nomCourt = drop?.name || "Drop 01";
  const estActif = drop?.is_active ?? true;

  const motsTitre = titrePrincipal.trim().split(" ");
  const ligne2 = motsTitre.length > 1 ? motsTitre.slice(-2).join(" ") : "";
  const ligne1 = motsTitre.length > 1 ? motsTitre.slice(0, -2).join(" ") : titrePrincipal;

  return (
    <>
      <Header />
      <AnnouncementBar />

      <div dangerouslySetInnerHTML={{ __html: "<!-- eclat I : NORD -->" }} />

      {/* HERO */}
      <section className="relative bg-[#0A0A0A] text-white flex items-center px-4 sm:px-6 py-6 sm:py-10 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-16 items-stretch lg:items-center">
            <FadeIn direction="left" duration={900} className="h-full">
              <div className="relative w-full h-full overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${imageUrl}')` }} aria-hidden="true" />
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#B8985A] text-[#0A0A0A] px-2 py-1 sm:px-4 sm:py-2 text-[7px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-semibold">
                  {nomCourt}
                </div>
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-white text-[7px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase bg-black/50 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1">
                  001 / {nbPieces}
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" duration={900} className="h-full">
              <div className="flex flex-col justify-center h-full">
                <div className="inline-flex items-center gap-2 mb-3 sm:mb-6">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#B8985A] rounded-full animate-pulse" />
                  <span className="text-[7px] sm:text-xs tracking-[0.2em] sm:tracking-[0.4em] uppercase text-[#B8985A]">
                    {sousTitre}
                  </span>
                </div>

                <h1 className="text-xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-3 sm:mb-6">
                  {ligne1}
                  {ligne2 && (
                    <>
                      <br />
                      <span className="text-white/40">{ligne2}</span>
                    </>
                  )}
                </h1>

                <p className="text-[10px] sm:text-base text-white/70 leading-snug sm:leading-relaxed mb-3 sm:mb-8 max-w-lg">
                  {description}
                </p>

                {estActif ? (
                  <DropAchat
                    dateOuverture={dateOuverture}
                    dateExacte={formatDateExacte(dateOuverture)}
                  />
                ) : (
                  <>
                    <div className="mb-3 sm:mb-8 lg:mb-10">
                      <div className="inline-block border border-white/30 px-4 py-2 sm:px-6 sm:py-3">
                        <span className="text-[9px] sm:text-sm tracking-[0.3em] uppercase text-white/70 font-semibold">
                          Drop terminé
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-sm text-white/50 mt-3 sm:mt-4 max-w-md">
                        Ce drop n'est plus disponible. Inscrivez-vous pour être prévenu·e du prochain.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3">
                      <BoutonPrevenuDrop />
                    </div>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECTION COMMENT ÇA MARCHE */}
      <section id="comment" className="bg-[#F5F1EA] py-12 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="up">
            <div className="text-center mb-8 md:mb-20">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">Le parcours</p>
              <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1A2332] leading-[0.95]">
                COMMENT
                <br />
                <span className="text-[#1A2332]/40">ÇA MARCHE ?</span>
              </h2>
              <div className="w-16 h-px bg-[#B8985A] mx-auto mt-8" />
            </div>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-px bg-[#B8985A]/20" aria-hidden="true" />
            <div className="flex flex-col">
              {steps.map((step, index) => (
                <FadeIn key={step.number} delay={index * 100} direction="up">
                  <div className="flex flex-row gap-4 sm:gap-10 items-start py-5 md:py-8 min-h-[80px] sm:min-h-[120px]">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-[#0A0A0A] flex items-center justify-center relative z-10">
                        <span className="text-white font-black text-sm sm:text-2xl tracking-tight">{step.number}</span>
                      </div>
                    </div>
                    <div className="flex-1 pt-1 sm:pt-4">
                      <h3 className="text-lg sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1A2332] mb-1 sm:mb-3 uppercase">{step.title}</h3>
                      <p className="text-sm sm:text-lg text-[#1A2332]/70 leading-relaxed max-w-xl">{step.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION À GAGNER */}
      <section className="bg-[#0A0A0A] text-white py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up">
            <div className="text-center mb-12 md:mb-20">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">Les gains</p>
              <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]">
                {nbGagnants} GAGNANTS
                <br />
                <span className="text-white/40">SUR {nbPieces} PIÈCES.</span>
              </h2>
              <div className="w-16 h-px bg-[#B8985A] mx-auto mt-8 mb-6" />
              <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto">Tirage au sort. Révélation au scan.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {lots.map((prize, index) => (
              <FadeIn key={index} delay={index * 100} direction="up">
                <div className="border border-white/10 p-6 md:p-8 text-center hover:border-[#B8985A] transition-colors">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#B8985A] mb-3">{prize.amount}</div>
                  <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/60">{prize.count}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <p className="text-[10px] text-white/40 text-center mt-12 max-w-2xl mx-auto leading-relaxed">
            Tirage certifié par huissier. Règlement sur demande.
          </p>
        </div>
      </section>

      {/* SECTION AUTHENTIFICATION */}
      <section className="relative bg-[#EFE9DC] py-20 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.04] pointer-events-none" style={{ backgroundImage: "url('/hero.jpg')" }} aria-hidden="true" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn direction="right">
              <div>
                <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">Authenticité</p>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A2332] leading-[0.95] mb-6">
                  CHAQUE PIÈCE,
                  <br />
                  <span className="text-[#1A2332]/40">UNE EMPREINTE.</span>
                </h2>
                <div className="w-16 h-px bg-[#B8985A] mb-8" />
                <p className="text-base text-[#1A2332]/70 leading-relaxed mb-8 max-w-lg">
                  Numéro brodé. Certificat unique. Authentification cryptographique.
                  <br />
                  <br />
                  Chaque pièce Northstone est mathématiquement infalsifiable.
                </p>
                <Link href="/authenticite" className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-semibold text-[#1A2332] border-b border-[#1A2332] pb-1 hover:gap-5 hover:text-[#B8985A] hover:border-[#B8985A] transition-all duration-300">
                  Découvrir le système
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <line x1="0" y1="6" x2="14" y2="6" />
                    <polyline points="10 2 14 6 10 10" />
                  </svg>
                </Link>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {[
                  { num: "01", label: "Numéro" },
                  { num: "02", label: "Carte" },
                  { num: "03", label: "Puce" },
                ].map((item) => (
                  <div key={item.num} className="aspect-square bg-[#1A2332] flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-black text-[#B8985A] mb-1">{item.num}</div>
                      <div className="text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-white/60">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECTION REVENTE */}
      <section className="bg-[#F5F1EA] py-20 md:py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn direction="up">
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">Marché secondaire</p>
            <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1A2332] leading-[0.95] mb-6">
              UN OBJET QUI
              <br />
              <span className="text-[#1A2332]/40">PREND DE LA VALEUR.</span>
            </h2>
            <div className="w-16 h-px bg-[#B8985A] mx-auto mb-8" />
            <p className="text-base sm:text-lg text-[#1A2332]/70 max-w-2xl mx-auto leading-relaxed mb-12">
              Jamais rééditées. Définitivement collection.
              <br />
              Revente sécurisée sur Northstone.
            </p>
          </FadeIn>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto pt-8 border-t border-[#1A2332]/10">
            {[
              { value: "100%", label: "Authentifié" },
              { value: "P2P", label: "Transfert" },
              { value: "∞", label: "Traçabilité" },
            ].map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 100} direction="up">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-[#1A2332]">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1A2332]/60 mt-2">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION ARCHIVE */}
      <section className="bg-[#EFE9DC] py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-4">Les drops passés</p>
              <h2 className="text-2xl sm:text-5xl font-black tracking-tight text-[#1A2332] leading-[0.95]">
                LA MÉMOIRE
                <br />
                <span className="text-[#1A2332]/40">DE LA MAISON.</span>
              </h2>
              <div className="w-16 h-px bg-[#B8985A] mx-auto mt-8" />
            </div>
          </FadeIn>

          <FadeIn direction="up">
            <div className="text-center text-[#1A2332]/40 text-sm py-20 border-2 border-dashed border-[#1A2332]/10 max-w-2xl mx-auto">
              <p className="mb-2">Aucune archive.</p>
              <p>Le premier drop arrive.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}