import { useState } from "react";

const products = [
  {
    id: 1,
    title: "Peşinatsız Destekle Aracın Kapında.",
    subtitle: "30 Dakika'da Kredi Hazır!",
    image: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fd48ae6be8511489c8905ee933513aed5?format=webp&width=800&height=1200",
    buttonText: "Hemen Başvur",
  },
  {
    id: 2,
    title: "30 Dakika'da Taşıt Kredisi Hazır",
    subtitle: "20 Yaş'a Kadar Tüm Araçlarda Senetli Satış Kredisi.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F131274b80b1d48b0b1d63539799f60ec?format=webp&width=800&height=1200",
    buttonText: "Hemen Başvur",
  },
  {
    id: 3,
    title: "Ön Onaylı +800.000TL Kredi Limiti",
    subtitle: "Günü Yüksek Kredi İmkanı",
    image: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F208b71039a474d89b38a8ba38d113503?format=webp&width=800&height=1200",
    buttonText: "Hemen Başvur",
  },
];

export default function ProductDropdown() {
  const [isOpen, setIsOpen] = useState(false);

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
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex flex-col items-center">
          <button className={`text-sm font-medium pb-2 transition-colors ${isOpen ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
            Kendim İçin
          </button>
          {isOpen && (
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1f3a93' }}></div>
          )}
        </div>

        {/* Dropdown Menu - Transparent area + White content */}
        {isOpen && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 z-40 w-screen origin-top"
            style={{ 
              animation: 'dropdownSlideIn 0.3s ease-out', 
              top: '-30px',
              pointerEvents: 'none'
            }}
          >
            {/* Transparent hover area (button üstüne kadar) */}
            <div style={{ height: '30px', backgroundColor: 'transparent' }}></div>

            {/* Transparent content area */}
            <div
              className="shadow-xl"
              style={{
                borderTop: '2px solid #1f3a93',
                pointerEvents: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0)'
              }}
            >
              {/* Dropdown Header */}
              <div className="border-b border-gray-200 py-4 text-sm font-semibold text-gray-700">
                <div className="max-w-6xl mx-auto px-4">
                  Kendim İçin Finansal Çözümler
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 max-w-6xl mx-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    style={{
                      borderWidth: "2px",
                      borderStyle: "solid",
                      borderImage: "linear-gradient(135deg, #e8e8e8, #b0b0b0) 1"
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-24 bg-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Content */}
                    <div className="text-white" style={{ backgroundColor: "#1e2f79", padding: "8px" }}>
                      <h3 className="text-base font-bold mb-0">
                        {product.title}
                      </h3>
                      {product.subtitle && (
                        <p className="text-base text-blue-100 mb-0.5">
                          {product.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Button */}
                    <div className="px-2 py-2 bg-white" style={{
                      borderTopWidth: "2px",
                      borderTopStyle: "solid",
                      borderImage: "linear-gradient(to right, #e8e8e8, #b0b0b0) 1"
                    }}>
                      <button className="w-full py-1 font-medium text-xs rounded hover:bg-blue-50 transition-colors" style={{
                        borderWidth: "2px",
                        borderStyle: "solid",
                        borderImage: "linear-gradient(135deg, #e8e8e8, #b0b0b0) 1",
                        color: "#1f3a93"
                      }}>
                        {product.buttonText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-1.5 py-2 border-t border-gray-200">
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
