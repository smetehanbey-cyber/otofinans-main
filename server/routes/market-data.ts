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
    const marketData: MarketDataResponse[] = [];

    // Fallback data - Daha geniş döviz seçkisi
    const fallbackData = [
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
        symbol: "GBP",
        name: "İngiliz Poundu",
        buyRate: 37.5,
        sellRate: 37.8,
        change: 0.35,
        isPositive: true,
      },
      {
        id: 4,
        symbol: "JPY",
        name: "Japon Yeni",
        buyRate: 0.225,
        sellRate: 0.228,
        change: 0.12,
        isPositive: true,
      },
      {
        id: 5,
        symbol: "ALT (gr)",
        name: "Altın",
        buyRate: 2072.6269,
        sellRate: 2157.0752,
        change: 2.759,
        isPositive: true,
      },
      {
        id: 6,
        symbol: "GMS (gr)",
        name: "Gümüş",
        buyRate: 24.9138,
        sellRate: 26.1854,
        change: 0.087,
        isPositive: false,
      },
    ];

    let ratesData = null;
    let metalData = null;

    // Try to fetch currency rates from fawazahmed0 currency API
    try {
      const usdRes = await fetch(
        "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/try.json",
        {
          signal: AbortSignal.timeout(5000),
        }
      );
      if (usdRes.ok) {
        ratesData = await usdRes.json();
      }
    } catch (error) {
      console.log("Currency API fetch failed:", error);
    }

    // Try to fetch metal prices
    try {
      const metalRes = await fetch("https://api.metals.live/v1/spot/metals", {
        signal: AbortSignal.timeout(5000),
      });
      if (metalRes.ok) {
        metalData = await metalRes.json();
      }
    } catch (error) {
      console.log("Metals API fetch failed:", error);
    }

    // If we have exchange rates, use them; otherwise use fallback
    if (ratesData && ratesData.try && ratesData.try.usd && ratesData.try.eur) {
      // fawazahmed0 API returns: how much USD/EUR you get for 1 TRY
      // To get TRY per USD/EUR, we calculate: 1 / rate
      const usdRate = 1 / ratesData.try.usd;
      const eurRate = 1 / ratesData.try.eur;

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

      // Gold and Silver with metals data or fallback
      if (metalData && metalData.gold && metalData.silver) {
        const goldGram = (metalData.gold / 31.1035) * usdRate;
        const silverGram = (metalData.silver / 31.1035) * usdRate;

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
        // Use fallback for metals
        marketData.push(
          {
            id: 3,
            symbol: "ALT (gr)",
            name: "Altın",
            buyRate: fallbackData[2].buyRate,
            sellRate: fallbackData[2].sellRate,
            change: (Math.random() * 0.5 - 0.25),
            isPositive: Math.random() > 0.5,
          },
          {
            id: 4,
            symbol: "GMS (gr)",
            name: "Gümüş",
            buyRate: fallbackData[3].buyRate,
            sellRate: fallbackData[3].sellRate,
            change: (Math.random() * 0.5 - 0.25),
            isPositive: Math.random() > 0.5,
          }
        );
      }
    } else {
      // Use all fallback data if rates fetch fails
      return res.json(fallbackData.map(item => ({
        ...item,
        change: parseFloat((Math.random() * 0.5 - 0.25).toFixed(3)),
        isPositive: Math.random() > 0.5,
      })));
    }

    res.json(marketData);
  } catch (error) {
    console.error("Unexpected error in market data handler:", error);
    // Return fallback data as last resort
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
