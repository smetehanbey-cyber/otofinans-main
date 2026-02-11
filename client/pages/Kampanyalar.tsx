import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import ServicesSection from "@/components/ServicesSection";
import BankLogosCarousel from "@/components/BankLogosCarousel";
import PiyasaVerileri from "@/components/PiyasaVerileri";
import CarBrandsShowcase from "@/components/CarBrandsShowcase";

function KampanyalarCardsSection() {
  // Add CSS styles for the progress bar animation
  const progressBarStyles = `
    @keyframes greenFillProgress {
      from {
        width: 0%;
      }
      to {
        width: 100%;
      }
    }

    .campaign-button-wrapper {
      position: relative;
      display: block;
      width: 100%;
    }

    .campaign-button-link {
      position: relative;
      display: inline-flex !important;
      overflow: hidden;
      color: white !important;
      border-radius: 9999px;
    }

    .campaign-button-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 0%;
      height: 100%;
      background: linear-gradient(to right, #22c55e, #16a34a);
      pointer-events: none;
      z-index: 0;
      border-radius: 9999px;
    }

    .campaign-button-link span {
      position: relative;
      z-index: 2;
      color: white !important;
    }

    .campaign-button-wrapper:hover .campaign-button-link::before {
      animation: greenFillProgress 13s ease-in-out forwards;
    }

    @keyframes showWhatsApp {
      0% {
        opacity: 0;
      }
      99% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    .campaign-button-wrapper {
      position: relative;
    }

    .campaign-button-link .button-text {
      display: inline-block;
    }

    .campaign-button-wrapper:hover .campaign-button-link .button-text {
      animation: fadeOutText 13s ease-in-out forwards;
    }

    @keyframes fadeOutText {
      0% {
        opacity: 1;
      }
      99% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    .campaign-button-link .whatsapp-text {
      position: absolute;
      opacity: 0;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
    }

    .campaign-button-wrapper:hover .campaign-button-link .whatsapp-text {
      animation: showWhatsApp 13s ease-in-out forwards;
    }

    .campaign-image-container {
      position: relative;
      overflow: hidden;
      border: 3px solid #0f367e;
      border-radius: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .campaign-image-container img {
      position: relative;
      transition: transform 0.3s ease-out;
      border: none;
      border-radius: 29px;
    }

    .campaign-image-container:hover img {
      transform: scale(1.02);
    }
  `;

  const campaigns = [
    {
      id: 1,
      title: "Hızlı Kredi Desteği",
      description: "20 Yaş'a Kadar Tüm Aracılarda Kredi Onayı OtoFinansında",
      image: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F92045d3d960f406e80a0a36b4ec1ada0?format=webp&width=800&height=1200",
    },
    {
      id: 2,
      title: "Ön Onaylı +800.000TL Kredi Limitini Hazır!",
      description: "Limitini Etkilemeden Ön Onaylı Kredini Hemen Kullan! Fırsatları kaçırma!",
      image: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F0195001f0f1644c09ed8556737d376ca?format=webp&width=800&height=1200",
    },
    {
      id: 3,
      title: "Peşinatsız Destek",
      description: "30 Dakikada Kredi! Aracın Hemen Kapında",
      image: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F78d5f17173244bcda7edc13b4e5a7301?format=webp&width=800&height=1200",
    },
  ];

  return (
    <section className="py-4 sm:py-6 bg-gray-50">
      <style>{progressBarStyles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-3 sm:mb-4">
          <h2
            className="text-lg sm:text-xl lg:text-2xl font-bold mb-3"
            style={{ color: "#0f367e" }}
          >
            Kampanyalar
          </h2>
        </div>

        {/* Campaign Cards */}
        <div className="max-w-4xl mx-auto space-y-0">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              style={{
                border: "2px solid rgba(15, 54, 126, 0.1)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 md:p-4">
                {/* Image */}
                <div className="campaign-image-container w-full h-auto">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full object-cover"
                    style={{
                      height: "256px",
                      width: "100%",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-3 md:p-4">
                  <h3
                    className="font-bold text-xl sm:text-2xl mb-2"
                    style={{ color: "#0f367e" }}
                  >
                    {campaign.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-tight mb-4">
                    {campaign.description}
                  </p>
                  <div className="campaign-button-wrapper">
                    <a
                      href="https://wa.me/905324098440?text=Krediler%20hakkında%20bilgi%20almak%20istiyorum."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="campaign-button-link inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3 text-white font-bold text-sm sm:text-base rounded-full hover:opacity-90 w-full sm:w-auto border-2"
                      style={{
                        background: "linear-gradient(to right, #0f367e, #1a4d9e)",
                        borderColor: "#2563eb",
                      }}
                    >
                      <span className="button-text">Hemen Başvur</span>
                      <span className="whatsapp-text">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
  const navigate = useNavigate();

  const handleCreditCalculatorClick = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("credit-calculator");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

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
                    <span>7/24 müşteri destek hizmeti</span>
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
        <KampanyalarCardsSection />

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
            {/* Brand with Logo - Logo on left, text on right */}
            <div className="flex flex-row items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fe4ff196a7e434a4a9b9ad3a4f4a42668?format=webp&width=800&height=1200"
                alt="Oto Finans Global Logo"
                className="h-12 w-auto flex-shrink-0"
              />
              <p className="text-xs text-gray-400" style={{ letterSpacing: "0.5px" }}>
                TÜRKİYE'NİN TAKSİTLİ ARAÇ SATIŞ PLATFORMU
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate("/")} className="hover:text-white transition-colors text-left font-normal">
                    Ana Sayfa
                  </button>
                </li>
                <li>
                  <button onClick={handleCreditCalculatorClick} className="hover:text-white transition-colors text-left font-normal">
                    Kredi Hesapla
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/isortakligi")} className="hover:text-white transition-colors text-left font-normal">
                    İş Ortaklığı
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/finansmanlar")} className="hover:text-white transition-colors text-left font-normal">
                    Finansmanlar
                  </button>
                </li>
                <li className="border-t border-gray-600 pt-2 mt-2">
                  <a
                    href="#"
                    className="hover:text-white transition-colors text-blue-300 font-semibold"
                  >
                    Yetkili Bayi Girişi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors text-blue-300 font-semibold"
                  >
                    Admin
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
