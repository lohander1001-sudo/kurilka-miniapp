"use client";

import { useMemo, useState } from "react";
import type { Lang, Product } from "@/lib/types";
import { track } from "@/lib/ga";

export function ProductModal(props: {
  product: Product;
  lang: Lang;
  onClose: () => void;
  labels: {
    buy: string;
    sheetTitle: string;
    qty: string;
    delivery: string;
    city: string;
    cityPlaceholder: string;
    omniva: string;
    unisend: string;
    pickup: string;
    copyOpen: string;
    copied: string;
  };
  onToast: (msg: string) => void;
}) {
  const p = props.product;
  const name = p.name[props.lang] || p.name.ru;
  const flavor = p.flavor[props.lang] || p.flavor.ru;
  const desc = p.description[props.lang] || p.description.ru;
  const list = p.flavorList?.[props.lang] || p.flavorList?.ru || "";

  const [qty, setQty] = useState(1);
  const [delivery, setDelivery] = useState<"omniva" | "unisend" | "pickup">("omniva");
  const [city, setCity] = useState("");

  const deliveryLabel = useMemo(() => {
    if (delivery === "omniva") return props.labels.omniva;
    if (delivery === "unisend") return props.labels.unisend;
    return props.labels.pickup;
  }, [delivery, props.labels]);

  const message = useMemo(() => {
    const cityPart = city?.trim() ? city.trim() : "—";
    return `Хочу ${name} (${flavor}), кол-во: ${qty}, доставка: ${deliveryLabel}, город: ${cityPart}.`;
  }, [name, flavor, qty, deliveryLabel, city]);

  const sellerUsername =
    process.env.NEXT_PUBLIC_SELLER_USERNAME || "aleksejssokolovsaffiliate";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const onBuy = async () => {
    track("buy_click", { id: p.id });
    const ok = await copyToClipboard(message);
    track("copy_message", { ok: ok ? 1 : 0 });

    if (ok) {
      props.onToast(props.labels.copied);
    } else {
      props.onToast("Не удалось скопировать автоматически — выделите и скопируйте текст вручную.");
    }

    track("open_seller_chat", { from: "buy" });
    window.open(`https://t.me/${sellerUsername}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm" onClick={props.onClose}>
      <div
        className="mx-auto max-w-md px-4 pt-10 pb-24"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="neon-border rounded-3xl bg-black/35 shadow-neon overflow-hidden">
          <div className="p-4 flex items-start justify-between gap-3 border-b border-white/5">
            <div className="min-w-0">
              <div className="font-extrabold neon-text glow text-lg leading-tight">
                {name}
              </div>
              <div className="text-xs text-white/70 mt-1">{flavor}</div>
            </div>
            <button
              className="rounded-2xl px-3 py-2 bg-white/10 hover:bg-white/15 neon-border text-xs font-semibold"
              onClick={props.onClose}
            >
              ✕
            </button>
          </div>

          <div className="p-4">
            <div className="h-44 w-full rounded-2xl bg-white/5 neon-border overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.images[0] || "/placeholder.png"}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-white/75">
              <Stat label="Puffs" value={p.puffs.toLocaleString()} />
              <Stat label="Nicotine" value={`${p.nicotinePercent}%`} />
              <Stat
                label="Price"
                value={p.price ? `${p.price.toFixed(2)} ${p.currency}` : `— ${p.currency}`}
              />
            </div>

            <div className="mt-4 text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
              {desc}
            </div>

            {list ? (
              <div className="mt-4 neon-border rounded-2xl bg-black/25 p-3">
                <div className="text-xs font-semibold neon-text glow">Flavor list</div>
                <div className="mt-2 text-xs text-white/80 whitespace-pre-wrap">{list}</div>
              </div>
            ) : null}

            <div className="mt-5 neon-border rounded-3xl bg-black/25 p-4">
              <div className="font-bold neon-text glow">{props.labels.sheetTitle}</div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="text-xs text-white/70">
                  {props.labels.qty}
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
                    className="mt-1 w-full rounded-2xl bg-white/5 neon-border px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="text-xs text-white/70">
                  {props.labels.delivery}
                  <select
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value as any)}
                    className="mt-1 w-full rounded-2xl bg-white/5 neon-border px-3 py-2 text-sm outline-none"
                  >
                    <option value="omniva">{props.labels.omniva}</option>
                    <option value="unisend">{props.labels.unisend}</option>
                    <option value="pickup">{props.labels.pickup}</option>
                  </select>
                </label>

                <label className="text-xs text-white/70 col-span-2">
                  {props.labels.city}
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={props.labels.cityPlaceholder}
                    className="mt-1 w-full rounded-2xl bg-white/5 neon-border px-3 py-2 text-sm outline-none placeholder:text-white/35"
                  />
                </label>
              </div>

              <div className="mt-3">
                <div className="text-[11px] text-white/60">Сообщение для продавца:</div>
                <div className="mt-1 rounded-2xl bg-white/5 neon-border p-3 text-xs text-white/85 whitespace-pre-wrap">
                  {message}
                </div>
              </div>

              <button
                onClick={onBuy}
                className="mt-4 w-full rounded-2xl px-4 py-3 font-semibold bg-gradient-to-r from-pink-500/80 via-fuchsia-500/70 to-sky-500/70 shadow-neon"
              >
                {props.labels.copyOpen}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="neon-border rounded-2xl bg-black/25 p-3">
      <div className="text-[10px] text-white/55">{label}</div>
      <div className="font-semibold text-white/90 mt-1">{value}</div>
    </div>
  );
}
