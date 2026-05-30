import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Middleware next-intl pour gérer les langues
const intlMiddleware = createMiddleware(routing);

// Routes protégées (nécessitent d'être connecté)
// On utilise une regex qui matche /compte, /en/compte, /fr/compte, etc.
const isProtectedRoute = createRouteMatcher([
  "/(.*)?/?compte(.*)",
  "/(.*)?/?checkout(.*)",
  "/(.*)?/?panier(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Protection Clerk d'abord
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Puis on laisse next-intl gérer la locale
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Exclure les fichiers Next.js internes et statiques
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};