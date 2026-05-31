import { supabase } from "./supabase";

export const MAX_ATTEMPTS = 3;
export const CURRENT_DROP = "drop01";

export type EarlyAccess = {
  id?: string;
  clerk_user_id: string;
  drop_id: string;
  status: "in_progress" | "unlocked" | "failed";
  attempts_used: number;
  unlocked_at?: string;
};

// Récupère l'état de l'accès anticipé d'un utilisateur pour le drop courant
export async function getEarlyAccess(clerkUserId: string): Promise<EarlyAccess | null> {
  const { data, error } = await supabase
    .from("early_access")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .eq("drop_id", CURRENT_DROP)
    .maybeSingle();

  if (error) {
    console.error("getEarlyAccess error:", error);
    return null;
  }
  return data as EarlyAccess | null;
}

// Crée la ligne de départ si elle n'existe pas encore
export async function ensureEarlyAccessRow(clerkUserId: string): Promise<EarlyAccess | null> {
  const existing = await getEarlyAccess(clerkUserId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("early_access")
    .insert([
      {
        clerk_user_id: clerkUserId,
        drop_id: CURRENT_DROP,
        status: "in_progress",
        attempts_used: 0,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("ensureEarlyAccessRow error:", error);
    return null;
  }
  return data as EarlyAccess;
}

// Met à jour l'état après un essai (échec ou réussite)
export async function updateEarlyAccess(
  clerkUserId: string,
  updates: Partial<Pick<EarlyAccess, "status" | "attempts_used" | "unlocked_at">>
): Promise<EarlyAccess | null> {
  const { data, error } = await supabase
    .from("early_access")
    .update(updates)
    .eq("clerk_user_id", clerkUserId)
    .eq("drop_id", CURRENT_DROP)
    .select()
    .single();

  if (error) {
    console.error("updateEarlyAccess error:", error);
    return null;
  }
  return data as EarlyAccess;
}