import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import ServicesSection from "@/components/ServicesSection";
import BankLogosCarousel from "@/components/BankLogosCarousel";
import PiyasaVerileri from "@/components/PiyasaVerileri";
import CarBrandsShowcase from "@/components/CarBrandsShowcase";
import ProcessFlow from "@/components/ProcessFlow";
import Footer from "@/components/Footer";

import { motion, AnimatePresence } from "framer-motion";
import carFinanceImg from "@/assets/images/car-finance.png";

function FinansmanlarFAQSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isMainExpanded, setIsMainExpanded] = useState(false);

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
    { name: "Burgan Bank", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F505da3d1d93a41f59e62e18381b84283?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi, Motorsiklet Kredisi" },
    { name: "OtoSOR", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fe4169ff414504baebf1f91ef4ffaad7e?format=webp&width=800&height=1200", financingTypes: "Taşıt Kredisi, Ticari Araç Kredisi, Teminatlı Taşıt Kredisi" },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const visibleBanks = isMainExpanded ? banks : banks.slice(0, 4);

  return (
    <section className="py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headlines moved to main */}

        {/* Banks Accordion - Compact Stacked Cards */}
        <motion.div
          layout
          className="space-y-2 relative"
        >
          <AnimatePresence initial={false}>
            {visibleBanks.map((bank, idx) => (
              <motion.div
                key={bank.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 30, delay: idx * 0.03 }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Header Bar */}
                <button
                  onClick={() => toggleExpand(bank.name)}
                  className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {bank.logo && (
                      <div className="w-10 h-10 p-1 flex items-center justify-center bg-white border border-gray-100 rounded-lg">
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-sm sm:text-base font-bold text-gray-800">
                      {bank.name}
                    </h3>
                  </div>
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: expandedId === bank.name ? "#0f367e" : "transparent",
                      color: expandedId === bank.name ? "#fff" : "#0f367e"
                    }}
                  >
                    <motion.span
                      animate={{ rotate: expandedId === bank.name ? 90 : 0 }}
                    >
                      {expandedId === bank.name ? "−" : "+"}
                    </motion.span>
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {expandedId === bank.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                      <div className="px-5 py-5 border-t border-gray-100 bg-gray-50/30">
                        <div className="flex flex-wrap gap-2">
                          {bank.financingTypes.split(", ").map((type, typeIdx) => (
                            <div
                              key={typeIdx}
                              className="px-4 py-1.5 bg-white border border-blue-100 text-[#0f367e] text-xs font-bold rounded-full shadow-sm"
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Fade Overlay for collapsed state */}
          {!isMainExpanded && banks.length > 4 && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50/90 to-transparent pointer-events-none rounded-b-xl" />
          )}
        </motion.div>

        {/* Expand/Collapse Button */}
        <div className="mt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMainExpanded(!isMainExpanded)}
            className="px-8 py-2.5 bg-white border-2 border-[#0f367e] text-[#0f367e] font-bold text-sm rounded-full shadow-md hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            {isMainExpanded ? (
              <>Daha Az Gör <motion.span animate={{ rotate: 180 }}>↓</motion.span></>
            ) : (
              <>Tüm Finansmanları Gör <span>↓</span></>
            )}
          </motion.button>
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

export default function Finansmanlar() {
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
        {/* Adjusted spacing from header (10px) */}
        <div className="h-[10px] w-full bg-white" aria-hidden="true" />

        {/* Headlines Section - Moved to top as per user request */}
        <div className="text-center py-4 bg-white">
          <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter" style={{ color: "#0f367e" }}>
            FİNANSMAN SEÇENEKLERİ
          </h2>
          <p className="mt-2 text-xs font-semibold text-gray-400 uppercase tracking-widest leading-relaxed">
            ÖN ONAYLI KREDİNİZİ HEMEN KULLANABİLİRSİNİZ.
          </p>
        </div>

        {/* Process Icons Section - "Ayrı bir bölme" */}
        <section className="bg-slate-50 border-y border-gray-100 py-8">
          <ProcessFlow bgTransparent />
        </section>

        {/* 10px spacing below "Aracına kavuş" (ProcessFlow section end) */}
        <div className="h-[10px] w-full bg-white" aria-hidden="true" />

        {/* Finansmanlar Section - Separated with padding and background group */}
        <div className="pt-2 sm:pt-4 border-t border-gray-100 bg-gray-50/30">
          <FinansmanlarFAQSection />
        </div>


        {/* 10px Spacer before Services */}
        <div className="h-[10px] w-full bg-white" aria-hidden="true" />

        {/* Services Section - Separate Container */}
        <section className="bg-slate-50/50 border-y border-gray-100">
          <ServicesSection />
        </section>

        {/* 10px Spacer after Services */}
        <div className="h-[10px] w-full bg-white" aria-hidden="true" />

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
                  Hayalindeki Araca Finansmanla Hemen Kavuş.

                </h2>

                <p className="text-sm sm:text-base lg:text-lg text-blue-100 leading-relaxed animate-fade-in-up-delay-1">
                  OtoFinans'ın geniş banka ağı ve size özel faiz oranlarıyla bütçenizi yormadan
                  hayalinizdeki araca sahip olun. Uzman danışmanlarımızla en uygun ödeme
                  planını birlikte oluşturalım.
                </p>

                <div className="animate-fade-in-up-delay-2 pt-4">
                  <a
                    href="https://wa.me/905324098440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border-2 border-blue-400 text-white font-bold rounded-full hover:border-blue-300 hover:text-blue-300 transition-colors duration-200 text-sm sm:text-base"
                    title="OtoFinanslı Ol"
                  >
                    Kredini Şimdi Hesapla
                  </a>
                </div>
              </div>

              {/* Right Content - Woman Image */}
              <div className="hidden lg:block h-full relative overflow-hidden min-h-[420px]">
                <div className="animate-slide-in-right absolute inset-0 w-full h-[110%] -top-[5%]">
                  <img
                    src={carFinanceImg}
                    alt="Araba Anahtarı Teslimatı"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Car Brands Showcase */}
        <CarBrandsShowcase />
      </main>

      <Footer />
    </div>
  );
}
