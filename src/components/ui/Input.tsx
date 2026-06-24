import * as React from "react";
import { cn } from "@/lib/cn";

const fieldBase =
  "w-full rounded bg-elevated px-3.5 py-2.5 text-text placeholder:text-text-muted border border-border focus:border-gold/50 outline-none transition-colors aria-[invalid=true]:border-danger";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
  },
);

export { fieldBase };
