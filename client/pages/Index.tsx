import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import ServicesSection from "@/components/ServicesSection";
import BankLogosCarousel from "@/components/BankLogosCarousel";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BankLogosCarousel />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-blue-700 to-slate-900 text-white py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Left Content */}
              <div className="order-2 lg:order-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                  <div>Hayaline</div>
                  <div className="font-black text-5xl sm:text-6xl lg:text-7xl">Geç Kalma</div>
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
                  Oto Finans olarak, binek ve ticari taşıt finansmanları konusunda sektörün en güvenilir ve hızlı çözümünü sunuyoruz.
                </p>
                <ul className="space-y-3 sm:space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-base sm:text-lg">
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
                  className="inline-block bg-blue-400 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-lg transition-colors duration-200 text-lg shadow-lg hover:shadow-xl"
                >
                  Hemen Başvur →
                </a>
              </div>

              {/* Right Content - Banner Slider */}
              <div className="order-1 lg:order-2">
                <BannerSlider />

                {/* Contact Info */}
                <div className="mt-8 bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                  <p className="text-sm text-blue-100 mb-2">Bizimle İletişime Geçin</p>
                  <p className="text-2xl sm:text-3xl font-bold">+90 532 409 8440</p>
                  <p className="text-blue-100 text-sm mt-2">Pazartesi-Cuma: 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <ServicesSection />

        {/* CTA Section */}
        <section className="py-12 sm:py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Başlamaya Hazır mısınız?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Oto Finans Global ile aracınızı satın almanız sadece birkaç dakika uzakta
            </p>
            <a
              href="tel:+905324098440"
              className="inline-block bg-blue-400 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-lg transition-colors duration-200 text-lg shadow-lg hover:shadow-xl"
            >
              Şimdi Başvur
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex flex-col mb-4">
                <span className="text-xl font-bold text-white">OTO</span>
                <span className="text-xs font-semibold text-white -mt-1">FINANS GLOBAL</span>
              </div>
              <p className="text-sm">Otomobil finansmanında güvenilir bir ortak.</p>
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
                  <a href="mailto:info@otofin.com" className="hover:text-white transition-colors">
                    Email: info@otofin.com
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
              &copy; 2024 Oto Finans Global. Tüm hakları saklıdır.
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
