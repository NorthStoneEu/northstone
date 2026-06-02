"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormProduct = {
  id?: number;
  slug: string;
  name: string;
  category: string;
  gender: "homme" | "femme";
  price: number;
  description: string;
  composition: string;
  care: string;
  delivery: string;
  isNew: boolean;
  colors: string[];
  sizes: string[];
  imagesByColor: Record<string, string[]>;
  stockBySize: Record<string, number>;
};

const empty: FormProduct = {
  slug: "",
  name: "",
  category: "",
  gender: "homme",
  price: 0,
  description: "",
  composition: "",
  care: "",
  delivery: "Livraison offerte dès 80€ en France.",
  isNew: false,
  colors: [],
  sizes: [],
  imagesByColor: {},
  stockBySize: {},
};

const categoriesHomme = ["Polos", "T-shirts", "Chemises", "Sweats", "Pulls", "Pantalons", "Vestes"];
const categoriesFemme = ["Robes", "T-shirts", "Chemisiers", "Pulls", "Pantalons", "Vestes", "Accessoires"];

export default function ProduitForm({ initial }: { initial?: FormProduct }) {
  const router = useRouter();
  const [p, setP] = useState<FormProduct>(initial || empty);
  const [saving, setSaving] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [uploadingColor, setUploadingColor] = useState<string | null>(null);

  const isEdit = !!p.id;
  const categories = p.gender === "homme" ? categoriesHomme : categoriesFemme;

  const set = (field: keyof FormProduct, value: any) => {
    setP((prev) => ({ ...prev, [field]: value }));
  };

  const genererSlug = () => {
    const slug = p.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    set("slug", slug);
  };

  const ajouterCouleur = () => {
    const c = newColor.trim();
    if (!c || p.colors.includes(c)) return;
    setP((prev) => ({
      ...prev,
      colors: [...prev.colors, c],
      imagesByColor: { ...prev.imagesByColor, [c]: prev.imagesByColor[c] || [] },
    }));
    setNewColor("");
  };

  const retirerCouleur = (c: string) => {
    setP((prev) => {
      const newImages = { ...prev.imagesByColor };
      delete newImages[c];
      return {
        ...prev,
        colors: prev.colors.filter((x) => x !== c),
        imagesByColor: newImages,
      };
    });
  };

  const ajouterTaille = () => {
    const s = newSize.trim();
    if (!s || p.sizes.includes(s)) return;
    setP((prev) => ({
      ...prev,
      sizes: [...prev.sizes, s],
      stockBySize: { ...prev.stockBySize, [s]: prev.stockBySize[s] || 0 },
    }));
    setNewSize("");
  };

  const retirerTaille = (s: string) => {
    setP((prev) => {
      const newStock = { ...prev.stockBySize };
      delete newStock[s];
      return {
        ...prev,
        sizes: prev.sizes.filter((x) => x !== s),
        stockBySize: newStock,
      };
    });
  };

  // Modifier la quantité en stock d'une taille
  const setStock = (size: string, qty: number) => {
    setP((prev) => ({
      ...prev,
      stockBySize: { ...prev.stockBySize, [size]: qty < 0 ? 0 : qty },
    }));
  };

  const uploaderImage = async (color: string, file: File) => {
    setUploadingColor(color);
    try {
      const { supabase } = await import("@/lib/supabase");
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { contentType: file.type, upsert: false });

      if (error) {
        alert("Erreur upload : " + error.message);
        setUploadingColor(null);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      setP((prev) => ({
        ...prev,
        imagesByColor: {
          ...prev.imagesByColor,
          [color]: [...(prev.imagesByColor[color] || []), urlData.publicUrl],
        },
      }));
    } catch (e: any) {
      alert("Erreur : " + (e.message || "inconnue"));
    }
    setUploadingColor(null);
  };

  const retirerImage = (color: string, url: string) => {
    setP((prev) => ({
      ...prev,
      imagesByColor: {
        ...prev.imagesByColor,
        [color]: (prev.imagesByColor[color] || []).filter((u) => u !== url),
      },
    }));
  };

  const enregistrer = async () => {
    if (!p.name || !p.slug || !p.category) {
      alert("Nom, slug et catégorie sont obligatoires.");
      return;
    }
    setSaving(true);
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch("/api/admin/produits", {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(p),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/produits");
    } else {
      const data = await res.json();
      alert("Erreur : " + (data.error || "inconnue"));
    }
  };

  const inputClass =
    "w-full bg-transparent border border-[#1A2332]/20 px-3 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors";
  const labelClass = "block text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/50 mb-2";

  // Stock total (somme de toutes les tailles)
  const stockTotal = p.sizes.reduce((sum, s) => sum + (p.stockBySize[s] || 0), 0);

  return (
    <div className="min-h-screen bg-[#F5F1EA]">
      <header className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-lg font-black tracking-[0.2em] hover:text-[#B8985A] transition-colors">
            NORTHSTONE
          </Link>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] border border-[#B8985A]/40 px-2 py-0.5">
            Admin
          </span>
        </div>
        <Link href="/admin/produits" className="text-xs text-white/70 hover:text-white transition-colors">
          ← Retour aux produits
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332] mb-8">
          {isEdit ? "Modifier le produit" : "Nouveau produit"}
        </h1>

        <div className="bg-white border border-[#1A2332]/10 p-6 sm:p-8 space-y-6">
          {/* Genre */}
          <div>
            <label className={labelClass}>Genre</label>
            <div className="flex gap-2">
              {(["homme", "femme"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => set("gender", g)}
                  className={`px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-semibold border transition-all ${
                    p.gender === g
                      ? "bg-[#1A2332] text-white border-[#1A2332]"
                      : "bg-transparent text-[#1A2332]/60 border-[#1A2332]/20"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Nom */}
          <div>
            <label className={labelClass}>Nom du produit</label>
            <input className={inputClass} value={p.name} onChange={(e) => set("name", e.target.value)} onBlur={() => { if (!p.slug) genererSlug(); }} />
          </div>

          {/* Slug */}
          <div>
            <label className={labelClass}>Slug (URL) — généré automatiquement</label>
            <div className="flex gap-2">
              <input className={inputClass} value={p.slug} onChange={(e) => set("slug", e.target.value)} />
              <button onClick={genererSlug} className="px-3 py-2 text-[10px] tracking-[0.15em] uppercase text-[#1A2332] border border-[#1A2332]/20 hover:border-[#1A2332] whitespace-nowrap" style={{ cursor: "pointer" }}>
                Auto
              </button>
            </div>
          </div>

          {/* Catégorie + Prix */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Catégorie</label>
              <select className={inputClass} value={p.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">— Choisir —</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Prix (€)</label>
              <input type="number" className={inputClass} value={p.price} onChange={(e) => set("price", Number(e.target.value))} />
            </div>
          </div>

          {/* Nouveau ? */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={p.isNew} onChange={(e) => set("isNew", e.target.checked)} />
              <span className="text-sm text-[#1A2332]">Marquer comme "Nouveau"</span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={inputClass} rows={3} value={p.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          {/* Composition / Entretien / Livraison */}
          <div>
            <label className={labelClass}>Composition & Origine</label>
            <textarea className={inputClass} rows={2} value={p.composition} onChange={(e) => set("composition", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Entretien</label>
            <textarea className={inputClass} rows={2} value={p.care} onChange={(e) => set("care", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Livraison & Retours</label>
            <textarea className={inputClass} rows={2} value={p.delivery} onChange={(e) => set("delivery", e.target.value)} />
          </div>

          {/* Tailles + STOCK */}
          <div>
            <label className={labelClass}>Tailles & Stock</label>
            <p className="text-xs text-[#1A2332]/50 mb-3">
              Indique la quantité disponible pour chaque taille. Une taille à 0 sera affichée comme épuisée.
            </p>

            {p.sizes.length > 0 && (
              <div className="space-y-2 mb-3">
                {p.sizes.map((s) => (
                  <div key={s} className="flex items-center gap-3 bg-[#EFE9DC] px-3 py-2">
                    <span className="text-sm font-semibold text-[#1A2332] w-16">{s}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <label className="text-[10px] tracking-[0.15em] uppercase text-[#1A2332]/50">
                        Stock :
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={p.stockBySize[s] ?? 0}
                        onChange={(e) => setStock(s, Number(e.target.value))}
                        className="w-20 bg-white border border-[#1A2332]/20 px-2 py-1 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A]"
                      />
                      <span className="text-xs text-[#1A2332]/40">
                        {(p.stockBySize[s] || 0) === 0 ? "(épuisé)" : `${p.stockBySize[s]} dispo`}
                      </span>
                    </div>
                    <button
                      onClick={() => retirerTaille(s)}
                      className="text-red-500 font-bold text-lg"
                      style={{ cursor: "pointer" }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <p className="text-[11px] text-[#B8985A] font-semibold pt-1">
                  Stock total : {stockTotal} article(s)
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <input className={inputClass} placeholder="ex: M, 32, TU..." value={newSize} onChange={(e) => setNewSize(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); ajouterTaille(); } }} />
              <button onClick={ajouterTaille} className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase bg-[#1A2332] text-white whitespace-nowrap" style={{ cursor: "pointer" }}>Ajouter taille</button>
            </div>
          </div>

          {/* Couleurs + images */}
          <div>
            <label className={labelClass}>Couleurs & Photos</label>
            <div className="flex gap-2 mb-4">
              <input className={inputClass} placeholder="ex: Noir, Blanc, Beige..." value={newColor} onChange={(e) => setNewColor(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); ajouterCouleur(); } }} />
              <button onClick={ajouterCouleur} className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase bg-[#1A2332] text-white whitespace-nowrap" style={{ cursor: "pointer" }}>Ajouter couleur</button>
            </div>

            <div className="space-y-4">
              {p.colors.map((color) => (
                <div key={color} className="border border-[#1A2332]/15 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-[#1A2332]">{color}</span>
                    <button onClick={() => retirerCouleur(color)} className="text-[10px] tracking-[0.15em] uppercase text-red-600" style={{ cursor: "pointer" }}>Retirer cette couleur</button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {(p.imagesByColor[color] || []).map((url) => (
                      <div key={url} className="relative w-16 h-20 bg-[#EFE9DC] bg-cover bg-center" style={{ backgroundImage: `url('${url}')` }}>
                        <button onClick={() => retirerImage(color, url)} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center" style={{ cursor: "pointer" }}>×</button>
                      </div>
                    ))}
                  </div>

                  <label className="inline-block text-[10px] tracking-[0.15em] uppercase text-[#1A2332] border border-[#1A2332]/20 px-3 py-2 cursor-pointer hover:border-[#1A2332]">
                    {uploadingColor === color ? "Envoi..." : "+ Ajouter une photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploaderImage(color, f); e.target.value = ""; }} />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Enregistrer */}
          <div className="pt-4 border-t border-[#1A2332]/10">
            <button onClick={enregistrer} disabled={saving} className="w-full bg-black text-[#B8985A] border border-black py-4 text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all disabled:opacity-40" style={{ cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer le produit"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}