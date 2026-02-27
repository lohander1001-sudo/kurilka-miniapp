"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchCMS } from "@/lib/cms";
import { track } from "@/lib/ga";
import type { CMS, Lang, Product, TabKey } from "@/lib/types";
import { AgeGate } from "@/components/AgeGate";
import { Header } from "@/components/Header";
import { Tabs } from "@/components/Tabs";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Section } from "@/components/Section";
import { Toast } from "@/components/Toast";

const DEFAULT_LANG: Lang = "ru";

export default function Page() {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const [tab, setTab] = useState<TabKey>("catalog");
  const [cms, setCms] = useState<CMS | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ageOk, setAgeOk] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    track("app_open");
    try {
      // @ts-ignore
      const tg = window?.Telegram?.WebApp;
      tg?.expand?.();
      tg?.ready?.();
    } catch {}
  }, []);

  useEffect(() => {
    setAgeOk(localStorage.getItem("age_confirmed") === "1");
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCMS();
        if (!alive) return;
        setCms(data);
      } catch (e: any) {
        setError(e?.message || "Network error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const t = useMemo(() => {
    const dict = cms?.content ?? {};
    const get = (key: string, fallback: string) => dict[key]?.[lang] ?? fallback;
    return { get };
  }, [cms, lang]);

  const products = useMemo(() => (cms?.products ?? []).filter(p => p.inStock), [cms]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const hay = [
        p.name[lang], p.flavor[lang], p.description[lang],
        p.name.ru, p.name.lv, p.name.en,
        p.flavor.ru, p.flavor.lv, p.flavor.en,
        p.description.ru, p.description.lv, p.description.en
      ].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [products, query, lang]);

  const confirmAge = () => {
    localStorage.setItem("age_confirmed", "1");
    setAgeOk(true);
    track("age_confirm");
  };

  if (!ageOk) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AgeGate
          title={t.get("age_gate_title", "Только 18+")}
          text={t.get("age_gate_text", "Витрина доступна только для лиц старше 18 лет.")}
          confirmLabel={t.get("age_gate_confirm", "Мне 18+")}
          exitLabel={t.get("age_gate_exit", "Выйти")}
          onConfirm={confirmAge}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title={t.get("app_title", "KURILKA")} lang={lang} setLang={setLang} />

      <main className="mx-auto max-w-md px-4 pb-28">
        {loading ? (
          <div className="mt-6 neon-border rounded-2xl p-4 bg-black/20">
            <div className="animate-pulse space-y-3">
              <div className="h-5 w-44 rounded bg-white/10" />
              <div className="h-32 rounded-xl bg-white/10" />
              <div className="h-10 rounded bg-white/10" />
            </div>
          </div>
        ) : error ? (
          <div className="mt-6 neon-border rounded-2xl p-4 bg-red-500/10">
            <div className="font-semibold">Ошибка</div>
            <div className="text-sm opacity-90 mt-1">{error}</div>
            <div className="text-xs opacity-70 mt-3">
              Проверь Publish to web (CSV) и NEXT_PUBLIC_SHEETS_ID.
            </div>
          </div>
        ) : (
          <>
            {tab === "catalog" && (
              <>
                <div className="mt-5">
                  <div className="text-lg font-bold neon-text glow">
                    {t.get("catalog_title", "Каталог")}
                  </div>
                  <div className="mt-3 neon-border bg-black/20 rounded-2xl p-3">
                    <input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        track("search", { q: e.target.value });
                      }}
                      placeholder={t.get("search_placeholder", "Поиск по названию, вкусу…")}
                      className="w-full bg-transparent outline-none text-sm placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {filtered.length === 0 ? (
                    <div className="neon-border rounded-2xl p-4 bg-black/20 text-sm opacity-80">
                      Ничего не найдено
                    </div>
                  ) : (
                    filtered.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        lang={lang}
                        buyLabel={t.get("buy_button", "Купить")}
                        onOpen={() => {
                          setSelected(p);
                          track("view_item", { id: p.id });
                        }}
                      />
                    ))
                  )}
                </div>
              </>
            )}

            {tab === "how" && (
              <Section
                title={t.get("how_buy_tab", "Как купить")}
                body={t.get("how_buy_body", "1) Выберите товар в каталоге.\n2) Нажмите «Купить»...")}
              />
            )}

            {tab === "delivery" && (
              <Section
                title={t.get("delivery_tab", "Доставка")}
                body={t.get("delivery_body", "• Omniva / Unisend — 1–2 дня.\n• Бесплатная доставка от 35€.")}
              />
            )}

            {tab === "contacts" && (
              <Section
                title={t.get("contacts_tab", "Контакты")}
                body={t.get("contacts_body", "Продавец: @aleksejssokolovsaffiliate")}
                actionLabel={t.get("contact_button", "Написать продавцу")}
                onAction={() => {
                  const username = process.env.NEXT_PUBLIC_SELLER_USERNAME || "aleksejssokolovsaffiliate";
                  track("open_seller_chat", { from: "contacts" });
                  window.open(`https://t.me/${username}`, "_blank");
                }}
              />
            )}
          </>
        )}
      </main>

      <Tabs
        active={tab}
        onChange={setTab}
        labels={{
          catalog: t.get("catalog_title", "Каталог"),
          how: t.get("how_buy_tab", "Как купить"),
          delivery: t.get("delivery_tab", "Доставка"),
          contacts: t.get("contacts_tab", "Контакты")
        }}
      />

      {selected && cms ? (
        <ProductModal
          product={selected}
          lang={lang}
          onClose={() => setSelected(null)}
          labels={{
            buy: t.get("buy_button", "Купить"),
            sheetTitle: t.get("buy_sheet_title", "Быстрый заказ"),
            qty: t.get("qty_label", "Количество"),
            delivery: t.get("delivery_label", "Доставка"),
            city: t.get("city_label", "Город"),
            cityPlaceholder: t.get("city_placeholder", "Например: Riga / Daugavpils"),
            omniva: t.get("delivery_omniva", "Omniva (пакомат)"),
            unisend: t.get("delivery_unisend", "Unisend (пакомат)"),
            pickup: t.get("delivery_pickup_daugavpils", "Самовывоз (пакомат Daugavpils)"),
            copyOpen: t.get("copy_and_open_chat", "Скопировать и открыть чат"),
            copied: t.get("copied_toast", "Скопировано ✅ Вставьте сообщение в чат и отправьте.")
          }}
          onToast={(msg) => setToast(msg)}
        />
      ) : null}

      <Toast text={toast} onDone={() => setToast(null)} />
    </div>
  );
}
