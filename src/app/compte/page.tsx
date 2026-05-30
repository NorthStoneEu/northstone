import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompteClient from "@/components/CompteClient";

export default async function ComptePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <Header />

      <main className="flex-1 bg-[#F5F1EA] px-4 sm:px-6 py-5 md:py-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-5">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-2">
              Espace personnel
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332] leading-[0.9] mb-2">
              MON COMPTE
            </h1>
            <div className="w-10 h-px bg-[#B8985A] mx-auto" />
          </div>

          <CompteClient />
        </div>
      </main>

      <Footer />
    </>
  );
}