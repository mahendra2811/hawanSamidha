"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type QtyStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
};

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 9999,
  label = "Quantity",
  className,
}: QtyStepperProps) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  return (
    <div
      className={cn("inline-flex items-center rounded border border-border bg-elevated", className)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="grid h-10 w-10 place-items-center text-text-secondary transition-colors hover:text-gold disabled:opacity-40"
      >
        <Minus size={16} aria-hidden />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
        className="h-10 w-12 [appearance:textfield] border-x border-border bg-transparent text-center text-text outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="grid h-10 w-10 place-items-center text-text-secondary transition-colors hover:text-gold disabled:opacity-40"
      >
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}
