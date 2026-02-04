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

  // Fallback data
  const fallbackRates: Record<string, { buyRate: number; sellRate: number }> = {
    USD: { buyRate: 43.0000, sellRate: 43.5000 },
    EUR: { buyRate: 46.5000, sellRate: 47.0000 },
    GBP: { buyRate: 53.0000, sellRate: 53.8000 },
    JPY: { buyRate: 0.3000, sellRate: 0.3200 },
  };

  const marketData: MarketDataResponse[] = [];
  let dataIndex = 1;
  let tcmbRates: Record<string, { buyRate: number; sellRate: number }> = {};

  // Try to fetch from TCMB XML
  try {
    const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const xmlText = await response.text();
      tcmbRates = parseTCMBXML(xmlText);

      if (Object.keys(tcmbRates).length > 0) {
        console.log("✓ TCMB rates fetched successfully:", Object.keys(tcmbRates).join(", "));
      }
    }
  } catch (error) {
    console.log("TCMB API fetch failed, using fallback:", error instanceof Error ? error.message : error);
  }

  // Use TCMB rates if available, otherwise fallback
  const ratesToUse = Object.keys(tcmbRates).length > 0 ? tcmbRates : fallbackRates;

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
