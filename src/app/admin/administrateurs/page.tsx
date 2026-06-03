import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getAdminInfo, estOwnerPermanent } from "@/lib/admin";
import AdminsManager from "./AdminsManager";

export const metadata = {
  title: "Gestion des accès — Admin Northstone",
};

export default async function AdministrateursPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const info = await getAdminInfo(email);

  // Doit être admin ET (owner OU avoir le module "admins")
  const autorise =
    info && (info.role === "owner" || (info.permissions["admins"] || []).length > 0);
  if (!autorise) {
    redirect("/");
  }

  return <AdminsManager estOwner={estOwnerPermanent(email)} />;
}