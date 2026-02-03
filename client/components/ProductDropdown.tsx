import { useState } from "react";

const products = [
  {
    id: 1,
    title: "20 YAYA KADAR Tüm Araçlarda Kredi",
    subtitle: "30 Dakika'da Kredi Hazır!",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop",
    buttonText: "Hemen Başvur",
  },
  {
    id: 2,
    title: "30 Dakika'da Taşıt Kredisi Hazır",
    image: "https://images.unsplash.com/photo-1619405399517-d4dc2500d5f9?w=400&h=300&fit=crop",
    buttonText: "Hemen Başvur",
  },
  {
    id: 3,
    title: "Ön Onaylı +800.000TL Kredi Limiti",
    subtitle: "Günü Yüksek Kredi İmkanı",
    image: "https://images.unsplash.com/photo-1606611281537-bbb6bfa74edf?w=400&h=300&fit=crop",
    buttonText: "Hemen Başvur",
  },
];

export default function ProductDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="text-sm text-gray-700 hover:text-primary font-medium pb-1 border-b-2 border-transparent hover:border-primary transition-colors">
        Kendim İçin
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-0 bg-white rounded-b-lg shadow-xl border border-gray-200 border-t-0 z-40 w-max">
          {/* Dropdown Header */}
          <div className="px-6 py-4 border-b border-gray-200 text-sm font-semibold text-gray-700">
            Finansal Çözümler
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-3 gap-4 p-6 min-w-[900px]">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Content */}
                <div className="p-4 bg-blue-600">
                  <h3 className="text-sm font-bold text-white mb-2">
                    {product.title}
                  </h3>
                  {product.subtitle && (
                    <p className="text-xs text-blue-100 mb-4">
                      {product.subtitle}
                    </p>
                  )}
                </div>

                {/* Button */}
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                  <button className="w-full py-1.5 border border-primary text-primary font-medium text-xs rounded hover:bg-blue-50 transition-colors">
                    {product.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-1.5 py-3 border-t border-gray-200">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      )}
    </div>
  );
}
