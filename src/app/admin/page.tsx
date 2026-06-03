import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Administration — Northstone",
};

export default async function AdminPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  // Protection : non connecté OU pas admin -> redirection accueil
  if (!(await isAdmin(email))) {
    redirect("/");
  }

  return <AdminDashboard email={email ?? ""} />;
}