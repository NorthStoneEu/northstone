import { redirect } from "next/navigation";
import { verifier2fa } from "@/lib/verifier2fa";
import ProduitForm from "../../ProduitForm";

export const metadata = {
  title: "Nouveau produit — Admin Northstone",
};

export default async function NouveauProduitPage() {
  const etat = await verifier2fa();
  if (etat === "pas-admin") redirect("/");
  if (etat === "2fa-requise") redirect("/admin/2fa");

  return <ProduitForm />;
}