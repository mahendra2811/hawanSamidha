"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUi } from "@/store/ui";
import { ContactFab } from "./ContactFab";
import { ContactPopup } from "./ContactPopup";
import { WhatsAppFab } from "./WhatsAppFab";

const SEEN_KEY = "ammedi-contact-popup-seen";
const AUTO_OPEN_DELAY = 5000;

/**
 * Global floating widget: WhatsApp FAB (bottom-right) + a Contact FAB (bottom-left)
 * that expands into a quick-enquiry popup. Auto-opens once per browser session,
 * then only opens on tap. Mounted once in the root layout, dynamically imported
 * with ssr:false so it never delays first paint.
 */
export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const cartOpen = useUi((s) => s.cartOpen);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // sessionStorage unavailable (private mode, etc.) — skip auto-open.
    }
    if (seen) return;

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // ignore
      }
      if (!useUi.getState().cartOpen) setOpen(true);
    }, AUTO_OPEN_DELAY);

    return () => window.clearTimeout(timer);
  }, []);

  function handleClose() {
    setOpen(false);
    fabRef.current?.focus();
  }

  // Left widget hides entirely while the cart drawer is open — they'd overlap
  // on mobile where the drawer covers full width.
  const showContactWidget = !cartOpen;

  return (
    <>
      {showContactWidget && (
        <>
          {/* Backdrop: blurs the rest of the site so the popup reads as the
              focal point, and doubles as the "click outside to close" target. */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="floating-contact-backdrop"
                className="fixed inset-0 z-[34] bg-black/10 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleClose}
                aria-hidden
              />
            )}
          </AnimatePresence>
          <ContactFab ref={fabRef} open={open} onToggle={() => (open ? handleClose() : setOpen(true))} />
          <AnimatePresence>
            {open && <ContactPopup key="floating-contact-popup" onClose={handleClose} />}
          </AnimatePresence>
        </>
      )}
      <WhatsAppFab />
    </>
  );
}

export default FloatingContact;
