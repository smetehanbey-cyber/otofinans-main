import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import ServicesSection from "@/components/ServicesSection";
import BankLogosCarousel from "@/components/BankLogosCarousel";
import PiyasaVerileri from "@/components/PiyasaVerileri";
import CarBrandsShowcase from "@/components/CarBrandsShowcase";
import { MapPin, Phone, Mail, Clock, AlertCircle } from "lucide-react";
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from "@react-google-maps/api";

function HeadquartersAndMap() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Türkiye'nin il konumları (Google Maps koordinatları - Latitude, Longitude)
  const turkishCities = [
    { name: "İstanbul", lat: 41.0082, lng: 28.9784 },
    { name: "Ankara", lat: 39.9334, lng: 32.8597 },
    { name: "İzmir", lat: 38.4161, lng: 27.1380 },
    { name: "Bursa", lat: 40.1957, lng: 29.1792 },
    { name: "Antalya", lat: 36.9271, lng: 30.7133 },
    { name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
    { name: "Konya", lat: 37.8713, lng: 32.4827 },
    { name: "Adana", lat: 36.9909, lng: 35.3213 },
    { name: "Diyarbakır", lat: 37.9144, lng: 40.2306 },
    { name: "Van", lat: 38.6010, lng: 43.5890 },
    { name: "Erzurum", lat: 39.9199, lng: 41.2767 },
    { name: "Rize", lat: 40.7265, lng: 40.5227 },
    { name: "Trabzon", lat: 40.6271, lng: 39.7605 },
    { name: "Samsun", lat: 41.2869, lng: 35.6921 },
    { name: "Sinop", lat: 42.0265, lng: 35.1537 },
    { name: "Kastamonu", lat: 41.3887, lng: 33.7827 },
    { name: "Çankırı", lat: 40.6022, lng: 34.9519 },
    { name: "Kayseri", lat: 38.7269, lng: 35.4858 },
    { name: "Sivas", lat: 39.6485, lng: 36.4901 },
    { name: "Tokat", lat: 40.3131, lng: 36.5548 },
  ];

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    borderRadius: "8px",
  };

  const center = {
    lat: 38.9637,
    lng: 35.2433, // Türkiye'nin merkezi
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Genel Merkez Bilgileri */}
        <div className="mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-2"
            style={{ color: "#0f367e" }}
          >
            Genel Merkez
          </h2>
          <p className="text-center text-gray-600 mb-10 text-lg">
            OtoFinans Global - Türkiye'nin Taksitli Araç Satış Platformu
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* İletişim Adresi */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 border border-blue-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: "#0f367e" }}>
                  Adres
                </h3>
              </div>
              <p className="text-gray-700 font-semibold mb-2">OtoFinans Global</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                İstanbul Caddesi No: 123<br />
                Şişli, İstanbul 34000<br />
                Türkiye
              </p>
            </div>

            {/* Telefon */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8 border border-green-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: "#0f367e" }}>
                  Telefon
                </h3>
              </div>
              <p className="text-gray-700 font-semibold mb-2">Müşteri Hizmetleri</p>
              <p className="text-2xl font-bold text-green-600 mb-2">
                +90 532 409 8440
              </p>
              <p className="text-gray-600 text-sm">
                Pazartesi - Cuma: 09:00 - 18:00<br />
                Cumartesi: 10:00 - 16:00
              </p>
            </div>

            {/* E-posta */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8 border border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: "#0f367e" }}>
                  E-posta
                </h3>
              </div>
              <p className="text-gray-700 font-semibold mb-2">İletişim E-postası</p>
              <p className="text-sm text-purple-600 font-semibold mb-4 break-all">
                bilgi@otofinansglobal.com
              </p>
              <a
                href="mailto:bilgi@otofinansglobal.com"
                className="inline-block text-sm font-medium text-purple-600 hover:text-purple-700 underline"
              >
                E-posta Gönder →
              </a>
            </div>
          </div>
        </div>

        {/* Çalışma Saatleri */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-8 h-8 text-white" />
            <h3 className="text-2xl font-bold text-white">Çalışma Saatleri</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
            <div>
              <p className="font-semibold text-lg mb-2">Hafta İçi (Pazartesi - Cuma)</p>
              <p className="text-blue-100 text-lg">09:00 - 18:00</p>
            </div>
            <div>
              <p className="font-semibold text-lg mb-2">Cumartesi</p>
              <p className="text-blue-100 text-lg">10:00 - 16:00</p>
            </div>
            <div>
              <p className="font-semibold text-lg mb-2">Pazar</p>
              <p className="text-blue-100 text-lg">Kapalı</p>
            </div>
            <div>
              <p className="font-semibold text-lg mb-2">Acil Durum (WhatsApp)</p>
              <p className="text-blue-100 text-lg">24/7 Açık</p>
            </div>
          </div>
        </div>

        {/* Türkiye Haritası */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8" style={{ color: "#0f367e" }}>
            Türkiye Genelinde Hizmet Veriş Ağımız
          </h3>
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 w-full max-w-4xl" style={{ borderColor: "#0f367e" }}>
              {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                    <h4 className="font-bold text-yellow-800">Google Maps API Anahtarı Gerekli</h4>
                  </div>
                  <p className="text-yellow-700 mb-4">
                    Google Maps'i kullanmak için API anahtarını `.env` dosyasına eklemeniz gerekir.
                  </p>
                  <code className="bg-yellow-100 px-3 py-2 rounded text-sm text-yellow-900 block mb-4">
                    VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
                  </code>
                  <p className="text-xs text-yellow-600">
                    <a href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-700">
                      Google Cloud Console'dan API anahtarı alın →
                    </a>
                  </p>
                </div>
              ) : (
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={6}>
                    {turkishCities.map((city) => (
                      <MarkerF
                        key={city.name}
                        position={{ lat: city.lat, lng: city.lng }}
                        title={city.name}
                        onMouseOver={() => setHoveredCity(city.name)}
                        onMouseOut={() => setHoveredCity(null)}
                        onClick={() => setSelectedCity(city.name)}
                      >
                        {selectedCity === city.name && (
                          <InfoWindowF onCloseClick={() => setSelectedCity(null)}>
                            <div className="bg-white p-2 rounded">
                              <h4 className="font-bold text-blue-900">{city.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">
                                OtoFinans Hizmet Bölgesi
                              </p>
                            </div>
                          </InfoWindowF>
                        )}
                      </MarkerF>
                    ))}
                  </GoogleMap>
                </LoadScript>
              )}
              <p className="text-center text-gray-600 text-sm mt-4">
                Şehirlerin üzerine gelip tıklayarak detayları görebilirsiniz
              </p>
            </div>
          </div>
        </div>

        {/* Bilgi Kartı */}
        <div className="bg-blue-50 border-l-4" style={{ borderColor: "#0f367e" }}>
          <div className="p-6">
            <h4 className="font-bold text-lg mb-3" style={{ color: "#0f367e" }}>
              ℹ️ Bilgilendirme
            </h4>
            <p className="text-gray-700">
              OtoFinans Global olarak tüm Türkiye'de hizmet vermekteyiz. Şehriniz haritada gösterilmese bile,
              WhatsApp (+90 532 409 8440) veya email (bilgi@otofinansglobal.com) yoluyla iletişime geçebilirsiniz.
              Müşteri memnuniyeti bizim önceliğimizdir.
            </p>
          </div>
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

export default function BizeUlas() {
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
                    Bize
                  </div>
                  <div className="font-black text-4xl sm:text-5xl lg:text-6xl">
                    Ulaşın
                  </div>
                </h1>
                <p className="text-base sm:text-lg text-blue-100 mb-3 sm:mb-4">
                  Sorularınız, önerileriniz ve tavsiyeleriniz için bizi WhatsApp,
                  Email veya telefon aracılığıyla iletişime geçebilirsiniz.
                </p>
                <ul className="space-y-2 sm:space-y-2.5 mb-4">
                  <li className="flex items-center gap-3 text-sm sm:text-base">
                    <CheckIcon />
                    <span>WhatsApp: +90 532 409 8440</span>
                  </li>
                  <li className="flex items-center gap-3 text-base sm:text-lg">
                    <CheckIcon />
                    <span>Email: bilgi@otofinansglobal.com</span>
                  </li>
                  <li className="flex items-center gap-3 text-base sm:text-lg">
                    <CheckIcon />
                    <span>24/7 Müşteri Destek</span>
                  </li>
                  <li className="flex items-center gap-3 text-base sm:text-lg">
                    <CheckIcon />
                    <span>Hızlı ve Profesyonel Çözümler</span>
                  </li>
                </ul>

                <a
                  href="https://wa.me/905324098440?text=Merhaba%20OtoFinans."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-4 border-2 border-blue-400 text-white font-bold rounded-full hover:border-blue-300 hover:text-blue-300 transition-colors duration-200 text-sm sm:text-base"
                >
                  WhatsApp'tan Yazın →
                </a>
              </div>

              {/* Right Content - Banner Slider */}
              <div className="order-1 lg:order-2">
                <BannerSlider />

                {/* Contact Info */}
                <a
                  href="https://wa.me/905324098440?text=Merhaba%20OtoFinans."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors block"
                >
                  <p className="text-xs text-blue-100 mb-1">
                    Hemen İletişime Geç
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    +90 532 409 8440
                  </p>
                  <p className="text-blue-100 text-sm mt-2">
                    WhatsApp veya Telefon ile Arayabilirsiniz
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
            Müşteri Memnuniyeti OtoFinans'ta ⇋ Anında Çözümler!
          </p>
        </div>

        {/* Headquarters & Map Section */}
        <HeadquartersAndMap />

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
                  Sorularınıza Anında Cevap Verelim
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
                  OtoFinans müşteri destek ekibi, tüm sorularınızı yanıtlamak ve
                  talebinizi karşılamak için 24/7 çalışır. Bize ulaşın, en kısa
                  sürede yardımcı olabiliriz.
                </p>

                <div className="animate-fade-in-up-delay-2 pt-4">
                  <a
                    href="https://wa.me/905324098440?text=Merhaba%20OtoFinans."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border-2 border-blue-400 text-white font-bold rounded-full hover:border-blue-300 hover:text-blue-300 transition-colors duration-200 text-sm sm:text-base"
                    title="Hemen İletişime Geç"
                  >
                    Hemen İletişime Geç
                  </a>
                </div>
              </div>

              {/* Right Content - Woman Image */}
              <div className="hidden lg:flex items-end justify-end h-[420px] overflow-hidden relative">
                <div className="animate-slide-in-right lg:z-10 flex items-center justify-center">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F2be5232ddd104e73a951c651243e7999?format=webp&width=800&height=1200"
                    alt="OtoFinans Müşteri Destek"
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
                    href="https://wa.me/905324098440?text=Merhaba%20OtoFinans."
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
