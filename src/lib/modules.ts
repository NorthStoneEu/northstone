// Définition des modules + actions du back-office.
// AUCUNE dépendance serveur ici → importable côté client ET serveur.

export const MODULES = [
  {
    id: "produits",
    label: "Produits",
    actions: [
      { id: "voir", label: "Voir les produits" },
      { id: "creer", label: "Ajouter un produit" },
      { id: "modifier", label: "Modifier un produit" },
      { id: "dupliquer", label: "Dupliquer un produit" },
      { id: "supprimer", label: "Supprimer un produit" },
      { id: "gerer_stock", label: "Gérer le stock" },
    ],
  },
  {
    id: "dashboard",
    label: "Tableau de bord & statistiques",
    actions: [
      { id: "voir", label: "Voir le tableau de bord" },
      { id: "voir_finances", label: "Voir le chiffre d'affaires / valeur du stock" },
    ],
  },
  {
    id: "ventes",
    label: "Ventes & chiffre d'affaires",
    actions: [
      { id: "voir", label: "Voir les ventes" },
      { id: "exporter", label: "Exporter les données" },
      { id: "rembourser", label: "Effectuer un remboursement" },
    ],
  },
  {
    id: "mail",
    label: "Messages clients",
    actions: [
      { id: "voir", label: "Voir les messages" },
      { id: "repondre", label: "Répondre aux messages" },
      { id: "supprimer", label: "Supprimer un message" },
    ],
  },
  {
    id: "drops",
    label: "Gestion des drops",
    actions: [
      { id: "voir", label: "Voir les drops" },
      { id: "creer", label: "Créer un drop" },
      { id: "modifier", label: "Modifier un drop" },
      { id: "supprimer", label: "Supprimer un drop" },
      { id: "gerer_loterie", label: "Gérer la loterie" },
    ],
  },
  {
    id: "admins",
    label: "Gestion des accès",
    actions: [
      { id: "voir", label: "Voir les accès" },
      { id: "ajouter", label: "Ajouter un accès" },
      { id: "modifier", label: "Modifier un accès" },
      { id: "retirer", label: "Retirer un accès" },
    ],
  },
] as const;

export type ModuleId = (typeof MODULES)[number]["id"];

// Map des permissions : { produits: ["voir","creer"], dashboard: ["voir"], ... }
export type Permissions = Partial<Record<ModuleId, string[]>>;