import { useState, useMemo, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export default function CreditCalculator() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [productType, setProductType] = useState("Taşıt Kredisi");
  const [amount, setAmount] = useState(100000);
  const [duration, setDuration] = useState(48);
  const [rate, setRate] = useState(0.99);
  const [tableVisible, setTableVisible] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Show table when any input changes (after initial load)
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    setTableVisible(true);
  }, [amount, duration, rate, productType]);

  // Rate options for different customer types (monthly percentages)
  const rateOptions = [
    { label: "", value: 0.99 },
    { label: "", value: 3.7 },
    { label: "", value: 3.8 },
    { label: "", value: 4.5 },
  ];

  // Calculate monthly payment using compound interest formula
  // Formula: installment = principal * (r * pow) / (pow - 1)
  // where pow = Math.pow(1 + r, n) and r = ratePercent / 100
  const monthlyPayment = useMemo(() => {
    if (amount <= 0 || duration <= 0) return 0;

    // Convert percentage to decimal (e.g., 0.99% → 0.0099, 3.70% → 0.037)
    const r = rate / 100;

    // Calculate power term: (1 + r)^n
    const pow = Math.pow(1 + r, duration);

    // Apply equal installment formula: principal * (r * pow) / (pow - 1)
    const monthlyPay = amount * (r * pow) / (pow - 1);

    return monthlyPay.toFixed(2);
  }, [amount, duration, rate]);

  // Calculate total payment
  const totalPayment = useMemo(() => {
    return (parseFloat(monthlyPayment) * duration).toFixed(2);
  }, [monthlyPayment, duration]);

  const formattedMonthly = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(parseFloat(monthlyPayment));

  const formattedTotal = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(parseFloat(totalPayment));

  // Helper function to calculate monthly payment using compound interest formula
  // Formula: installment = principal * (r * pow) / (pow - 1)
  // where pow = Math.pow(1 + r, n) and r = ratePercent / 100
  const calculateMonthlyPayment = (
    principal: number,
    ratePercent: number,
    months: number,
  ): number => {
    if (principal <= 0 || months <= 0) return 0;

    // Convert percentage to decimal (3.70 → 0.037)
    const r = ratePercent / 100;

    // Calculate power term: (1 + r)^n
    const pow = Math.pow(1 + r, months);

    // Apply equal installment formula: principal * (r * pow) / (pow - 1)
    const installment = principal * (r * pow) / (pow - 1);

    return installment;
  };

  // Generate payment schedule table data with different down payment scenarios
  const paymentScheduleData = useMemo(() => {
    const downPaymentPercentages = [20, 30, 40, 50, 60, 70];
    const termMonths = [12, 18, 24, 36, 48];
    const data: Array<{
      downPaymentPercent: number;
      downPayment: number;
      loanAmount: number;
      installments: number[];
    }> = [];

    downPaymentPercentages.forEach((percentage) => {
      const downPayment = amount * (percentage / 100);
      const loanAmount = amount - downPayment;
      const installments = termMonths.map((months) =>
        calculateMonthlyPayment(loanAmount, rate, months),
      );

      data.push({
        downPaymentPercent: percentage,
        downPayment: downPayment,
        loanAmount: loanAmount,
        installments: installments,
      });
    });

    return data;
  }, [amount, rate]);

  // Generate and download payment schedule as PNG image
  const downloadPaymentSchedulePNG = async () => {
    if (!tableRef.current) return;

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import("html2canvas")).default;

      // Temporarily make table visible for PNG export
      const wasVisible = tableVisible;
      const originalStyle = {
        opacity: tableRef.current.style.opacity,
        maxHeight: tableRef.current.style.maxHeight,
        overflow: tableRef.current.style.overflow,
        position: tableRef.current.style.position,
        width: tableRef.current.style.width,
        height: tableRef.current.style.height,
      };

      // Ensure table is fully visible and has proper dimensions
      tableRef.current.style.opacity = "1";
      tableRef.current.style.maxHeight = "none";
      tableRef.current.style.overflow = "visible";
      tableRef.current.style.position = "fixed";
      tableRef.current.style.left = "-9999px";
      tableRef.current.style.width = "auto";
      tableRef.current.style.height = "auto";

      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 200));

      // Get the actual dimensions of the table
      const tableWidth = tableRef.current.scrollWidth || 1200;
      const tableHeight = tableRef.current.scrollHeight || 800;

      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowHeight: tableHeight,
        windowWidth: tableWidth,
        width: tableWidth,
        height: tableHeight,
      });

      // Restore original styles
      Object.keys(originalStyle).forEach(key => {
        tableRef.current!.style[key as any] = originalStyle[key as keyof typeof originalStyle];
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Odeme-Plani-${amount.toLocaleString("tr-TR")}TL.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      toast.success("Ödeme planınız görüntü olarak kayıt edilmiştir", {
        duration: 4000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Error generating PNG:", error);
      toast.error("Tablo oluştururken hata meydana geldi. Lütfen tekrar deneyiniz.", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  // Generate and download payment schedule as Excel
  const downloadPaymentSchedule = () => {
    // Convert percentage to decimal (0.99% → 0.0099, 3.70% → 0.037)
    const monthlyRate = rate / 100;
    const scheduleData = [];
    let remainingBalance = amount;

    for (let month = 1; month <= duration; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = parseFloat(monthlyPayment) - interestPayment;
      remainingBalance -= principalPayment;

      scheduleData.push({
        Ay: month,
        "Taksit Tutarı (₺)": parseFloat(monthlyPayment).toFixed(2),
        "Anapara (₺)": Math.max(principalPayment, 0).toFixed(2),
        "Faiz (₺)": interestPayment.toFixed(2),
        "Kalan Bakiye (₺)": Math.max(remainingBalance, 0).toFixed(2),
      });
    }

    // Create Excel workbook
    const ws = XLSX.utils.json_to_sheet(scheduleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ödeme Planı");

    // Set column widths
    ws["!cols"] = [
      { wch: 8 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
    ];

    // Download file
    XLSX.writeFile(wb, `Odeme-Plani-${amount}TL-${duration}Ay.xlsx`);
  };

  return (
    <section id="credit-calculator" className="py-4 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-2 sm:mb-3">
          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-medium mb-0"
            style={{ color: "#0f367e" }}
          >
            Ön Onaylı Kredin Hazır.
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Taşıt Kredini Şimdi Kullanabilirsin!
          </p>
        </div>

        {/* Calculator Section */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200">
          {/* Input Section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            {/* Product Type */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Ürün
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option>Taşıt Kredisi</option>
                <option>Ticari Araç Kredisi</option>
                <option>Motorsiklet Kredisi</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tutar
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={amount.toLocaleString("tr-TR")}
                  onChange={(e) => {
                    const numericValue =
                      parseInt(e.target.value.replace(/\D/g, "")) || 0;
                    setAmount(numericValue);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  ₺
                </span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Vade
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                  Ay
                </span>
              </div>
            </div>

            {/* Rate */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Oran
              </label>
              <select
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {rateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    %{option.value.toFixed(2)} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-600 mb-2 text-left">
                Taksit Tutarı
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {formattedMonthly}
              </p>
              <p className="text-xs font-semibold mt-1 text-left" style={{ color: "#0f367e" }}>
                Peşinatsız Tamamına Kredi Olursa
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-2 text-left">
                Ödenecek Toplam Tutar
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {formattedTotal}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-2 text-left">Oran</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                %{rate.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Payment Schedule Table for PNG Export */}
          <div
            ref={tableRef}
            style={{
              backgroundColor: "#ffffff",
              opacity: tableVisible ? 1 : 0,
              maxHeight: tableVisible ? "2000px" : "0px",
              overflow: "hidden",
              marginBottom: tableVisible ? "32px" : "0px",
              transition:
                "opacity 0.6s ease-in-out, maxHeight 0.6s ease-in-out, transform 0.6s ease-in-out, margin-bottom 0.6s ease-in-out",
              transform: tableVisible ? "translateY(0)" : "translateY(-20px)",
            }}
          >
            {/* Scrollable Table Wrapper for Mobile - header and table scroll together */}
            <div
              style={{
                overflowX: "auto",
                overflowY: "hidden",
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "-ms-autohiding-scrollbar",
                width: "100%",
              }}
              className="scrollable-table-container"
            >
              <style>{`
                .scrollable-table-container {
                  scrollbar-width: thin;
                  scrollbar-color: #6d2fce #e5e7eb;
                }
                .scrollable-table-container::-webkit-scrollbar {
                  height: 6px;
                }
                .scrollable-table-container::-webkit-scrollbar-track {
                  background: #e5e7eb;
                  border-radius: 10px;
                }
                .scrollable-table-container::-webkit-scrollbar-thumb {
                  background: #6d2fce;
                  border-radius: 10px;
                }
                .scrollable-table-container::-webkit-scrollbar-thumb:hover {
                  background: #5a1fb8;
                }
              `}</style>

              {/* Header - Inside scroll container, moves with table */}
              <div
                style={{
                  backgroundColor: "#1a2b7d",
                  color: "#ffffff",
                  padding: "20px",
                  marginBottom: "0",
                  borderRadius: "0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  borderBottom: "5px solid #6d2fce",
                  minWidth: "1000px",
                }}
              >
                <div style={{ flex: 1, minWidth: "0" }}>
                  <h3
                    style={{
                      margin: "0",
                      fontSize: "clamp(14px, 4vw, 22px)",
                      fontWeight: "bold",
                      letterSpacing: "1px",
                      fontFamily: '"Paytone One", sans-serif',
                      wordBreak: "break-word",
                    }}
                  >
                    {amount.toLocaleString("tr-TR")} TL ARAÇ İÇİN TAKSİTLİ SATIŞ
                    ÖRNEK ÖDEME TABLOSU
                  </h3>
                </div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F475a3c8d7d4e4dda994162d8b3ea3e67?format=webp&width=800&height=1200"
                  alt="Oto Finans Logo"
                  style={{ height: "clamp(40px, 10vw, 65px)", width: "auto", objectFit: "contain", marginLeft: "10px", flexShrink: 0 }}
                />
              </div>

              {/* Table */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                  fontFamily: '"Paytone One", sans-serif',
                  minWidth: "1000px",
                }}
              >
              <thead>
                <tr style={{ backgroundColor: "#1800ae", color: "#ffffff" }}>
                  <th
                    style={{
                      border: "2px solid #1800ae",
                      padding: "20px 6px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: "bold",
                      fontSize: "21px",
                      fontFamily: '"Paytone One", sans-serif',
                      letterSpacing: "2px",
                      height: "60px",
                      lineHeight: "1.2",
                    }}
                  >
                    PEŞİNAT
                  </th>
                  <th
                    style={{
                      border: "2px solid #1800ae",
                      padding: "20px 0 20px 6px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: "bold",
                      fontSize: "21px",
                      fontFamily: '"Paytone One", sans-serif',
                      letterSpacing: "2px",
                      minWidth: "123px",
                      height: "60px",
                      lineHeight: "1.2",
                    }}
                  >
                    KREDİ TUTARI
                  </th>
                  <th
                    style={{
                      border: "2px solid #1800ae",
                      padding: "20px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: "bold",
                      fontSize: "21px",
                      fontFamily: '"Paytone One", sans-serif',
                      letterSpacing: "2px",
                      minWidth: "123px",
                      height: "60px",
                      lineHeight: "1.2",
                    }}
                  >
                    12AY
                  </th>
                  <th
                    style={{
                      border: "2px solid #1800ae",
                      padding: "20px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: "bold",
                      fontSize: "21px",
                      fontFamily: '"Paytone One", sans-serif',
                      letterSpacing: "2px",
                      minWidth: "123px",
                      height: "60px",
                      lineHeight: "1.2",
                    }}
                  >
                    18AY
                  </th>
                  <th
                    style={{
                      border: "2px solid #1800ae",
                      padding: "20px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: "bold",
                      fontSize: "21px",
                      fontFamily: '"Paytone One", sans-serif',
                      letterSpacing: "2px",
                      minWidth: "123px",
                      height: "60px",
                      lineHeight: "1.2",
                    }}
                  >
                    24AY
                  </th>
                  <th
                    style={{
                      border: "2px solid #1800ae",
                      padding: "20px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: "bold",
                      fontSize: "21px",
                      fontFamily: '"Paytone One", sans-serif',
                      letterSpacing: "2px",
                      minWidth: "123px",
                      height: "60px",
                      lineHeight: "1.2",
                    }}
                  >
                    36AY
                  </th>
                  <th
                    style={{
                      border: "2px solid #1800ae",
                      padding: "20px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: "bold",
                      fontSize: "21px",
                      fontFamily: '"Paytone One", sans-serif',
                      letterSpacing: "2px",
                      minWidth: "123px",
                      height: "60px",
                      lineHeight: "1.2",
                    }}
                  >
                    48AY
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentScheduleData.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{ backgroundColor: "#ffffff", color: "#000000" }}
                  >
                    <td
                      style={{
                        border: "1px solid #6d2fce",
                        padding: "16px 6px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontSize: "17px",
                        fontWeight: 900,
                        fontFamily: '"Arimo", sans-serif',
                        letterSpacing: "0",
                        height: "60px",
                        lineHeight: "1.2",
                      }}
                    >
                      %{row.downPaymentPercent} (
                      {row.downPayment.toLocaleString("tr-TR", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      ₺)
                    </td>
                    <td
                      style={{
                        border: "1px solid #6d2fce",
                        padding: "16px 0 16px 6px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontWeight: 900,
                        fontSize: "17px",
                        fontFamily: '"Arimo", sans-serif',
                        minWidth: "123px",
                        letterSpacing: "0",
                        height: "60px",
                        lineHeight: "1.2",
                      }}
                    >
                      {row.loanAmount.toLocaleString("tr-TR", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      ₺
                    </td>
                    {row.installments.map((installment, termIdx) => (
                      <td
                        key={termIdx}
                        style={{
                          border: "1px solid #6d2fce",
                          padding: "16px",
                          textAlign: "center",
                          verticalAlign: "middle",
                          fontSize: "17px",
                          fontWeight: 900,
                          fontFamily: '"Arimo", sans-serif',
                          minWidth: "123px",
                          letterSpacing: "0",
                          height: "60px",
                          lineHeight: "1.2",
                        }}
                      >
                        {installment.toLocaleString("tr-TR", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        ₺
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={downloadPaymentSchedulePNG}
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              Ödeme Planı
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
            <a
              href="https://wa.me/905326398440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center"
            >
              Hemen Başvur
            </a>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <ul className="text-xs text-gray-600 space-y-2">
              <li>
                • Şahıs vergi levhalı müşterilerimize geçerli ayrı avantajlar
                için %0,99 seçerek hesaplama ekranından ödeme planını
                indirebilirsiniz.
              </li>
              <li>• Minimum Taşıt Kredisi 50.000 TL olarka geçerlidir.</li>
              <li>
                • Dosya masrafları ödeme planı dışında ek olarak sunulmaktadır.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
