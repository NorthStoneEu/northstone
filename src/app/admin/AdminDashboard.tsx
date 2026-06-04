"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Product = {
  id: number;
  gender: string;
  price: number;
  stock_by_size: Record<string, number>;
};

export default function AdminDashboard({
  email,
  peutGererAdmins = false,
  estOwner = false,
}: {
  email: string;
  peutGererAdmins?: boolean;
  estOwner?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sections du back-office (certaines cartes sont conditionnelles)
  const sections = [
    { titre: "Produits", desc: "Gérer la collection permanente", href: "/admin/produits", actif: true, icone: "M3 7l1.5 12h15L21 7M3 7l3-4h12l3 4M3 7h18M9 11v4M15 11v4" },
    { titre: "Drops", desc: "Créer et gérer les drops", href: "/admin/drops", actif: false, icone: "M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" },
    { titre: "Commandes", desc: "Suivre les commandes", href: "/admin/commandes", actif: false, icone: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" },
    { titre: "Authentification", desc: "Pièces et puces NFC", href: "/admin/authentification", actif: false, icone: "M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" },
    ...(peutGererAdmins
      ? [{ titre: "Gestion des accès", desc: "Collaborateurs et permissions", href: "/admin/administrateurs", actif: true, icone: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" }]
      : []),
    ...(estOwner
      ? [{ titre: "Journal d'activité", desc: "Historique des actions admin", href: "/admin/journal", actif: true, icone: "M12 8v4l3 3M3.05 11a9 9 0 1 1 .5 4M3 4v5h5" }]
      : []),
  ];

  useEffect(() => {
    fetch("/api/admin/produits", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Calculs des statistiques
  const stockTotal = (p: Product) =>
    Object.values(p.stock_by_size || {}).reduce((sum, q) => sum + (Number(q) || 0), 0);

  const total = products.length;
  const nbHomme = products.filter((p) => p.gender === "homme").length;
  const nbFemme = products.filter((p) => p.gender === "femme").length;
  const enRupture = products.filter((p) => stockTotal(p) === 0).length;
  const stockFaible = products.filter((p) => {
    const s = stockTotal(p);
    return s > 0 && s <= 5;
  }).length;
  const valeurStock = products.reduce(
    (sum, p) => sum + p.price * stockTotal(p),
    0
  );
  const articlesTotal = products.reduce((sum, p) => sum + stockTotal(p), 0);

  const stats = [
    {
      label: "Produits",
      valeur: total,
      detail: `${nbHomme} homme · ${nbFemme} femme`,
      couleur: "text-[#1A2332]",
    },
    {
      label: "En rupture",
      valeur: enRupture,
      detail: enRupture > 0 ? "à réapprovisionner" : "tout est en stock",
      couleur: enRupture > 0 ? "text-red-600" : "text-green-600",
    },
    {
      label: "Stock faible",
      valeur: stockFaible,
      detail: "5 articles ou moins",
      couleur: stockFaible > 0 ? "text-[#B8985A]" : "text-[#1A2332]",
    },
    {
      label: "Valeur du stock",
      valeur: `${valeurStock.toLocaleString("fr-FR")} €`,
      detail: `${articlesTotal} article(s) en stock`,
      couleur: "text-[#1A2332]",
    },
  ];

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
        <div className="mb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#1A2332]/40 mb-2">
            Tableau de bord
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A2332]">
            Bonjour
          </h1>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-[#1A2332]/10 border-t-2 border-t-[#B8985A] p-5"
            >
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#1A2332]/45 mb-3">
                {stat.label}
              </p>
              <p className={`text-3xl font-black tracking-tight leading-none ${stat.couleur}`}>
                {loading ? "—" : stat.valeur}
              </p>
              <p className="text-[11px] text-[#1A2332]/45 mt-2">
                {loading ? "Chargement..." : stat.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#1A2332]/45 font-semibold mb-5">
          Gestion
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sections.map((s, i) => {
            const numero = String(i + 1).padStart(2, "0");
            const contenu = (
              <>
                <span className="absolute top-4 right-5 text-6xl font-black leading-none text-[#B8985A]/15 select-none">
                  {numero}
                </span>
                <svg
                  width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="#B8985A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d={s.icone} />
                </svg>
                <div className="flex items-center gap-2 mt-4">
                  <h3 className="text-lg font-black tracking-tight text-[#1A2332]">{s.titre}</h3>
                  {!s.actif && (
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#1A2332]/40 border border-[#1A2332]/20 px-2 py-0.5">
                      Bientôt
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#1A2332]/55 mt-1">{s.desc}</p>
              </>
            );

            return s.actif ? (
              <Link
                key={s.titre}
                href={s.href}
                className="relative block bg-white border border-[#1A2332]/10 p-6 hover:border-[#B8985A] hover:shadow-md transition-all overflow-hidden"
              >
                {contenu}
              </Link>
            ) : (
              <div
                key={s.titre}
                className="relative block bg-white/50 border border-[#1A2332]/10 p-6 opacity-60 cursor-not-allowed overflow-hidden"
              >
                {contenu}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}