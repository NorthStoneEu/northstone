const guarantees = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Qualité d'exception",
    description: "Ateliers européens sélectionnés",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="8" width="18" height="12" rx="1" />
        <path d="M7 8V5a5 5 0 0110 0v3" />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: "Authentification cryptographique",
    description: "Triangulation infalsifiable",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="6" width="20" height="14" rx="1" />
        <path d="M2 10h20" />
        <path d="M8 14h2" />
      </svg>
    ),
    title: "Livraison offerte",
    description: "Dès 100€ d'achat",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 12a9 9 0 109-9" />
        <polyline points="3 4 3 12 11 12" />
      </svg>
    ),
    title: "Retour 30 jours",
    description: "Sauf pièces de drop",
  },
];

export default function Reassurance() {
  return (
    <section className="bg-[#F5F1EA] border-y border-[#1A2332]/10 py-6 md:py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {guarantees.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 text-center md:text-left"
            >
              <div className="text-[#B8985A] flex-shrink-0">{item.icon}</div>
              <div className="flex flex-col">
                <p className="text-[12px] sm:text-[13px] font-semibold text-[#1A2332] tracking-tight leading-tight uppercase">
                  {item.title}
                </p>
                <p className="text-[11px] sm:text-[12px] text-[#6B6B6B] mt-0.5 leading-tight">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}