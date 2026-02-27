"use client";

import type { TabKey } from "@/lib/types";

export function Tabs(props: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  labels: Record<TabKey, string>;
}) {
  const items: TabKey[] = ["catalog", "how", "delivery", "contacts"];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/5 bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-md px-3 py-2 grid grid-cols-4 gap-2">
        {items.map((k) => {
          const active = k === props.active;
          return (
            <button
              key={k}
              onClick={() => props.onChange(k)}
              className={[
                "rounded-2xl px-2 py-3 text-[11px] font-semibold",
                active
                  ? "bg-white/15 neon-border shadow-neon"
                  : "bg-white/5 hover:bg-white/10"
              ].join(" ")}
            >
              {props.labels[k]}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
