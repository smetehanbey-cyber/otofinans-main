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
  const [scroll, setScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const itemWidth = 110; // width of each bank item in pixels
  const centerOffset = itemWidth / 2;

  // Reset auto-advance timer
  const resetAutoAdvance = () => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
    autoAdvanceRef.current = setTimeout(() => {
      setScroll((prev) => prev + itemWidth);
    }, 2000);
  };

  useEffect(() => {
    resetAutoAdvance();
    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
    };
  }, [scroll]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    dragStartRef.current = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const dragEndPos =
      "changedTouches" in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const dragDistance = dragStartRef.current - dragEndPos;

    setIsDragging(false);

    if (Math.abs(dragDistance) > 30) {
      setScroll((prev) => prev + (dragDistance > 0 ? itemWidth : -itemWidth));
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
    } else {
      resetAutoAdvance();
    }
  };

  const getCenterIndex = () => {
    return Math.round(scroll / itemWidth) % banksBase.length;
  };

  const centerIndex = getCenterIndex();
  const duplicatedBanks = [...banksBase, ...banksBase];

  return (
    <div className="w-full bg-gray-50 border-y border-gray-200">
      <style>{`
        .bank-carousel-wrapper {
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 12px 16px;
          gap: 0;
          width: 100%;
          position: relative;
          cursor: grab;
          user-select: none;
          height: auto;
          background-color: rgba(243, 244, 246, 1);
        }

        .bank-carousel-wrapper.dragging {
          cursor: grabbing;
        }

        .bank-carousel-track {
          display: flex;
          gap: 16px;
          position: relative;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: translateX(calc(-${itemWidth}px * var(--scroll-index)));
        }

        .bank-item {
          flex: 0 0 ${itemWidth}px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-gray-700;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0.4;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .bank-item.center-item {
          opacity: 1;
        }

        .bank-logo {
          width: 50px;
          height: 50px;
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
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .bank-item.center-item .bank-logo {
          width: 80px;
          height: 80px;
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.5);
        }

        .bank-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 6px;
        }

        .bank-name {
          color: #374151;
          font-size: 11px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .bank-item.center-item .bank-name {
          color: #0f367e;
          font-weight: 700;
          font-size: 12px;
        }
      `}</style>

      <div
        ref={containerRef}
        className={`bank-carousel-wrapper ${isDragging ? "dragging" : ""}`}
        style={{ "--scroll-index": Math.round(scroll / itemWidth) } as React.CSSProperties}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div className="bank-carousel-track">
          {duplicatedBanks.map((bank, index) => {
            const bankIndex = index % banksBase.length;
            const isCenter = bankIndex === centerIndex;

            return (
              <div
                key={index}
                className={`bank-item ${isCenter ? "center-item" : ""}`}
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
