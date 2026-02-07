import { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";

export default function CreditCalculator() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [productType, setProductType] = useState('Taşıt Kredisi');
  const [amount, setAmount] = useState(1000);
  const [duration, setDuration] = useState(48);
  const [rate, setRate] = useState(0.99);

  // Rate options for different customer types (monthly percentages)
  const rateOptions = [
    { label: 'Esnaf', value: 0.99 },
    { label: 'Şirket', value: 3.70 },
    { label: 'Bireysel', value: 3.80 }
  ];

  // Calculate monthly payment using compound interest formula
  // Formula: installment = principal * (r * (1+r)^n) / ((1+r)^n - 1)
  // where r = monthly rate as decimal, n = number of months
  const monthlyPayment = useMemo(() => {
    if (amount <= 0 || duration <= 0) return 0;

    // Convert percentage to decimal (0.99% → 0.0099)
    const monthlyRate = rate / 100;

    // Compound interest formula for equal installments
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, duration);
    const denominator = Math.pow(1 + monthlyRate, duration) - 1;
    const monthlyPay = amount * (numerator / denominator);

    return monthlyPay.toFixed(2);
  }, [amount, duration, rate]);

  // Calculate total payment
  const totalPayment = useMemo(() => {
    return (parseFloat(monthlyPayment) * duration).toFixed(2);
  }, [monthlyPayment, duration]);

  const formattedMonthly = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(parseFloat(monthlyPayment));

  const formattedTotal = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(parseFloat(totalPayment));

  // Helper function to calculate monthly payment for any principal, rate, and duration
  const calculateMonthlyPayment = (principal: number, monthlyRate: number, months: number): number => {
    if (principal <= 0 || months <= 0) return 0;
    const r = monthlyRate / 100;
    const numerator = r * Math.pow(1 + r, months);
    const denominator = Math.pow(1 + r, months) - 1;
    return principal * (numerator / denominator);
  };

  // Generate payment schedule table data with different down payment scenarios
  const paymentScheduleData = useMemo(() => {
    const downPaymentPercentages = [20, 30, 40, 50, 60, 70];
    const termMonths = [12, 18, 24, 36, 48];
    const data: Array<{downPaymentPercent: number; downPayment: number; loanAmount: number; installments: number[]}> = [];

    downPaymentPercentages.forEach(percentage => {
      const downPayment = amount * (percentage / 100);
      const loanAmount = amount - downPayment;
      const installments = termMonths.map(months =>
        calculateMonthlyPayment(loanAmount, rate, months)
      );

      data.push({
        downPaymentPercent: percentage,
        downPayment: downPayment,
        loanAmount: loanAmount,
        installments: installments
      });
    });

    return data;
  }, [amount, rate]);

  // Generate and download payment schedule as PNG image
  const downloadPaymentSchedulePNG = async () => {
    if (!tableRef.current) return;

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Odeme-Plani-${amount.toLocaleString('tr-TR')}TL.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Tablo oluştururken hata meydana geldi. Lütfen tekrar deneyiniz.');
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
        'Ay': month,
        'Taksit Tutarı (₺)': parseFloat(monthlyPayment).toFixed(2),
        'Anapara (₺)': Math.max(principalPayment, 0).toFixed(2),
        'Faiz (₺)': interestPayment.toFixed(2),
        'Kalan Bakiye (₺)': Math.max(remainingBalance, 0).toFixed(2)
      });
    }

    // Create Excel workbook
    const ws = XLSX.utils.json_to_sheet(scheduleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ödeme Planı");

    // Set column widths
    ws['!cols'] = [
      { wch: 8 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 }
    ];

    // Download file
    XLSX.writeFile(wb, `Odeme-Plani-${amount}TL-${duration}Ay.xlsx`);
  };

  return (
    <section className="py-4 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-2 sm:mb-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium mb-0" style={{ color: '#0f367e' }}>
            Ön Onaylı Kredin Hazır.
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Taşıt Kredini Şimdi Kullanabilirsin!
          </p>
        </div>

        {/* Calculator Section */}
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200">
          {/* Input Section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            {/* Product Type */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Ürün</label>
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
              <label className="text-sm font-medium text-gray-700 mb-2 block">Tutar</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={amount.toLocaleString('tr-TR')}
                  onChange={(e) => {
                    const numericValue = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                    setAmount(numericValue);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">₺</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Vade</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap">Ay</span>
              </div>
            </div>

            {/* Rate */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Oran</label>
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-600 mb-2 text-left">Taksit Tutarı</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {formattedMonthly}
              </p>
              <p className="text-xs text-gray-600 mt-1 text-left">Peşinatsız Tamamına Kredi Olursa</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-2 text-left">Ödenecek Toplam Tutar</p>
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
            <div></div>
          </div>

          {/* Payment Schedule Table for PNG Export */}
          <div ref={tableRef} className="mb-8 p-6" style={{ backgroundColor: '#ffffff' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#1a2b7d', color: '#ffffff', padding: '20px', marginBottom: '0', borderRadius: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0', fontSize: '25px', fontWeight: 'bold', letterSpacing: '0.5px', fontFamily: '"Paytone One", sans-serif' }}>
                  {amount.toLocaleString('tr-TR')} TL ARAÇ İÇİN TAKSİTLİ SATIŞ ÖRNEK ÖDEME TABLOSU
                </h3>
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fdd2abb901dc9416a9b712d9a471c713a?format=webp&width=800&height=1200"
                alt="Oto Finans Logo"
                style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            {/* Separator Line */}
            <div style={{ height: '5px', backgroundColor: '#6d2fce', width: '100%' }}></div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', fontFamily: '"Paytone One", sans-serif' }}>
              <thead>
                <tr style={{ backgroundColor: '#1800ae', color: '#ffffff' }}>
                  <th style={{ border: '2px solid #1800ae', padding: '14px 6px', textAlign: 'left', fontWeight: 'bold', fontSize: '20px', fontFamily: '"Paytone One", sans-serif', letterSpacing: '0.5px' }}>PEŞİNAT</th>
                  <th style={{ border: '2px solid #1800ae', padding: '14px 0 14px 6px', textAlign: 'left', fontWeight: 'bold', fontSize: '20px', fontFamily: '"Paytone One", sans-serif', letterSpacing: '0.5px', width: '98px' }}>KREDİ TUTARI</th>
                  <th style={{ border: '2px solid #1800ae', padding: '14px', textAlign: 'right', fontWeight: 'bold', fontSize: '20px', fontFamily: '"Paytone One", sans-serif', letterSpacing: '0.5px', minWidth: '123px' }}>12AY</th>
                  <th style={{ border: '2px solid #1800ae', padding: '14px', textAlign: 'right', fontWeight: 'bold', fontSize: '20px', fontFamily: '"Paytone One", sans-serif', letterSpacing: '0.5px', minWidth: '123px' }}>18AY</th>
                  <th style={{ border: '2px solid #1800ae', padding: '14px', textAlign: 'right', fontWeight: 'bold', fontSize: '20px', fontFamily: '"Paytone One", sans-serif', letterSpacing: '0.5px', minWidth: '123px' }}>24AY</th>
                  <th style={{ border: '2px solid #1800ae', padding: '14px', textAlign: 'right', fontWeight: 'bold', fontSize: '20px', fontFamily: '"Paytone One", sans-serif', letterSpacing: '0.5px', minWidth: '123px' }}>36AY</th>
                  <th style={{ border: '2px solid #1800ae', padding: '14px', textAlign: 'right', fontWeight: 'bold', fontSize: '20px', fontFamily: '"Paytone One", sans-serif', letterSpacing: '0.5px', minWidth: '123px' }}>48AY</th>
                </tr>
              </thead>
              <tbody>
                {paymentScheduleData.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <td style={{ border: '1px solid #6d2fce', padding: '14px 6px', textAlign: 'left', fontSize: '14px', fontWeight: '500', fontFamily: '"Paytone One", sans-serif' }}>
                      %{row.downPaymentPercent} ({row.downPayment.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺)
                    </td>
                    <td style={{ border: '1px solid #6d2fce', padding: '14px 0 14px 6px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', fontFamily: '"Paytone One", sans-serif', width: '98px' }}>
                      {row.loanAmount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                    </td>
                    {row.installments.map((installment, termIdx) => (
                      <td key={termIdx} style={{ border: '1px solid #6d2fce', padding: '14px', textAlign: 'right', fontSize: '14px', fontFamily: '"Paytone One", sans-serif', minWidth: '95px' }}>
                        {installment.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadPaymentSchedulePNG}
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200"
            >
              Ödeme Planı
            </button>
            <a
              href="tel:+905324098440"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center"
            >
              Hemen Başvur
            </a>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <ul className="text-xs text-gray-600 space-y-2">
              <li>• Şahıs vergi levhalı müşterilerimize geçerli ayrı avantajlar için %0,99 seçerek hesaplama ekranından ödeme planını indirebilirsiniz.</li>
              <li>• Minimum Taşıt Kredisi 50.000 TL olarka geçerlidir.</li>
              <li>• Dosya masrafları ödeme planı dışında ek olarak sunulmaktadır.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
