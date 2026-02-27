"use client";

export function AgeGate(props: {
  title: string;
  text: string;
  confirmLabel: string;
  exitLabel: string;
  onConfirm: () => void;
}) {
  return (
    <div className="w-full max-w-md neon-border rounded-3xl bg-black/30 p-5 shadow-neon">
      <div className="text-2xl font-extrabold neon-text glow">{props.title}</div>
      <div className="mt-3 text-sm leading-relaxed text-white/85">{props.text}</div>

      <div className="mt-5 grid grid-cols-1 gap-3">
        <button
          onClick={props.onConfirm}
          className="rounded-2xl px-4 py-3 font-semibold bg-gradient-to-r from-pink-500/80 via-fuchsia-500/70 to-sky-500/70 shadow-neon"
        >
          {props.confirmLabel}
        </button>
        <button
          onClick={() => {
            // @ts-ignore
            window?.Telegram?.WebApp?.close?.();
            window.location.href = "about:blank";
          }}
          className="rounded-2xl px-4 py-3 font-semibold bg-white/10 hover:bg-white/15 neon-border"
        >
          {props.exitLabel}
        </button>
      </div>
    </div>
  );
}
