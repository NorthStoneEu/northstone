import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getEarlyAccess } from "@/lib/earlyAccess";

export default async function PrecommandePage() {
  const { userId } = await auth();

  // 1. Pas connecté → connexion
  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Vérifier l'accès anticipé côté serveur
  const access = await getEarlyAccess(userId);

  // 3. Pas débloqué → renvoyer vers le mini-jeu
  if (!access || access.status !== "unlocked") {
    redirect("/mini-jeu");
  }

  // 4. Accès autorisé → afficher la pré-commande
  return (
    <>
      <Header />

      <main className="flex-1 bg-[#0A0A0A] text-white px-4 sm:px-6 py-16 relative overflow-hidden min-h-[80vh]">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(184,152,90,0.12), transparent 60%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Ornement or */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
            <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
            <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
          </div>

          <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-4 font-medium">
            Accès anticipé · Membre privilégié
          </p>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[0.95] mb-5">
            PRÉ-COMMANDE
            <br />
            <span className="text-white/35">LA GENÈSE.</span>
          </h1>

          <div className="w-12 h-px bg-[#B8985A] mx-auto mb-8" />

          <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-12 max-w-xl mx-auto">
            Vous faites partie des rares à avoir résolu l'énigme. Vous accédez à la pré-commande
            du <span className="text-[#B8985A]">Drop 01</span> en avant-première, avant l'ouverture
            publique.
          </p>

          {/* Bloc placeholder pour les pièces du drop */}
          <div className="bg-white/[0.03] border border-[#B8985A]/20 px-8 py-12 mb-10">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-3">
              Bientôt disponible
            </p>
            <p className="text-lg sm:text-xl font-black tracking-tight text-white mb-4">
              Les pièces seront révélées ici
            </p>
            <p className="text-xs text-white/50 leading-relaxed max-w-md mx-auto">
              400 pièces · 130 gagnants · Ouverture des ventes le 15 novembre 2026.
              <br />
              Votre accès est enregistré : vous pourrez commander dès l'ouverture.
            </p>
          </div>

          <Link
            href="/drops"
            className="inline-block px-10 py-4 border border-white/25 text-white text-[11px] tracking-[0.3em] uppercase font-semibold hover:border-[#B8985A] hover:text-[#B8985A] transition-all"
          >
            Découvrir le drop
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}