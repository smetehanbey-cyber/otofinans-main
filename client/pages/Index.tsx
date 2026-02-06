import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import ServicesSection from "@/components/ServicesSection";
import BankLogosCarousel from "@/components/BankLogosCarousel";
import CreditCalculator from "@/components/CreditCalculator";
import PiyasaVerileri from "@/components/PiyasaVerileri";
import CarBrandsShowcase from "@/components/CarBrandsShowcase";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="text-white py-4 sm:py-6" style={{
          background: 'linear-gradient(to bottom right, #0f367e, #1a4d9e, #2563eb)'
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-center">
              {/* Left Content */}
              <div className="order-2 lg:order-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 leading-tight">
                  <div className="text-4xl sm:text-5xl lg:text-6xl">Hayaline</div>
                  <div className="font-black text-4xl sm:text-5xl lg:text-6xl">Geç Kalma</div>
                </h1>
                <p className="text-base sm:text-lg text-blue-100 mb-3 sm:mb-4">
                  Ön onaylı +800.000TL kredin hazır! Ticari ve Binek 20 Yaş'a kadar tüm taşıtlarda geçerli <u>48 Ay Vade</u> seçeneği OtoFinans'ta.
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
                  href="tel:+905324098440"
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-4 border-2 border-blue-400 text-white font-bold rounded-full hover:border-blue-300 hover:text-blue-300 transition-colors duration-200 text-sm sm:text-base"
                >
                  OtoFinanslı Ol →
                </a>
              </div>

              {/* Right Content - Banner Slider */}
              <div className="order-1 lg:order-2">
                <BannerSlider />

                {/* Contact Info */}
                <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                  <p className="text-xs text-blue-100 mb-1">Bizimle İletişime Geç</p>
                  <p className="text-lg sm:text-xl font-bold">+90 532 409 8440</p>
                  <p className="text-blue-100 text-sm mt-2">Limitini Etkilemeden Hemen Bilgi Al</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bank Logos Carousel */}
        <BankLogosCarousel />

        {/* Support Tagline */}
        <div className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-2.5 text-center">
          <p className="font-semibold text-white px-4" style={{ fontSize: 'calc(0.875rem - 0.5px)' }}>
            Destek OtoFinans'ta ⇋ Aracın 30 Dakika'da Kapında!
          </p>
        </div>

        {/* Credit Calculator Section */}
        <CreditCalculator />

        {/* Market Data Section */}
        <PiyasaVerileri />

        {/* Services Section */}
        <ServicesSection />

        {/* Banner Section with Animations */}
        <section className="relative overflow-hidden" style={{ backgroundColor: '#0f367e', minHeight: '420px' }}>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-stretch lg:items-center min-h-[420px]">
              {/* Left Content */}
              <div className="text-white flex flex-col justify-between py-8 lg:py-0 h-auto lg:h-full relative z-10">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight animate-fade-in-up">
                    Aracını bizimle hızlı sat anında <b>Oto Finanslı</b> ol
                  </h2>
                  <p className="text-base sm:text-lg text-blue-100 leading-relaxed animate-fade-in-up-delay-1">
                    Oto Finans ile özgürce günlük rutinlerinden<br />
                    geri kalmadan aracına en iyi teklifi biz bulalım<br />
                    ve en hızlı kredi sistemleri ile biz satalım. Tüm Türkiye'deki alıcılarımız sizi bekliyor.
                  </p>
                </div>

                <div className="animate-fade-in-up-delay-2 mt-10">
                  <a
                    href="tel:+905324098440"
                    className="inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-4 border-2 border-blue-400 text-white font-bold rounded-full hover:border-blue-300 hover:text-blue-300 transition-colors duration-200 text-sm sm:text-base"
                    title="Oto Finanslı Ol"
                  >
                    Oto Finanslı Ol
                  </a>
                </div>
              </div>

              {/* Right Content - Woman Image */}
              <div className="hidden lg:flex items-center justify-start h-[420px] overflow-hidden" style={{ paddingLeft: '10px', paddingBottom: '20px' }}>
                <div className="w-full animate-slide-in-right lg:z-10 flex items-center justify-center">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F2be5232ddd104e73a951c651243e7999?format=webp&width=800&height=1200"
                    alt="Oto Finans Müşteri"
                    className="h-[400px] w-auto object-contain"
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
              <p className="text-sm mb-3">TÜRKİYE'NİN TAKSİTLİ ARAÇ SATIŞ PLATFORMU</p>
              <a
                href="https://www.instagram.com/otofinansglobal/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
                /otofinansglobal
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Ana Sayfa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ürünler</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kurumsal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-white font-semibold mb-4">Hakkımızda</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SSS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="tel:+905324098440" className="hover:text-white transition-colors">
                    Telefon: +90 532 409 8440
                  </a>
                </li>
                <li>
                  <a href="mailto:bilgi@otofinansglobal.com" className="hover:text-white transition-colors">
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

          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-sm">
              &copy; 2027 Oto Finans Global. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
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
