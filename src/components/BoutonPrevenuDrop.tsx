"use client";

import { useState } from "react";
import NewsletterModal from "./NewsletterModal";

export default function BoutonPrevenuDrop() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-3 sm:px-8 py-2 sm:py-4 bg-[#B8985A] text-[#0A0A0A] text-[8px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold hover:bg-[#D4B574] transition-colors text-center w-full"
        style={{ cursor: "pointer", border: "none" }}
      >
        Être prévenu·e
      </button>
      <NewsletterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}