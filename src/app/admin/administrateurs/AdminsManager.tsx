"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MODULES } from "@/lib/modules";

type Permissions = Record<string, string[]>;

type Admin = {
  email: string;
  nom: string;
  prenom?: string;
  nom_famille?: string;
  poste?: string;
  permissions: Permissions;
  ajoute_par?: string;
  created_at?: string;
};

const DUREE_ACCES_MS = 10 * 60 * 1000; // 10 minutes

export default function AdminsManager({ estOwner = false }: { estOwner?: boolean }) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Verrou 2FA (owner uniquement) ──
  const [deverrouille, setDeverrouille] = useState(!estOwner);
  const [codeVerrou, setCodeVerrou] = useState("");
  const [modeSecours, setModeSecours] = useState(false);
  const [erreurVerrou, setErreurVerrou] = useState("");
  const [verifEnCours, setVerifEnCours] = useState(false);
  const [tempsRestant, setTempsRestant] = useState(DUREE_ACCES_MS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Démarre le compte à rebours une fois déverrouillé
  useEffect(() => {
    if (!deverrouille || !estOwner) return;
    setTempsRestant(DUREE_ACCES_MS);
    const debut = Date.now();
    timerRef.current = setInterval(() => {
      const restant = DUREE_ACCES_MS - (Date.now() - debut);
      if (restant <= 0) {
        setTempsRestant(0);
        setDeverrouille(false);
        setCodeVerrou("");
        setModeSecours(false);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setTempsRestant(restant);
      }
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [deverrouille, estOwner]);

  const verifierVerrou = async () => {
    setErreurVerrou("");
    setVerifEnCours(true);
    const res = await fetch("/api/admin/2fa/sensible", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code: codeVerrou, estCodeSecours: modeSecours }),
    });
    const data = await res.json();
    setVerifEnCours(false);
    if (data.ok) {
      setDeverrouille(true);
    } else {
      setErreurVerrou(data.error || "Code incorrect.");
    }
  };

  const formatTimer = (ms: number) => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const charger = () => {
    setLoading(true);
    fetch("/api/admin/administrateurs", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setAdmins(data.admins || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    charger();
  }, []);

  // ── État du formulaire ──
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nomFamille, setNomFamille] = useState("");
  const [poste, setPoste] = useState("");
  const [permissions, setPermissions] = useState<Permissions>({});

  // ── Gestion des cases ──
  const aAction = (moduleId: string, actionId: string) =>
    (permissions[moduleId] || []).includes(actionId);

  const toggleAction = (moduleId: string, actionId: string) => {
    setPermissions((prev) => {
      const actuelles = prev[moduleId] || [];
      const mod = MODULES.find((m) => m.id === moduleId);
      const toutesActions = mod ? mod.actions.map((a) => a.id) : [];

      let nouvelles: string[];

      if (actuelles.includes(actionId)) {
        if (actionId === "voir") {
          nouvelles = [];
        } else {
          nouvelles = actuelles.filter((a) => a !== actionId);
        }
      } else {
        nouvelles = [...actuelles, actionId];
        if (!nouvelles.includes("voir") && toutesActions.includes("voir")) {
          nouvelles.push("voir");
        }
      }

      const copie = { ...prev };
      if (nouvelles.length === 0) {
        delete copie[moduleId];
      } else {
        copie[moduleId] = toutesActions.filter((a) => nouvelles.includes(a));
      }
      return copie;
    });
  };

  const toggleModuleEntier = (moduleId: string) => {
    setPermissions((prev) => {
      const mod = MODULES.find((m) => m.id === moduleId);
      const toutesActions = mod ? mod.actions.map((a) => a.id) : [];
      const actuelles = prev[moduleId] || [];
      const toutCoche = actuelles.length === toutesActions.length;

      const copie = { ...prev };
      if (toutCoche) {
        delete copie[moduleId];
      } else {
        copie[moduleId] = [...toutesActions];
      }
      return copie;
    });
  };

  const toutEstCoche = MODULES.every((m) => {
    const actuelles = permissions[m.id] || [];
    return actuelles.length === m.actions.length;
  });

  const toggleTout = () => {
    if (toutEstCoche) {
      setPermissions({});
    } else {
      const tout: Permissions = {};
      MODULES.forEach((m) => {
        tout[m.id] = m.actions.map((a) => a.id);
      });
      setPermissions(tout);
    }
  };

  const reinitialiser = () => {
    setEmail("");
    setPrenom("");
    setNomFamille("");
    setPoste("");
    setPermissions({});
  };

  const enregistrer = async () => {
    if (!email.trim() || !email.includes("@")) {
      alert("Entre un email valide.");
      return;
    }
    setSaving(true);
    const nomComplet = `${prenom} ${nomFamille}`.trim();
    const res = await fetch("/api/admin/administrateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        nom: nomComplet,
        prenom,
        nomFamille,
        poste,
        permissions,
      }),
    });
    setSaving(false);
    if (res.ok) {
      reinitialiser();
      charger();
    } else {
      const data = await res.json();
      alert("Erreur : " + (data.error || "inconnue"));
    }
  };

  const modifier = (a: Admin) => {
    setEmail(a.email);
    setPrenom(a.prenom || "");
    setNomFamille(a.nom_famille || "");
    setPoste(a.poste || "");
    setPermissions(a.permissions && typeof a.permissions === "object" && !Array.isArray(a.permissions) ? a.permissions : {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const retirer = async (a: Admin) => {
    if (!confirm(`Retirer l'accès de "${a.email}" ? Cette action est définitive.`)) return;
    const res = await fetch(`/api/admin/administrateurs?email=${encodeURIComponent(a.email)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      charger();
    } else {
      const data = await res.json();
      alert("Erreur : " + (data.error || "inconnue"));
    }
  };

  const reinitialiser2fa = async (a: Admin) => {
    if (!confirm(`Réinitialiser la 2FA de "${a.email}" ?\n\nLa personne devra reconfigurer son application d'authentification à sa prochaine connexion. À faire uniquement si elle a perdu l'accès à son téléphone.`)) return;
    const res = await fetch("/api/admin/2fa/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: a.email }),
    });
    if (res.ok) {
      alert(`La 2FA de ${a.email} a été réinitialisée. La personne reconfigurera à sa prochaine connexion.`);
    } else {
      const data = await res.json();
      alert("Erreur : " + (data.error || "inconnue"));
    }
  };

  // ── Helpers affichage ──
  const labelModule = (id: string) => MODULES.find((m) => m.id === id)?.label || id;
  const labelAction = (moduleId: string, actionId: string) => {
    const mod = MODULES.find((m) => m.id === moduleId);
    return mod?.actions.find((a) => a.id === actionId)?.label || actionId;
  };
  const nbActionsModule = (id: string) => MODULES.find((m) => m.id === id)?.actions.length || 0;

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return "";
    }
  };

  const inputClass =
    "w-full bg-transparent border border-[#1A2332]/20 px-3 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors";
  const labelClass = "block text-[10px] tracking-[0.25em] uppercase text-[#1A2332]/50 mb-2";

  // ── Écran de verrouillage (owner non encore déverrouillé) ──
  if (estOwner && !deverrouille) {
    return (
      <div className="min-h-screen bg-[#F5F1EA]">
        <header className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-lg font-black tracking-[0.2em] hover:text-[#B8985A] transition-colors">
              NORTHSTONE
            </Link>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] border border-[#B8985A]/40 px-2 py-0.5">
              Admin
            </span>
          </div>
          <Link href="/admin" className="text-xs text-white/70 hover:text-white transition-colors">
            ← Tableau de bord
          </Link>
        </header>

        <main className="max-w-md mx-auto px-6 py-16">
          <div className="bg-white border border-[#1A2332]/10 p-8">
            <div className="flex justify-center mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B8985A" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-tight text-[#1A2332] mb-2 text-center">
              Zone sensible
            </h1>
            <p className="text-sm text-[#1A2332]/60 mb-6 text-center">
              {modeSecours
                ? "Entrez un de vos codes de secours pour accéder à la gestion des accès."
                : "Entrez le code à 6 chiffres de votre application d'authentification pour accéder à la gestion des accès."}
            </p>

            <input
              autoFocus
              className="w-full bg-transparent border border-[#1A2332]/20 px-3 py-3 text-center text-lg tracking-[0.3em] text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors mb-3"
              placeholder={modeSecours ? "XXXX-XXXX" : "123456"}
              value={codeVerrou}
              onChange={(e) => setCodeVerrou(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifierVerrou()}
            />

            {erreurVerrou && <p className="text-xs text-red-600 mb-3">{erreurVerrou}</p>}

            <button
              onClick={verifierVerrou}
              disabled={verifEnCours || !codeVerrou.trim()}
              className="w-full bg-black text-[#B8985A] px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all disabled:opacity-40 mb-3"
              style={{ cursor: verifEnCours ? "not-allowed" : "pointer" }}
            >
              {verifEnCours ? "Vérification..." : "Déverrouiller"}
            </button>

            <button
              onClick={() => { setModeSecours(!modeSecours); setCodeVerrou(""); setErreurVerrou(""); }}
              className="w-full text-[11px] text-[#1A2332]/50 hover:text-[#B8985A] transition-colors"
              style={{ background: "none", cursor: "pointer" }}
            >
              {modeSecours ? "← Utiliser le code de l'application" : "Utiliser un code de secours"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EA]">
      <header className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-lg font-black tracking-[0.2em] hover:text-[#B8985A] transition-colors">
            NORTHSTONE
          </Link>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8985A] border border-[#B8985A]/40 px-2 py-0.5">
            Admin
          </span>
        </div>
        <Link href="/admin" className="text-xs text-white/70 hover:text-white transition-colors">
          ← Tableau de bord
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Timer accès sensible (owner) */}
        {estOwner && (
          <div className={`flex items-center justify-between mb-6 px-4 py-2.5 border ${
            tempsRestant <= 60000 ? "border-red-300 bg-red-50" : "border-[#B8985A]/30 bg-[#B8985A]/5"
          }`}>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/60">
              🔓 Accès sensible actif
            </span>
            <span className={`text-sm font-mono font-semibold ${tempsRestant <= 60000 ? "text-red-600" : "text-[#1A2332]"}`}>
              {formatTimer(tempsRestant)}
            </span>
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A2332] mb-2">
          Gestion des accès
        </h1>
        <p className="text-sm text-[#1A2332]/60 mb-8">
          {estOwner
            ? "Ajoutez des collaborateurs et choisissez précisément les actions qu'ils peuvent effectuer dans chaque module."
            : "Consultez les collaborateurs et leurs permissions."}
        </p>

        {/* Bandeau consultation seule (non-owner) */}
        {!estOwner && (
          <div className="bg-[#EFE9DC] border border-[#B8985A]/30 p-4 mb-8">
            <p className="text-xs text-[#1A2332]/70">
              🔒 Consultation seule — seul l'administrateur principal peut ajouter, modifier ou retirer un accès.
            </p>
          </div>
        )}

        {/* Formulaire d'ajout/modification (owner uniquement) */}
        {estOwner && (
          <div className="bg-white border border-[#1A2332]/10 p-6 sm:p-8 space-y-6 mb-10">
            <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#1A2332]/50 font-semibold">
              Ajouter / modifier un accès
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Prénom</label>
                <input
                  className={inputClass}
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Nom</label>
                <input
                  className={inputClass}
                  placeholder="Nom"
                  value={nomFamille}
                  onChange={(e) => setNomFamille(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  className={inputClass}
                  type="email"
                  placeholder="collaborateur@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Poste / fonction</label>
                <input
                  className={inputClass}
                  placeholder="Ex : Responsable e-commerce"
                  value={poste}
                  onChange={(e) => setPoste(e.target.value)}
                />
              </div>
            </div>

            {/* Permissions granulaires */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelClass} style={{ marginBottom: 0 }}>
                  Permissions détaillées
                </label>
                <button
                  onClick={toggleTout}
                  className="text-[10px] tracking-[0.15em] uppercase text-[#B8985A] border border-[#B8985A]/40 px-3 py-1.5 hover:bg-[#B8985A]/10 transition-colors"
                  style={{ background: "none", cursor: "pointer" }}
                >
                  {toutEstCoche ? "Tout retirer" : "Tout autoriser"}
                </button>
              </div>

              <div className="space-y-3">
                {MODULES.map((m) => {
                  const actuelles = permissions[m.id] || [];
                  const moduleActif = actuelles.length > 0;
                  const toutModuleCoche = actuelles.length === m.actions.length;
                  return (
                    <div
                      key={m.id}
                      className={`border p-4 transition-colors ${
                        moduleActif ? "border-[#B8985A]/50 bg-[#B8985A]/5" : "border-[#1A2332]/15"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-[#1A2332]">{m.label}</span>
                        <button
                          onClick={() => toggleModuleEntier(m.id)}
                          className="text-[9px] tracking-[0.15em] uppercase text-[#1A2332]/50 border border-[#1A2332]/20 px-2 py-1 hover:border-[#1A2332] transition-colors"
                          style={{ background: "none", cursor: "pointer" }}
                        >
                          {toutModuleCoche ? "Tout retirer" : "Tout"}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.actions.map((act) => (
                          <label
                            key={act.id}
                            className="flex items-center gap-2.5 cursor-pointer text-sm text-[#1A2332]/80 hover:text-[#1A2332]"
                          >
                            <input
                              type="checkbox"
                              checked={aAction(m.id, act.id)}
                              onChange={() => toggleAction(m.id, act.id)}
                            />
                            <span>{act.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#1A2332]/40 mt-3">
                ⚠️ Le module "Gestion des accès" permet d'ajouter/retirer d'autres admins. À donner avec prudence.
                <br />
                L'action "Voir" est automatiquement activée dès qu'une autre action est cochée.
              </p>
            </div>

            <div className="flex gap-3 pt-2 border-t border-[#1A2332]/10">
              <button
                onClick={enregistrer}
                disabled={saving}
                className="bg-black text-[#B8985A] border border-black px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all disabled:opacity-40"
                style={{ cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? "Enregistrement..." : "Enregistrer l'accès"}
              </button>
              <button
                onClick={reinitialiser}
                className="px-6 py-3 text-[11px] tracking-[0.2em] uppercase text-[#1A2332] border border-[#1A2332]/20 hover:border-[#1A2332] transition-colors"
                style={{ background: "none", cursor: "pointer" }}
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}

        {/* Liste des admins */}
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#1A2332]/50 font-semibold mb-4">
          Accès existants
        </h2>

        {/* Owner permanent (toi) */}
        <div className="bg-[#1A2332] text-white p-5 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Administrateur principal</p>
              <p className="text-xs text-white/60 mt-0.5">Accès total · permanent</p>
            </div>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#B8985A] border border-[#B8985A]/40 px-2 py-1">
              Owner
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10 text-[#1A2332]/40 text-sm">Chargement...</p>
        ) : admins.length === 0 ? (
          <p className="text-sm text-[#1A2332]/40 py-4">Aucun autre accès pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {admins.map((a) => {
              const perms = a.permissions && typeof a.permissions === "object" && !Array.isArray(a.permissions) ? a.permissions : {};
              const modulesActifs = Object.keys(perms).filter((k) => (perms[k] || []).length > 0);
              return (
                <div key={a.email} className="bg-white border border-[#1A2332]/10 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1A2332] truncate">
                        {a.nom || a.email}
                      </p>
                      <p className="text-xs text-[#1A2332]/50">{a.email}</p>
                      {a.poste && (
                        <p className="text-xs text-[#1A2332]/70 mt-0.5">{a.poste}</p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {modulesActifs.map((modId) => (
                          <span
                            key={modId}
                            className="text-[9px] tracking-[0.1em] uppercase text-[#1A2332]/60 bg-[#EFE9DC] px-2 py-0.5"
                          >
                            {labelModule(modId)} ({(perms[modId] || []).length}/{nbActionsModule(modId)})
                          </span>
                        ))}
                        {modulesActifs.length === 0 && (
                          <span className="text-[10px] text-[#1A2332]/30 italic">Aucune permission</span>
                        )}
                      </div>

                      {/* Détail des actions par module */}
                      {modulesActifs.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {modulesActifs.map((modId) => (
                            <p key={modId} className="text-[11px] text-[#1A2332]/50">
                              <span className="text-[#1A2332]/70 font-medium">{labelModule(modId)} :</span>{" "}
                              {(perms[modId] || []).map((act) => labelAction(modId, act)).join(", ")}
                            </p>
                          ))}
                        </div>
                      )}

                      {(a.ajoute_par || a.created_at) && (
                        <p className="text-[10px] text-[#1A2332]/30 mt-2">
                          {a.created_at && `Ajouté le ${formatDate(a.created_at)}`}
                          {a.ajoute_par && ` · par ${a.ajoute_par}`}
                        </p>
                      )}
                    </div>
                    {estOwner && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => modifier(a)}
                          className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#1A2332] border border-[#1A2332]/20 hover:border-[#1A2332] transition-colors"
                          style={{ background: "none", cursor: "pointer" }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => retirer(a)}
                          className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-red-600 border border-red-200 hover:border-red-600 transition-colors"
                          style={{ background: "none", cursor: "pointer" }}
                        >
                          Retirer
                        </button>
                        <button
                          onClick={() => reinitialiser2fa(a)}
                          className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#1A2332]/60 border border-[#1A2332]/20 hover:border-[#B8985A] hover:text-[#B8985A] transition-colors"
                          title="Réinitialiser la 2FA (si perte du téléphone)"
                          style={{ background: "none", cursor: "pointer" }}
                        >
                          Reset 2FA
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}