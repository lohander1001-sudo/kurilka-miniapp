"use client";

import { useEffect } from "react";

export function Toast(props: { text: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!props.text) return;
    const t = setTimeout(props.onDone, 2600);
    return () => clearTimeout(t);
  }, [props.text, props.onDone]);

  if (!props.text) return null;

  return (
    <div className="fixed left-0 right-0 bottom-24 z-40 px-4">
      <div className="mx-auto max-w-md neon-border rounded-2xl bg-black/55 backdrop-blur px-4 py-3 shadow-neon text-sm">
        {props.text}
      </div>
    </div>
  );
}
