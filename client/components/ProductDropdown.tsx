import { useState, useRef, useEffect } from "react";

const products = [
  {
    id: 1,
    title: "Peşinatsız Destek",
    subtitle: "30 Dakika'da kredin hazır! Aracın Hemen Kapıda!",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fd48ae6be8511489c8905ee933513aed5?format=webp&width=800&height=1200",
    buttonText: "Hemen Başvur",
  },
  {
    id: 2,
    title: "Hızlı Kredi Desteği",
    subtitle: "20 Yaş'a Kadar Tüm Araçlarda Kredi Onayı OtoFinans'ta.",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F131274b80b1d48b0b1d63539799f60ec?format=webp&width=800&height=1200",
    buttonText: "Hemen Başvur",
  },
  {
    id: 3,
    title: "Ön Onaylı +800.000TL Kredi Limitin Hazır!",
    subtitle: "Günü Yüksek Kredi İmkanı",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F208b71039a474d89b38a8ba38d113503?format=webp&width=800&height=1200",
    buttonText: "Hemen Başvur",
  },
];

export default function ProductDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    // Hemen aç - 3 saniye gecikme kaldırıldı
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // 300ms delay ile kapat - ani kapanmayı önlemek için
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <>
      <style>{`
        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col items-center">
          <button
            className={`text-sm font-medium pb-2 transition-colors ${isOpen ? "text-primary" : "text-gray-700 hover:text-primary"}`}
          >
            Kendim İçin
          </button>
          {isOpen && (
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#1f3a93" }}
            ></div>
          )}
        </div>

        {/* Dropdown Menu - Full width white content */}
        {isOpen && (
          <div
            className="fixed left-0 right-0 z-40 w-full origin-top"
            style={{
              animation: "dropdownSlideIn 0.3s ease-out",
              top: "120px",
              pointerEvents: "auto",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Content area - Full width */}
            <div
              className="shadow-xl"
              style={{
                borderTop: "2px solid #1f3a93",
                pointerEvents: "auto",
                backgroundColor: "#ffffff",
              }}
            >
              {/* Dropdown Header */}
              <div className="border-b border-gray-100 py-3 text-sm font-semibold text-gray-700 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                  Kendim İçin Finansal Çözümler
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-3 gap-4 p-6 max-w-6xl mx-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                    style={{
                      backgroundColor: "#0f367e",
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-28 bg-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Content - Flex column to push button down */}
                    <div
                      className="text-white flex flex-col flex-grow"
                      style={{ backgroundColor: "#0f367e", padding: "12px" }}
                    >
                      <div className="flex-grow"></div>
                      <h3 className="text-sm font-bold mb-1">
                        {product.title}
                      </h3>
                      {product.subtitle && (
                        <p className="text-xs text-blue-100 mb-0">
                          {product.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Button */}
                    <div className="px-3 py-3">
                      <a
                        href="https://wa.me/905324098440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 font-bold text-xs rounded-full text-white transition-colors hover:border-blue-300 hover:text-blue-200 inline-block text-center"
                        style={{
                          border: "2px solid #3b82f6",
                          backgroundColor: "transparent",
                        }}
                      >
                        {product.buttonText}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-1.5 py-3 border-t border-gray-100 bg-white">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
