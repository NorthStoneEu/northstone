"use client";

import Link from "next/link";

const sections = [
  { titre: "Produits", desc: "Gérer la collection permanente", href: "/admin/produits", actif: true },
  { titre: "Drops", desc: "Créer et gérer les drops", href: "/admin/drops", actif: false },
  { titre: "Commandes", desc: "Suivre les commandes", href: "/admin/commandes", actif: false },
  { titre: "Authentification", desc: "Pièces et puces NFC", href: "/admin/authentification", actif: false },
];

export default function AdminDashboard({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-[#F5F1EA]">
      {/* Barre admin */}
      <header className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black tracking-[0.2em]">NORTHSTONE</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] border border-[#B8985A]/40 px-2 py-0.5">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/50 hidden sm:block">{email}</span>
          <Link href="/" className="text-xs text-white/70 hover:text-white transition-colors">
            ← Retour au site
          </Link>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332] mb-2">
          Tableau de bord
        </h1>
        <p className="text-sm text-[#1A2332]/60 mb-10">
          Gérez votre boutique Northstone.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sections.map((s) => (
            s.actif ? (
              <Link
                key={s.titre}
                href={s.href}
                className="block bg-white border border-[#1A2332]/10 p-6 hover:border-[#B8985A] hover:shadow-md transition-all"
              >
                <h2 className="text-lg font-black tracking-tight text-[#1A2332] mb-1">{s.titre}</h2>
                <p className="text-sm text-[#1A2332]/60">{s.desc}</p>
              </Link>
            ) : (
              <div
                key={s.titre}
                className="block bg-white/50 border border-[#1A2332]/10 p-6 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-black tracking-tight text-[#1A2332]">{s.titre}</h2>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#1A2332]/40 border border-[#1A2332]/20 px-2 py-0.5">
                    Bientôt
                  </span>
                </div>
                <p className="text-sm text-[#1A2332]/60">{s.desc}</p>
              </div>
            )
          ))}
        </div>
      </main>
    </div>
  );
}