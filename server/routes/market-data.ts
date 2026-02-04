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

// Fetch gold and currency data from Trunçgil Finans API
// This is a reliable Turkish finance API for gold prices (GAU/TRY)
async function fetchFromTruncgil(): Promise<Record<string, RateData>> {
  const rates: Record<string, RateData> = {};

  try {
    const response = await fetch(
      "https://finans.truncgil.com/v4/today.json",
      { signal: AbortSignal.timeout(5000) }
    );

    if (response.ok) {
      const data = await response.json();

      // Trunçgil API structure typically has currency and gold data
      // Example: data.USD, data.EUR, data.GBP, data.GAU (Gold)

      // USD
      if (data.USD) {
        const item = data.USD;
        const buyRate = item.Alis || item.alis || item.buying || item.buy;
        const sellRate = item.Satis || item.satis || item.selling || item.sell;
        if (buyRate && sellRate) {
          const buy = parseFloat(buyRate);
          const sell = parseFloat(sellRate);
          if (!isNaN(buy) && !isNaN(sell)) {
            rates.USD = {
              buyRate: parseFloat(buy.toFixed(4)),
              sellRate: parseFloat(sell.toFixed(4)),
              change: 0,
            };
            console.log(`✓ Trunçgil USD: Al=${rates.USD.buyRate}, Sat=${rates.USD.sellRate}`);
          }
        }
      }

      // EUR
      if (data.EUR) {
        const item = data.EUR;
        const buyRate = item.Alis || item.alis || item.buying || item.buy;
        const sellRate = item.Satis || item.satis || item.selling || item.sell;
        if (buyRate && sellRate) {
          const buy = parseFloat(buyRate);
          const sell = parseFloat(sellRate);
          if (!isNaN(buy) && !isNaN(sell)) {
            rates.EUR = {
              buyRate: parseFloat(buy.toFixed(4)),
              sellRate: parseFloat(sell.toFixed(4)),
              change: 0,
            };
            console.log(`✓ Trunçgil EUR: Al=${rates.EUR.buyRate}, Sat=${rates.EUR.sellRate}`);
          }
        }
      }

      // GBP
      if (data.GBP) {
        const item = data.GBP;
        const buyRate = item.Alis || item.alis || item.buying || item.buy;
        const sellRate = item.Satis || item.satis || item.selling || item.sell;
        if (buyRate && sellRate) {
          const buy = parseFloat(buyRate);
          const sell = parseFloat(sellRate);
          if (!isNaN(buy) && !isNaN(sell)) {
            rates.GBP = {
              buyRate: parseFloat(buy.toFixed(4)),
              sellRate: parseFloat(sell.toFixed(4)),
              change: 0,
            };
            console.log(`✓ Trunçgil GBP: Al=${rates.GBP.buyRate}, Sat=${rates.GBP.sellRate}`);
          }
        }
      }

      // GAU (Gold/Altın) - Trunçgil specific
      if (data.GAU || data.GRAM_ALTIN || data.altın) {
        const item = data.GAU || data.GRAM_ALTIN || data.altın;
        const buyRate = item.Alis || item.alis || item.buying || item.buy;
        const sellRate = item.Satis || item.satis || item.selling || item.sell;
        if (buyRate && sellRate) {
          const buy = parseFloat(buyRate);
          const sell = parseFloat(sellRate);
          if (!isNaN(buy) && !isNaN(sell)) {
            rates.GAU = {
              buyRate: parseFloat(buy.toFixed(2)),
              sellRate: parseFloat(sell.toFixed(2)),
              change: 0,
            };
            console.log(`✓ Trunçgil GAU (Gold): Al=${rates.GAU.buyRate}, Sat=${rates.GAU.sellRate}`);
          }
        }
      }

      if (Object.keys(rates).length > 0) {
        console.log("✓ Trunçgil API: Successfully fetched rates for", Object.keys(rates).join(", "));
      } else {
        console.log("⚠ Trunçgil API: No rates extracted from response");
      }
    } else {
      console.log(`Trunçgil API returned status ${response.status}`);
    }
  } catch (error) {
    console.log("Trunçgil API fetch failed:", error instanceof Error ? error.message : error);
  }

  return rates;
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
