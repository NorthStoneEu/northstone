import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Langues disponibles
  locales: ["fr", "en"],

  // Langue par défaut (utilisée pour la racine /)
  defaultLocale: "fr",

  // Pas de préfixe pour la langue par défaut
  // Exemple : /compte (FR) et /en/compte (EN)
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];