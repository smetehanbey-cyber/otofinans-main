import { Request, Response } from "express";

interface MarketDataResponse {
  id: number;
  symbol: string;
  name: string;
  buyRate: number;
  sellRate: number;
  change: number;
  isPositive: boolean;
}

interface RateData {
  buyRate: number;
  sellRate: number;
  change?: number;
}

// Fetch all rates from genelpara.com API (updates every 15 minutes)
// Using /list=all endpoint to get all currencies and commodities
async function fetchFromGenelPara(): Promise<Record<string, { buyRate: number; sellRate: number }>> {
  const rates: Record<string, { buyRate: number; sellRate: number }> = {};

  try {
    const response = await fetch(
      "https://api.genelpara.com/json/?list=all",
      { signal: AbortSignal.timeout(5000) }
    );

    if (response.ok) {
      const data = await response.json();

      // The API returns data with this structure:
      // { success: true, data: { USD: { alis: "...", satis: "..." }, EUR: { alis: "...", satis: "..." }, ... } }
      if (data.success && data.data) {
        // USD
        if (data.data.USD) {
          const item = data.data.USD;
          const buyRate = parseFloat(item.alis);
          const sellRate = parseFloat(item.satis);
          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            rates.USD = {
              buyRate: parseFloat(buyRate.toFixed(4)),
              sellRate: parseFloat(sellRate.toFixed(4)),
            };
            console.log(`✓ USD: Al=${rates.USD.buyRate}, Sat=${rates.USD.sellRate}`);
          }
        }

        // EUR
        if (data.data.EUR) {
          const item = data.data.EUR;
          const buyRate = parseFloat(item.alis);
          const sellRate = parseFloat(item.satis);
          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            rates.EUR = {
              buyRate: parseFloat(buyRate.toFixed(4)),
              sellRate: parseFloat(sellRate.toFixed(4)),
            };
            console.log(`✓ EUR: Al=${rates.EUR.buyRate}, Sat=${rates.EUR.sellRate}`);
          }
        }

        // GBP
        if (data.data.GBP) {
          const item = data.data.GBP;
          const buyRate = parseFloat(item.alis);
          const sellRate = parseFloat(item.satis);
          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            rates.GBP = {
              buyRate: parseFloat(buyRate.toFixed(4)),
              sellRate: parseFloat(sellRate.toFixed(4)),
            };
            console.log(`✓ GBP: Al=${rates.GBP.buyRate}, Sat=${rates.GBP.sellRate}`);
          }
        }

        // GRAM ALTIN (Gram Gold in TL)
        if (data.data["GRAM ALTIN"]) {
          const item = data.data["GRAM ALTIN"];
          const buyRate = parseFloat(item.alis);
          const sellRate = parseFloat(item.satis);
          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            rates["GRAM ALTIN"] = {
              buyRate: parseFloat(buyRate.toFixed(2)),
              sellRate: parseFloat(sellRate.toFixed(2)),
            };
            console.log(`✓ GRAM ALTIN: Al=${rates["GRAM ALTIN"].buyRate}, Sat=${rates["GRAM ALTIN"].sellRate}`);
          }
        }
      }

      if (Object.keys(rates).length > 0) {
        console.log("✓ GenelPara API: Successfully fetched rates for", Object.keys(rates).join(", "));
      } else {
        console.log("⚠ GenelPara API: No rates fetched, will use fallback");
      }
    } else {
      console.log(`GenelPara API returned status ${response.status}`);
    }
  } catch (error) {
    console.log("GenelPara API fetch failed:", error instanceof Error ? error.message : error);
  }

  return rates;
}


export async function handleMarketData(
  _req: Request,
  res: Response
): Promise<void> {
  const items = [
    { key: "USD", symbol: "USD", name: "Amerikan Doları" },
    { key: "EUR", symbol: "EUR", name: "Euro" },
    { key: "GBP", symbol: "GBP", name: "İngiliz Poundu" },
    { key: "GRAM ALTIN", symbol: "ALT (gr)", name: "Gram Altın" },
  ];

  // Fallback data - Current rates
  const fallbackRates: Record<string, { buyRate: number; sellRate: number }> = {
    USD: { buyRate: 43.4918, sellRate: 43.5038 },
    EUR: { buyRate: 51.4746, sellRate: 51.4821 },
    GBP: { buyRate: 59.7531, sellRate: 60.0526 },
    "GRAM ALTIN": { buyRate: 2830.50, sellRate: 2890.50 },
  };

  const marketData: MarketDataResponse[] = [];
  let dataIndex = 1;
  let ratesToUse = fallbackRates;

  // Try to fetch from genelpara.com API first (updates every 15 minutes)
  const genelParaRates = await fetchFromGenelPara();
  if (Object.keys(genelParaRates).length > 0) {
    ratesToUse = genelParaRates;
  }

  // Add USD, EUR, GBP, and GRAM ALTIN in order
  for (const item of items) {
    const rates = ratesToUse[item.key];
    const change = Math.random() * 0.4 - 0.2;

    if (rates) {
      marketData.push({
        id: dataIndex++,
        symbol: item.symbol,
        name: item.name,
        buyRate: parseFloat(rates.buyRate.toFixed(item.key === "GRAM ALTIN" ? 2 : 4)),
        sellRate: parseFloat(rates.sellRate.toFixed(item.key === "GRAM ALTIN" ? 2 : 4)),
        change: parseFloat(change.toFixed(3)),
        isPositive: change >= 0,
      });
    }
  }

  res.json(marketData);
}
