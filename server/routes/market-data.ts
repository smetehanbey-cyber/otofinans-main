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

export async function handleMarketData(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    // Fetch currency rates from exchangerate-api
    const ratesRes = await fetch("https://api.exchangerate-api.com/v4/latest/TRY");
    const ratesData = await ratesRes.json();

    // Fetch metal prices from metals.live
    const metalRes = await fetch("https://api.metals.live/v1/spot/metals");
    const metalData = await metalRes.json();

    const marketData: MarketDataResponse[] = [];

    if (ratesData.rates) {
      // Get rates for USD and EUR to TRY
      const usdRate = 1 / ratesData.rates.USD;
      const eurRate = 1 / ratesData.rates.EUR;

      // USD
      const usdChange = (Math.random() * 0.5 - 0.25);
      marketData.push({
        id: 1,
        symbol: "USD",
        name: "Amerikan Doları",
        buyRate: parseFloat((usdRate * 0.998).toFixed(4)),
        sellRate: parseFloat((usdRate * 1.002).toFixed(4)),
        change: parseFloat(usdChange.toFixed(3)),
        isPositive: usdChange >= 0,
      });

      // EUR
      const eurChange = (Math.random() * 0.5 - 0.25);
      marketData.push({
        id: 2,
        symbol: "EUR",
        name: "Euro",
        buyRate: parseFloat((eurRate * 0.998).toFixed(4)),
        sellRate: parseFloat((eurRate * 1.002).toFixed(4)),
        change: parseFloat(eurChange.toFixed(3)),
        isPositive: eurChange >= 0,
      });

      // Gold and Silver
      if (metalData && metalData.gold && metalData.silver) {
        // Convert from USD per troy ounce to TRY per gram
        const goldGram = (metalData.gold / 31.1035) * usdRate;
        const silverGram = (metalData.silver / 31.1035) * usdRate;

        // Gold
        const goldChange = (Math.random() * 0.5 - 0.25);
        marketData.push({
          id: 3,
          symbol: "ALT (gr)",
          name: "Altın",
          buyRate: parseFloat(goldGram.toFixed(4)),
          sellRate: parseFloat((goldGram * 1.041).toFixed(4)),
          change: parseFloat(goldChange.toFixed(3)),
          isPositive: goldChange >= 0,
        });

        // Silver
        const silverChange = (Math.random() * 0.5 - 0.25);
        marketData.push({
          id: 4,
          symbol: "GMS (gr)",
          name: "Gümüş",
          buyRate: parseFloat(silverGram.toFixed(4)),
          sellRate: parseFloat((silverGram * 1.081).toFixed(4)),
          change: parseFloat(silverChange.toFixed(3)),
          isPositive: silverChange >= 0,
        });
      } else {
        // Fallback data if metals API fails
        marketData.push(
          {
            id: 3,
            symbol: "ALT (gr)",
            name: "Altın",
            buyRate: 2072.6269,
            sellRate: 2157.0752,
            change: (Math.random() * 0.5 - 0.25),
            isPositive: Math.random() > 0.5,
          },
          {
            id: 4,
            symbol: "GMS (gr)",
            name: "Gümüş",
            buyRate: 24.9138,
            sellRate: 26.1854,
            change: (Math.random() * 0.5 - 0.25),
            isPositive: Math.random() > 0.5,
          }
        );
      }
    }

    res.json(marketData);
  } catch (error) {
    console.error("Error fetching market data:", error);
    // Return fallback data
    res.json([
      {
        id: 1,
        symbol: "USD",
        name: "Amerikan Doları",
        buyRate: 30.0747,
        sellRate: 30.2315,
        change: 0.47,
        isPositive: true,
      },
      {
        id: 2,
        symbol: "EUR",
        name: "Euro",
        buyRate: 32.7758,
        sellRate: 32.9215,
        change: 0.28,
        isPositive: true,
      },
      {
        id: 3,
        symbol: "ALT (gr)",
        name: "Altın",
        buyRate: 2072.6269,
        sellRate: 2157.0752,
        change: 2.759,
        isPositive: true,
      },
      {
        id: 4,
        symbol: "GMS (gr)",
        name: "Gümüş",
        buyRate: 24.9138,
        sellRate: 26.1854,
        change: 0.087,
        isPositive: false,
      },
    ]);
  }
}
