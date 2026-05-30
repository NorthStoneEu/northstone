import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrappers autour des Link et navigation de Next.js
// pour qu'ils prennent en compte la locale automatiquement
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);