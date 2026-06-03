"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TwoFAView() {
  const router = useRouter();
  const [phase, setPhase] = useState<"chargement" | "config" | "usage">("chargement");
  const [qrCode, setQrCode] = useState("");
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [modeSecours, setModeSecours] = useState(false);
  const [codesSecours, setCodesSecours] = useState<string[]>([]);
  const [copie, setCopie] = useState(false);
  const [sauvegardeFaite, setSauvegardeFaite] = useState(false); // a téléchargé ou copié
  const [confirme, setConfirme] = useState(false); // case cochée

  // Au chargement : déterminer la phase (config ou usage)
  useEffect(() => {
    fetch("/api/admin/2fa/status", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.estAdmin) {
          router.push("/");
          return;
        }
        if (data.sessionValide) {
          router.push("/admin");
          return;
        }
        if (data.configuree) {
          setPhase("usage");
        } else {
          demarrerConfig();
        }
      })
      .catch(() => setErreur("Erreur de chargement."));
  }, []);

  const demarrerConfig = async () => {
    const res = await fetch("/api/admin/2fa/setup", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      setQrCode(data.qrCode);
      setPhase("config");
    } else {
      setErreur(data.error || "Erreur de configuration.");
    }
  };

  const verifier = async () => {
    setErreur("");
    setEnCours(true);
    const res = await fetch("/api/admin/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code, estCodeSecours: modeSecours }),
    });
    const data = await res.json();
    setEnCours(false);

    if (!res.ok) {
      setErreur(data.error || "Code incorrect.");
      return;
    }

    if (data.premierActivation && data.codesSecours) {
      setCodesSecours(data.codesSecours);
      return;
    }

    router.push("/admin");
  };

  // Contenu texte des codes de secours (pour téléchargement / copie)
  const contenuCodes = () => {
    return [
      "NORTHSTONE — Codes de secours (administration)",
      "",
      "Gardez ces codes en lieu sûr. Chaque code ne fonctionne qu'une seule fois.",
      "Ils permettent d'accéder à l'admin en cas de perte du téléphone.",
      "",
      ...codesSecours.map((c, i) => `${i + 1}. ${c}`),
      "",
      `Généré le ${new Date().toLocaleString("fr-FR")}`,
    ].join("\n");
  };

  const telechargerCodes = () => {
    const blob = new Blob([contenuCodes()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "northstone-codes-secours.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSauvegardeFaite(true);
  };

  const copierCodes = async () => {
    try {
      await navigator.clipboard.writeText(contenuCodes());
      setCopie(true);
      setSauvegardeFaite(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      setErreur("Impossible de copier. Téléchargez plutôt le fichier.");
    }
  };

  // Écran : codes de secours à noter (après 1ère activation)
  if (codesSecours.length > 0) {
    const peutContinuer = confirme && sauvegardeFaite;
    return (
      <div className="min-h-screen bg-[#F5F1EA] flex items-center justify-center px-6 py-10">
        <div className="bg-white border border-[#1A2332]/10 p-8 max-w-md w-full">
          <h1 className="text-xl font-black tracking-tight text-[#1A2332] mb-2">
            Codes de secours
          </h1>
          <p className="text-sm text-[#1A2332]/60 mb-5">
            ⚠️ Ces codes sont votre <strong>seul moyen d'accès</strong> si vous perdez votre téléphone. Chaque code ne fonctionne qu'une seule fois. <strong>Ils ne seront plus jamais affichés.</strong> Conservez-les dans un endroit sûr (gestionnaire de mots de passe, coffre, papier rangé).
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4 bg-[#F5F1EA] p-4 border border-[#1A2332]/10">
            {codesSecours.map((c) => (
              <span key={c} className="text-sm font-mono text-[#1A2332] tracking-wider text-center py-1">
                {c}
              </span>
            ))}
          </div>

          {/* Boutons télécharger / copier */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={telechargerCodes}
              className="flex-1 flex items-center justify-center gap-2 border border-[#1A2332]/20 px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#1A2332] hover:border-[#B8985A] hover:text-[#B8985A] transition-colors"
              style={{ background: "none", cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Télécharger
            </button>
            <button
              onClick={copierCodes}
              className="flex-1 flex items-center justify-center gap-2 border border-[#1A2332]/20 px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#1A2332] hover:border-[#B8985A] hover:text-[#B8985A] transition-colors"
              style={{ background: "none", cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copie ? "Copié ✓" : "Copier"}
            </button>
          </div>

          {!sauvegardeFaite && (
            <p className="text-[11px] text-[#B8985A] mb-3">
              Téléchargez ou copiez vos codes avant de continuer.
            </p>
          )}

          {/* Confirmation obligatoire */}
          <label className="flex items-start gap-2.5 cursor-pointer mb-5 text-sm text-[#1A2332]/80">
            <input
              type="checkbox"
              checked={confirme}
              onChange={(e) => setConfirme(e.target.checked)}
              className="mt-0.5"
            />
            <span>Je confirme avoir sauvegardé ces codes en lieu sûr et compris qu'ils ne seront plus affichés.</span>
          </label>

          <button
            onClick={() => router.push("/admin")}
            disabled={!peutContinuer}
            className="w-full bg-black text-[#B8985A] px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all disabled:opacity-40"
            style={{ cursor: peutContinuer ? "pointer" : "not-allowed" }}
          >
            Continuer vers l'administration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EA] flex items-center justify-center px-6 py-10">
      <div className="bg-white border border-[#1A2332]/10 p-8 max-w-md w-full">
        {phase === "chargement" && (
          <p className="text-center text-[#1A2332]/40 text-sm py-8">Chargement...</p>
        )}

        {phase === "config" && (
          <>
            <h1 className="text-xl font-black tracking-tight text-[#1A2332] mb-2">
              Configurer la double authentification
            </h1>
            <p className="text-sm text-[#1A2332]/60 mb-6">
              Pour sécuriser l'accès à l'administration, vous devez configurer une application d'authentification. Cela ne prend qu'une minute.
            </p>
            <div className="mb-6 space-y-4">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A2332] text-[#B8985A] text-[11px] font-semibold flex items-center justify-center">1</span>
                <p className="text-sm text-[#1A2332]/80 leading-relaxed">
                  Installez une application d'authentification sur votre téléphone :<br />
                  <strong>Google Authenticator</strong>, Authy ou Microsoft Authenticator.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A2332] text-[#B8985A] text-[11px] font-semibold flex items-center justify-center">2</span>
                <p className="text-sm text-[#1A2332]/80 leading-relaxed">
                  Ouvrez l'application, appuyez sur <strong>+</strong>, puis choisissez <strong>« Scanner un QR code »</strong>.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A2332] text-[#B8985A] text-[11px] font-semibold flex items-center justify-center">3</span>
                <p className="text-sm text-[#1A2332]/80 leading-relaxed">
                  Scannez le QR code ci-dessous. Un compte <strong>« Northstone Admin »</strong> apparaîtra, associé à votre adresse e-mail.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A2332] text-[#B8985A] text-[11px] font-semibold flex items-center justify-center">4</span>
                <p className="text-sm text-[#1A2332]/80 leading-relaxed">
                  Entrez ci-dessous le <strong>code à 6 chiffres</strong> affiché par l'application. Il change automatiquement toutes les 30 secondes.
                </p>
              </div>
            </div>
            {qrCode && (
              <div className="flex justify-center mb-4">
                <img src={qrCode} alt="QR code 2FA" className="w-48 h-48 border border-[#1A2332]/10" />
              </div>
            )}
            <p className="text-[11px] text-[#1A2332]/40 mb-5 text-center">
              🔒 Ne partagez jamais ce QR code ni vos codes avec personne.
            </p>
          </>
        )}

        {phase === "usage" && (
          <>
            <h1 className="text-xl font-black tracking-tight text-[#1A2332] mb-2">
              Vérification de sécurité
            </h1>
            <p className="text-sm text-[#1A2332]/60 mb-5">
              {modeSecours
                ? "Entrez un de vos codes de secours."
                : "Entrez le code à 6 chiffres affiché dans votre application d'authentification."}
            </p>
          </>
        )}

        {(phase === "config" || phase === "usage") && (
          <>
            <input
              autoFocus={phase === "usage"}
              className="w-full bg-transparent border border-[#1A2332]/20 px-3 py-3 text-center text-lg tracking-[0.3em] text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors mb-3"
              placeholder={modeSecours ? "XXXX-XXXX" : "123456"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifier()}
            />

            {erreur && <p className="text-xs text-red-600 mb-3">{erreur}</p>}

            <button
              onClick={verifier}
              disabled={enCours || !code.trim()}
              className="w-full bg-black text-[#B8985A] px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all disabled:opacity-40 mb-3"
              style={{ cursor: enCours ? "not-allowed" : "pointer" }}
            >
              {enCours ? "Vérification..." : "Valider"}
            </button>

            {phase === "usage" && (
              <button
                onClick={() => { setModeSecours(!modeSecours); setCode(""); setErreur(""); }}
                className="w-full text-[11px] text-[#1A2332]/50 hover:text-[#B8985A] transition-colors"
                style={{ background: "none", cursor: "pointer" }}
              >
                {modeSecours ? "← Utiliser le code de l'application" : "J'ai perdu mon téléphone — utiliser un code de secours"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}