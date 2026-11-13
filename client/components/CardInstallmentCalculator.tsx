import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowUpRight,
  ChevronDown,
  CreditCard,
  Download,
  Info,
  ReceiptText,
  RotateCcw,
} from "lucide-react";
import {
  calculateCardPlan,
  parseCardInput,
  type CardCalculationMode,
} from "@/lib/card-calculator";

const money = (value: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
    value,
  );
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-lg font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

export default function CardInstallmentCalculator() {
  const [mode, setMode] = useState<CardCalculationMode>("net");
  const [amount, setAmount] = useState("320.000");
  const [rate, setRate] = useState("26,5");
  const [months, setMonths] = useState(12);
  const numericAmount = parseCardInput(amount, "amount");
  const numericRate = parseCardInput(rate, "rate");
  const amountError =
    !Number.isFinite(numericAmount) ||
    numericAmount < 1 ||
    numericAmount > 10_000_000;
  const rateError =
    !Number.isFinite(numericRate) || numericRate < 0 || numericRate > 99;
  const result = calculateCardPlan(numericAmount, numericRate, months, mode);

  function reset() {
    setMode("net");
    setAmount("320.000");
    setRate("26,5");
    setMonths(12);
  }
  function download() {
    if (!result) return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const downloadError = () =>
      toast.error("Taksit planı indirilemedi. Lütfen tekrar deneyin.");
    if (!context) {
      downloadError();
      return;
    }

    const width = 720;
    const rowHeight = 36;
    const tableTop = 262;
    const rows = [
      ["Taksit", "Taksit tutarı", "Kalan tutar"],
      ...result.schedule.map((row) => [
        `${row.number}. taksit`,
        money(row.amount),
        money(row.balance),
      ]),
      ["Toplam", money(result.gross), money(0)],
    ];
    const tableBottom = tableTop + rows.length * rowHeight;
    const height = tableBottom + 82;
    canvas.width = width * 2;
    canvas.height = height * 2;
    context.scale(2, 2);
    context.textBaseline = "middle";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#173c88";
    context.fillRect(0, 0, width, 88);
    context.fillStyle = "#ffffff";
    context.font = "bold 24px Arial, sans-serif";
    context.fillText("OtoFinans Global", 32, 29);
    context.font = "18px Arial, sans-serif";
    context.fillText("Kredi Kartı Taksit Planı", 32, 60);

    const summary = [
      ["Net tutar", money(result.net)],
      ["Karttan çekilecek toplam", money(result.gross)],
      [
        "Toplam kesinti oranı",
        `%${numericRate.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}`,
      ],
      ["Toplam kesinti tutarı", money(result.deduction)],
      ["Taksit sayısı", String(months)],
    ];
    context.fillStyle = "#0f172a";
    context.font = "16px Arial, sans-serif";
    summary.forEach(([label, value], index) => {
      const y = 114 + index * 28;
      context.textAlign = "left";
      context.fillText(label, 32, y);
      context.textAlign = "right";
      context.fillText(value, width - 32, y);
    });

    rows.forEach(([label, amount, balance], index) => {
      const y = tableTop + index * rowHeight;
      const emphasized = index === 0 || index === rows.length - 1;
      context.fillStyle = emphasized ? "#dbeafe" : "#f8fafc";
      context.fillRect(32, y, width - 64, rowHeight - 1);
      context.fillStyle = "#0f172a";
      context.font = emphasized
        ? "bold 16px Arial, sans-serif"
        : "16px Arial, sans-serif";
      context.textAlign = "left";
      context.fillText(label, 48, y + rowHeight / 2);
      context.textAlign = "right";
      context.fillText(amount, 456, y + rowHeight / 2);
      context.fillText(balance, width - 48, y + rowHeight / 2);
    });

    context.textAlign = "left";
    context.fillStyle = "#475569";
    context.font = "14px Arial, sans-serif";
    context.fillText(
      "Bilgilendirme amaçlıdır; banka teklifi değildir.",
      32,
      tableBottom + 28,
    );
    context.fillText(
      "Oran kullanıcı tarafından girilmiştir.",
      32,
      tableBottom + 49,
    );

    canvas.toBlob(
      (blob) => {
        if (blob?.type !== "image/jpeg") {
          downloadError();
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "otofinans-kart-taksit-plani.jpg";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      "image/jpeg",
      0.95,
    );
  }

  return (
    <section
      id="card-installment-calculator"
      aria-labelledby="card-calculator-title"
      className="scroll-mt-24 bg-slate-100 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 [@media(max-width:768px)]:pt-[48px]">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-800">
              <CreditCard size={16} aria-hidden="true" /> KARTLA ÖDEME PLANINIZ
            </span>
            <h2
              id="card-calculator-title"
              className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
            >
              Kredi Kartı Taksit Hesaplama
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Tutarı ve toplam kesinti oranını girin; kart çekimini, net tutarı
              ve taksitlerinizi tek ekranda görün.
            </p>
          </div>
          <span className="w-fit shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600">
            POS / taksitli satış simülasyonu
          </span>
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-[1.1fr_1fr]">
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-7 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-900">
                İşlem bilgileri
              </h3>
              <button
                type="button"
                onClick={reset}
                className={`flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-slate-500 hover:text-blue-800 ${focusClass}`}
              >
                <RotateCcw size={14} aria-hidden="true" /> Sıfırla
              </button>
            </div>
            <fieldset className="mb-6">
              <legend className="mb-2 text-sm font-semibold text-slate-700">
                Hesaplama yönü
              </legend>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                {(
                  [
                    { value: "net", label: "Net tutardan hesapla" },
                    { value: "gross", label: "Kart çekiminden hesapla" },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex cursor-pointer items-center justify-center rounded-lg px-2 py-3 text-center text-xs font-semibold transition sm:text-sm ${mode === option.value ? "bg-white text-blue-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    <input
                      className="peer sr-only"
                      type="radio"
                      name="card-calculation-mode"
                      value={option.value}
                      checked={mode === option.value}
                      onChange={() => setMode(option.value)}
                    />
                    <span
                      className="absolute inset-0 rounded-lg peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500"
                      aria-hidden="true"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label
              htmlFor="card-amount"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              {mode === "net"
                ? "Hesaba geçmesini istediğiniz net tutar"
                : "Karttan çekilecek toplam tutar"}
            </label>
            <div className="relative">
              <input
                id="card-amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={() => {
                  if (!amountError)
                    setAmount(
                      numericAmount.toLocaleString("tr-TR", {
                        maximumFractionDigits: 2,
                      }),
                    );
                }}
                aria-invalid={amountError}
                aria-describedby="card-amount-help"
                className={`${inputClass} pr-14`}
              />
              <span className="pointer-events-none absolute right-4 top-4 text-sm font-semibold text-slate-400">
                TL
              </span>
            </div>
            <p
              id="card-amount-help"
              className={`mt-2 text-xs ${amountError ? "text-red-700" : "text-slate-500"}`}
            >
              {amountError
                ? "1 TL ile 10.000.000 TL arasında geçerli bir tutar girin."
                : "Örneğin: 320.000 veya 320.000,50"}
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="card-months"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Taksit sayısı
                </label>
                <select
                  id="card-months"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className={inputClass}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n === 1 ? "Tek çekim" : `${n} taksit`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="card-rate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Toplam kesinti oranı (%)
                </label>
                <input
                  id="card-rate"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  aria-invalid={rateError}
                  aria-describedby="card-rate-help"
                  className={inputClass}
                />
              </div>
            </div>
            <p
              id="card-rate-help"
              className={`mt-3 text-xs leading-5 ${rateError ? "text-red-700" : "text-slate-500"}`}
            >
              {rateError
                ? "%0 ile %99 arasında bir oran girin (ör. 26,5)."
                : "Seçtiğiniz taksit için bankanızın bildirdiği toplam kesinti oranını girin. Taksit değişince oran otomatik değişmez; aylık faiz oranı değildir."}
            </p>
            <div className="mt-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-xs leading-6 text-blue-900">
              <Info size={18} className="mt-1 shrink-0" aria-hidden="true" />
              <p>
                <strong>Örnek hesaplama.</strong> Başlangıçtaki %26,5 bir banka
                teklifi değildir. Vergi ve ek ücretler ayrıca hesaplanmaz; varsa
                toplam kesinti oranına dahil edilmelidir.
              </p>
            </div>
          </div>

          <div className="relative min-w-0 bg-gradient-to-br from-[#0f367e] via-[#173c88] to-[#1a2474] p-5 text-white sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-100">
                <ReceiptText size={18} aria-hidden="true" /> Hesaplama özeti
              </h3>
              <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-blue-100">
                {months === 1 ? "Tek çekim" : `${months} taksit`}
              </span>
            </div>
            <div aria-live="polite" aria-atomic="true">
              {result ? (
                <>
                  <p className="text-sm text-blue-100">
                    {months === 1 ? "Tek çekim tutarı" : "Aylık taksit tutarı"}
                  </p>
                  <p className="mt-2 break-words text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
                    {money(result.installment)}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-blue-200">
                    {months > 1
                      ? "Kuruş farkları taksitlere dağıtılır; toplam tutar değişmez."
                      : "Tüm tutar tek seferde karttan çekilir."}
                  </p>
                  <dl className="mt-8 divide-y divide-white/15 rounded-2xl border border-white/15 bg-white/5 px-4 sm:px-5">
                    {[
                      ["Karttan çekilecek toplam", result.gross],
                      ["Hesaba geçecek net tutar", result.net],
                      ["Toplam kesinti tutarı", result.deduction],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-4"
                      >
                        <dt className="text-xs text-blue-100 sm:text-sm">
                          {label}
                        </dt>
                        <dd className="text-base font-bold sm:text-lg">
                          {money(Number(value))}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : (
                <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
                  <p className="font-semibold">Hesaplamayı tamamlayalım</p>
                  <p className="mt-2 text-sm leading-6 text-blue-100">
                    Sonucu görmek için geçerli bir tutar ve kesinti oranı girin.
                  </p>
                </div>
              )}
            </div>
            <a
              href={`https://wa.me/905324098440?text=${encodeURIComponent(result ? `Merhaba, kredi kartıyla taksitli ödeme hakkında bilgi almak istiyorum. Net tutar: ${money(result.net)}, kart çekimi: ${money(result.gross)}, taksit: ${months}, örnek toplam kesinti oranı: %${numericRate.toLocaleString("tr-TR")}. Güncel teklifinizi paylaşır mısınız?` : "Merhaba, kredi kartıyla taksitli ödeme hakkında bilgi almak istiyorum.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-4 text-sm font-bold text-blue-900 transition hover:bg-blue-50 ${focusClass}`}
            >
              Güncel teklif için bize ulaşın{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <p className="mt-3 text-center text-xs text-blue-200">
              Kart bilgilerinizi paylaşmanız gerekmez.
            </p>
          </div>
        </div>

        {result && (
          <details className="group mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <summary
              className={`flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-sm font-semibold text-slate-800 sm:px-7 [&::-webkit-details-marker]:hidden ${focusClass}`}
            >
              <span className="flex items-center gap-2">
                <ReceiptText
                  size={18}
                  className="text-blue-800"
                  aria-hidden="true"
                />{" "}
                Taksit planını incele
              </span>
              <ChevronDown
                size={18}
                className="transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="border-t border-slate-100 px-5 pb-5 sm:px-7">
              <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                <p className="max-w-xl text-xs leading-5 text-slate-500">
                  Ödeme günleri kartınızın ekstre tarihine bağlıdır. Bu plan,
                  taksit tutarlarını gösterir.
                </p>
                <button
                  type="button"
                  onClick={download}
                  className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-900 hover:bg-slate-50 ${focusClass}`}
                >
                  <Download size={15} aria-hidden="true" /> Planı indir (JPG)
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[360px] text-right text-sm tabular-nums">
                  <caption className="sr-only">
                    Kredi kartı taksit ödeme planı
                  </caption>
                  <thead>
                    <tr className="bg-slate-50 text-xs text-slate-500">
                      <th scope="col" className="p-3 text-left">
                        Taksit
                      </th>
                      <th scope="col" className="p-3">
                        Taksit tutarı
                      </th>
                      <th scope="col" className="p-3">
                        Kalan tutar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.schedule.map((row) => (
                      <tr key={row.number}>
                        <th
                          scope="row"
                          className="p-3 text-left font-medium text-slate-600"
                        >
                          {row.number}. taksit
                        </th>
                        <td className="p-3 font-semibold text-slate-900">
                          {money(row.amount)}
                        </td>
                        <td className="p-3 text-slate-500">
                          {money(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-200 text-blue-900">
                      <th scope="row" className="p-3 text-left">
                        Toplam
                      </th>
                      <td className="p-3 font-bold">{money(result.gross)}</td>
                      <td className="p-3">{money(0)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </details>
        )}
        <p className="mt-5 text-xs leading-6 text-slate-500">
          Hesaplama bilgilendirme amaçlıdır; nakit avans veya kredi teklifi
          değildir. Kesinti, karttan çekilen toplam tutar üzerinden hesaplanır.
          Taksit uygunluğu; kart, banka, sektör ve yürürlükteki kurallara
          bağlıdır. Hesaba geçiş süresi bankanızın sözleşmesine göre belirlenir.
        </p>
      </div>
    </section>
  );
}
