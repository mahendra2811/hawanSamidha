import * as React from "react";
import { cn } from "@/lib/cn";
import { fieldBase } from "./Input";

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<"select">>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(fieldBase, "appearance-none pr-9", className)} {...props}>
        {children}
      </select>
    );
  },
);
