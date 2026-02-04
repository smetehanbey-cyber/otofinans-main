import { Request, Response } from "express";

interface MarketDataResponse {
  id: number;
  symbol: string;
  name: string;
  buyRate: number;
  sellRate: number;
  change: number;
  isPositive: boolean;
  buyRateFormatted?: string; // Turkish formatted version for high values like gold
  sellRateFormatted?: string;
}

interface RateData {
  buyRate: number;
  sellRate: number;
  change?: number;
}

// Fetch gold (XAU/TRY) rate from Metal Price API
// This provides real-time gold to Turkish Lira conversion
async function fetchGoldFromMetalPriceAPI(): Promise<RateData | null> {
  try {
    const response = await fetch(
      "https://api.metalpriceapi.com/v1/latest?api_key=42ba482ba703b3a5569425c0be0a8a0a&base=XAU&currencies=TRY",
      {
        signal: AbortSignal.timeout(5000),
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (response.ok) {
      const data = await response.json();

      // API response structure: { rates: { TRY: number }, ... }
      if (data.rates && data.rates.TRY) {
        const goldPrice = parseFloat(data.rates.TRY);

        if (!isNaN(goldPrice) && goldPrice > 0) {
          // Use the rate as both buy and sell (mid-market rate)
          // Add a small spread for realistic trading (0.5%)
          const spreadPercentage = 0.005;
          const buyRate = goldPrice;
          const sellRate = goldPrice * (1 + spreadPercentage);

          const rateData: RateData = {
            buyRate: parseFloat(buyRate.toFixed(2)),
            sellRate: parseFloat(sellRate.toFixed(2)),
            change: 0,
          };

          console.log(`✓ Metal Price API Gold (XAU/TRY): Al=${rateData.buyRate}, Sat=${rateData.sellRate} TL`);
          return rateData;
        }
      }
    } else {
      console.log(`Metal Price API returned status ${response.status}`);
    }
  } catch (error) {
    console.log("Metal Price API fetch failed:", error instanceof Error ? error.message : error);
  }

  return null;
}

// Fetch gold (XAU/TRY) rate from exchangerate-api.com (free tier, no key needed)
// This provides real-time gold to Turkish Lira conversion (fallback)
async function fetchGoldFromExchangeRate(): Promise<RateData | null> {
  try {
    // Try exchangerate-api.com (free tier without API key)
    const response = await fetch(
      "https://v6.exchangerate-api.com/v6/latest/XAU",
      {
        signal: AbortSignal.timeout(5000),
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (response.ok) {
      const data = await response.json();

      // API response structure: { result: "success", rates: { TRY: number, ... } }
      if (data.result === "success" && data.rates && data.rates.TRY) {
        const goldPrice = parseFloat(data.rates.TRY);

        if (!isNaN(goldPrice) && goldPrice > 0) {
          // Use the rate as both buy and sell (mid-market rate)
          // Add a small spread for realistic trading (0.5%)
          const spreadPercentage = 0.005;
          const buyRate = goldPrice;
          const sellRate = goldPrice * (1 + spreadPercentage);

          const rateData: RateData = {
            buyRate: parseFloat(buyRate.toFixed(2)),
            sellRate: parseFloat(sellRate.toFixed(2)),
            change: 0,
          };

          console.log(`✓ ExchangeRate-API Gold (XAU/TRY): Al=${rateData.buyRate}, Sat=${rateData.sellRate} TL`);
          return rateData;
        }
      }
    } else {
      console.log(`ExchangeRate-API returned status ${response.status}`);
    }
  } catch (error) {
    console.log("ExchangeRate-API fetch failed:", error instanceof Error ? error.message : error);
  }

  return null;
}

// Fetch gold and currency data from Trunçgil Finans API
// This is a reliable Turkish finance API for gold prices (GAU/TRY)
async function fetchFromTruncgil(): Promise<Record<string, RateData>> {
  const rates: Record<string, RateData> = {};

  try {
    const response = await fetch(
      "https://finans.truncgil.com/v4/today.json",
      {
        signal: AbortSignal.timeout(5000),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        }
      }
    );

    if (response.ok) {
      const text = await response.text();

      // The response might have encoding issues, try cleaning it
      let cleanText = text;
      // Remove any BOM or invalid characters at the start
      if (cleanText.charCodeAt(0) === 0xFEFF) {
        cleanText = cleanText.slice(1);
      }

      // Try to parse JSON, with fallback for malformed responses
      let data;
      try {
        data = JSON.parse(cleanText);
      } catch (parseError) {
        console.log("⚠ Trunçgil JSON parse error:", parseError instanceof Error ? parseError.message : "Unknown error");
        // Try to fix common JSON issues with trailing commas or quotes
        let fixed = cleanText
          .replace(/,\s*([}\]])/g, '$1')           // Remove trailing commas
          .replace(/([}\]])\s*,\s*$/g, '$1')       // Remove trailing commas at end
          .replace(/\\u0000/g, '')                  // Remove null bytes
          .replace(/[\x00-\x1F\x7F]/g, '');        // Remove control characters except newlines

        try {
          data = JSON.parse(fixed);
          console.log("⚠ Recovered Trunçgil data after fixing JSON");
        } catch {
          console.log("⚠ Could not parse Trunçgil API response even after fixing");
          console.log("Response length:", text.length);
          return rates;
        }
      }

      // Trunçgil API Structure (confirmed):
      // - Currencies use: { Type, Change, Name, Buying, Selling }
      // - Gold types: HAMITALTIN (gram gold), CEYREKALTIN, etc.

      // USD
      if (data.USD && typeof data.USD === "object") {
        const item = data.USD;
        const buyRate = parseFloat(item.Buying);
        const sellRate = parseFloat(item.Selling);
        const change = item.Change ? parseFloat(item.Change) : 0;
        if (!isNaN(buyRate) && !isNaN(sellRate)) {
          rates.USD = {
            buyRate: parseFloat(buyRate.toFixed(4)),
            sellRate: parseFloat(sellRate.toFixed(4)),
            change: isNaN(change) ? 0 : change,
          };
          console.log(`✓ Trunçgil USD: Al=${rates.USD.buyRate}, Sat=${rates.USD.sellRate}`);
        }
      }

      // EUR
      if (data.EUR && typeof data.EUR === "object") {
        const item = data.EUR;
        const buyRate = parseFloat(item.Buying);
        const sellRate = parseFloat(item.Selling);
        const change = item.Change ? parseFloat(item.Change) : 0;
        if (!isNaN(buyRate) && !isNaN(sellRate)) {
          rates.EUR = {
            buyRate: parseFloat(buyRate.toFixed(4)),
            sellRate: parseFloat(sellRate.toFixed(4)),
            change: isNaN(change) ? 0 : change,
          };
          console.log(`✓ Trunçgil EUR: Al=${rates.EUR.buyRate}, Sat=${rates.EUR.sellRate}`);
        }
      }

      // GBP
      if (data.GBP && typeof data.GBP === "object") {
        const item = data.GBP;
        const buyRate = parseFloat(item.Buying);
        const sellRate = parseFloat(item.Selling);
        const change = item.Change ? parseFloat(item.Change) : 0;
        if (!isNaN(buyRate) && !isNaN(sellRate)) {
          rates.GBP = {
            buyRate: parseFloat(buyRate.toFixed(4)),
            sellRate: parseFloat(sellRate.toFixed(4)),
            change: isNaN(change) ? 0 : change,
          };
          console.log(`✓ Trunçgil GBP: Al=${rates.GBP.buyRate}, Sat=${rates.GBP.sellRate}`);
        }
      }

      // HAMITALTIN (Gram Gold/Altın) - Trunçgil's gram gold entry
      if (data.HAMITALTIN && typeof data.HAMITALTIN === "object") {
        const item = data.HAMITALTIN;
        const buyRate = parseFloat(item.Buying);
        const sellRate = parseFloat(item.Selling);
        const change = item.Change ? parseFloat(item.Change) : 0;
        if (!isNaN(buyRate) && !isNaN(sellRate)) {
          rates.GAU = {
            buyRate: parseFloat(buyRate.toFixed(2)),
            sellRate: parseFloat(sellRate.toFixed(2)),
            change: isNaN(change) ? 0 : change,
          };
          console.log(`✓ Trunçgil HAMITALTIN (Gram Gold): Al=${rates.GAU.buyRate}, Sat=${rates.GAU.sellRate}`);
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
  // Fallback data - Current rates
  const fallbackRates: Record<string, RateData> = {
    USD: { buyRate: 43.4918, sellRate: 43.5038, change: 0.03 },
    EUR: { buyRate: 51.4746, sellRate: 51.4821, change: 0.04 },
    GBP: { buyRate: 59.7531, sellRate: 60.0526, change: 0.26 },
    GAU: { buyRate: 2830.50, sellRate: 2890.50, change: 1.5 },
  };

  let ratesToUse = fallbackRates;

  // Try Trunçgil API first (provides currencies and gold prices)
  const truncgilRates = await fetchFromTruncgil();
  if (Object.keys(truncgilRates).length > 0) {
    // Merge Trunçgil data with fallback, preferring Trunçgil
    ratesToUse = { ...fallbackRates, ...truncgilRates };
    console.log("✓ Using Trunçgil API data for currencies");
  } else {
    // Fallback to genelpara API if Trunçgil fails
    const genelParaRates = await fetchFromGenelPara();
    if (Object.keys(genelParaRates).length > 0) {
      ratesToUse = { ...fallbackRates, ...genelParaRates };
      console.log("✓ Using GenelPara API data");
    } else {
      console.log("⚠ APIs unavailable, using fallback data");
    }
  }

  // Trunçgil already provides HAMITALTIN (Gram Gold) data
  // It's included in the truncgilRates above
  // Gold rates are updated every fetch cycle

  // Map API data to display items
  const items = [
    { key: "USD", symbol: "USD", name: "Amerikan Doları", decimals: 4 },
    { key: "EUR", symbol: "EUR", name: "Euro", decimals: 4 },
    { key: "GBP", symbol: "GBP", name: "İngiliz Poundu", decimals: 4 },
    { key: "GAU", symbol: "ALT (gr)", name: "Gram Altın", decimals: 2 }, // GAU is gold in Trunçgil API
  ];

  const marketData: MarketDataResponse[] = [];
  let dataIndex = 1;

  // Get USD/TRY rate for Gram Gold calculation
  const usdRate = ratesToUse.USD?.buyRate || 43.5;

  // Add USD, EUR, GBP, and GAU (Gram Altın) in order
  for (const item of items) {
    // Try primary key first, then fallback to GA (genelpara format)
    let rates = ratesToUse[item.key];
    if (!rates && item.key === "GAU") {
      rates = ratesToUse["GA"]; // Try genelpara key if Trunçgil key not found
    }

    if (rates) {
      const change = rates.change ?? 0;

      // For Gram Gold (GAU), format with Turkish notation
      let buyRate = parseFloat(rates.buyRate.toFixed(item.decimals));
      let sellRate = parseFloat(rates.sellRate.toFixed(item.decimals));
      let buyRateFormatted: string | undefined;
      let sellRateFormatted: string | undefined;

      if (item.key === "GAU") {
        // Gram Gold: XAU/TRY (troy ounce) / 31.10 gram = price per gram
        // 1 troy ounce = 31.10 grams
        const GRAMS_PER_TROY_OUNCE = 31.10;

        let buyRateTL = rates.buyRate;
        let sellRateTL = rates.sellRate;

        // If value is small (fallback USD), multiply by USD rate to get TRY
        if (buyRateTL < 10000) {
          // Fallback USD values - multiply by USD/TRY rate
          buyRateTL = buyRateTL * usdRate;
          sellRateTL = sellRateTL * usdRate;
          console.log(`✓ Gram Gold (Fallback USD in TRY): Troy Ounce Al=${buyRateTL}, Sat=${sellRateTL} TRY`);
        } else {
          // API values are in TRY (troy ounce price)
          console.log(`✓ Gram Gold (API Troy Ounce): XAU/TRY Al=${buyRateTL}, Sat=${sellRateTL} TRY`);
        }

        // Convert troy ounce price to gram price: divide by 31.10
        let buyRateGram = buyRateTL / GRAMS_PER_TROY_OUNCE;
        let sellRateGram = sellRateTL / GRAMS_PER_TROY_OUNCE;

        console.log(`✓ Gram Gold (per gram): Al=${buyRateGram.toFixed(2)}, Sat=${sellRateGram.toFixed(2)} TRY/gram`);

        // Turkish formatting: thousands with dots, decimals with comma
        // Example: 1.589,50
        buyRateFormatted = buyRateGram.toLocaleString('tr-TR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        sellRateFormatted = sellRateGram.toLocaleString('tr-TR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        // Update buyRate and sellRate to gram prices for display
        buyRate = parseFloat(buyRateGram.toFixed(2));
        sellRate = parseFloat(sellRateGram.toFixed(2));
      }

      marketData.push({
        id: dataIndex++,
        symbol: item.symbol,
        name: item.name,
        buyRate,
        sellRate,
        change: parseFloat(change.toFixed(3)),
        isPositive: change >= 0,
        buyRateFormatted,
        sellRateFormatted,
      });
    }
  }

  res.json(marketData);
}
