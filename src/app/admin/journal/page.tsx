import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { estOwnerPermanent } from "@/lib/admin";
import JournalView from "./JournalView";

export const metadata = {
  title: "Journal d'activité — Admin Northstone",
};

export default async function JournalPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  // Owner uniquement
  if (!estOwnerPermanent(email)) {
    redirect("/");
  }

  return <JournalView />;
}