import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ViderPanierApresPaiement from "@/components/ViderPanierApresPaiement";

export const metadata = {
  title: "Commande confirmée — Northstone",
};

export default function CommandeSuccesPage() {
  return (
    <>
      <Header />
      <ViderPanierApresPaiement />

      <section className="bg-[#F5F1EA] px-6 py-24 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
            <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
            <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
          </div>

          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(184, 152, 90, 0.1)", border: "1px solid #B8985A" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B8985A" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-4 font-medium">
            Commande confirmée
          </p>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A2332] leading-[0.9] mb-5">
            MERCI POUR
            <br />
            <span className="text-[#1A2332]/35">VOTRE CONFIANCE.</span>
          </h1>

          <div className="w-12 h-px bg-[#B8985A] mx-auto mb-5" />

          <p className="text-sm text-[#1A2332]/70 leading-relaxed mb-8">
            Votre paiement a bien été reçu. Vous recevrez un email de confirmation avec le récapitulatif de votre commande.
          </p>

          <Link
            href="/"
            className="inline-block px-10 py-3.5 bg-black text-[#B8985A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}