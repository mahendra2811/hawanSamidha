"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { site } from "@/config/site";
import { useTabVisible } from "./useTabVisible";
import { WhatsAppIcon } from "./WhatsAppIcon";

/**
 * Bottom-right FAB → wa.me with a prefilled message. Uses `site.whatsapp` (the
 * same source as every other WhatsApp button on the site) so behavior matches
 * the rest of the site: a real fallback number ships by default, env-overridable.
 */
export function WhatsAppFab() {
  const t = useTranslations("FloatingContact");
  const reduceMotion = useReducedMotion();
  const tabVisible = useTabVisible();
  const animate = !reduceMotion && tabVisible;

  if (!site.whatsapp) return null;

  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t("whatsappPrefill"))}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappLabel")}
      className="fixed right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[35] grid h-14 w-14 place-items-center md:bottom-[calc(1rem+env(safe-area-inset-bottom))]"
    >
      {animate && (
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ opacity: [0.4, 0], scale: [1, 1.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          aria-hidden
        />
      )}
      <motion.span
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20"
        animate={animate ? { rotate: [0, -8, 8, 0] } : undefined}
        transition={animate ? { duration: 0.6, repeat: Infinity, repeatDelay: 3.4, ease: "easeInOut" } : undefined}
      >
        <WhatsAppIcon />
      </motion.span>
    </a>
  );
}
