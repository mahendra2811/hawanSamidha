/**
 * Homepage hero background slide(s).
 *
 * One entry => a static hero (still auto/manually device- and theme-aware,
 * just no slideshow timer/controls). Two or more entries => an
 * auto-advancing, manually-swappable slideshow.
 *
 * Each slide can supply up to 4 image variants. Only `desktop` is required —
 * everything else falls back sensibly:
 *   desktopDark  -> desktop            (no dark asset? reuse light)
 *   mobile       -> desktop            (no mobile asset? reuse desktop)
 *   mobileDark   -> mobileDark ?? desktopDark ?? mobile ?? desktop
 *
 * The FIRST slide's desktop+mobile images are the LCP / priority images.
 * Add, remove, or reorder slides here — no component change needed. Drop
 * new files in public/hero/ first.
 */
export type HeroSlide = {
  /** Desktop, light theme. Required — the fallback for every other variant. */
  desktop: string;
  /** Desktop, dark theme. */
  desktopDark?: string;
  /** Mobile (<768px), light theme. */
  mobile?: string;
  /** Mobile (<768px), dark theme. */
  mobileDark?: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    desktop: "/hero/home-hero.webp",
    mobile: "/hero/home-hero-mobile.webp",
  },
  {
    desktop: "/hero/lightbanner.webp",
    desktopDark: "/hero/darkbanner2.webp",
    mobileDark: "/hero/mobilebanner2.webp",
  },
];

export function resolveHeroSlide(slide: HeroSlide, theme: "light" | "dark") {
  const desktopLight = slide.desktop;
  const desktopDark = slide.desktopDark ?? desktopLight;
  const mobileLight = slide.mobile ?? desktopLight;
  const mobileDark = slide.mobileDark ?? desktopDark ?? mobileLight;
  return {
    desktop: theme === "dark" ? desktopDark : desktopLight,
    mobile: theme === "dark" ? mobileDark : mobileLight,
  };
}
