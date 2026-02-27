export type Lang = "ru" | "lv" | "en";
export type TabKey = "catalog" | "how" | "delivery" | "contacts";

export type Localized = Record<Lang, string>;

export type Product = {
  id: string;
  name: Localized;
  flavor: Localized;
  puffs: number;
  nicotinePercent: number;
  price: number | null;
  currency: string;
  inStock: boolean;
  images: string[];
  description: Localized;
  flavorList?: Localized;
};

export type CMS = {
  products: Product[];
  content: Record<string, Localized>;
};
