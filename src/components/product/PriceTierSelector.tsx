import type { PriceTier } from "@data/products.schema";
import { pick } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function PriceTierSelector({
  tiers,
  value,
  onChange,
  locale,
  label,
}: {
  tiers: PriceTier[];
  value: string;
  onChange: (id: string) => void;
  locale: string;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-2 sm:grid-cols-2">
      {tiers.map((tier) => {
        const selected = tier.id === value;
        return (
          <button
            key={tier.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(tier.id)}
            className={cn(
              "flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-colors",
              selected
                ? "border-gold bg-gold/10"
                : "border-border bg-surface hover:border-gold/40",
            )}
          >
            <span className="font-medium text-text">{pick(tier.label, locale)}</span>
            <span className="text-xs text-text-muted">{pick(tier.packaging, locale)}</span>
          </button>
        );
      })}
    </div>
  );
}
