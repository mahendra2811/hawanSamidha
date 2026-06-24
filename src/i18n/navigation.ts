import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation primitives. Use <Link> for navigation everywhere.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
