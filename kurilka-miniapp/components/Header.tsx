"use client";

import type { Lang } from "@/lib/types";

export function Header(props: {
  title: string;
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-black/20 border-b border-white/5">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl neon-border bg-black/30 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="logo"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as any).style.display = "none";
              }}
            />
            <div className="text-xs neon-text font-black">K</div>
          </div>
          <div className="leading-tight">
            <div className="text-lg font-extrabold neon-text glow">{props.title}</div>
          </div>
        </div>

        <div className="flex gap-2">
          {(["ru", "lv", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => props.setLang(l)}
              className={[
                "px-3 py-2 rounded-xl text-xs font-semibold",
                l === props.lang
                  ? "bg-white/15 neon-border shadow-neon"
                  : "bg-white/5 hover:bg-white/10"
              ].join(" ")}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
