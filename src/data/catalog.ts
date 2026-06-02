import { supabase } from "@/lib/supabase";

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  gender: "homme" | "femme";
  price: number;
  imagesByColor: Record<string, string[]>;
  description: string;
  composition: string;
  care: string;
  delivery: string;
  isNew: boolean;
  colors: string[];
  sizes: string[];
  stockBySize: Record<string, number>;
};

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    gender: row.gender,
    price: Number(row.price),
    imagesByColor: row.images_by_color || {},
    description: row.description || "",
    composition: row.composition || "",
    care: row.care || "",
    delivery: row.delivery || "",
    isNew: row.is_new,
    colors: row.colors || [],
    sizes: row.sizes || [],
    stockBySize: row.stock_by_size || {},
  };
}

export async function getAllProducts(gender?: "homme" | "femme"): Promise<Product[]> {
  let query = supabase.from("catalog_items").select("*").order("id", { ascending: true });
  if (gender) query = query.eq("gender", gender);

  const { data, error } = await query;
  if (error) {
    console.error("Erreur chargement produits:", error.message);
    return [];
  }
  return (data || []).map(rowToProduct);
}


export async function getProductBySlug(
  slug: string,
  gender?: "homme" | "femme"
): Promise<Product | null> {
  let query = supabase.from("catalog_items").select("*").eq("slug", slug);
  if (gender) query = query.eq("gender", gender);

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return rowToProduct(data);
}

export async function getSimilarProducts(
  currentProductId: number,
  category: string,
  gender: "homme" | "femme",
  limit = 4
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("catalog_items")
    .select("*")
    .eq("category", category)
    .eq("gender", gender)
    .neq("id", currentProductId)
    .limit(limit);

  if (error) return [];
  return (data || []).map(rowToProduct);
}