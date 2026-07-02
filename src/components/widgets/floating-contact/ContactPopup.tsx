"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { MOBILE_RE } from "@/lib/enquiry-schema";
import { useProfile } from "@/store/profile";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { EnquiryActions } from "@/components/cart/EnquiryActions";
import { env } from "@/lib/env";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactPopup({ onClose }: { onClose: () => void }) {
  const t = useTranslations("FloatingContact");
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const popupRef = useRef<HTMLDivElement>(null);
  const headingId = "floating-contact-heading";

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t("errors.nameRequired")),
        mobile: z
          .string()
          .min(1, t("errors.mobileRequired"))
          .regex(MOBILE_RE, t("errors.mobileInvalid")),
        comment: z.string().max(500, t("errors.commentTooLong")).optional(),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", mobile: "", comment: "" },
  });

  const profile = useProfile();
  useEffect(() => {
    if (!profile.hasHydrated) return;
    reset({ name: profile.name, mobile: profile.mobile, comment: "" });
  }, [profile.hasHydrated, profile.name, profile.mobile, reset]);

  // Focus trap + ESC. Mounted only while the popup is open, so this effect's
  // lifetime IS the open lifetime. Outside-click-to-close is handled by the
  // backdrop (see FloatingContact.tsx), which also blurs the rest of the page.
  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      popupRef.current
        ?.querySelector<HTMLElement>('input, textarea, button, [href], [tabindex]:not([tabindex="-1"])')
        ?.focus();
    }, 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !popupRef.current) return;
      const nodes = popupRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-collapse a short while after success.
  useEffect(() => {
    if (status !== "success") return;
    const timer = window.setTimeout(onClose, 1800);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function onSubmit(values: FormValues) {
    setStatus("submitting");
    profile.save({ name: values.name, mobile: values.mobile });

    try {
      if (env.web3formsKey) {
        const res = await fetch(WEB3FORMS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: env.web3formsKey,
            subject: `Quick enquiry — ${values.name} (${values.mobile})`,
            from_name: "Ammedi Website",
            Name: values.name,
            Mobile: values.mobile,
            ...(values.comment ? { Comment: values.comment } : {}),
            Source: "Floating contact popup",
            message: values.comment || "(No comment.)",
            botcheck: "",
          }),
        });
        const data = (await res.json().catch(() => ({ success: false }))) as { success?: boolean };
        setStatus(data.success ? "success" : "error");
        if (data.success) reset({ name: values.name, mobile: values.mobile, comment: "" });
        return;
      }

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          mobile: values.mobile,
          message: values.comment,
          items: [],
          source: "popup",
        }),
      });
      const data = (await res.json().catch(() => ({ ok: false }))) as { ok?: boolean };
      setStatus(data.ok ? "success" : "error");
      if (data.ok) reset({ name: values.name, mobile: values.mobile, comment: "" });
    } catch {
      setStatus("error");
    }
  }

  const errId = (field: string) => `floating-contact-${field}-error`;

  return (
    <motion.div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      style={{ transformOrigin: "bottom left" }}
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 12 }}
      transition={reduceMotion ? { duration: 0.12 } : { type: "spring", stiffness: 320, damping: 26 }}
      className="fixed bottom-[calc(9rem+env(safe-area-inset-bottom))] left-4 z-[35] flex max-h-[min(70vh,520px)] w-[min(calc(100vw-2rem),340px)] flex-col overflow-y-auto rounded-2xl border border-border bg-elevated p-5 shadow-2xl md:bottom-[calc(5.25rem+env(safe-area-inset-bottom))]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("closeLabel")}
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-text-muted transition-colors hover:bg-surface hover:text-text"
      >
        <X size={18} aria-hidden />
      </button>

      {status === "success" ? (
        <div className="grid flex-1 place-items-center py-4 text-center">
          <svg width={56} height={56} viewBox="0 0 56 56" fill="none" aria-hidden>
            <motion.circle
              cx={28}
              cy={28}
              r={26}
              stroke="var(--color-success)"
              strokeWidth={2}
              fill="none"
              initial={{ pathLength: reduceMotion ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
            <motion.path
              d="M17 29l7 7 15-15"
              stroke="var(--color-success)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: reduceMotion ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.3 }}
            />
          </svg>
          <h2 id={headingId} className="mt-3 font-display text-lg font-semibold text-text">
            {t("successTitle")}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">{t("successBody")}</p>
        </div>
      ) : (
        <>
          <h2 id={headingId} className="pr-8 font-display text-lg font-semibold text-text">
            {t("title")}
          </h2>
          <p className="mt-0.5 pr-8 text-sm text-text-secondary">{t("subtitle")}</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-3">
            <div>
              <label htmlFor="fc-name" className="mb-1 block text-sm font-medium text-text">
                {t("name")}
              </label>
              <Input
                id="fc-name"
                placeholder={t("namePlaceholder")}
                disabled={status === "submitting"}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? errId("name") : undefined}
                {...register("name")}
              />
              {errors.name && (
                <p id={errId("name")} className="mt-1 text-sm text-danger">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="fc-mobile" className="mb-1 block text-sm font-medium text-text">
                {t("mobile")}
              </label>
              <Input
                id="fc-mobile"
                type="tel"
                inputMode="numeric"
                placeholder={t("mobilePlaceholder")}
                disabled={status === "submitting"}
                aria-invalid={!!errors.mobile}
                aria-describedby={errors.mobile ? errId("mobile") : undefined}
                {...register("mobile")}
              />
              {errors.mobile && (
                <p id={errId("mobile")} className="mt-1 text-sm text-danger">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="fc-comment" className="mb-1 block text-sm font-medium text-text">
                {t("comment")}
              </label>
              <Textarea
                id="fc-comment"
                rows={2}
                placeholder={t("commentPlaceholder")}
                disabled={status === "submitting"}
                {...register("comment")}
              />
            </div>

            {status === "error" && (
              <div className="rounded border border-danger/40 bg-danger/10 p-3 text-sm text-text-secondary">
                <p>
                  <strong className="text-text">{t("errorTitle")}.</strong> {t("errorBody")}
                </p>
                <EnquiryActions message={t("whatsappPrefill")} className="mt-2" size="sm" />
              </div>
            )}

            <Button type="submit" size="md" disabled={status === "submitting"} className="w-full">
              {status === "submitting" ? t("submitting") : t("submit")}
            </Button>
          </form>
        </>
      )}
    </motion.div>
  );
}
