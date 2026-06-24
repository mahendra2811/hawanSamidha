import type { Ingredient } from "@data/products.schema";
import { pick } from "@/lib/i18n";

export function IngredientList({
  ingredients,
  locale,
}: {
  ingredients: Ingredient[];
  locale: string;
}) {
  if (ingredients.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {ingredients.map((ing, i) => (
        <li
          key={i}
          className="rounded-full border border-border bg-elevated px-3 py-1 text-sm text-text-secondary"
        >
          {pick(ing.name, locale)}
          {ing.note && <span className="text-text-muted"> — {pick(ing.note, locale)}</span>}
        </li>
      ))}
    </ul>
  );
}
