import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getAdminInfo, estOwnerPermanent } from "@/lib/admin";
import { verifier2fa } from "@/lib/verifier2fa";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Administration — Northstone",
};

export default async function AdminPage() {
  // Garde 2FA : doit être admin ET avoir validé sa 2FA pour cette session
  const etat = await verifier2fa();
  if (etat === "pas-admin") {
    redirect("/");
  }
  if (etat === "2fa-requise") {
    redirect("/admin/2fa");
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const info = await getAdminInfo(email);

  // Sécurité supplémentaire (ne devrait pas arriver après verifier2fa)
  if (!info) {
    redirect("/");
  }

  // Peut-il gérer les accès ? (owner OU au moins une action sur le module "admins")
  const peutGererAdmins =
    info.role === "owner" || (info.permissions["admins"] || []).length > 0;

  return <AdminDashboard email={info.email} peutGererAdmins={peutGererAdmins} estOwner={estOwnerPermanent(email)} />;
}