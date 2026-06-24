"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];
  const current = list[active] ?? list[0];

  return (
    <figure className="flex flex-col gap-3">
      <div className="grad-glow relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
        {current && (
          <Image
            src={current}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>
      {list.length > 1 && (
        <ul className="grid grid-cols-5 gap-2">
          {list.slice(0, 10).map((img, i) => (
            <li key={img}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${alt} — image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-lg border transition-colors",
                  i === active ? "border-gold" : "border-border hover:border-gold/40",
                )}
              >
                <Image src={img} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
