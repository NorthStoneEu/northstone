"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

const EMAIL_CONTACT = "contact@northstone.com";

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    const corps = `Nom : ${nom}\nPrénom : ${prenom}\nEmail : ${email}\nTéléphone : ${telephone}\n\n${message}`;
    const lien = `mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent(
      sujet || "Contact depuis le site"
    )}&body=${encodeURIComponent(corps)}`;
    window.location.href = lien;
  };

  const champOk = nom.trim() && email.trim() && message.trim();

  return (
    <>
      <Header />

      {/* HERO SOMBRE */}
      <section className="relative bg-[#0A0A0A] text-white px-6 pt-12 pb-12 md:pt-14 md:pb-14 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(184,152,90,0.12), transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span style={{ width: "24px", height: "1px", backgroundColor: "#B8985A" }} />
              <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
              <span style={{ width: "24px", height: "1px", backgroundColor: "#B8985A" }} />
            </div>
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#B8985A] mb-6">
              Nous écrire
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[0.95] mb-6">
              UNE QUESTION ?
              <br />
              <span className="text-white/35">UNE ENVIE ?</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto mb-8">
              Pièce, commande, drop, authenticité — nous lisons tout, et nous
              répondons sous 48h ouvrées.
            </p>
            <button
              onClick={() => { window.location.href = "mailto:" + EMAIL_CONTACT; }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8985A] hover:text-white transition-colors"
              style={{ background: "none", cursor: "pointer" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 5L2 7" />
              </svg>
              {EMAIL_CONTACT}
            </button>
          </FadeIn>
        </div>
      </section>

      {/* FORMULAIRE */}
      <main className="bg-[#F5F1EA] px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <FadeIn direction="up">
            <div className="bg-white border-t-2 border-[#B8985A] shadow-xl p-6 sm:p-10">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/50 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full bg-transparent border-b border-[#1A2332]/20 px-1 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/50 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="w-full bg-transparent border-b border-[#1A2332]/20 px-1 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/50 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-[#1A2332]/20 px-1 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/50 mb-2">
                      Téléphone <span className="text-[#1A2332]/30">(optionnel)</span>
                    </label>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full bg-transparent border-b border-[#1A2332]/20 px-1 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/50 mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    className="w-full bg-transparent border-b border-[#1A2332]/20 px-1 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/50 mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full bg-transparent border-b border-[#1A2332]/20 px-1 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!champOk}
                  className="w-full bg-black text-[#B8985A] border border-black py-4 text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all disabled:opacity-40"
                  style={{ cursor: champOk ? "pointer" : "not-allowed" }}
                >
                  Envoyer le message
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </>
  );
}