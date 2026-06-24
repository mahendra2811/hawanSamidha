import { getTranslations } from "next-intl/server";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ChannelLinks } from "@/components/channels/ChannelLinks";
import { NAV_ITEMS } from "./nav-items";
import { site } from "@/config/site";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl font-semibold text-text">{site.name}</p>
            <p className="mt-3 max-w-xs text-sm text-text-secondary">{t("tagline")}</p>
            <p className="mt-4 flex items-start gap-2 text-sm text-text-muted">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
              {site.company.city}, {site.company.state}, {site.company.country}
            </p>
          </div>

          {/* Explore */}
          <nav aria-label={t("navTitle")}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              {t("navTitle")}
            </h2>
            <ul className="mt-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary transition-colors hover:text-gold"
                  >
                    {tn(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Channels */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              {t("channelsTitle")}
            </h2>
            <ChannelLinks variant="row" className="mt-4" />
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              {t("contactTitle")}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {site.phone && (
                <li>
                  <a
                    href={`tel:${site.phone}`}
                    className="flex items-center gap-2 text-text-secondary transition-colors hover:text-gold"
                  >
                    <Phone size={16} className="text-gold" aria-hidden /> {site.phone}
                  </a>
                </li>
              )}
              {site.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${site.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-secondary transition-colors hover:text-gold"
                  >
                    <MessageCircle size={16} className="text-gold" aria-hidden /> WhatsApp
                  </a>
                </li>
              )}
              {site.enquiryEmail && (
                <li>
                  <a
                    href={`mailto:${site.enquiryEmail}`}
                    className="flex items-center gap-2 text-text-secondary transition-colors hover:text-gold"
                  >
                    <Mail size={16} className="text-gold" aria-hidden /> {site.enquiryEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-sm text-text-muted sm:flex-row">
          <p>
            © {site.company.establishedYear}–2026 {site.company.legalName}. {t("rights")}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-gold">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-gold">
              {t("terms")}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
