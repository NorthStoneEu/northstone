"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Etat = "in_progress" | "unlocked" | "failed";

export default function MiniJeuPage() {
  const { isSignedIn, isLoaded } = useUser();

  const [statut, setStatut] = useState<Etat>("in_progress");
  const [essaisRestants, setEssaisRestants] = useState<number>(3);
  const [reponse, setReponse] = useState("");
  const [chargement, setChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [messageErreur, setMessageErreur] = useState<string | null>(null);
  const [secousse, setSecousse] = useState(false);

  // Charger l'état actuel de l'énigme pour cet utilisateur
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setChargement(false);
      return;
    }
    fetch("/api/etat-enigme", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.status) setStatut(data.status);
        if (typeof data?.attemptsLeft === "number") setEssaisRestants(data.attemptsLeft);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, [isLoaded, isSignedIn]);

  const valider = async () => {
    if (!reponse.trim() || envoiEnCours) return;
    setMessageErreur(null);
    setEnvoiEnCours(true);
    try {
      const res = await fetch("/api/verifier-enigme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reponse }),
      });
      const data = await res.json();

      if (data?.status) setStatut(data.status);
      if (typeof data?.attemptsLeft === "number") setEssaisRestants(data.attemptsLeft);

      if (!data?.correct && data?.status !== "unlocked") {
        // Mauvaise réponse : on secoue le champ + message
        setSecousse(true);
        setTimeout(() => setSecousse(false), 500);
        setReponse("");
        if (data?.status === "failed") {
          setMessageErreur("Tous vos essais sont épuisés.");
        } else {
          setMessageErreur("Ce n'est pas la bonne étoile. Réessayez.");
        }
      }
    } catch {
      setMessageErreur("Une erreur est survenue. Réessayez.");
    }
    setEnvoiEnCours(false);
  };

  const couleurs = {
    creme: "#F5F1EA",
    noir: "#0A0A0A",
    marine: "#1A2332",
    or: "#B8985A",
    orClair: "#D4B574",
  };

  return (
    <>
      <Header />

      <main style={{ backgroundColor: couleurs.noir, color: "#fff", minHeight: "80vh", position: "relative", overflow: "hidden" }}>
        {/* Halo doré d'ambiance */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "radial-gradient(circle at 50% 30%, rgba(184,152,90,0.14), transparent 60%)",
          }}
        />

        <div className="max-w-2xl mx-auto px-6" style={{ position: "relative", paddingTop: "64px", paddingBottom: "80px" }}>
          {/* Badge */}
          <div className="text-center mb-8">
            <span style={{ fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: couleurs.or, border: `1px solid ${couleurs.or}40`, padding: "6px 16px" }}>
              Épreuve exclusive · Drop 01
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-center" style={{ fontSize: "34px", fontWeight: 900, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: "8px" }}>
            LA CONSTELLATION
            <br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>DU GRAVEUR.</span>
          </h1>
          <div style={{ width: "48px", height: "1px", backgroundColor: couleurs.or, margin: "20px auto 0" }} />

          {/* CONTENU SELON L'ÉTAT */}
          {chargement || !isLoaded ? (
            <p className="text-center" style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginTop: "48px" }}>Chargement…</p>
          ) : !isSignedIn ? (
            /* NON CONNECTÉ */
            <div className="text-center" style={{ marginTop: "48px" }}>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "28px", maxWidth: "440px", marginLeft: "auto", marginRight: "auto" }}>
                L'épreuve est réservée aux membres. Connectez-vous pour tenter de débloquer l'accès anticipé au Drop 01.
              </p>
              <Link
                href="/sign-in?redirect_url=/mini-jeu"
                style={{ display: "inline-block", padding: "16px 40px", backgroundColor: couleurs.or, color: couleurs.noir, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}
              >
                Se connecter pour jouer
              </Link>
            </div>
          ) : statut === "unlocked" ? (
            /* DÉBLOQUÉ */
            <div className="text-center" style={{ marginTop: "48px" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>⭐</div>
              <p style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: couleurs.or, marginBottom: "12px", fontWeight: 600 }}>
                Étoile trouvée
              </p>
              <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>Accès anticipé débloqué</h2>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "32px", maxWidth: "440px", marginLeft: "auto", marginRight: "auto" }}>
                Vous avez recomposé l'étoile des Graveurs. La pré-commande exclusive du Drop 01 vous est ouverte, avant tout le monde.
              </p>
              <Link
                href="/drops/commander"
                style={{ display: "inline-block", padding: "16px 40px", backgroundColor: couleurs.or, color: couleurs.noir, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}
              >
                Accéder à la pré-commande
              </Link>
            </div>
          ) : statut === "failed" ? (
            /* ÉCHOUÉ */
            <div className="text-center" style={{ marginTop: "48px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#A86", marginBottom: "12px", fontWeight: 600 }}>
                Épreuve terminée
              </p>
              <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "16px" }}>Les étoiles se sont éteintes</h2>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "32px", maxWidth: "440px", marginLeft: "auto", marginRight: "auto" }}>
                Vos trois tentatives sont épuisées. Pas d'inquiétude : à l'ouverture publique, le Drop 01 sera accessible à tous, premier arrivé premier servi.
              </p>
              <Link
                href="/drops"
                style={{ display: "inline-block", padding: "16px 40px", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}
              >
                Voir le compte à rebours
              </Link>
            </div>
          ) : (
            /* EN COURS */
            <div style={{ marginTop: "40px" }}>
              {/* La consigne cryptique */}
              <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,152,90,0.25)", padding: "28px 24px", marginBottom: "32px" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: couleurs.or, marginBottom: "16px", textAlign: "center" }}>
                  Le parchemin du Graveur
                </p>
                <p style={{ fontSize: "16px", lineHeight: 1.9, color: "rgba(255,255,255,0.85)", textAlign: "center", fontStyle: "italic" }}>
                  « Trois éclats sont gravés dans la pierre de nos pages —<br />
                  invisibles à l'œil, lisibles à qui sait regarder dessous.<br />
                  <br />
                  Inspectez. Le Drop. L'Authenticité. La Livraison.<br />
                  <br />
                  Recomposez l'étoile. »
                </p>
              </div>

              {/* Compteur d'essais */}
              <div className="text-center" style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                  Tentatives restantes
                </p>
                <div className="flex items-center justify-center gap-2" style={{ marginTop: "10px" }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: i < essaisRestants ? couleurs.or : "transparent",
                        border: `1px solid ${i < essaisRestants ? couleurs.or : "rgba(255,255,255,0.25)"}`,
                        transition: "all 0.3s",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Champ de réponse */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  maxWidth: "420px",
                  margin: "0 auto",
                  transform: secousse ? "translateX(0)" : undefined,
                  animation: secousse ? "secousse 0.4s" : undefined,
                }}
              >
                <input
                  value={reponse}
                  onChange={(e) => setReponse(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") valider(); }}
                  placeholder="Le nom de l'étoile…"
                  disabled={envoiEnCours}
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(184,152,90,0.4)",
                    padding: "14px 16px",
                    fontSize: "15px",
                    color: "#fff",
                    outline: "none",
                    letterSpacing: "0.05em",
                  }}
                />
                <button
                  onClick={valider}
                  disabled={!reponse.trim() || envoiEnCours}
                  style={{
                    padding: "14px 24px",
                    backgroundColor: couleurs.or,
                    color: couleurs.noir,
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    border: "none",
                    cursor: !reponse.trim() || envoiEnCours ? "not-allowed" : "pointer",
                    opacity: !reponse.trim() || envoiEnCours ? 0.5 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {envoiEnCours ? "…" : "Valider"}
                </button>
              </div>

              {/* Message d'erreur */}
              {messageErreur && (
                <p className="text-center" style={{ color: "#E08A8A", fontSize: "13px", marginTop: "16px" }}>
                  {messageErreur}
                </p>
              )}

              {/* Aide discrète */}
              <p className="text-center" style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "28px", lineHeight: 1.6 }}>
                Indice : les éclats se cachent dans le code de nos pages. Apprenez à regarder sous la surface.
              </p>
            </div>
          )}
        </div>

        <style>{`
          @keyframes secousse {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}