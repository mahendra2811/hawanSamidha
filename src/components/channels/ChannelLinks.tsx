import { getTranslations } from "next-intl/server";
import { ExternalLink, Globe, ShoppingBag, Store } from "lucide-react";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

type Channel = { key: string; label: string; href: string; Icon: typeof Store };

export async function ChannelLinks({
  className,
  variant = "grid",
}: {
  className?: string;
  variant?: "grid" | "row";
}) {
  const t = await getTranslations("Channels");

  const channels: Channel[] = [
    site.channels.indiamart && {
      key: "indiamart",
      label: t("indiamart"),
      href: site.channels.indiamart,
      Icon: Store,
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

  return (
    <ul
      className={cn(
        variant === "grid"
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3"
          : "flex flex-wrap gap-3",
        className,
      )}
    >
      {channels.map(({ key, label, href, Icon }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("visit", { channel: label })}
            className="group flex items-center justify-between gap-3 rounded border border-border bg-surface px-4 py-3 transition-colors hover:border-gold/40 hover:bg-elevated"
          >
            <span className="flex items-center gap-3">
              <Icon size={20} className="text-gold" aria-hidden />
              <span className="font-medium text-text">{label}</span>
            </span>
            <ExternalLink size={16} className="text-text-muted group-hover:text-gold" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
