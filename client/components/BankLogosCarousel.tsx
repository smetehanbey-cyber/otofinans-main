import React, { useState, useEffect, useRef } from "react";

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

// Create infinite loop by repeating the array
const banks = [...banksBase, ...banksBase, ...banksBase];

export default function BankLogosCarousel() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ITEM_WIDTH = 70; // Width + gap
  const SCROLL_DURATION = 600; // Smooth scroll duration in ms

  // Start with the middle of the first set visible in center
  const INITIAL_OFFSET = Math.floor(banksBase.length / 2) * ITEM_WIDTH;

  // Auto-scroll every 2 seconds
  useEffect(() => {
    const autoScroll = () => {
      setScrollOffset((prev) => prev + ITEM_WIDTH);
      scrollTimeoutRef.current = setTimeout(autoScroll, 2000);
    };

    // Start with initial offset to show first bank centered
    setScrollOffset(INITIAL_OFFSET);
    scrollTimeoutRef.current = setTimeout(autoScroll, 2000);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Apply scroll with smooth transition
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transition = `transform ${SCROLL_DURATION}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
      containerRef.current.style.transform = `translateX(-${scrollOffset}px)`;
    }
  }, [scrollOffset]);

  // Prevent mouse/touch interaction
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full bg-gray-50 border-y border-gray-200">
      <style>{`
        .bank-carousel-wrapper {
          display: flex;
          justify-center;
          align-items: center;
          overflow: hidden;
          padding: 20px 0;
          position: relative;
        }

        .bank-carousel-container {
          display: flex;
          gap: 16px;
          padding: 0 16px;
          will-change: transform;
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
          opacity: 0.5;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        /* Center item - ortada gelen item */
        .bank-item.center-item {
          transform: scale(1.3);
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
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .bank-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 4px;
        }

        .bank-item.center-item .bank-logo {
          transform: scale(1.25);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.7), 0 0 30px rgba(59, 130, 246, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .bank-name {
          color: #374151;
          transition: color 0.4s ease, font-weight 0.4s ease;
          font-size: 12px;
        }

        .bank-item.center-item .bank-name {
          color: #0f367e;
          font-weight: 700;
          font-size: 13px;
        }

        /* Center indicator - invisible reference point */
        .center-indicator {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 70px;
          margin-left: -35px;
          pointer-events: none;
        }
      `}</style>

      <div className="bank-carousel-wrapper" onWheel={handleWheel} onTouchStart={handleTouchStart}>
        {/* Center indicator */}
        <div className="center-indicator"></div>

        {/* Scrolling container */}
        <div
          className="bank-carousel-container"
          ref={containerRef}
        >
          {banks.map((bank, index) => {
            // Calculate if this item is in the center position
            const centerPosition = Math.round(scrollOffset / ITEM_WIDTH) % banksBase.length;
            const itemPosition = index % banksBase.length;
            const isCenterItem = itemPosition === centerPosition;

            return (
              <div
                key={index}
                className={`bank-item ${isCenterItem ? "center-item" : ""}`}
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
  );
}
