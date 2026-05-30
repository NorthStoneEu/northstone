"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NewsletterModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setSuccess(false);
    setEmail("");
    setPhone("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Adresse email invalide");
        setIsLoading(false);
        return;
      }

      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert([
          {
            email: email.toLowerCase().trim(),
            phone: phone.trim() || null,
            source: "modal_drop01",
            drop_interested: "drop01",
          },
        ]);

      if (dbError) {
        if (dbError.code === "23505") {
          setError("Cet email est déjà inscrit. Merci !");
        } else {
          setError(`Erreur: ${dbError.message || dbError.code || "inconnue"}`);
        }
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Réessayez.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Overlay sombre opaque */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(10, 10, 10, 0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      />

      {/* Modale */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#F5F1EA",
          width: "100%",
          maxWidth: "420px",
          margin: "0 auto",
          boxShadow: "0 25px 80px -12px rgba(0, 0, 0, 0.7)",
          animation: "slideUp 0.4s ease-out",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        {/* Filet or en haut */}
        <div style={{ height: "3px", backgroundColor: "#B8985A" }} />

        {/* Bouton fermer */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#1A2332] hover:text-[#B8985A] transition-colors z-10"
          aria-label="Fermer"
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        <div style={{ padding: "48px 40px 40px 40px" }}>
          {!success ? (
            <>
              {/* HEADER */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-5">
                  <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                  <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
                  <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                </div>

                <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-4 font-medium">
                  Accès exclusif · Drop 01
                </p>

                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A2332] leading-[0.9] mb-5">
                  REJOIGNEZ
                  <br />
                  <span className="text-[#1A2332]/35">L'HÉRITAGE.</span>
                </h2>

                <div className="w-12 h-px bg-[#B8985A] mx-auto mb-5" />

                <p className="text-xs sm:text-[13px] text-[#1A2332]/70 leading-relaxed max-w-[300px] mx-auto">
                  Soyez prévenu·e en avant-première du lancement de
                  <span className="text-[#B8985A] font-semibold"> La Genèse</span>.
                  <br />
                  400 pièces · 15 novembre 2026.
                </p>
              </div>

              {/* FORMULAIRE */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-[9px] tracking-[0.25em] uppercase text-[#1A2332]/80 font-semibold mb-2.5">
                    Adresse email <span className="text-[#B8985A]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full bg-transparent border-b border-[#1A2332]/25 px-1 py-3 text-sm text-[#1A2332] placeholder:text-[#1A2332]/35 focus:outline-none focus:border-[#B8985A] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[9px] tracking-[0.25em] uppercase text-[#1A2332]/80 font-semibold mb-2.5">
                    Téléphone <span className="text-[#1A2332]/40 normal-case tracking-normal">(optionnel)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full bg-transparent border-b border-[#1A2332]/25 px-1 py-3 text-sm text-[#1A2332] placeholder:text-[#1A2332]/35 focus:outline-none focus:border-[#B8985A] transition-colors"
                  />
                  <p className="text-[10px] text-[#1A2332]/45 mt-2 italic">
                    Vous serez prévenu·e par SMS le jour du drop
                  </p>
                </div>

                {error && (
                  <div className="text-[11px] text-red-700 bg-red-50 border-l-2 border-red-400 px-3 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className={`w-full py-4 text-[11px] tracking-[0.3em] uppercase font-semibold transition-all mt-6 ${
                    isLoading || !email
                      ? "bg-[#1A2332]/15 text-[#1A2332]/40 cursor-not-allowed"
                      : "bg-black text-[#B8985A] hover:bg-[#1F1F1F]"
                  }`}
                  style={{ border: "none" }}
                >
                  {isLoading ? "Inscription en cours..." : "Rejoindre la liste"}
                </button>

                <p className="text-[10px] text-[#1A2332]/45 text-center leading-relaxed pt-3 italic">
                  En vous inscrivant, vous acceptez de recevoir nos communications.
                  <br />
                  Désinscription à tout moment.
                </p>
              </form>
            </>
          ) : (
            // ÉCRAN DE CONFIRMATION
            <div className="text-center py-6">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
                <span style={{ width: "4px", height: "4px", backgroundColor: "#B8985A", borderRadius: "50%" }} />
                <span style={{ width: "20px", height: "1px", backgroundColor: "#B8985A" }} />
              </div>

              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(184, 152, 90, 0.1)", border: "1px solid #B8985A" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B8985A" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8985A] mb-4 font-medium">
                Inscription confirmée
              </p>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332] leading-[0.9] mb-5">
                BIENVENUE DANS
                <br />
                <span className="text-[#1A2332]/35">L'HÉRITAGE.</span>
              </h2>

              <div className="w-12 h-px bg-[#B8985A] mx-auto mb-5" />

              <p className="text-xs sm:text-[13px] text-[#1A2332]/70 leading-relaxed max-w-[300px] mx-auto mb-8">
                Vous êtes désormais sur la liste exclusive du
                <span className="text-[#B8985A] font-semibold"> Drop 01</span>.
                <br />
                Rendez-vous le <span className="font-semibold">15 novembre 2026</span>.
              </p>

              {/* Bouton Fermer */}
              <button
                onClick={handleClose}
                className="px-10 py-3.5 bg-black text-[#B8985A] text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all"
                style={{ border: "none" }}
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}