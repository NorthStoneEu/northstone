"use client";

import { UserProfile } from "@clerk/nextjs";
import MesInformations from "./profil/MesInformations";
import MesAdresses from "./profil/MesAdresses";

export default function CompteClient() {
  return (
    <div className="flex justify-center">
      <UserProfile
        path="/compte"
        appearance={{
          variables: {
            colorPrimary: "#B8985A",
          },
          elements: {
            rootBox: "w-full",
            card: "shadow-xl border-t-2 border-[#B8985A] bg-white",
            navbarButton: "text-[#1A2332] hover:text-[#B8985A]",
            profileSectionTitleText: "text-[#1A2332] font-bold",
            formButtonPrimary:
              "bg-[#1A2332] hover:bg-[#0A0A0A] text-[#B8985A] text-[11px] tracking-[0.2em] uppercase font-semibold",
            badge: "bg-[#B8985A]/10 text-[#B8985A] border border-[#B8985A]/30",
          },
        }}
      >
        {/* Onglet custom : Mes informations */}
        <UserProfile.Page
          label="Mes informations"
          url="informations"
          labelIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        >
          <MesInformations />
        </UserProfile.Page>

        {/* Onglet custom : Mes adresses */}
        <UserProfile.Page
          label="Mes adresses"
          url="adresses"
          labelIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          }
        >
          <MesAdresses />
        </UserProfile.Page>
      </UserProfile>
    </div>
  );
}