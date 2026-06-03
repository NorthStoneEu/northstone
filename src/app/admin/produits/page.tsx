import { redirect } from "next/navigation";
import { verifier2fa } from "@/lib/verifier2fa";
import ProduitsAdmin from "./ProduitsAdmin";

export const metadata = {
  title: "Produits — Admin Northstone",
};

export default async function ProduitsPage() {
  const etat = await verifier2fa();
  if (etat === "pas-admin") redirect("/");
  if (etat === "2fa-requise") redirect("/admin/2fa");

  return <ProduitsAdmin />;
}