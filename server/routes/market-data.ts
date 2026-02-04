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
async function fetchFromGenelPara(): Promise<Record<string, RateData>> {
  const rates: Record<string, RateData> = {};

  try {
    const response = await fetch(
      "https://api.genelpara.com/json/?list=all",
      { signal: AbortSignal.timeout(5000) }
    );

    if (response.ok) {
      const data = await response.json();

      // The API returns data with this structure:
      // { success: true, data: { USD: { alis: "...", satis: "...", degisim: "..." }, ... } }
      if (data.success && data.data) {
        // USD
        if (data.data.USD) {
          const item = data.data.USD;
          const buyRate = parseFloat(item.alis);
          const sellRate = parseFloat(item.satis);
          const change = item.degisim ? parseFloat(item.degisim) : 0;
          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            rates.USD = {
              buyRate: parseFloat(buyRate.toFixed(4)),
              sellRate: parseFloat(sellRate.toFixed(4)),
              change: isNaN(change) ? 0 : change,
            };
            console.log(`✓ USD: Al=${rates.USD.buyRate}, Sat=${rates.USD.sellRate}, Değişim=${rates.USD.change}`);
          }
        }

        // EUR
        if (data.data.EUR) {
          const item = data.data.EUR;
          const buyRate = parseFloat(item.alis);
          const sellRate = parseFloat(item.satis);
          const change = item.degisim ? parseFloat(item.degisim) : 0;
          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            rates.EUR = {
              buyRate: parseFloat(buyRate.toFixed(4)),
              sellRate: parseFloat(sellRate.toFixed(4)),
              change: isNaN(change) ? 0 : change,
            };
            console.log(`✓ EUR: Al=${rates.EUR.buyRate}, Sat=${rates.EUR.sellRate}, Değişim=${rates.EUR.change}`);
          }
        }

        // GBP
        if (data.data.GBP) {
          const item = data.data.GBP;
          const buyRate = parseFloat(item.alis);
          const sellRate = parseFloat(item.satis);
          const change = item.degisim ? parseFloat(item.degisim) : 0;
          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            rates.GBP = {
              buyRate: parseFloat(buyRate.toFixed(4)),
              sellRate: parseFloat(sellRate.toFixed(4)),
              change: isNaN(change) ? 0 : change,
            };
            console.log(`✓ GBP: Al=${rates.GBP.buyRate}, Sat=${rates.GBP.sellRate}, Değişim=${rates.GBP.change}`);
          }
        }

        // GA (Gram Altın - Gram Gold in TL)
        // Using GA key as per genelpara.com API specification
        if (data.data.GA) {
          const item = data.data.GA;
          const buyRate = parseFloat(item.alis);
          const sellRate = parseFloat(item.satis);
          const change = item.degisim ? parseFloat(item.degisim) : 0;
          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            rates.GA = {
              buyRate: parseFloat(buyRate.toFixed(2)),
              sellRate: parseFloat(sellRate.toFixed(2)),
              change: isNaN(change) ? 0 : change,
            };
            console.log(`✓ GA (Gram Altın): Al=${rates.GA.buyRate}, Sat=${rates.GA.sellRate}, Değişim=${rates.GA.change}`);
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
    { key: "GA", symbol: "ALT (gr)", name: "Gram Altın" }, // GA is the API key for Gram Altın
  ];

  // Fallback data - Current rates
  const fallbackRates: Record<string, RateData> = {
    USD: { buyRate: 43.4918, sellRate: 43.5038, change: 0.03 },
    EUR: { buyRate: 51.4746, sellRate: 51.4821, change: 0.04 },
    GBP: { buyRate: 59.7531, sellRate: 60.0526, change: 0.26 },
    GA: { buyRate: 2830.50, sellRate: 2890.50, change: 1.5 },
  };

  const marketData: MarketDataResponse[] = [];
  let dataIndex = 1;
  let ratesToUse = fallbackRates;

  // Try to fetch from genelpara.com API first (updates every 15 minutes)
  const genelParaRates = await fetchFromGenelPara();
  if (Object.keys(genelParaRates).length > 0) {
    ratesToUse = genelParaRates;
  }

  // Add USD, EUR, GBP, and GA (Gram Altın) in order
  for (const item of items) {
    const rates = ratesToUse[item.key];

    if (rates) {
      const change = rates.change ?? 0;
      marketData.push({
        id: dataIndex++,
        symbol: item.symbol,
        name: item.name,
        buyRate: parseFloat(rates.buyRate.toFixed(item.key === "GA" ? 2 : 4)),
        sellRate: parseFloat(rates.sellRate.toFixed(item.key === "GA" ? 2 : 4)),
        change: parseFloat(change.toFixed(3)),
        isPositive: change >= 0,
      });
    }
  }

  res.json(marketData);
}
