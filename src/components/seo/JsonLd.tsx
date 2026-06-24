/**
 * Injects a JSON-LD <script>. Content is built from our own product/site data
 * (not user input); we still escape `<` to `<` so a stray "</script>" in any
 * string can never break out of the script context.
 */
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
