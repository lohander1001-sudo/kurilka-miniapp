"use client";

import type { Lang, Product } from "@/lib/types";

export function ProductCard(props: {
  product: Product;
  lang: Lang;
  buyLabel: string;
  onOpen: () => void;
}) {
  const p = props.product;
  const name = p.name[props.lang] || p.name.ru;
  const flavor = p.flavor[props.lang] || p.flavor.ru;

  return (
    <div
      className="neon-border rounded-3xl bg-black/25 p-3 shadow-card"
      onClick={props.onOpen}
      role="button"
    >
      <div className="flex gap-3">
        <div className="h-20 w-20 rounded-2xl bg-white/5 neon-border overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.images[0] || "/placeholder.png"}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-bold leading-snug">
            <span className="neon-text glow">{name}</span>
          </div>
          <div className="mt-1 text-xs text-white/70 truncate">{flavor}</div>

          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/70">
            <Badge>{p.puffs.toLocaleString()} puffs</Badge>
            <Badge>{p.nicotinePercent}%</Badge>
            <Badge>
              {p.price ? `${p.price.toFixed(2)} ${p.currency}` : `— ${p.currency}`}
            </Badge>
          </div>

          <div className="mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onOpen();
              }}
              className="rounded-2xl px-4 py-2 text-xs font-semibold bg-gradient-to-r from-pink-500/80 via-fuchsia-500/70 to-sky-500/70 shadow-neon"
            >
              {props.buyLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 rounded-xl bg-white/5 neon-border">
      {children}
    </span>
  );
}
