import { redirect } from "next/navigation";
import { verifier2fa } from "@/lib/verifier2fa";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProduitForm from "../../ProduitForm";

export const metadata = {
  title: "Modifier produit — Admin Northstone",
};

export default async function ModifierProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const etat = await verifier2fa();
  if (etat === "pas-admin") redirect("/");
  if (etat === "2fa-requise") redirect("/admin/2fa");

  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("catalog_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    redirect("/admin/produits");
  }

  // Convertir la ligne DB (snake_case) vers le format du formulaire (camelCase)
  const initial = {
    id: data.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    gender: data.gender,
    price: Number(data.price),
    description: data.description || "",
    composition: data.composition || "",
    care: data.care || "",
    delivery: data.delivery || "",
    isNew: data.is_new,
    colors: data.colors || [],
    sizes: data.sizes || [],
    imagesByColor: data.images_by_color || {},
    stockBySize: data.stock_by_size || {},
  };

  return <ProduitForm initial={initial} />;
}