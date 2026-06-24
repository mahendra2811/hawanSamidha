import type { Spec } from "@data/products.schema";
import { pick } from "@/lib/i18n";

export function SpecList({ specs, locale }: { specs: Spec[]; locale: string }) {
  if (specs.length === 0) return null;
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {specs.map((spec, i) => (
        <div key={i} className="flex justify-between gap-4 border-b border-border py-2">
          <dt className="text-sm text-text-muted">{pick(spec.label, locale)}</dt>
          <dd className="text-right text-sm font-medium text-text">{pick(spec.value, locale)}</dd>
        </div>
      ))}
    </dl>
  );
}
