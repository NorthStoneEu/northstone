import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Northstone — Maison française · Éditions limitées",
  description:
    "Northstone est une maison française de vêtements brodés en éditions limitées. Chaque pièce est authentifiée par certificat numérique unique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={{
        ...frFR,
        signIn: {
          ...frFR.signIn,
          start: {
            ...frFR.signIn?.start,
            actionText: "Première visite ?",
            actionLink: "Créer un compte",
          },
        },
        signUp: {
          ...frFR.signUp,
          start: {
            ...frFR.signUp?.start,
            actionText: "Déjà un compte ?",
            actionLink: "Se connecter",
          },
        },
        formButtonPrimary: "Continuer",
      }}
      appearance={{
        variables: {
          colorPrimary: "#B8985A",
          colorBackground: "#F5F1EA",
          colorText: "#1A2332",
          colorInputBackground: "#FFFFFF",
          colorInputText: "#1A2332",
          fontFamily: "var(--font-inter)",
          borderRadius: "0px",
        },
        elements: {
          formButtonPrimary:
            "bg-black hover:bg-[#1F1F1F] text-[#B8985A] text-[11px] tracking-[0.3em] uppercase font-semibold py-3.5",
          card: "shadow-2xl border-t-2 border-[#B8985A]",
          headerTitle: "text-2xl font-black tracking-tight text-[#1A2332]",
          headerSubtitle: "text-xs text-[#1A2332]/70",
          socialButtonsBlockButton:
            "border border-[#1A2332]/20 hover:border-[#B8985A] text-[#1A2332]",
          formFieldLabel: "text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/80 font-semibold",
          footerActionLink: "text-[#B8985A] hover:text-[#1F1F1F]",
        },
      }}
    >
      <html lang="fr" className={`${inter.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col font-sans bg-[#F5F1EA] text-[#0A0A0A]">
          <ScrollToTop />
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}