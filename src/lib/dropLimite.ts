import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Statuts qui "consomment" le droit d'achat (une pièce déjà acquise).
// Une commande annulée ou remboursée NE compte PAS (le client peut re-commander).
const STATUTS_VALIDES = ["payee", "en_preparation", "expediee", "livree"];

/**
 * Vérifie si un client a déjà une pièce valide pour un drop donné.
 * Retourne true s'il a déjà commandé (donc on doit le bloquer).
 */
export async function aDejaUnePieceDuDrop(
  clerkUserId: string | null | undefined,
  dropId: string
): Promise<boolean> {
  if (!clerkUserId || !dropId) return false;

  const { data, error } = await supabaseAdmin
    .from("commandes")
    .select("id, statut")
    .eq("clerk_user_id", clerkUserId)
    .eq("drop_id", dropId)
    .eq("type", "drop");

  if (error) {
    // En cas d'erreur de lecture, on bloque par sécurité (mieux vaut refuser qu'autoriser un doublon)
    console.error("Erreur vérification limite drop:", error);
    return true;
  }

  // A-t-il au moins une commande avec un statut valide ?
  return (data || []).some((c) => STATUTS_VALIDES.includes(c.statut));
}

/**
 * Vérifie si un client PEUT acheter une pièce de ce drop.
 * Retourne true s'il peut (n'a pas encore de pièce valide).
 */
export async function peutAcheterLeDrop(
  clerkUserId: string | null | undefined,
  dropId: string
): Promise<boolean> {
  const dejaUne = await aDejaUnePieceDuDrop(clerkUserId, dropId);
  return !dejaUne;
}