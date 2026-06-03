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
}: {
  email: string;
  peutGererAdmins?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sections du back-office (la carte "Gestion des accès" n'apparaît que si autorisé)
  const sections = [
    { titre: "Produits", desc: "Gérer la collection permanente", href: "/admin/produits", actif: true },
    { titre: "Drops", desc: "Créer et gérer les drops", href: "/admin/drops", actif: false },
    { titre: "Commandes", desc: "Suivre les commandes", href: "/admin/commandes", actif: false },
    { titre: "Authentification", desc: "Pièces et puces NFC", href: "/admin/authentification", actif: false },
    ...(peutGererAdmins
      ? [{ titre: "Gestion des accès", desc: "Collaborateurs et permissions", href: "/admin/administrateurs", actif: true }]
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
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332] mb-2">
          Tableau de bord
        </h1>
        <p className="text-sm text-[#1A2332]/60 mb-8">
          Gérez votre boutique Northstone.
        </p>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-[#1A2332]/10 p-5">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/50 mb-2">
                {stat.label}
              </p>
              <p className={`text-2xl sm:text-3xl font-black tracking-tight ${stat.couleur}`}>
                {loading ? "—" : stat.valeur}
              </p>
              <p className="text-[11px] text-[#1A2332]/40 mt-1">
                {loading ? "Chargement..." : stat.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#1A2332]/50 font-semibold mb-4">
          Gestion
        </h2>
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