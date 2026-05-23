import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F5F1EA] text-[#0A0A0A]">
        {children}
      </body>
    </html>
  );
}