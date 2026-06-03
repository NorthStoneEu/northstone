import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import ProduitsAdmin from "./ProduitsAdmin";

export const metadata = {
  title: "Produits — Admin Northstone",
};

export default async function ProduitsPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!(await isAdmin(email))) {
    redirect("/");
  }

  return <ProduitsAdmin />;
}