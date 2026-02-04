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
      // { success: true, data: { EUR: { alis: "...", satis: "..." }, GBP: { alis: "...", satis: "..." }, ... } }
      if (data.success && data.data) {
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

        // GRAM ALTIN (Gram Gold)
        if (data.data["GRAM ALTIN"]) {
          const item = data.data["GRAM ALTIN"];
          const buyRate = parseFloat(item.alis);
          const sellRate = parseFloat(item.satis);
          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            rates["GRAM ALTIN"] = {
              buyRate: parseFloat(buyRate.toFixed(4)),
              sellRate: parseFloat(sellRate.toFixed(4)),
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

// Parse TCMB XML to extract currency rates
function parseTCMBXML(xml: string): Record<string, { buyRate: number; sellRate: number }> {
  const rates: Record<string, { buyRate: number; sellRate: number }> = {};

  const currencyCodes = ["USD", "EUR", "GBP", "JPY"];

  for (const code of currencyCodes) {
    // Find currency block
    const currencyPattern = new RegExp(
      `<Currency Code="${code}">([\\s\\S]*?)</Currency>`,
      "i"
    );
    const currencyMatch = xml.match(currencyPattern);

    if (currencyMatch) {
      const currencyBlock = currencyMatch[1];

      // Extract BanknoteBuying
      const buyingMatch = currencyBlock.match(/<BanknoteBuying>([\d.]+)<\/BanknoteBuying>/);
      // Extract BanknoteSelling
      const sellingMatch = currencyBlock.match(/<BanknoteSelling>([\d.]+)<\/BanknoteSelling>/);

      if (buyingMatch && sellingMatch) {
        rates[code] = {
          buyRate: parseFloat(buyingMatch[1]),
          sellRate: parseFloat(sellingMatch[1]),
        };
      }
    }
  }

  return rates;
}

export async function handleMarketData(
  _req: Request,
  res: Response
): Promise<void> {
  const currencyNames: Record<string, string> = {
    USD: "Amerikan Doları",
    EUR: "Euro",
    GBP: "İngiliz Poundu",
    JPY: "Japon Yeni",
  };

  // Fallback data - Current rates (Feb 4, 2026)
  // Source: Multiple forex data providers (Investing.com, XE, WalletInvestor)
  const fallbackRates: Record<string, { buyRate: number; sellRate: number }> = {
    USD: { buyRate: 43.2656, sellRate: 43.4980 }, // 1 USD = 43.26-43.50 TRY
    EUR: { buyRate: 46.8410, sellRate: 47.0798 }, // EUR ~1.08x USD
    GBP: { buyRate: 54.8897, sellRate: 55.1724 }, // GBP ~1.27x USD
    JPY: { buyRate: 0.3041, sellRate: 0.3058 },   // JPY ~0.007x USD
  };

  const marketData: MarketDataResponse[] = [];
  let dataIndex = 1;
  let ratesToUse = fallbackRates;

  // Try to fetch from genelpara.com API first (updates every 15 minutes)
  const genelParaRates = await fetchFromGenelPara();
  if (Object.keys(genelParaRates).length > 0) {
    ratesToUse = genelParaRates;
  } else {
    // Try TCMB XML as fallback
    try {
      const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const xmlText = await response.text();
        const tcmbRates = parseTCMBXML(xmlText);

        if (Object.keys(tcmbRates).length > 0) {
          ratesToUse = tcmbRates;
          console.log("✓ TCMB rates fetched successfully:", Object.keys(tcmbRates).join(", "));
        }
      }
    } catch (error) {
      console.log("TCMB API fetch failed, using fallback");
    }
  }

  // Add currencies
  for (const currency of Object.keys(currencyNames)) {
    const rates = ratesToUse[currency];
    const change = Math.random() * 0.4 - 0.2;

    marketData.push({
      id: dataIndex++,
      symbol: currency,
      name: currencyNames[currency],
      buyRate: parseFloat(rates.buyRate.toFixed(4)),
      sellRate: parseFloat(rates.sellRate.toFixed(4)),
      change: parseFloat(change.toFixed(3)),
      isPositive: change >= 0,
    });
  }

  // Add precious metals
  const goldChange = Math.random() * 0.4 - 0.2;
  marketData.push({
    id: dataIndex++,
    symbol: "ALT (gr)",
    name: "Altın",
    buyRate: 2072.6269,
    sellRate: 2157.0752,
    change: parseFloat(goldChange.toFixed(3)),
    isPositive: goldChange >= 0,
  });

  const silverChange = Math.random() * 0.4 - 0.2;
  marketData.push({
    id: dataIndex++,
    symbol: "GMS (gr)",
    name: "Gümüş",
    buyRate: 24.9138,
    sellRate: 26.1854,
    change: parseFloat(silverChange.toFixed(3)),
    isPositive: silverChange >= 0,
  });

  res.json(marketData);
}
