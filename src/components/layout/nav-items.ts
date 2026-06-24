/** Primary navigation. `key` maps to the `Nav` message namespace. */
export const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/install", key: "install" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
