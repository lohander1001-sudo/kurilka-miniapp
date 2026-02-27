export function track(name: string, params: Record<string, any> = {}) {
  try {
    // @ts-ignore
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      // @ts-ignore
      window.gtag("event", name, params);
    }
  } catch {}
}
