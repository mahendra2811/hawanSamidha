import * as React from "react";
import { cn } from "@/lib/cn";
import { fieldBase } from "./Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>(function Textarea({ className, rows = 4, ...props }, ref) {
  return <textarea ref={ref} rows={rows} className={cn(fieldBase, "resize-y", className)} {...props} />;
});
