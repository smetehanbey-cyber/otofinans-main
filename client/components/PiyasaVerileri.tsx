import { useState, useMemo, useEffect } from "react";

export default function PiyasaVerileri() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [marketData, setMarketData] = useState([
    {
      id: 1,
      symbol: "USD",
      name: "Amerikan Doları",
      buyRate: 43.4918,
      sellRate: 43.5038,
      change: 0.03,
      isPositive: true,
    },
    {
      id: 2,
      symbol: "EUR",
      name: "Euro",
      buyRate: 51.4746,
      sellRate: 51.4821,
      change: 0.04,
      isPositive: true,
    },
    {
      id: 3,
      symbol: "GBP",
      name: "İngiliz Poundu",
      buyRate: 59.7531,
      sellRate: 60.0526,
      change: 0.26,
      isPositive: true,
    },
  ]);

  // Fetch market data from backend
  useEffect(() => {
    const fetchMarketData = async () => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      try {
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch("/api/market-data", {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'same-origin',
        });

        if (timeoutId) clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`Market data API error: ${response.status} ${response.statusText}`);
          return;
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setMarketData(data);
          console.log("Market data updated successfully");
        }
      } catch (error) {
        if (timeoutId) clearTimeout(timeoutId);

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.warn("Market data fetch timeout after 10 seconds");
          } else {
            console.warn("Market data fetch error:", error.message);
          }
        } else {
          console.warn("Market data fetch failed:", error);
        }
        // Keep showing previous data on error (graceful degradation)
      }
    };

    // Fetch immediately
    fetchMarketData();

    // Set up interval to fetch every minute for updates
    const interval = setInterval(fetchMarketData, 1 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const itemsPerPage = 3;
  const totalItems = marketData.length;
  const maxIndex = totalItems > itemsPerPage ? Math.ceil(totalItems / itemsPerPage) - 1 : 0;

  const currentItems = useMemo(() => {
    const start = currentIndex * itemsPerPage;
    return marketData.slice(start, start + itemsPerPage);
  }, [currentIndex, marketData]);


  return (
    <section className="py-6 sm:py-8" style={{ backgroundColor: "#1f3a93" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Piyasa Verileri
          </h2>
          <div className="w-16 h-1 bg-white mx-auto"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Currency Symbol */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{item.symbol}</p>
                  <p className="text-xs text-gray-500">{item.name}</p>
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    item.isPositive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span className="text-lg">
                    {item.isPositive ? "▲" : "▼"}
                  </span>
                  <span className="text-xs font-semibold">
                    {item.change.toFixed(3)}%
                  </span>
                </div>
              </div>

              {/* Buy/Sell Rates */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-600">Al</span>
                  <span className="text-sm font-bold text-gray-900">
                    {item.buyRate.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-600">Sat</span>
                  <span className="text-sm font-bold text-gray-900">
                    {item.sellRate.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls - Dots Only */}
        <div className="flex justify-center items-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
