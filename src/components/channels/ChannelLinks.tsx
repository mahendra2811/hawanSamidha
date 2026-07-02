import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ExternalLink, Globe, ShoppingBag, Store } from "lucide-react";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";

type Channel = {
  key: string;
  label: string;
  href: string;
  Icon: typeof Store;
  logo?: string;
  tagline?: string;
};

export async function ChannelLinks({
  className,
  variant = "grid",
  featured = false,
}: {
  className?: string;
  variant?: "grid" | "row";
  /** Render a single channel as a bigger, brand-forward card (logo + tagline
   * + CTA) instead of a small list tile. Opt-in — the footer / QR page / About
   * page keep the compact list even when there's only one active channel. */
  featured?: boolean;
}) {
  const t = await getTranslations("Channels");

  const channels: Channel[] = [
    site.channels.indiamart && {
      key: "indiamart",
      label: t("indiamart"),
      href: site.channels.indiamart,
      Icon: Store,
      logo: "/channels/indiamart.webp",
      tagline: t("indiamartTagline"),
    },
    site.channels.flipkart && {
      key: "flipkart",
      label: t("flipkart"),
      href: site.channels.flipkart,
      Icon: ShoppingBag,
    },
    site.channels.facebook && {
      key: "facebook",
      label: t("facebook"),
      href: site.channels.facebook,
      Icon: Globe,
    },
  ].filter(Boolean) as Channel[];

  if (channels.length === 0) return null;

  // A single active channel (today, just IndiaMART) can opt into a bigger,
  // brand-forward featured card instead of a small grid tile — a lone tile
  // in an otherwise-empty grid reads as unfinished.
  if (featured && channels.length === 1) {
    const [channel] = channels;
    return (
      <div className={className}>
        <a
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("visit", { channel: channel.label })}
          className="group flex flex-col items-center gap-5 rounded-2xl border border-border bg-surface p-6 text-center transition-colors hover:border-gold/40 hover:bg-elevated sm:flex-row sm:text-left"
        >
          {channel.logo ? (
            <span className="grid h-20 w-40 shrink-0 place-items-center rounded-xl bg-white p-3 shadow-sm">
              <Image
                src={channel.logo}
                alt={channel.label}
                width={280}
                height={180}
                className="h-full w-full object-contain"
              />
            </span>
          ) : (
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-elevated">
              <channel.Icon size={28} className="text-gold" aria-hidden />
            </span>
          )}
          <span className="flex-1">
            <span className="block font-display text-xl font-semibold text-text">
              {channel.label}
            </span>
            {channel.tagline && (
              <span className="mt-1 block text-sm text-text-secondary">{channel.tagline}</span>
            )}
          </span>
          <span className={buttonClasses("outline", "md", "shrink-0")}>
            {t("visitStore")}
            <ExternalLink size={16} aria-hidden />
          </span>
        </a>
      </div>
    );
  }

  return (
    <ul
      className={cn(
        variant === "grid"
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3"
          : "flex flex-wrap gap-3",
        className,
      )}
    >
      {channels.map((channel) => (
        <li key={channel.key}>
          <a
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("visit", { channel: channel.label })}
            className="group flex items-center justify-between gap-3 rounded border border-border bg-surface px-4 py-3 transition-colors hover:border-gold/40 hover:bg-elevated"
          >
            <span className="flex items-center gap-3">
              {channel.logo ? (
                <span className="grid h-6 w-12 shrink-0 place-items-center rounded bg-white p-1">
                  <Image
                    src={channel.logo}
                    alt=""
                    width={80}
                    height={50}
                    className="h-full w-full object-contain"
                  />
                </span>
              ) : (
                <channel.Icon size={20} className="text-gold" aria-hidden />
              )}
              <span className="font-medium text-text">{channel.label}</span>
            </span>
            <ExternalLink size={16} className="text-text-muted group-hover:text-gold" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
