import React, { useState, useRef, useEffect } from "react";

const banksBase = [
  { name: "Akbank", code: "AKB", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F40cf2a6e226b47bd9314e9bbaede9785?format=webp&width=800&height=1200" },
  { name: "Garanti Bank", code: "GRT", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Ff1c781a50b284c6a85ed62586fd10241?format=webp&width=800&height=1200" },
  { name: "İş Bankası", code: "İSB", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fdf32cba7a967459194ccbe6afe31254c?format=webp&width=800&height=1200" },
  { name: "Halk Bank", code: "HLK", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F2e0f2e6ff00a495abd1a1d832520c890?format=webp&width=800&height=1200" },
  { name: "Ziraat Bankası", code: "ZRT", logo: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F7a0de587811f4d6c897da9512983b25b?format=webp&width=800&height=1200" },
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

// Duplicate banks for seamless infinite scroll
const banks = [...banksBase, ...banksBase, ...banksBase];

export default function BankLogosCarousel() {
  const [centerIndex, setCenterIndex] = useState(Math.floor(banksBase.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % banksBase.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gray-50 border-y border-gray-200 overflow-hidden">
      <style>{`
        .bank-carousel-container {
          display: flex;
          gap: 16px;
          padding: 20px 16px;
          width: fit-content;
          animation: scroll-continuous 80s linear infinite;
        }
        
        @keyframes scroll-continuous {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-${banksBase.length} * 70px - ${banksBase.length} * 16px));
          }
        }
        
        .bank-carousel-container:hover {
          animation-play-state: paused;
        }
        
        .bank-item {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-gray-700;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          transition: transform 0.3s ease, opacity 0.3s ease;
          opacity: 0.6;
        }
        
        .bank-item.selected {
          transform: scale(1.25);
          opacity: 1;
        }
        
        .bank-logo {
          width: 40px;
          height: 40px;
          background: linear-gradient(to bottom right, #93c5fd, #60a5fa);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: #1e3a8a;
          overflow: hidden;
          flex-shrink: 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .bank-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 4px;
        }
        
        .bank-item.selected .bank-logo {
          transform: scale(1.2);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.6), 0 0 12px rgba(59, 130, 246, 0.4);
        }
        
        .bank-name {
          color: #374151;
          transition: color 0.3s ease, font-weight 0.3s ease;
        }
        
        .bank-item.selected .bank-name {
          color: #0f367e;
          font-weight: 700;
        }
      `}</style>

      <div className="flex justify-center items-center overflow-hidden">
        <div className="relative w-full flex justify-center">
          {/* Center indicator line */}
          <div className="absolute top-0 bottom-0 w-1 bg-blue-400 opacity-0 z-10" style={{ left: "50%" }}></div>
          
          {/* Scrolling container */}
          <div className="bank-carousel-container">
            {banks.map((bank, index) => {
              const isCenterItem = (index % banksBase.length) === centerIndex;
              return (
                <div
                  key={index}
                  className={`bank-item ${isCenterItem ? "selected" : ""}`}
                >
                  <div className="bank-logo">
                    {bank.logo ? (
                      <img src={bank.logo} alt={bank.name} />
                    ) : (
                      bank.code
                    )}
                  </div>
                  <span className="bank-name">{bank.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
