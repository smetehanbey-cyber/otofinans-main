import { useState, useMemo } from "react";

export default function CreditCalculator() {
  const [amount, setAmount] = useState(1000);
  const [duration, setDuration] = useState(48);
  const [customRate, setCustomRate] = useState(false);
  const [rate, setRate] = useState(9.99);

  // Calculate monthly payment
  const monthlyPayment = useMemo(() => {
    if (amount <= 0 || duration <= 0) return 0;
    const monthlyRate = rate / 100 / 12;
    const monthlyPay = 
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, duration))) /
      (Math.pow(1 + monthlyRate, duration) - 1);
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

  return (
    <section className="py-4 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground mb-0">
            Ön Onaylı Krediniz Hazır.
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Şimdi Kullanabilirsiniz!
          </p>
        </div>

        {/* Calculator Section */}
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200">
          {/* Input Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Product Type */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Ürün</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
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
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
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
                <span className="ml-2 text-sm font-medium text-gray-700">Ay</span>
              </div>
            </div>

            {/* Set Interest Rate */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customRate}
                  onChange={(e) => setCustomRate(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Kâr Oranı Belirle</span>
              </label>
            </div>
          </div>

          {/* Custom Rate Input */}
          {customRate && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Kâr Oranı (%)</label>
              <input
                type="number"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none max-w-xs"
              />
            </div>
          )}

          {/* Results Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-600 mb-2">Taksit Tutarı</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {formattedMonthly}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-2">Ödenecek Toplam Tutar</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {formattedTotal}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-2">Oranı</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                %{rate.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200">
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
              <li>• Tahsil ücreti müsteşnaından proje tarafı tahsil edilecektir. Ödenecek toplam tutar finansman tahsisi kömodyitededir.</li>
              <li>• Minimum Taşıt Kredisi 50.000 TL, Azamı Finansman için DRB'nin ücreti % 2.5, 250.000 TL üzeride Azamı Finansman için DRB'nin ücreti % 2 ve taksat yapılabilmektedir.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
