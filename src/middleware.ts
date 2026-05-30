import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes protégées (nécessitent d'être connecté)
const isProtectedRoute = createRouteMatcher([
  "/compte(.*)",
  "/checkout(.*)",
  "/panier(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Exclure les fichiers Next.js internes et statiques
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Toujours inclure les routes API
    "/(api|trpc)(.*)",
  ],
};