import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Adresse expéditeur. Tant que le domaine n'est pas vérifié dans Resend,
// on utilise onboarding@resend.dev (fonctionne pour les tests).
// Une fois northstone.fr vérifié → "Northstone <commandes@northstone.fr>".
const FROM = "Northstone <onboarding@resend.dev>";

type ArticleEmail = {
  name?: string;
  price?: number;
  color?: string;
  size?: string;
  qty?: number;
};

type DonneesCommande = {
  numero: string;
  emailClient: string;
  articles: ArticleEmail[];
  montantTotal: number; // en centimes
  devise?: string;
  adresseLivraison?: any;
  type?: string; // "drop" | "permanente"
};

const C = {
  creme: "#F5F1EA",
  cremeWarm: "#EFE9DC",
  marine: "#1A2332",
  or: "#B8985A",
  noir: "#0A0A0A",
};

function formatPrix(centimes: number): string {
  return `${(centimes / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function formatPrixEuro(euros: number): string {
  return `${euros.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function lignesAdresse(adr: any): string[] {
  if (!adr) return [];
  return [
    adr.line1,
    adr.line2,
    [adr.postal_code, adr.city].filter(Boolean).join(" "),
    adr.country,
  ].filter(Boolean);
}

function construireHTML(d: DonneesCommande): string {
  const estDrop = d.type === "drop";
  const adresse = lignesAdresse(d.adresseLivraison);

  const lignesArticles = (d.articles || [])
    .map((a) => {
      const sousTotal = (Number(a.price) || 0) * (a.qty || 1);
      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid rgba(26,35,50,0.08);">
            <div style="font-size:14px;font-weight:600;color:${C.marine};">${a.name || "Pièce Northstone"}</div>
            <div style="font-size:12px;color:rgba(26,35,50,0.55);margin-top:3px;">
              ${[a.color, a.size ? `Taille ${a.size}` : "", a.qty ? `Quantité ${a.qty}` : ""].filter(Boolean).join(" · ")}
            </div>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid rgba(26,35,50,0.08);text-align:right;font-size:14px;font-weight:600;color:${C.marine};white-space:nowrap;">
            ${a.price ? formatPrixEuro(sousTotal) : "—"}
          </td>
        </tr>`;
    })
    .join("");

  const blocAdresse =
    adresse.length > 0
      ? `
      <tr><td style="padding:24px 32px 0;">
        <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${C.or};font-weight:600;margin-bottom:10px;">Livraison</div>
        <div style="font-size:13px;color:${C.marine};line-height:1.7;">
          ${adresse.map((l) => `<div>${l}</div>`).join("")}
        </div>
      </td></tr>`
      : "";

  const messageDrop = estDrop
    ? `<div style="font-size:13px;color:rgba(26,35,50,0.7);line-height:1.7;margin-top:8px;">Votre pièce numérotée sera fabriquée après la clôture du drop, puis expédiée avec remise contre signature. Pièce unique, non remboursable.</div>`
    : `<div style="font-size:13px;color:rgba(26,35,50,0.7);line-height:1.7;margin-top:8px;">Votre commande est en cours de préparation. Vous recevrez un suivi dès son expédition.</div>`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
</head>
<body style="margin:0;padding:0;background-color:${C.cremeWarm};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.cremeWarm};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${C.creme};border:1px solid rgba(26,35,50,0.1);">

          <!-- Filet or -->
          <tr><td style="height:3px;background-color:${C.or};font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- En-tête logo -->
          <tr>
            <td style="background-color:${C.noir};padding:28px 32px;text-align:center;">
              <div style="font-size:20px;font-weight:800;letter-spacing:0.3em;color:#ffffff;">NORTHSTONE</div>
              ${estDrop ? `<div style="font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:${C.or};margin-top:8px;">Édition limitée</div>` : ""}
            </td>
          </tr>

          <!-- Confirmation -->
          <tr>
            <td style="padding:36px 32px 0;text-align:center;">
              <div style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:${C.or};font-weight:600;margin-bottom:12px;">Commande confirmée</div>
              <div style="font-size:22px;font-weight:800;color:${C.marine};letter-spacing:-0.01em;">Merci pour votre commande</div>
              <div style="font-size:13px;color:rgba(26,35,50,0.6);margin-top:10px;">Commande n° <span style="font-weight:700;color:${C.marine};">${d.numero}</span></div>
              ${messageDrop}
            </td>
          </tr>

          <!-- Articles -->
          <tr>
            <td style="padding:28px 32px 0;">
              <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${C.or};font-weight:600;margin-bottom:6px;">Votre commande</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${lignesArticles}
                <tr>
                  <td style="padding:16px 0 0;font-size:15px;font-weight:800;color:${C.marine};">Total payé</td>
                  <td style="padding:16px 0 0;text-align:right;font-size:15px;font-weight:800;color:${C.marine};">${formatPrix(d.montantTotal)}</td>
                </tr>
              </table>
              <div style="font-size:10px;color:rgba(26,35,50,0.45);margin-top:6px;">TVA incluse · ${(d.devise || "EUR").toUpperCase()}</div>
            </td>
          </tr>

          ${blocAdresse}

          <!-- Bouton suivi -->
          <tr>
            <td style="padding:32px 32px;text-align:center;">
              <a href="https://northstone.fr/compte/commandes" style="display:inline-block;background-color:${C.noir};color:${C.or};text-decoration:none;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;padding:15px 36px;">Suivre ma commande</a>
            </td>
          </tr>

          <!-- Pied -->
          <tr>
            <td style="background-color:${C.cremeWarm};padding:24px 32px;text-align:center;border-top:1px solid rgba(26,35,50,0.08);">
              <div style="font-size:11px;color:rgba(26,35,50,0.5);line-height:1.7;">
                Une question ? Écrivez-nous à <a href="mailto:contact@northstone.fr" style="color:${C.or};text-decoration:none;">contact@northstone.fr</a>
              </div>
              <div style="font-size:10px;color:rgba(26,35,50,0.4);margin-top:12px;letter-spacing:0.1em;">© 2026 Northstone · Pièces numérotées et certifiées</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Envoie l'email de confirmation. Ne fait jamais planter le webhook en cas d'erreur.
export async function envoyerEmailConfirmation(d: DonneesCommande): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY absente — email non envoyé.");
    return;
  }
  if (!d.emailClient) {
    console.warn("⚠️ Pas d'email client — email non envoyé.");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [d.emailClient],
      subject: `Confirmation de votre commande ${d.numero} — Northstone`,
      html: construireHTML(d),
    });
    if (error) {
      console.error("⚠️ Erreur envoi email Resend:", error);
    } else {
      console.log(`✅ Email de confirmation envoyé à ${d.emailClient} (${d.numero})`);
    }
  } catch (e) {
    console.error("⚠️ Exception envoi email:", e);
  }
}