"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { MOBILE_RE, EMAIL_RE } from "@/lib/enquiry-schema";
import { useCart } from "@/store/cart";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { EnquiryActions } from "./EnquiryActions";
import { buildCartEnquiry } from "@/lib/enquiry";
import { pick } from "@/lib/i18n";

type Status = "idle" | "submitting" | "success" | "disabled" | "error";

export function EnquiryForm() {
  const t = useTranslations("Enquiry");
  const locale = useLocale();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const [status, setStatus] = useState<Status>("idle");

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t("errors.nameRequired")),
        mobile: z
          .string()
          .min(1, t("errors.mobileRequired"))
          .regex(MOBILE_RE, t("errors.mobileInvalid")),
        email: z
          .string()
          .trim()
          .regex(EMAIL_RE, t("errors.emailInvalid"))
          .optional()
          .or(z.literal("")),
        message: z.string().max(2000).optional(),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", mobile: "", email: "", message: "" },
  });

  const cartMessage = buildCartEnquiry(lines, locale);

  async function onSubmit(values: FormValues) {
    setStatus("submitting");
    const items = lines.map((l) => ({
      slug: l.slug,
      tierId: l.tierId,
      name: pick(l.name, locale),
      tier: pick(l.tierLabel, locale),
      qty: l.qty,
    }));
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, items }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data.ok) {
        setStatus("success");
        clear();
      } else if (data.reason === "email-disabled") {
        setStatus("disabled");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-success/40 bg-success/10 p-6 text-center">
        <CheckCircle2 className="mx-auto text-success" size={32} aria-hidden />
        <h2 className="mt-3 font-display text-xl font-semibold text-text">{t("successTitle")}</h2>
        <p className="mt-1 text-text-secondary">{t("successBody")}</p>
      </div>
    );
  }

  const errId = (field: string) => `enquiry-${field}-error`;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="enquiry-name" className="mb-1.5 block text-sm font-medium text-text">
            {t("name")}
          </label>
          <Input
            id="enquiry-name"
            placeholder={t("namePlaceholder")}
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
          <label htmlFor="enquiry-mobile" className="mb-1.5 block text-sm font-medium text-text">
            {t("mobile")}
          </label>
          <Input
            id="enquiry-mobile"
            type="tel"
            inputMode="numeric"
            placeholder={t("mobilePlaceholder")}
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
          <label htmlFor="enquiry-email" className="mb-1.5 block text-sm font-medium text-text">
            {t("email")}
          </label>
          <Input
            id="enquiry-email"
            type="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? errId("email") : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id={errId("email")} className="mt-1 text-sm text-danger">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="enquiry-message" className="mb-1.5 block text-sm font-medium text-text">
            {t("message")}
          </label>
          <Textarea
            id="enquiry-message"
            placeholder={t("messagePlaceholder")}
            {...register("message")}
          />
        </div>

        {status === "disabled" && (
          <div className="flex gap-2 rounded border border-gold/30 bg-gold/10 p-3 text-sm text-text-secondary">
            <AlertTriangle size={18} className="shrink-0 text-gold" aria-hidden />
            <span>
              <strong className="text-text">{t("disabledTitle")}.</strong> {t("disabledBody")}
            </span>
          </div>
        )}
        {status === "error" && (
          <div className="flex gap-2 rounded border border-danger/40 bg-danger/10 p-3 text-sm text-text-secondary">
            <AlertTriangle size={18} className="shrink-0 text-danger" aria-hidden />
            <span>
              <strong className="text-text">{t("errorTitle")}.</strong> {t("errorBody")}
            </span>
          </div>
        )}

        <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? t("submitting") : t("submit")}
        </Button>
      </form>

      <div className="border-t border-border pt-5">
        <p className="mb-3 text-sm text-text-muted">{t("or")}</p>
        <EnquiryActions message={cartMessage} />
      </div>
    </div>
  );
}
