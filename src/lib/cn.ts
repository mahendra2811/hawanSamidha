/** Tiny className joiner (no conflict-merge — our usage is controlled). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
