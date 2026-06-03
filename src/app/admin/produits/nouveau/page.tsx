import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import ProduitForm from "../../ProduitForm";

export const metadata = {
  title: "Nouveau produit — Admin Northstone",
};

export default async function NouveauProduitPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!(await isAdmin(email))) {
    redirect("/");
  }

  return <ProduitForm />;
}