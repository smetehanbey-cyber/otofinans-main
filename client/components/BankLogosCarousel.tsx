import React from "react";

const banks = [
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
  { name: "Akbank", code: "AKB" },
  { name: "Garanti BBVA", code: "GRT" },
  { name: "İş Bankası", code: "İSB" },
  { name: "Halkbank", code: "HLK" },
  { name: "Ziraat Bankası", code: "ZRT" },
];

export default function BankLogosCarousel() {
  return (
    <div className="w-full bg-gray-50 border-y border-gray-200 overflow-hidden">
      <style>{`
        @keyframes scroll-left-to-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .scroll-animation {
          animation: scroll-left-to-right 50s linear infinite;
        }
      `}</style>

      <div className="h-9 flex items-center relative overflow-hidden">
        <div className="scroll-animation flex whitespace-nowrap">
          {banks.map((bank, index) => (
            <div
              key={index}
              className="px-6 flex items-center gap-2 text-gray-700 text-sm font-medium flex-shrink-0"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-blue-900">
                {bank.code}
              </div>
              <span>{bank.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
