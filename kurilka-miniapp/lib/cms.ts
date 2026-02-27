import { parseCSV, rowsToObjects } from "./csv";
import type { CMS, Product } from "./types";

function sheetCsvUrl(sheetId: string, sheetName: string) {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName
  )}`;
}

function toBool(v: string) {
  const x = (v || "").toLowerCase();
  return x === "true" || x === "1" || x === "yes";
}

function toNum(v: string): number | null {
  const n = Number(String(v || "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export async function fetchCMS(): Promise<CMS> {
  const sheetId = process.env.NEXT_PUBLIC_SHEETS_ID;
  if (!sheetId) {
    const offline = await fetch("/data/offline.json").then((r) => r.json());
    return offline as CMS;
  }

  const [prodCsv, contentCsv] = await Promise.all([
    fetch(sheetCsvUrl(sheetId, "Products"), { cache: "no-store" }).then((r) => r.text()),
    fetch(sheetCsvUrl(sheetId, "Content"), { cache: "no-store" }).then((r) => r.text())
  ]);

  const prodRows = rowsToObjects(parseCSV(prodCsv));
  const contentRows = rowsToObjects(parseCSV(contentCsv));

  const products: Product[] = prodRows
    .filter((r) => r.id)
    .map((r) => {
      const images = [r.image1, r.image2].filter(Boolean);

      const name = {
        ru: r.name_ru || r.name || "",
        lv: r.name_lv || r.name || "",
        en: r.name_en || r.name || ""
      };

      const flavor = {
        ru: r.flavor_ru || r.flavor || "",
        lv: r.flavor_lv || r.flavor || "",
        en: r.flavor_en || r.flavor || ""
      };

      const description = {
        ru: r.description_ru || "",
        lv: r.description_lv || "",
        en: r.description_en || ""
      };

      const flavorList =
        r.flavorList_ru || r.flavorList_lv || r.flavorList_en
          ? {
              ru: r.flavorList_ru || "",
              lv: r.flavorList_lv || "",
              en: r.flavorList_en || ""
            }
          : undefined;

      return {
        id: r.id,
        name,
        flavor,
        puffs: Number(toNum(r.puffs) ?? 0),
        nicotinePercent: Number(toNum(r.nicotinePercent) ?? 0),
        price: toNum(r.price),
        currency: r.currency || "EUR",
        inStock: toBool(r.inStock),
        images,
        description,
        flavorList
      };
    });

  const content: Record<string, any> = {};
  for (const r of contentRows) {
    if (!r.key) continue;
    content[r.key] = {
      ru: r.ru || "",
      lv: r.lv || "",
      en: r.en || ""
    };
  }

  return { products, content };
}
