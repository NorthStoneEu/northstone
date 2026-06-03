import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getAdminInfo } from "@/lib/admin";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Administration — Northstone",
};

export default async function AdminPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const info = await getAdminInfo(email);

  // Protection : non connecté OU pas admin -> redirection accueil
  if (!info) {
    redirect("/");
  }

  // Peut-il gérer les accès ? (owner OU au moins une action sur le module "admins")
  const peutGererAdmins =
    info.role === "owner" || (info.permissions["admins"] || []).length > 0;

  return <AdminDashboard email={info.email} peutGererAdmins={peutGererAdmins} />;
}