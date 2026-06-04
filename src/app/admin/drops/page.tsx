import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getAdminInfo } from "@/lib/admin";
import { verifier2fa } from "@/lib/verifier2fa";
import DropsManager from "./DropsManager";

export const metadata = {
  title: "Drops — Admin Northstone",
};

export default async function DropsAdminPage() {
  const etat = await verifier2fa();
  if (etat === "pas-admin") redirect("/");
  if (etat === "2fa-requise") redirect("/admin/2fa");

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const info = await getAdminInfo(email);

  const autorise = info && (info.role === "owner" || (info.permissions["drops"] || []).length > 0);
  if (!autorise) {
    redirect("/admin");
  }

  return <DropsManager />;
}