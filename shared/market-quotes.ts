export const currencies = [
  { symbol: "USD", name: "Amerikan Doları" },
  { symbol: "EUR", name: "Euro" },
  { symbol: "GBP", name: "İngiliz Poundu" },
] as const;

export type CurrencySymbol = (typeof currencies)[number]["symbol"];
export type CurrencyQuote = {
  buyRate: number;
  sellRate: number;
  change: number | null;
};
export type MarketQuotes = Partial<Record<CurrencySymbol, CurrencyQuote>>;

function marketNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return NaN;
  const clean = value.replace(/[%\s]/g, "");
  if (!clean) return NaN;
  return Number(
    clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean,
  );
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

export function parseMarketQuotes(payload: unknown): MarketQuotes {
  const root = record(payload);
  const data = record(root.data ?? root);
  const quotes: MarketQuotes = {};

  for (const { symbol } of currencies) {
    const item = record(data[symbol]);
    const buyRate = marketNumber(item.Buying ?? item["Alış"] ?? item.alis);
    const sellRate = marketNumber(item.Selling ?? item["Satış"] ?? item.satis);
    const change = marketNumber(item.Change ?? item["Değişim"] ?? item.degisim);
    if (
      Number.isFinite(buyRate) &&
      buyRate > 0 &&
      Number.isFinite(sellRate) &&
      sellRate > 0
    ) {
      quotes[symbol] = {
        buyRate,
        sellRate,
        change: Number.isFinite(change) ? change : null,
      };
    }
  }
  return quotes;
}

export const truncgilUrl = "https://finans.truncgil.com/v3/today.json";

export async function fetchMarketSource(url: string, signal: AbortSignal) {
  try {
    const response = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });
    return response.ok ? parseMarketQuotes(await response.json()) : {};
  } catch {
    return {};
  }
}
