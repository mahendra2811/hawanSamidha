import { getTranslations } from "next-intl/server";
import { Share, PlusSquare } from "lucide-react";

export async function InstallInstructions() {
  const t = await getTranslations("Install");
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-text">{t("iosTitle")}</h2>
      <ol className="mt-4 space-y-3 text-sm text-text-secondary">
        <li className="flex items-center gap-3">
          <Share size={18} className="shrink-0 text-gold" aria-hidden /> {t("iosStep1")}
        </li>
        <li className="flex items-center gap-3">
          <PlusSquare size={18} className="shrink-0 text-gold" aria-hidden /> {t("iosStep2")}
        </li>
        <li className="flex items-center gap-3">
          <span className="grid h-[18px] w-[18px] shrink-0 place-items-center text-gold">✓</span>
          {t("iosStep3")}
        </li>
      </ol>
    </div>
  );
}
