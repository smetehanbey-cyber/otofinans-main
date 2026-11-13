import type { Request, Response } from "express";
import {
  currencies,
  fetchMarketSource,
  truncgilUrl,
} from "../../shared/market-quotes";

export async function handleMarketData(
  _req: Request,
  res: Response,
): Promise<void> {
  const [primary, secondary] = await Promise.all([
    fetchMarketSource(truncgilUrl, AbortSignal.timeout(4500)),
    fetchMarketSource(
      "https://api.genelpara.com/embed/para-birimleri.json",
      AbortSignal.timeout(4500),
    ),
  ]);
  const quotes = { ...secondary, ...primary };
  const rates = currencies.flatMap(({ symbol, name }, index) => {
    const quote = quotes[symbol];
    return quote ? [{ id: index + 1, symbol, name, ...quote }] : [];
  });

  if (!rates.length) {
    res
      .set("Cache-Control", "no-store")
      .status(503)
      .json({ error: "Market data unavailable" });
    return;
  }
  res.set("Cache-Control", "public, max-age=15, s-maxage=30").json(rates);
}
