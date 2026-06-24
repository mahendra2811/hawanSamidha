import { cn } from "@/lib/cn";

type SectionProps = React.ComponentPropsWithoutRef<"section">;

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-12 sm:py-16 lg:py-20", className)} {...props}>
      {children}
    </section>
  );
}
