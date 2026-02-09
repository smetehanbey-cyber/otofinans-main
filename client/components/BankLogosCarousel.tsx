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

export default function BankLogosCarousel() {
  const [scrollPos, setScrollPos] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastMouseX, setLastMouseX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const duplicatedBanks = [...banksBase, ...banksBase];
  const itemWidth = 140; // approximate width per item with gap

  // Auto-scroll when not hovering
  useEffect(() => {
    if (!isMouseOver) {
      autoScrollRef.current = setInterval(() => {
        setScrollPos((prev) => (prev + 1) % (banksBase.length * itemWidth));
      }, 50); // Slow scroll speed
    } else {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isMouseOver]);

  const handleMouseEnter = () => {
    setIsMouseOver(true);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
    setHoveredIndex(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const containerWidth = rect.width;
    const centerX = containerWidth / 2;

    // Calculate direction and speed based on mouse position
    const distanceFromCenter = mouseX - centerX;
    const maxDistance = containerWidth / 2;
    const normalizedDistance = Math.max(-1, Math.min(1, distanceFromCenter / maxDistance));
    
    // Speed multiplier: -1 (fast left) to 1 (fast right)
    const speedMultiplier = normalizedDistance * 3; // 3x speed variation

    // Update scroll position based on mouse movement
    setScrollPos((prev) => {
      let newPos = prev + speedMultiplier;
      // Keep it within bounds
      const maxScroll = banksBase.length * itemWidth;
      return ((newPos % maxScroll) + maxScroll) % maxScroll;
    });

    // Calculate hovered item based on mouse position
    const itemIndex = Math.floor((mouseX / containerWidth) * banksBase.length);
    setHoveredIndex(itemIndex % banksBase.length);

    setLastMouseX(mouseX);
  };

  return (
    <div className="w-full">
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .bank-carousel-wrapper {
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 3px 16px 5px 16px;
          gap: 0;
          width: 100%;
          position: relative;
          user-select: none;
          height: auto;
          background-color: rgba(243, 244, 246, 1);
          cursor: grab;
        }

        .bank-carousel-wrapper:active {
          cursor: grabbing;
        }

        .bank-carousel-track {
          display: flex;
          gap: 0;
          position: relative;
          transition: transform 0.1s linear;
        }

        .bank-item {
          flex: 0 0 auto;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          text-gray-700;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 1;
          padding: 8px 16px;
        }

        .bank-logo {
          width: 30px;
          height: 30px;
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
          transition: all 0.3s ease;
        }

        .bank-item:hover .bank-logo {
          width: 48px;
          height: 48px;
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.5);
          transform: scale(1.2);
        }

        .bank-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 4px;
        }

        .bank-name {
          color: #1f3a93;
          font-size: 15px;
          text-align: left;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .bank-item {
            flex: 0 0 auto;
            font-size: 12px;
          }

          .bank-name {
            font-size: 13px;
          }
        }
      `}</style>

      <div
        ref={containerRef}
        className="bank-carousel-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div
          className="bank-carousel-track"
          style={{
            transform: `translateX(-${scrollPos}px)`,
          }}
        >
          {duplicatedBanks.map((bank, index) => (
            <div key={index} className="bank-item">
              <div className="bank-logo">
                {bank.logo ? (
                  <img src={bank.logo} alt={bank.name} />
                ) : (
                  bank.code
                )}
              </div>
              <span className="bank-name">{bank.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
