"use client";

import { forwardRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTabVisible } from "./useTabVisible";

export const ContactFab = forwardRef<HTMLButtonElement, { open: boolean; onToggle: () => void }>(
  function ContactFab({ open, onToggle }, ref) {
    const t = useTranslations("FloatingContact");
    const reduceMotion = useReducedMotion();
    const tabVisible = useTabVisible();
    const idle = !open && !reduceMotion && tabVisible;

    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        aria-label={open ? t("closeLabel") : t("openLabel")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="fixed left-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[35] grid h-14 w-14 place-items-center rounded-full text-on-gold shadow-lg shadow-saffron/20 md:bottom-[calc(1rem+env(safe-area-inset-bottom))]"
      >
        <motion.span
          className="grad-gold absolute inset-0 rounded-full"
          animate={idle ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={idle ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
        />
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 grid h-3.5 w-3.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-ember" />
          </span>
        )}
        <span className="relative grid h-6 w-6 place-items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "chat"}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 grid place-items-center"
            >
              {open ? <X size={24} aria-hidden /> : <MessageCircle size={24} aria-hidden />}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    );
  },
);
