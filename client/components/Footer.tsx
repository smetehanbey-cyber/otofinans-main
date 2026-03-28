import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const navigate = useNavigate();
  const [isMobileSiteMapOpen, setIsMobileSiteMapOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  const handleCreditCalculatorClick = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("kredi-hesaplama");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <footer className="bg-[#0a1220] text-gray-400 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Header with Toggle */}
        <div className="flex sm:hidden items-center justify-between mb-8">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fe4ff196a7e434a4a9b9ad3a4f4a42668?format=webp&width=800&height=1200"
            alt="Oto Finans Global Logo"
            className="h-10 w-auto"
          />
          <button
            onClick={() => setIsMobileSiteMapOpen(!isMobileSiteMapOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white font-bold text-sm transition-all"
          >
            Site Haritası
            <motion.span animate={{ rotate: isMobileSiteMapOpen ? 180 : 0 }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.span>
          </button>
        </div>

        <motion.div 
          initial={false}
          animate={{ 
            height: isDesktop ? "auto" : (isMobileSiteMapOpen ? "auto" : 0),
            opacity: isDesktop ? 1 : (isMobileSiteMapOpen ? 1 : 0),
            marginBottom: isDesktop || isMobileSiteMapOpen ? 32 : 0
          }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 overflow-hidden"
        >
          {/* Yetkili Bayi and Admin Links */}
          <div className="px-1">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 hidden sm:block"></span>
              Erişim
            </h3>
            <ul className="space-y-3 sm:space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate("/admin")}
                  className="hover:text-white transition-colors text-blue-300/90 font-semibold bg-none border-none p-0 cursor-pointer text-left py-1 block"
                >
                  Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="px-1">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 hidden sm:block"></span>
              Hızlı Linkler
            </h3>
            <ul className="space-y-3 sm:space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-white transition-colors bg-none border-none p-0 cursor-pointer text-left py-1 block"
                >
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button
                  onClick={handleCreditCalculatorClick}
                  className="hover:text-white transition-colors bg-none border-none p-0 cursor-pointer text-left py-1 block"
                >
                  Kredi Hesapla
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/isortakligi")}
                  className="hover:text-white transition-colors bg-none border-none p-0 cursor-pointer text-left py-1 block"
                >
                  İş Ortaklığı
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/finansmanlar")}
                  className="hover:text-white transition-colors bg-none border-none p-0 cursor-pointer text-left py-1 block"
                >
                  Finansmanlar
                </button>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="px-1">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 hidden sm:block"></span>
              Hakkımızda
            </h3>
            <ul className="space-y-3 sm:space-y-2 text-sm">
              <li>
                <a href="/hakkimizda" className="hover:text-white transition-colors py-1 block">
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors py-1 block">
                  Kullanım Şartları
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors py-1 block">
                  SSS
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="px-1">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 hidden sm:block"></span>
              İletişim
            </h3>
            <ul className="space-y-3 sm:space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/905324098440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors py-1 block"
                >
                  WhatsApp: +90 532 409 8440
                </a>
              </li>
              <li>
                <a
                  href="mailto:bilgi@otofinansglobal.com"
                  className="hover:text-white transition-colors py-1 block"
                >
                  Email: bilgi@otofinansglobal.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors py-1 block">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors py-1 block">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        <div className="border-t border-gray-800/80 pt-8 flex justify-between items-center">
          <div className="flex items-center gap-4 hidden sm:flex">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fe4ff196a7e434a4a9b9ad3a4f4a42668?format=webp&width=800&height=1200"
              alt="Oto Finans Global Logo"
              className="w-auto h-[54px]"
            />
          </div>
          <p className="text-sm w-full sm:w-auto text-center sm:text-left text-gray-500 font-medium">
            &copy; 2027 Oto Finans Global. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
