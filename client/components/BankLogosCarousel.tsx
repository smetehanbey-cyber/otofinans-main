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

export default function BankLogosCarousel() {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(banksBase.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % banksBase.length);
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + banksBase.length) % banksBase.length);
    }
  };

  const scrollToCenter = (index: number) => {
    if (!containerRef.current) return;
    const itemWidth = 200; // Approximate item width
    const containerWidth = containerRef.current.offsetWidth;
    const scrollPosition = index * itemWidth - (containerWidth / 2 - itemWidth / 2);
    containerRef.current.scrollLeft = scrollPosition;
  };

  useEffect(() => {
    scrollToCenter(currentIndex);
  }, [currentIndex]);

  return (
    <div className="w-full bg-gray-50 border-y border-gray-200">
      <style>{`
        .carousel-container {
          display: flex;
          overflow-x: auto;
          gap: 16px;
          padding: 16px;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .carousel-container::-webkit-scrollbar {
          display: none;
        }
        
        .carousel-item {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          transition: transform 0.3s ease, opacity 0.3s ease;
          white-space: nowrap;
          cursor: grab;
          user-select: none;
          scroll-snap-align: center;
        }
        
        .carousel-item.active {
          transform: scale(1.15);
          opacity: 1;
        }
        
        .carousel-item:not(.active) {
          opacity: 0.6;
          transform: scale(0.95);
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
        
        .carousel-item.active .bank-logo {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .bank-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 4px;
        }
        
        .bank-name {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }
        
        .carousel-item.active .bank-name {
          color: #0f367e;
          font-weight: 600;
        }
      `}</style>

      <div
        className="carousel-container"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {banksBase.map((bank, index) => (
          <div
            key={index}
            className={`carousel-item ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
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
        ))}
      </div>
    </div>
  );
}
