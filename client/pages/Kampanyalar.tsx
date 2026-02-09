import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import ServicesSection from "@/components/ServicesSection";
import BankLogosCarousel from "@/components/BankLogosCarousel";
import PiyasaVerileri from "@/components/PiyasaVerileri";
import CarBrandsShowcase from "@/components/CarBrandsShowcase";

function KampanyalarFAQSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const banks = [
    { name: "Akbank", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F40cf2a6e226b47bd9314e9bbaede9785?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "Garanti Bank", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Ff1c781a50b284c6a85ed62586fd10241?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "İş Bankası", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fdf32cba7a967459194ccbe6afe31254c?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "Halk Bank", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F2e0f2e6ff00a495abd1a1d832520c890?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "Ziraat Bankası", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F7a0de587811f4d6c897da9512983b25b?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "QNB Finans", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F8ede5914db55457e95c3ec0d3bf78b23?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "TEB", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F8a13ada2623d40eaa2e8914fae816fd8?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "Denizbank", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F2cfe529a3dab4b26bfa9414505f4c954?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "Şekerbank", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fffc318966ca642c4b9d1a5553f26886c?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "HSBC", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F0f5042ee709541ddb8367172214095c5?format=webp&width=800&height=1200", financingTypes: "Teminatlı Taşıt Kredisi" },
    { name: "QuickFinans", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fac222f367e8a4bd48bdeb71d77198659?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "TürkiyeFinans", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fa6758614b57645c5906135614a3e72b4?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "VakıfKatılım", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fcbdde0484d924ae4aaa1710328f43c05?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "alBaraka", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F83b94514be2f42f4be86a42ffa88acc7?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "arabamtaksit", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Ffc2df4b1455e4508b4cf6129d52069cc?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi" },
    { name: "Burgan Bank", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F505da3d1d93a41f59e62e18381b84283?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "OtoSOR", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fe4169ff414504baebf1f91ef4ffaad7e?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi" },
    { name: "otovadeli.com", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fe4b1136e327a45d9a4585303fb14f28c?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi" },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className="text-lg sm:text-xl lg:text-2xl font-bold mb-3"
            style={{ color: "#0f367e" }}
          >
            Kampanyalar
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Tüm bankalar ve finansman kuruluşlarının sunduğu ürün ve hizmetler. Her banka için mevcut finansman seçeneklerini keşfedin.
          </p>
        </div>

        {/* Banks Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {banks.map((bank, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(bank.name)}
                className="w-full px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                style={{
                  backgroundColor: expandedId === bank.name ? "#f3f4f6" : "#ffffff",
                }}
              >
                <div className="flex items-center gap-3">
                  {bank.logo && (
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="w-10 h-10 object-contain flex-shrink-0"
                    />
                  )}
                  <h3
                    className="text-left text-sm sm:text-base font-semibold"
                    style={{ color: "#0f367e" }}
                  >
                    {bank.name}
                  </h3>
                </div>
                <div
                  className="flex-shrink-0 ml-4 text-2xl font-bold transition-transform duration-300"
                  style={{
                    color: "#0f367e",
                    transform:
                      expandedId === bank.name ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </div>
              </button>

              {/* Content */}
              {expandedId === bank.name && (
                <div className="px-6 py-4 sm:py-5 border-t border-gray-200 bg-white">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-3">
                        Sunulan Finansman Seçenekleri:
                      </h4>
                      <div className="flex items-center gap-3 overflow-x-auto pb-2 flex-wrap">
                        {bank.financingTypes.split(", ").map((type, typeIdx) => (
                          <div
                            key={typeIdx}
                            className="flex items-center justify-center px-5 py-2 border-2 flex-shrink-0 transition-all rounded-full whitespace-nowrap"
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.6)",
                              background: "linear-gradient(to right, #0f367e, #1a4d9e)",
                            }}
                          >
                            <span
                              className="text-center text-xs sm:text-sm font-semibold"
                              style={{ color: "#ffffff" }}
                            >
                              {type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        {bank.name} ile finansman almak için hemen iletişime geçin ve en uygun koşulları öğrenin.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-8 sm:mt-10 text-center px-4">
          <p className="text-gray-600 mb-6 text-xs sm:text-sm max-w-2xl mx-auto">
            Hemen iletişime geçin ve finansman başvurusu hangi bankadan daha uygun fiyata kullanabileceğinizin bilgisi sizlere verelim.
          </p>
          <a
            href="https://wa.me/905324098440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-2 sm:px-8 sm:py-3 bg-blue-600 text-white font-semibold text-xs sm:text-sm rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            İletişime Geç
          </a>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-6 w-6 text-blue-300 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Kampanyalar() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section
          className="text-white py-4 sm:py-6"
          style={{
            background:
              "linear-gradient(to bottom right, #0f367e, #1a4d9e, #2563eb)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-center">
              {/* Left Content */}
              <div className="order-2 lg:order-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 leading-tight">
                  <div className="text-4xl sm:text-5xl lg:text-6xl">
                    Hayaline
                  </div>
                  <div className="font-black text-4xl sm:text-5xl lg:text-6xl">
                    Geç Kalma
                  </div>
                </h1>
                <p className="text-base sm:text-lg text-blue-100 mb-3 sm:mb-4">
                  Ön onaylı +800.000TL kredin hazır! Ticari ve Binek 20 Yaş'a
                  kadar tüm taşıtlarda geçerli <u>48 Ay Vade</u> seçeneği
                  OtoFinans'ta.
                </p>
                <ul className="space-y-2 sm:space-y-2.5 mb-4">
                  <li className="flex items-center gap-3 text-sm sm:text-base">
                    <CheckIcon />
                    <span>30 dakikada kredi taraması ve onayı</span>
                  </li>
                  <li className="flex items-center gap-3 text-base sm:text-lg">
                    <CheckIcon />
                    <span>En düşük faiz oranları</span>
                  </li>
                  <li className="flex items-center gap-3 text-base sm:text-lg">
                    <CheckIcon />
                    <span>Minimum evrak ile başvuru</span>
                  </li>
                  <li className="flex items-center gap-3 text-base sm:text-lg">
                    <CheckIcon />
                    <span>24/7 müşteri destek hizmeti</span>
                  </li>
                </ul>

                <a
                  href="https://wa.me/905324098440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-4 border-2 border-blue-400 text-white font-bold rounded-full hover:border-blue-300 hover:text-blue-300 transition-colors duration-200 text-sm sm:text-base"
                >
                  OtoFinanslı Ol →
                </a>
              </div>

              {/* Right Content - Banner Slider */}
              <div className="order-1 lg:order-2">
                <BannerSlider />

                {/* Contact Info */}
                <a
                  href="https://wa.me/905324098440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors block"
                >
                  <p className="text-xs text-blue-100 mb-1">
                    Bizimle İletişime Geç
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    +90 532 409 8440
                  </p>
                  <p className="text-blue-100 text-sm mt-2">
                    Limitini Etkilemeden Hemen Bilgi Al
                  </p>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Bank Logos Carousel */}
        <BankLogosCarousel />

        {/* Support Tagline */}
        <div className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-2.5 text-center">
          <p
            className="font-semibold text-white px-4"
            style={{ fontSize: "calc(0.875rem - 0.5px)" }}
          >
            Destek OtoFinans'ta ⇋ Aracın 30 Dakika'da Kapında!
          </p>
        </div>

        {/* Kampanyalar Section */}
        <KampanyalarFAQSection />

        {/* Market Data Section */}
        <PiyasaVerileri />

        {/* Services Section */}
        <ServicesSection />

        {/* Banner Section with Animations */}
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: "#0f367e", minHeight: "420px" }}
        >
          <style>{`
            @keyframes slideInFromRight {
              from {
                opacity: 0;
                transform: translateX(100px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-slide-in-right {
              animation: slideInFromRight 0.8s ease-out forwards;
            }

            .animate-fade-in-up {
              animation: fadeInUp 0.8s ease-out forwards;
            }

            .animate-fade-in-up-delay-1 {
              animation: fadeInUp 0.8s ease-out 0.2s forwards;
              opacity: 0;
            }

            .animate-fade-in-up-delay-2 {
              animation: fadeInUp 0.8s ease-out 0.4s forwards;
              opacity: 0;
            }
          `}</style>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[420px]">
              {/* Left Content */}
              <div className="text-white flex flex-col justify-start lg:justify-center py-8 lg:py-12 space-y-6 relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight animate-fade-in-up">
                  Aracını bizimle hızlı sat paran cebine gelsin
                  <svg
                    className="inline w-9 h-8 sm:w-11 sm:h-10 text-white ml-2 align-middle"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                    <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                    <path d="M8 14c0 2 1.5 3 4 3s4-1 4-3" />
                  </svg>
                </h2>

                <p className="text-sm sm:text-base lg:text-lg text-blue-100 leading-relaxed animate-fade-in-up-delay-1">
                  Oto Finans ile özgürce günlük rutinlerinden geri kalmadan
                  aracına en iyi teklifi biz verelim ve en hızlı kredi
                  sistemleri ile biz satalım. Tüm Türkiye'deki alıcılarımız sizi
                  bekliyor.
                </p>

                <div className="animate-fade-in-up-delay-2 pt-4">
                  <a
                    href="https://wa.me/905324098440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border-2 border-blue-400 text-white font-bold rounded-full hover:border-blue-300 hover:text-blue-300 transition-colors duration-200 text-sm sm:text-base"
                    title="OtoFinanslı Ol"
                  >
                    OtoFinanslı Ol
                  </a>
                </div>
              </div>

              {/* Right Content - Woman Image */}
              <div className="hidden lg:flex items-end justify-end h-[420px] overflow-hidden relative">
                <div className="animate-slide-in-right lg:z-10 flex items-center justify-center">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F2be5232ddd104e73a951c651243e7999?format=webp&width=800&height=1200"
                    alt="Oto Finans Müşteri"
                    className="h-[400px] w-auto object-contain"
                    style={{ marginBottom: "-4px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Car Brands Showcase */}
        <CarBrandsShowcase />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand with Logo */}
            <div className="flex flex-col items-start text-left">
              <div className="mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fe4ff196a7e434a4a9b9ad3a4f4a42668?format=webp&width=800&height=1200"
                  alt="Oto Finans Global Logo"
                  className="h-16 w-auto"
                />
              </div>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border-2 border-blue-400 text-white font-bold rounded-full hover:border-blue-300 hover:text-blue-300 transition-colors duration-200 text-sm sm:text-base"
              >
                Yetkili Bayi Girişi
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ana Sayfa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kredi Hesapla
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    İş Ortaklığı
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Finansmanlar
                  </a>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-white font-semibold mb-4">Hakkımızda</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Gizlilik Politikası
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kullanım Şartları
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    SSS
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://wa.me/905324098440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp: +90 532 409 8440
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:bilgi@otofinansglobal.com"
                    className="hover:text-white transition-colors"
                  >
                    Email: bilgi@otofinansglobal.com
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex justify-between items-center">
            <p className="text-sm" style={{ letterSpacing: "1.5px" }}>
              TÜRKİYE'NİN TAKSİTLİ ARAÇ SATIŞ PLATFORMU
            </p>
            <p className="text-sm">
              &copy; 2027 Oto Finans Global. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
