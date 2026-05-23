import Link from "next/link";

const columns = [
  {
    title: "Boutique",
    links: [
      { label: "Homme", href: "/homme" },
      { label: "Femme", href: "/femme" },
      { label: "Drops", href: "/drops" },
      { label: "Accessoires", href: "/accessoires" },
    ],
  },
  {
    title: "Maison",
    links: [
      { label: "Notre histoire", href: "/about" },
      { label: "Savoir-faire", href: "/savoir-faire" },
      { label: "Authenticité", href: "/authenticite" },
      { label: "Boutiques", href: "/boutiques" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Livraison", href: "/livraison" },
      { label: "Retours", href: "/retours" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Suivre",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "TikTok", href: "https://tiktok.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
];

const legalLinks = [
  { label: "CGV", href: "/cgv" },
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "Cookies", href: "/cookies" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Bloc haut : Logo + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pb-16 border-b border-white/10">
          {/* Logo + tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-[0.2em] mb-4">
              NORTHSTONE
            </h2>
            <p className="text-sm text-white/60 max-w-sm leading-relaxed">
              Maison française de vêtements brodés en éditions limitées.
              Chaque pièce est une promesse de rareté et d'authenticité.
            </p>
          </div>

          {/* Newsletter */}
          <div className="lg:max-w-md lg:ml-auto w-full">
            <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/60 mb-3">
              Newsletter
            </p>
            <h3 className="text-lg sm:text-xl font-semibold mb-6">
              Soyez prévenu·e des prochains drops.
            </h3>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 bg-transparent border border-white/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#B8985A] text-[#0A0A0A] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#D4B574] transition-colors whitespace-nowrap"
              >
                S'inscrire
              </button>
            </form>
            <p className="text-[10px] text-white/40 mt-3">
              Pas de spam. Désabonnement en un clic.
            </p>
          </div>
        </div>

        {/* Bloc milieu : 4 colonnes de liens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-16">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/60 mb-5">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white hover:text-white/60 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bloc bas : Copyright + Mentions légales */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-10 border-t border-white/10">
          <p className="text-xs text-white/40">
            © 2026 Northstone. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}