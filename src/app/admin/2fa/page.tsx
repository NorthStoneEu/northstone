import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getAdminInfo } from "@/lib/admin";
import TwoFAView from "./TwoFAView";

export const metadata = {
  title: "Vérification de sécurité — Admin Northstone",
};

export default async function TwoFAPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const info = await getAdminInfo(email);

  // Doit être admin pour accéder à cette page
  if (!info) {
    redirect("/");
  }

  return <TwoFAView />;
}