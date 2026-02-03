import React from "react";

const banksBase = [
  { name: "Akbank", code: "AKB" },
  { name: "Garanti BBVA", code: "GRT" },
  { name: "İş Bankası", code: "İSB", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fdf32cba7a967459194ccbe6afe31254c?format=webp&width=800&height=1200" },
  { name: "Halkbank", code: "HLK" },
  { name: "Ziraat Bankası", code: "ZRT" },
  { name: "Finansbank", code: "FNS" },
  { name: "TEB", code: "TEB" },
  { name: "Denizbank", code: "DNZ", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F2cfe529a3dab4b26bfa9414505f4c954?format=webp&width=800&height=1200" },
  { name: "Şekerbank", code: "ŞEK", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F20670e8474bf412f91ec0c83960b0c90?format=webp&width=800&height=1200" },
  { name: "ICBC Turkey", code: "ICB" },
  { name: "QuickFinans", code: "QCK" },
  { name: "TürkiyeFinans", code: "TRF" },
  { name: "VakıfKatılım", code: "VKT", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fcbdde0484d924ae4aaa1710328f43c05?format=webp&width=800&height=1200" },
  { name: "alBaraka", code: "ALB", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F83b94514be2f42f4be86a42ffa88acc7?format=webp&width=800&height=1200" },
  { name: "arabamtaksit", code: "ART" },
  { name: "BurganBank", code: "BRG" },
  { name: "OtoSOR", code: "OSR" },
  { name: "otovadeli.com", code: "OVD" },
];

// Duplicate the array multiple times for seamless looping
const banks = [...banksBase, ...banksBase, ...banksBase];

export default function BankLogosCarousel() {
  // Calculate animation duration based on number of items
  // Each item takes about 8-10 seconds to scroll across screen
  const animationDuration = 220;

  return (
    <div className="w-full bg-gray-50 border-y border-gray-200 overflow-hidden">
      <style>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .scroll-animation {
          animation: scroll-infinite ${animationDuration}s linear infinite;
        }
      `}</style>

      <div className="h-10 flex items-center relative overflow-hidden">
        <div className="scroll-animation flex whitespace-nowrap gap-0">
          {banks.map((bank, index) => (
            <div
              key={index}
              className="px-6 flex items-center gap-2 text-gray-700 text-sm font-medium flex-shrink-0 min-w-max"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-blue-900">
                {bank.code}
              </div>
              <span className="whitespace-nowrap">{bank.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
