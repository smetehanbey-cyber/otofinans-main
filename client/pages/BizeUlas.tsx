import { useState } from "react";
import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import ServicesSection from "@/components/ServicesSection";
import BankLogosCarousel from "@/components/BankLogosCarousel";
import PiyasaVerileri from "@/components/PiyasaVerileri";
import CarBrandsShowcase from "@/components/CarBrandsShowcase";
import { TrendingUp, Users, Zap, Award } from "lucide-react";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form verilerini mesaj formatında birleştir
    const messageText = `İletişim Formu

Ad Soyad: ${formData.name}
E-posta: ${formData.email}
Telefon: ${formData.phone}
Şirket Adı: ${formData.companyName}
Konu: ${formData.subject}
${formData.message ? `Mesaj: ${formData.message}` : ''}`;

    // WhatsApp link'i oluştur ve aç
    const whatsappUrl = `https://wa.me/905324098440?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');

    // Başarı mesajı göster ve formu temizle
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benefits Grid */}
        <div className="mb-12">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8"
            style={{ color: "#0f367e" }}
          >
            Bize Ulaşın
          </h2>
          <p className="text-center text-gray-700 mb-8 text-lg">
            Sorularınız, önerileriniz ve talepleriniz için bize her zaman ulaşabilirsiniz
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Contact Channel 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <TrendingUp className="w-6 h-6" style={{ color: "#0f367e" }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#0f367e" }}>
                Hızlı Yanıt
              </h3>
              <p className="text-gray-600 text-sm">
                24 saat içinde cevap vermesi
              </p>
            </div>

            {/* Contact Channel 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Users className="w-6 h-6" style={{ color: "#0f367e" }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#0f367e" }}>
                Profesyonel Destek
              </h3>
              <p className="text-gray-600 text-sm">
                Deneyimli ve eğitimli ekibimiz
              </p>
            </div>

            {/* Contact Channel 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Zap className="w-6 h-6" style={{ color: "#0f367e" }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#0f367e" }}>
                Çok Kanallı
              </h3>
              <p className="text-gray-600 text-sm">
                WhatsApp, Email ve Form desteği
              </p>
            </div>

            {/* Contact Channel 4 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Award className="w-6 h-6" style={{ color: "#0f367e" }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#0f367e" }}>
                Gizlilik Garantisi
              </h3>
              <p className="text-gray-600 text-sm">
                Verileriniz tamamen güvenli
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h3 className="text-2xl font-bold mb-2" style={{ color: "#0f367e" }}>
            İletişim Formu
          </h3>
          <p className="text-gray-600 mb-6">
            Lütfen aşağıdaki formu doldurun. En kısa sürede sizinle iletişime geçeceğiz.
          </p>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">
                ✓ Mesajınız başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Adınızı yazınız"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="E-posta adresiniz"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+90 5XX XXX XXXX"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Şirketinizin adı (opsiyonel)"
                />
              </div>

              {/* Subject */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konu *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Konu seçiniz</option>
                  <option value="Kredi Başvurusu">Kredi Başvurusu</option>
                  <option value="Aracımı Satmak">Aracımı Satmak</option>
                  <option value="Teknik Destek">Teknik Destek</option>
                  <option value="Genel Soru">Genel Soru</option>
                  <option value="Geri Bildirim">Geri Bildirim</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mesajınız *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Lütfen detaylı bir açıklama yapınız..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white font-bold rounded-lg hover:from-blue-950 hover:via-blue-900 hover:to-blue-800 transition-colors text-lg"
            >
              Mesajı Gönder
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Verileriniz güvenlidir ve sadece iletişim süreci için kullanılacaktır.
          </p>
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
                  Email veya formu aracılığıyla iletişime geçebilirsiniz.
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

        {/* Contact Form Section */}
        <ContactForm />

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
