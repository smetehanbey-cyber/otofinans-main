import React from "react";

const banksBase = [
  { name: "Akbank", code: "AKB", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F40cf2a6e226b47bd9314e9bbaede9785?format=webp&width=800&height=1200" },
  { name: "Garanti Bank", code: "GRT", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Ff1c781a50b284c6a85ed62586fd10241?format=webp&width=800&height=1200" },
  { name: "İş Bankası", code: "İSB", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fdf32cba7a967459194ccbe6afe31254c?format=webp&width=800&height=1200" },
  { name: "Halk Bank", code: "HLK", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F2e0f2e6ff00a495abd1a1d832520c890?format=webp&width=800&height=1200" },
  { name: "Ziraat Bankası", code: "ZRT" },
  { name: "QNB Finans", code: "FNS", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F8ede5914db55457e95c3ec0d3bf78b23?format=webp&width=800&height=1200" },
  { name: "TEB", code: "TEB", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F8a13ada2623d40eaa2e8914fae816fd8?format=webp&width=800&height=1200" },
  { name: "Denizbank", code: "DNZ", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F2cfe529a3dab4b26bfa9414505f4c954?format=webp&width=800&height=1200" },
  { name: "Şekerbank", code: "ŞEK", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fffc318966ca642c4b9d1a5553f26886c?format=webp&width=800&height=1200" },
  { name: "HSBC", code: "HSB", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F0f5042ee709541ddb8367172214095c5?format=webp&width=800&height=1200" },
  { name: "QuickFinans", code: "QCK", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fac222f367e8a4bd48bdeb71d77198659?format=webp&width=800&height=1200" },
  { name: "TürkiyeFinans", code: "TRF", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fa6758614b57645c5906135614a3e72b4?format=webp&width=800&height=1200" },
  { name: "VakıfKatılım", code: "VKT", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fcbdde0484d924ae4aaa1710328f43c05?format=webp&width=800&height=1200" },
  { name: "alBaraka", code: "ALB", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F83b94514be2f42f4be86a42ffa88acc7?format=webp&width=800&height=1200" },
  { name: "arabamtaksit", code: "ART", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Ffc2df4b1455e4508b4cf6129d52069cc?format=webp&width=800&height=1200" },
  { name: "Burgan Bank", code: "BRG", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F505da3d1d93a41f59e62e18381b84283?format=webp&width=800&height=1200" },
  { name: "OtoSOR", code: "OSR", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fe4169ff414504baebf1f91ef4ffaad7e?format=webp&width=800&height=1200" },
  { name: "otovadeli.com", code: "OVD", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fe4b1136e327a45d9a4585303fb14f28c?format=webp&width=800&height=1200" },
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-blue-900 overflow-hidden">
                {bank.logo ? (
                  <img src={bank.logo} alt={bank.name} className="w-full h-full object-contain p-1" />
                ) : (
                  bank.code
                )}
              </div>
              <span className="whitespace-nowrap">{bank.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
