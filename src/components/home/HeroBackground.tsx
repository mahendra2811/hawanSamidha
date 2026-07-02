"use client";

import { useCallback, useEffect, useState } from "react";
import { getImageProps } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTheme } from "@/lib/use-theme";
import { resolveHeroSlide, type HeroSlide } from "@/config/hero-images";

const SLIDE_INTERVAL_MS = 6000;
// Matches the site's `md` breakpoint (BottomNav, Header nav, etc.) so the
// image switch lines up with every other responsive decision on the page.
const DESKTOP_QUERY = "(min-width: 768px)";

const IMAGE_CLASS =
  "-z-10 object-cover object-[90%_center] transition-opacity duration-700 ease-in-out lg:object-center";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * One slide, rendered as a native <picture> so the browser — not JS — picks
 * the desktop or mobile source via a real media query. Only one of the two
 * ever downloads; there's no double-fetch and no client-side layout-shift
 * risk from a JS breakpoint check running after hydration.
 */
function SlidePicture({
  desktopSrc,
  mobileSrc,
  active,
  priority,
}: {
  desktopSrc: string;
  mobileSrc: string;
  active: boolean;
  priority: boolean;
}) {
  const common = { alt: "", fill: true as const, sizes: "100vw", priority };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktopSrc });
  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: mobileSrc });

  return (
    <picture>
      <source media={DESKTOP_QUERY} srcSet={desktopSrcSet} />
      <source srcSet={mobileSrcSet} />
      <img
        {...imgProps}
        alt=""
        aria-hidden
        className={IMAGE_CLASS}
        style={{ ...imgProps.style, opacity: active ? 1 : 0 }}
      />
    </picture>
  );
}

/**
 * Hero background. A single slide renders as a plain (device- and
 * theme-responsive) picture — no timers, no controls, no slideshow JS.
 *
 * With 2+ slides: only slide 0 is `priority` (the LCP candidate, painted
 * immediately). Every later slide isn't even mounted until the page's `load`
 * event fires, so it can't compete with the first paint for bandwidth — it
 * starts fetching, as a strictly lower ("second wave") priority, right after
 * the page is otherwise done loading. Slides then crossfade on an interval,
 * with manual prev/next + dot controls layered on top. Each slide can supply
 * separate desktop/mobile and light/dark images (see hero-images.ts); the
 * theme is tracked live via `useTheme()`.
 */
export function HeroBackground({ slides }: { slides: HeroSlide[] }) {
  const multi = slides.length > 1;
  const [index, setIndex] = useState(0);
  const [restMounted, setRestMounted] = useState(
    () => !multi || (typeof document !== "undefined" && document.readyState === "complete"),
  );
  const reducedMotion = usePrefersReducedMotion();
  const theme = useTheme();

  // Defer every slide after the first until the page has otherwise finished
  // loading — they simply aren't in the DOM (no request) until then.
  useEffect(() => {
    if (restMounted) return;
    const onLoad = () => setRestMounted(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [restMounted]);

  // Auto-advance. Resets on every index change (manual or automatic) so a
  // manual click doesn't get immediately overridden by a near-due tick.
  useEffect(() => {
    if (!multi || reducedMotion) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [multi, reducedMotion, slides.length, index]);

  const goTo = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  return (
    <>
      {slides.map((slide, i) => {
        if (i > 0 && !restMounted) return null;
        const { desktop, mobile } = resolveHeroSlide(slide, theme);
        return (
          <SlidePicture
            key={`${i}-${desktop}-${mobile}`}
            desktopSrc={desktop}
            mobileSrc={mobile}
            active={i === index}
            priority={i === 0}
          />
        );
      })}

      {multi && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-3 lg:bottom-5">
          {/* <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="grid h-8 w-8 place-items-center rounded-full bg-base/70 text-text backdrop-blur transition-colors hover:bg-base"
          >
            <ChevronLeft size={16} aria-hidden />
          </button> */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "bg-gold w-5" : "bg-base/70 hover:bg-base w-2",
                )}
              />
            ))}
          </div>
          {/* <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="grid h-8 w-8 place-items-center rounded-full bg-base/70 text-text backdrop-blur transition-colors hover:bg-base"
          >
            <ChevronRight size={16} aria-hidden />
          </button> */}
        </div>
      )}
    </>
  );
}
