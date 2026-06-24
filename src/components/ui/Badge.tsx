import { cn } from "@/lib/cn";

type BadgeProps = React.ComponentPropsWithoutRef<"span"> & {
  tone?: "gold" | "neutral";
};

export function Badge({ className, tone = "gold", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "gold"
          ? "bg-gold/15 text-gold border-hairline"
          : "bg-elevated text-text-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
