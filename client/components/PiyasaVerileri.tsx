import { useEffect, useState } from "react";
import {
  currencies,
  fetchMarketSource,
  truncgilUrl,
  type MarketQuotes,
} from "@shared/market-quotes";

const formatRate = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export default function PiyasaVerileri() {
  const [quotes, setQuotes] = useState<MarketQuotes>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function refresh() {
      const signal = AbortSignal.any([
        controller.signal,
        AbortSignal.timeout(8000),
      ]);
      let rates: MarketQuotes = {};
      try {
        const response = await fetch("/api/market-data", {
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal,
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            for (const { symbol } of currencies) {
              const quote = data.find((item) => item?.symbol === symbol);
              if (
                Number.isFinite(quote?.buyRate) &&
                quote.buyRate > 0 &&
                Number.isFinite(quote.sellRate) &&
                quote.sellRate > 0
              ) {
                rates[symbol] = {
                  buyRate: quote.buyRate,
                  sellRate: quote.sellRate,
                  change: Number.isFinite(quote.change) ? quote.change : null,
                };
              }
            }
          }
        }
      } catch {
        // Static hosting can serve the SPA document in place of the API.
      }

      if (
        !controller.signal.aborted &&
        Object.keys(rates).length < currencies.length
      ) {
        const direct = await fetchMarketSource(
          truncgilUrl,
          AbortSignal.any([controller.signal, AbortSignal.timeout(4500)]),
        );
        rates = { ...direct, ...rates };
      }
      if (!controller.signal.aborted) {
        setQuotes(rates);
        setLoading(false);
      }
    }

    void refresh();
    const interval = setInterval(refresh, 30_000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="bg-[#1f3a93]" aria-labelledby="market-data-title">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <h2
            id="market-data-title"
            className="text-3xl font-bold text-white sm:text-4xl"
          >
            Piyasa Verileri
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-white" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {currencies.map(({ symbol, name }) => {
            const quote = quotes[symbol];
            const change = quote?.change;
            return (
              <div key={symbol} className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{symbol}</p>
                    <p className="text-xs text-gray-500">{name}</p>
                  </div>
                  {change != null && (
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {change >= 0 ? "▲" : "▼"}{" "}
                      {change.toLocaleString("tr-TR", {
                        maximumFractionDigits: 3,
                      })}
                      %
                    </span>
                  )}
                </div>
                <dl className="space-y-3">
                  <div className="flex justify-between gap-2">
                    <dt className="text-xs font-medium text-gray-600">Alış</dt>
                    <dd className="text-sm font-bold text-gray-900">
                      {quote ? formatRate.format(quote.buyRate) + " ₺" : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-xs font-medium text-gray-600">Satış</dt>
                    <dd className="text-sm font-bold text-gray-900">
                      {quote ? formatRate.format(quote.sellRate) + " ₺" : "—"}
                    </dd>
                  </div>
                </dl>
                {!quote && (
                  <p className="mt-3 text-xs text-gray-600">
                    {loading
                      ? "Kur bilgisi yükleniyor…"
                      : "Kur bilgisi geçici olarak alınamadı."}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
