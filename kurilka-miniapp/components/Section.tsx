"use client";

export function Section(props: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <section className="mt-5 neon-border rounded-3xl bg-black/25 p-5 shadow-card">
      <div className="text-lg font-extrabold neon-text glow">{props.title}</div>
      <div className="mt-3 text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
        {props.body}
      </div>

      {props.actionLabel && props.onAction ? (
        <button
          onClick={props.onAction}
          className="mt-5 rounded-2xl px-4 py-3 font-semibold bg-gradient-to-r from-pink-500/80 via-fuchsia-500/70 to-sky-500/70 shadow-neon"
        >
          {props.actionLabel}
        </button>
      ) : null}
    </section>
  );
}
