import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { estOwnerPermanent } from "@/lib/admin";
import { verifier2fa } from "@/lib/verifier2fa";
import JournalView from "./JournalView";

export const metadata = {
  title: "Journal d'activité — Admin Northstone",
};

export default async function JournalPage() {
  const etat = await verifier2fa();
  if (etat === "pas-admin") redirect("/");
  if (etat === "2fa-requise") redirect("/admin/2fa");

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  // Owner uniquement
  if (!estOwnerPermanent(email)) {
    redirect("/");
  }

  return <JournalView />;
}