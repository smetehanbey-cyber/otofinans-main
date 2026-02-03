import React from "react";

const banksBase = [
  { name: "Akbank", code: "AKB" },
  { name: "Garanti BBVA", code: "GRT" },
  { name: "İş Bankası", code: "İSB" },
  { name: "Halkbank", code: "HLK" },
  { name: "Ziraat Bankası", code: "ZRT" },
  { name: "Finansbank", code: "FNS" },
  { name: "TEB", code: "TEB" },
  { name: "Denizbank", code: "DNZ" },
  { name: "Şekerbank", code: "ŞEK" },
  { name: "ICBC Turkey", code: "ICB" },
  { name: "QuickFinans", code: "QCK" },
  { name: "TürkiyeFinans", code: "TRF" },
  { name: "VakıfKatılım", code: "VKT" },
  { name: "alBaraka", code: "ALB" },
  { name: "arabamtaksit", code: "ART" },
  { name: "BurganBank", code: "BRG" },
  { name: "OtoSOR", code: "OSR" },
  { name: "otovadeli.com", code: "OVD" },
];

// Duplicate the array multiple times for seamless looping
const banks = [...banksBase, ...banksBase, ...banksBase];

export default function BankLogosCarousel() {
  return (
    <div className="w-full bg-gray-50 border-y border-gray-200 overflow-hidden">
      <style>{`
        @keyframes scroll-left-to-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-${banksBase.length} * 200px));
          }
        }

        .scroll-animation {
          animation: scroll-left-to-right 200s linear infinite;
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
