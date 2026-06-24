"use client";

import { useTranslations } from "next-intl";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { site } from "@/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * WhatsApp / Call / Email actions. Each button renders only if its underlying
 * contact value exists. `message` is a prefilled enquiry body (product or cart).
 * `onEmail` lets a page route Email to its on-page form; otherwise mailto: is used.
 */
export function EnquiryActions({
  message,
  onEmail,
  className,
  size = "md",
}: {
  message: string;
  onEmail?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const t = useTranslations("Enquiry");

  const hasWhatsapp = site.whatsapp.length > 0;
  const hasPhone = site.phone.length > 0;
  const hasEmail = onEmail !== undefined || site.enquiryEmail.length > 0;

  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
  const telHref = `tel:${site.phone}`;
  const mailHref = `mailto:${site.enquiryEmail}?subject=${encodeURIComponent(
    "Wholesale enquiry — Ammedi",
  )}&body=${encodeURIComponent(message)}`;

  if (!hasWhatsapp && !hasPhone && !hasEmail) return null;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {hasWhatsapp && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("primary", size)}
        >
          <MessageCircle size={18} aria-hidden /> {t("whatsapp")}
        </a>
      )}
      {hasPhone && (
        <a href={telHref} className={buttonClasses("secondary", size)}>
          <Phone size={18} aria-hidden /> {t("call")}
        </a>
      )}
      {hasEmail &&
        (onEmail ? (
          <button type="button" onClick={onEmail} className={buttonClasses("outline", size)}>
            <Mail size={18} aria-hidden /> {t("emailUs")}
          </button>
        ) : (
          <a href={mailHref} className={buttonClasses("outline", size)}>
            <Mail size={18} aria-hidden /> {t("emailUs")}
          </a>
        ))}
    </div>
  );
}
