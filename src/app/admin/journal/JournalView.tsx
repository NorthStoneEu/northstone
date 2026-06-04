"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MODULES } from "@/lib/modules";

type Log = {
  id: number;
  created_at: string;
  acteur_email: string;
  acteur_nom: string;
  module: string;
  action: string;
  cible: string;
  details: Record<string, any>;
  etat_avant: Record<string, any> | null;
  etat_apres: Record<string, any> | null;
  adresse_ip: string;
  user_agent: string;
  localisation?: string;
};

const LABELS_SECURITE: Record<string, string> = {
  connexion: "Connexion",
  echec_2fa: "Échec 2FA",
  activation_2fa: "Activation 2FA",
};

// Noms de champs traduits (produits + admins)
const LABELS_CHAMPS: Record<string, string> = {
  name: "Nom",
  slug: "Slug (URL)",
  category: "Catégorie",
  gender: "Genre",
  price: "Prix",
  description: "Description",
  composition: "Composition",
  care: "Entretien",
  delivery: "Livraison",
  is_new: "Nouveauté",
  colors: "Couleurs",
  sizes: "Tailles",
  images_by_color: "Photos",
  stock_by_size: "Stock",
  permissions: "Permissions",
  nom: "Nom",
  prenom: "Prénom",
  nom_famille: "Nom de famille",
  poste: "Poste",
  ajoute_par: "Ajouté par",
};

export default function JournalView() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [ouvert, setOuvert] = useState<number | null>(null);
  const [exportEnCours, setExportEnCours] = useState(false);

  const [filtreActeur, setFiltreActeur] = useState("tous");
  const [filtreModule, setFiltreModule] = useState("tous");
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    fetch("/api/admin/journal", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const acteurs = Array.from(
    new Set(logs.map((l) => l.acteur_email).filter(Boolean))
  );

  const logsFiltres = logs.filter((l) => {
    if (filtreActeur !== "tous" && l.acteur_email !== filtreActeur) return false;
    if (filtreModule !== "tous" && l.module !== filtreModule) return false;
    if (recherche.trim()) {
      const q = recherche.toLowerCase();
      const texte = `${l.acteur_nom} ${l.acteur_email} ${l.cible} ${l.action} ${l.module}`.toLowerCase();
      if (!texte.includes(q)) return false;
    }
    return true;
  });

  // ── Helpers labels ──
  const labelModule = (id: string) => {
    if (id === "securite") return "Sécurité";
    return MODULES.find((m) => m.id === id)?.label || id;
  };
  const labelAction = (moduleId: string, actionId: string) => {
    if (moduleId === "securite") return LABELS_SECURITE[actionId] || actionId;
    const mod = MODULES.find((m) => m.id === moduleId);
    return mod?.actions.find((a) => a.id === actionId)?.label || actionId;
  };
  const labelChamp = (c: string) => LABELS_CHAMPS[c] || c;

  // Label d'une action de permission (ex: produits + creer → "Produits : Créer un produit")
  const labelPermission = (moduleId: string, actionId: string) => {
    const mod = MODULES.find((m) => m.id === moduleId);
    const labelMod = mod?.label || moduleId;
    const labelAct = mod?.actions.find((a) => a.id === actionId)?.label || actionId;
    return `${labelMod} : ${labelAct}`;
  };

  const verbeAction = (action: string): string => {
    const verbes: Record<string, string> = {
      creer: "a créé",
      ajouter: "a ajouté",
      modifier: "a modifié",
      supprimer: "a supprimé",
      retirer: "a retiré",
      connexion: "s'est connecté(e) —",
      echec_2fa: "a échoué à la vérification 2FA —",
      activation_2fa: "a activé la 2FA —",
    };
    return verbes[action] || `a effectué « ${action} » sur`;
  };

  const resumeLog = (l: Log): string => {
    const qui = l.acteur_nom || l.acteur_email || "Quelqu'un";
    const verbe = verbeAction(l.action);
    const quoi = l.cible || labelModule(l.module);
    return `${qui} ${verbe} ${quoi}`;
  };

  const lisibleUserAgent = (ua: string): string => {
    if (!ua) return "Inconnu";
    let navigateur = "Navigateur inconnu";
    const mNav = ua.match(/(Edg|OPR|Chrome|Firefox|Safari)\/(\d+)/);
    if (mNav) {
      const nom: Record<string, string> = { Edg: "Edge", OPR: "Opera", Chrome: "Chrome", Firefox: "Firefox", Safari: "Safari" };
      navigateur = `${nom[mNav[1]] || mNav[1]} ${mNav[2]}`;
    }
    let os = "";
    if (/Windows/.test(ua)) os = "Windows";
    else if (/Mac OS X/.test(ua)) os = "macOS";
    else if (/Android/.test(ua)) os = "Android";
    else if (/iPhone|iPad|iOS/.test(ua)) os = "iOS";
    else if (/Linux/.test(ua)) os = "Linux";
    return os ? `${navigateur} sur ${os}` : navigateur;
  };

  const formatDateHeure = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const formatDatePrecise = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const couleurAction = (action: string) => {
    if (action === "supprimer" || action === "retirer" || action === "echec_2fa") return "text-red-600 border-red-200 bg-red-50";
    if (action === "creer" || action === "ajouter") return "text-green-700 border-green-200 bg-green-50";
    if (action === "connexion") return "text-blue-700 border-blue-200 bg-blue-50";
    if (action === "activation_2fa") return "text-[#8a6d35] border-[#B8985A]/30 bg-[#B8985A]/10";
    return "text-[#1A2332]/70 border-[#1A2332]/15 bg-[#EFE9DC]";
  };

  const iconeAction = (action: string): string => {
    switch (action) {
      case "creer":
      case "ajouter":
        return "M12 5v14M5 12h14";
      case "supprimer":
      case "retirer":
        return "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6";
      case "modifier":
        return "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z";
      case "connexion":
        return "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3";
      case "echec_2fa":
        return "M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z";
      case "activation_2fa":
        return "M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z";
      default:
        return "M12 8v4l3 3M3.05 11a9 9 0 1 1 .5 4M3 4v5h5";
    }
  };

  // Formate une valeur simple de façon lisible
  const formatValeur = (champ: string, v: any): string => {
    if (v === null || v === undefined || v === "") return "(vide)";
    if (typeof v === "boolean") return v ? "Oui" : "Non";
    if (champ === "price") return `${Number(v).toLocaleString("fr-FR")} €`;
    if (Array.isArray(v)) return v.length ? v.join(", ") : "(aucun)";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };

  // Diff des permissions (cas spécial module admins)
  // Renvoie { ajoutees: string[], retirees: string[] }
  const diffPermissions = (avant: any, apres: any) => {
    const pa = (avant && typeof avant === "object" && !Array.isArray(avant)) ? avant : {};
    const pp = (apres && typeof apres === "object" && !Array.isArray(apres)) ? apres : {};
    const ajoutees: string[] = [];
    const retirees: string[] = [];

    const tousModules = new Set([...Object.keys(pa), ...Object.keys(pp)]);
    tousModules.forEach((mod) => {
      const actionsAvant: string[] = Array.isArray(pa[mod]) ? pa[mod] : [];
      const actionsApres: string[] = Array.isArray(pp[mod]) ? pp[mod] : [];
      actionsApres.forEach((act) => {
        if (!actionsAvant.includes(act)) ajoutees.push(labelPermission(mod, act));
      });
      actionsAvant.forEach((act) => {
        if (!actionsApres.includes(act)) retirees.push(labelPermission(mod, act));
      });
    });
    return { ajoutees, retirees };
  };

  // Diff du stock par taille
  const diffStock = (avant: any, apres: any): string[] => {
    const sa = (avant && typeof avant === "object") ? avant : {};
    const sp = (apres && typeof apres === "object") ? apres : {};
    const lignes: string[] = [];
    const toutesTailles = new Set([...Object.keys(sa), ...Object.keys(sp)]);
    toutesTailles.forEach((t) => {
      const va = Number(sa[t]) || 0;
      const vp = Number(sp[t]) || 0;
      if (va !== vp) lignes.push(`${t} : ${va} → ${vp}`);
    });
    return lignes;
  };

  // Construit une liste de changements lisibles entre avant et après
  type Changement = { label: string; avant?: string; apres?: string; liste?: string[]; type: "valeur" | "liste" };
  const construireChangements = (l: Log): Changement[] => {
    const avant = l.etat_avant;
    const apres = l.etat_apres;
    if (!avant || !apres) return [];

    const champsIgnores = ["updated_at", "created_at", "id"];
    const changements: Changement[] = [];
    const tousChamps = new Set([...Object.keys(avant), ...Object.keys(apres)]);

    tousChamps.forEach((champ) => {
      if (champsIgnores.includes(champ)) return;
      const va = JSON.stringify(avant[champ]);
      const vp = JSON.stringify(apres[champ]);
      if (va === vp) return;

      // Cas spécial : permissions
      if (champ === "permissions") {
        const { ajoutees, retirees } = diffPermissions(avant[champ], apres[champ]);
        const liste: string[] = [];
        ajoutees.forEach((p) => liste.push(`+ ${p}`));
        retirees.forEach((p) => liste.push(`− ${p}`));
        if (liste.length) changements.push({ label: "Permissions", liste, type: "liste" });
        return;
      }

      // Cas spécial : stock par taille
      if (champ === "stock_by_size") {
        const liste = diffStock(avant[champ], apres[champ]);
        if (liste.length) changements.push({ label: "Stock", liste, type: "liste" });
        return;
      }

      // Cas général
      changements.push({
        label: labelChamp(champ),
        avant: formatValeur(champ, avant[champ]),
        apres: formatValeur(champ, apres[champ]),
        type: "valeur",
      });
    });

    return changements;
  };

  // Liste lisible du contenu d'un objet créé/supprimé (pour affichage clair, pas JSON)
  const listerContenu = (obj: Record<string, any> | null): { label: string; valeur: string }[] => {
    if (!obj) return [];
    const champsIgnores = ["updated_at", "created_at", "id"];
    const lignes: { label: string; valeur: string }[] = [];
    Object.keys(obj).forEach((champ) => {
      if (champsIgnores.includes(champ)) return;
      if (champ === "permissions") {
        const perms = obj[champ];
        if (perms && typeof perms === "object") {
          const parts: string[] = [];
          Object.keys(perms).forEach((mod) => {
            const actions: string[] = Array.isArray(perms[mod]) ? perms[mod] : [];
            actions.forEach((act) => parts.push(labelPermission(mod, act)));
          });
          if (parts.length) lignes.push({ label: "Permissions", valeur: parts.join(" · ") });
        }
        return;
      }
      if (champ === "stock_by_size") {
        const stock = obj[champ];
        if (stock && typeof stock === "object") {
          const parts = Object.keys(stock).map((t) => `${t}: ${stock[t]}`);
          if (parts.length) lignes.push({ label: "Stock", valeur: parts.join(", ") });
        }
        return;
      }
      const val = formatValeur(champ, obj[champ]);
      if (val && val !== "(vide)") lignes.push({ label: labelChamp(champ), valeur: val });
    });
    return lignes;
  };

  // ── Génère un PDF pour une OU plusieurs actions ──
  const genererPDF = async (liste: Log[], nomFichier: string, sousTitre: string) => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const margeG = 15;
    const largeur = 210;
    const hauteur = 297;
    const basPage = hauteur - 18;
    let y = 0;

    const or: [number, number, number] = [184, 152, 90];
    const marine: [number, number, number] = [26, 35, 50];
    const gris: [number, number, number] = [120, 120, 120];

    const enTetePage = () => {
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, largeur, 22, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("NORTHSTONE", margeG, 14);
      doc.setTextColor(or[0], or[1], or[2]);
      doc.setFontSize(8);
      doc.text("JOURNAL D'ACTIVITÉ", largeur - margeG, 14, { align: "right" });
      y = 30;
    };

    let numPage = 1;
    const piedPage = () => {
      doc.setTextColor(gris[0], gris[1], gris[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(`Document confidentiel — Northstone · Page ${numPage}`, largeur / 2, hauteur - 10, { align: "center" });
    };

    const verifEspace = (besoin: number) => {
      if (y + besoin > basPage) {
        piedPage();
        doc.addPage();
        numPage++;
        enTetePage();
      }
    };

    enTetePage();

    doc.setTextColor(marine[0], marine[1], marine[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Journal d'activité", margeG, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(gris[0], gris[1], gris[2]);
    doc.text(`Exporté le ${new Date().toLocaleString("fr-FR")}`, margeG, y);
    y += 5;
    doc.text(sousTitre, margeG, y);
    y += 8;

    doc.setDrawColor(or[0], or[1], or[2]);
    doc.setLineWidth(0.5);
    doc.line(margeG, y, largeur - margeG, y);
    y += 8;

    liste.forEach((l, index) => {
      verifEspace(45);

      doc.setFillColor(245, 241, 234);
      doc.rect(margeG, y - 4, largeur - 2 * margeG, 7, "F");
      doc.setTextColor(marine[0], marine[1], marine[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`${index + 1}. ${labelAction(l.module, l.action)} — ${labelModule(l.module)}`, margeG + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(gris[0], gris[1], gris[2]);
      doc.text(formatDateHeure(l.created_at), largeur - margeG - 2, y, { align: "right" });
      y += 7;

      doc.setTextColor(marine[0], marine[1], marine[2]);
      doc.setFontSize(9);
      const resume = doc.splitTextToSize(resumeLog(l), largeur - 2 * margeG);
      doc.text(resume, margeG, y);
      y += resume.length * 4.5 + 1;

      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      const ligne = (label: string, valeur: string) => {
        verifEspace(5);
        doc.setFont("helvetica", "bold");
        doc.text(`${label} :`, margeG, y);
        doc.setFont("helvetica", "normal");
        const txt = doc.splitTextToSize(valeur || "—", largeur - 2 * margeG - 32);
        doc.text(txt, margeG + 30, y);
        y += Math.max(txt.length * 4, 4.5);
      };

      ligne("Date précise", formatDatePrecise(l.created_at));
      ligne("Acteur", `${l.acteur_nom || "—"} (${l.acteur_email})`);
      ligne("Adresse IP", l.adresse_ip || "— (locale)");
      if (l.localisation) ligne("Localisation", l.localisation);
      ligne("Appareil", lisibleUserAgent(l.user_agent));

      // Changements détaillés
      const changements = construireChangements(l);
      if (changements.length > 0) {
        verifEspace(6);
        doc.setFont("helvetica", "bold");
        doc.text("Détail des modifications :", margeG, y);
        y += 4.5;
        doc.setFont("helvetica", "normal");
        changements.forEach((c) => {
          if (c.type === "valeur") {
            verifEspace(5);
            const txt = doc.splitTextToSize(`• ${c.label} : ${c.avant} → ${c.apres}`, largeur - 2 * margeG - 4);
            doc.text(txt, margeG + 3, y);
            y += txt.length * 4;
          } else if (c.liste) {
            verifEspace(5);
            doc.text(`• ${c.label} :`, margeG + 3, y);
            y += 4;
            c.liste.forEach((item) => {
              verifEspace(4);
              const txt = doc.splitTextToSize(`   ${item}`, largeur - 2 * margeG - 8);
              doc.text(txt, margeG + 6, y);
              y += txt.length * 4;
            });
          }
        });
      } else if (!l.etat_avant && l.etat_apres) {
        verifEspace(6);
        doc.setFont("helvetica", "bold");
        doc.text("Élément créé :", margeG, y);
        y += 4.5;
        doc.setFont("helvetica", "normal");
        listerContenu(l.etat_apres).forEach((item) => {
          verifEspace(5);
          const txt = doc.splitTextToSize(`• ${item.label} : ${item.valeur}`, largeur - 2 * margeG - 4);
          doc.text(txt, margeG + 3, y);
          y += txt.length * 4;
        });
      } else if (l.etat_avant && !l.etat_apres) {
        verifEspace(6);
        doc.setFont("helvetica", "bold");
        doc.text("Élément supprimé :", margeG, y);
        y += 4.5;
        doc.setFont("helvetica", "normal");
        listerContenu(l.etat_avant).forEach((item) => {
          verifEspace(5);
          const txt = doc.splitTextToSize(`• ${item.label} : ${item.valeur}`, largeur - 2 * margeG - 4);
          doc.text(txt, margeG + 3, y);
          y += txt.length * 4;
        });
      }

      y += 3;
      doc.setDrawColor(220, 215, 205);
      doc.setLineWidth(0.2);
      doc.line(margeG, y, largeur - margeG, y);
      y += 6;
    });

    piedPage();
    doc.save(nomFichier);
  };

  const exporterTout = async () => {
    setExportEnCours(true);
    try {
      const dateFichier = new Date().toISOString().slice(0, 10);
      await genererPDF(logs, `northstone-journal-${dateFichier}.pdf`, `${logs.length} action(s) — historique complet`);
    } catch (e: any) {
      alert("Erreur lors de l'export PDF : " + (e.message || "inconnue"));
    }
    setExportEnCours(false);
  };

  const exporterUne = async (l: Log) => {
    try {
      const dateFichier = new Date(l.created_at).toISOString().slice(0, 10);
      await genererPDF([l], `northstone-action-${l.id}-${dateFichier}.pdf`, `Action n°${l.id} — export individuel`);
    } catch (e: any) {
      alert("Erreur lors de l'export PDF : " + (e.message || "inconnue"));
    }
  };

  const inputClass =
    "bg-transparent border border-[#1A2332]/20 px-3 py-2 text-sm text-[#1A2332] focus:outline-none focus:border-[#B8985A] transition-colors";

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

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#1A2332]/40 mb-2">Traçabilité</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A2332]">
              Journal d'activité
            </h1>
            <p className="text-sm text-[#1A2332]/55 mt-2">
              Historique de toutes les actions effectuées dans l'administration. Cliquez sur une ligne pour voir le détail complet.
            </p>
          </div>
          <button
            onClick={exporterTout}
            disabled={exportEnCours || logs.length === 0}
            className="inline-flex items-center gap-2 bg-black text-[#B8985A] border border-black px-5 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1F1F1F] transition-all disabled:opacity-40 whitespace-nowrap"
            style={{ cursor: exportEnCours || logs.length === 0 ? "not-allowed" : "pointer" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {exportEnCours ? "Génération..." : "Exporter tout en PDF"}
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-white border border-[#1A2332]/10 border-t-2 border-t-[#B8985A] p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/50 mb-1">Personne</label>
            <select className={inputClass} value={filtreActeur} onChange={(e) => setFiltreActeur(e.target.value)}>
              <option value="tous">Toutes</option>
              {acteurs.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/50 mb-1">Module</label>
            <select className={inputClass} value={filtreModule} onChange={(e) => setFiltreModule(e.target.value)}>
              <option value="tous">Tous</option>
              {MODULES.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
              <option value="securite">Sécurité</option>
            </select>
          </div>
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#1A2332]/50 mb-1">Recherche</label>
            <input
              className={inputClass}
              placeholder="Nom, cible, action..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
        </div>

        <p className="text-[11px] text-[#1A2332]/40 mb-3">
          {loading ? "Chargement..." : `${logsFiltres.length} action(s) affichée(s) · ${logs.length} au total`}
        </p>

        {loading ? (
          <p className="text-center py-10 text-[#1A2332]/40 text-sm">Chargement...</p>
        ) : logsFiltres.length === 0 ? (
          <p className="text-sm text-[#1A2332]/40 py-4">Aucune action trouvée.</p>
        ) : (
          <div className="space-y-2">
            {logsFiltres.map((l) => {
              const estOuvert = ouvert === l.id;
              const changements = construireChangements(l);
              return (
                <div key={l.id} className="bg-white border border-[#1A2332]/10">
                  <div className="flex items-stretch">
                    <button
                      onClick={() => setOuvert(estOuvert ? null : l.id)}
                      className="flex-1 text-left p-4 flex items-start justify-between gap-4 flex-wrap hover:bg-[#F5F1EA]/50 transition-colors"
                      style={{ background: "none", cursor: "pointer" }}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-[#1A2332]/10 bg-[#F5F1EA] mt-0.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A2332" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d={iconeAction(l.action)} />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[9px] tracking-[0.15em] uppercase border px-2 py-0.5 ${couleurAction(l.action)}`}>
                              {labelAction(l.module, l.action)}
                            </span>
                            <span className="text-[9px] tracking-[0.1em] uppercase text-[#1A2332]/50 bg-[#EFE9DC] px-2 py-0.5">
                              {labelModule(l.module)}
                            </span>
                          </div>
                          <p className="text-sm text-[#1A2332] mt-2">{resumeLog(l)}</p>
                          <p className="text-xs text-[#1A2332]/50 mt-1">
                            {l.acteur_nom || l.acteur_email}
                            {l.acteur_nom && l.acteur_email && ` · ${l.acteur_email}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <p className="text-[11px] text-[#1A2332]/40 whitespace-nowrap">
                          {formatDateHeure(l.created_at)}
                        </p>
                        <span className="text-[#1A2332]/30 text-xs">{estOuvert ? "▲" : "▼"}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => exporterUne(l)}
                      title="Exporter cette action en PDF"
                      className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-4 border-l border-[#1A2332]/10 text-[#1A2332]/50 hover:text-[#B8985A] hover:bg-[#F5F1EA]/50 transition-colors"
                      style={{ background: "none", cursor: "pointer" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span className="text-[8px] tracking-[0.1em] uppercase">PDF</span>
                    </button>
                  </div>

                  {estOuvert && (
                    <div className="border-t border-[#1A2332]/10 p-4 bg-[#F5F1EA]/30 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        <div>
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Date précise</span>
                          <p className="text-[#1A2332] mt-0.5">{formatDatePrecise(l.created_at)}</p>
                        </div>
                        <div>
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Acteur</span>
                          <p className="text-[#1A2332] mt-0.5">{l.acteur_nom || "—"} · {l.acteur_email}</p>
                        </div>
                        <div>
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Adresse IP</span>
                          <p className="text-[#1A2332] mt-0.5">{l.adresse_ip || "— (locale)"}</p>
                        </div>
                        <div>
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Localisation</span>
                          <p className="text-[#1A2332] mt-0.5">{l.localisation || "— (locale ou indisponible)"}</p>
                        </div>
                        <div>
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Appareil</span>
                          <p className="text-[#1A2332] mt-0.5">{lisibleUserAgent(l.user_agent)}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[#1A2332]/40 uppercase tracking-[0.15em] text-[9px]">Navigateur (détail technique)</span>
                          <p className="text-[#1A2332]/60 mt-0.5 break-all text-[11px]">{l.user_agent || "—"}</p>
                        </div>
                      </div>

                      {/* Changements détaillés (modification) */}
                      {changements.length > 0 && (
                        <div>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-[#1A2332]/40 mb-2">
                            Détail des modifications
                          </p>
                          <div className="space-y-1.5">
                            {changements.map((c, i) => (
                              <div key={i} className="text-xs bg-white border border-[#1A2332]/10 p-2">
                                <span className="font-semibold text-[#1A2332]">{c.label}</span>
                                {c.type === "valeur" ? (
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="text-red-600 line-through break-all">{c.avant}</span>
                                    <span className="text-[#1A2332]/30">→</span>
                                    <span className="text-green-700 break-all">{c.apres}</span>
                                  </div>
                                ) : (
                                  <div className="mt-1 space-y-0.5">
                                    {c.liste?.map((item, j) => (
                                      <p key={j} className={`break-all ${item.startsWith("+") ? "text-green-700" : item.startsWith("−") ? "text-red-600" : "text-[#1A2332]/70"}`}>
                                        {item}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Création */}
                      {changements.length === 0 && !l.etat_avant && l.etat_apres && (
                        <div>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-green-700/60 mb-2">
                            Élément créé
                          </p>
                          <div className="space-y-1 bg-white border border-[#1A2332]/10 p-3">
                            {listerContenu(l.etat_apres).map((item, i) => (
                              <p key={i} className="text-xs text-[#1A2332]/70 break-all">
                                <span className="font-semibold text-[#1A2332]">{item.label} :</span> {item.valeur}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suppression */}
                      {changements.length === 0 && l.etat_avant && !l.etat_apres && (
                        <div>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-red-600/60 mb-2">
                            Élément supprimé
                          </p>
                          <div className="space-y-1 bg-white border border-[#1A2332]/10 p-3">
                            {listerContenu(l.etat_avant).map((item, i) => (
                              <p key={i} className="text-xs text-[#1A2332]/70 break-all">
                                <span className="font-semibold text-[#1A2332]">{item.label} :</span> {item.valeur}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}