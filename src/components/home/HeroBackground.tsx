"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

const SLIDE_INTERVAL_MS = 6000;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
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
 * Hero background. A single image renders exactly as a plain, static
 * `<Image priority>` — no timers, no controls, no extra JS.
 *
 * With 2+ images: only the FIRST is `priority` (the LCP candidate, painted
 * immediately). The rest are not even mounted until the page's `load` event
 * fires, so they can't compete with the first paint for bandwidth — they
 * start fetching, as a strictly lower ("second wave") priority, right after
 * the page is otherwise done loading. Then they crossfade on an interval,
 * with manual prev/next + dot controls layered on top.
 */
export function HeroBackground({ images }: { images: string[] }) {
  const multi = images.length > 1;
  const [index, setIndex] = useState(0);
  const [restMounted, setRestMounted] = useState(
    () => !multi || (typeof document !== "undefined" && document.readyState === "complete"),
  );
  const reducedMotion = usePrefersReducedMotion();

  // Defer loading every image after the first until the page has otherwise
  // finished loading — they simply aren't in the DOM (no request) until then.
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
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [multi, reducedMotion, images.length, index]);

  const goTo = useCallback(
    (next: number) => setIndex(((next % images.length) + images.length) % images.length),
    [images.length],
  );

  return (
    <>
      {images.map((src, i) => {
        if (i > 0 && !restMounted) return null;
        return (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="-z-10 object-cover object-[90%_center] transition-opacity duration-700 ease-in-out lg:object-center"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden
          />
        );
      })}

      {multi && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-3 lg:bottom-5">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="grid h-8 w-8 place-items-center rounded-full bg-base/70 text-text backdrop-blur transition-colors hover:bg-base"
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-5 bg-gold" : "w-2 bg-base/70 hover:bg-base",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="grid h-8 w-8 place-items-center rounded-full bg-base/70 text-text backdrop-blur transition-colors hover:bg-base"
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
      )}
    </>
  );
}
