import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SignInPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-[#F5F1EA] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">

          {/* HEADER COMPACT */}
          <div className="text-center mb-6">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-2 font-medium">
              Maison Northstone
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332] leading-[0.9] mb-3">
              CONNEXION
            </h1>
            <div className="w-10 h-px bg-[#B8985A] mx-auto" />
          </div>

          {/* FORMULAIRE */}
          <SignIn
            path="/sign-in"
            signUpUrl="/sign-up"
            forceRedirectUrl="/compte"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-0 p-0 mx-0 w-full",
                header: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-[#1A2332]/20 hover:border-[#B8985A] hover:bg-[#B8985A]/5 text-[#1A2332] py-3 transition-all normal-case text-sm font-medium rounded-none",
                socialButtonsBlockButtonText: "text-sm font-medium",
                dividerLine: "bg-[#1A2332]/15",
                dividerText: "text-[10px] tracking-[0.3em] uppercase text-[#1A2332]/50",
                formFieldLabel:
                  "text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/80 font-semibold mb-1.5",
                formFieldInput:
                  "bg-transparent border-0 border-b border-[#1A2332]/25 rounded-none px-1 py-2.5 text-sm text-[#1A2332] focus:border-[#B8985A] focus:ring-0 focus:outline-none",
                formButtonPrimary:
                  "bg-black hover:bg-[#1F1F1F] text-[#B8985A] text-[11px] tracking-[0.3em] uppercase font-semibold py-3.5 rounded-none shadow-none normal-case mt-3 transition-colors",
                footer: "hidden",
                footerAction: "hidden",
                formFieldAction: "text-[#B8985A] hover:text-[#1F1F1F] text-xs",
                identityPreviewEditButton: "text-[#B8985A] hover:text-[#1F1F1F]",
                formResendCodeLink: "text-[#B8985A] hover:text-[#1F1F1F]",
                formFieldErrorText: "text-red-700 text-xs mt-1",
                alertText: "text-red-700 text-xs",
                formFieldInputShowPasswordButton: "text-[#1A2332]/60 hover:text-[#B8985A]",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
            }}
          />

          {/* Lien S'inscrire */}
          <div className="mt-5 pt-4 border-t border-[#1A2332]/10 text-center">
            <p className="text-xs text-[#1A2332]/65">
              Première visite ?{" "}
              <Link
                href="/sign-up"
                className="text-[#B8985A] hover:text-[#1F1F1F] font-semibold tracking-wide transition-colors"
              >
                Créer un compte
              </Link>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}