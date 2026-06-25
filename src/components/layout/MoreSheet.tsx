"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileForm } from "@/components/profile/ProfileForm";

const EXPLORE = [
  { href: "/about", key: "about", ns: "Nav" as const },
  { href: "/blog", key: "blog", ns: "Nav" as const },
  { href: "/install", key: "install", ns: "Nav" as const },
  { href: "/privacy", key: "privacy", ns: "Footer" as const },
  { href: "/terms", key: "terms", ns: "Footer" as const },
];

export function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tm = useTranslations("More");
  const tn = useTranslations("Nav");
  const tf = useTranslations("Footer");
  const tp = useTranslations("Profile");

  return (
    <Drawer open={open} onClose={onClose} title={tm("title")}>
      <div className="space-y-8">
        {/* Profile */}
        <section>
          <h3 className="font-display text-lg font-semibold text-text">{tp("title")}</h3>
          <p className="mb-3 text-sm text-text-muted">{tp("subtitle")}</p>
          <ProfileForm />
        </section>

        {/* Explore */}
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
            {tm("exploreTitle")}
          </h3>
          <ul className="flex flex-col">
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded px-2 py-3 text-text-secondary transition-colors hover:bg-elevated hover:text-text"
                >
                  {item.ns === "Nav" ? tn(item.key) : tf(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Settings */}
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
            {tm("settingsTitle")}
          </h3>
          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">{tm("language")}</span>
            <LocaleSwitcher />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">{tm("theme")}</span>
            <ThemeToggle className="border border-border" />
          </div>
        </section>
      </div>
    </Drawer>
  );
}
