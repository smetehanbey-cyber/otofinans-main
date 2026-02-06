import { useState, useRef } from "react";

const carBrands = [
  "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi", "Volkswagen",
  "Hyundai", "Kia", "Mazda", "Renault", "Peugeot", "Citroen", "Fiat",
  "Opel", "Suzuki", "Dacia", "Skoda", "SEAT", "Porsche", "Volvo",
  "Tesla", "MG", "BYD", "GAC", "Geely", "Jeep", "Chevrolet",
  "Nissan", "Subaru", "Mitsubishi", "Isuzu", "Dodge", "Cadillac"
];

// Car images - different per brand
const carImages: Record<string, string> = {
  Toyota: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F4d22196496544886a6621f8078066ae3?format=webp&width=800&height=1200",
  // Default image for all other brands
  default: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F369a614627794587a4636344173097f8?format=webp&width=800&height=1200"
};

const getCarImage = (brand: string): string => {
  return carImages[brand] || carImages.default;
};

export default function CarBrandsShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const containerWidth = rect.width;
    const centerX = containerWidth / 2;

    // Calculate which car index should be centered based on mouse position
    // Each car takes ~90px (50px width + 40px gap and padding)
    const itemWidth = 90;
    const itemsPerView = Math.floor(containerWidth / itemWidth);
    const totalScrollWidth = Math.max(0, (carBrands.length - itemsPerView) * itemWidth);

    // Map mouse position (0 to containerWidth) to scroll position (0 to totalScrollWidth)
    // When mouse is on left (0), show leftmost cars centered
    // When mouse is on right (containerWidth), show rightmost cars centered
    const mouseRatio = mouseX / containerWidth;
    const newScrollPos = Math.round(mouseRatio * totalScrollWidth);

    setScrollPos(newScrollPos);
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-6 sm:py-8">
      <style>{`
        @keyframes carHover {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.15);
          }
        }
        .car-item-hover {
          animation: carHover 0.3s ease-out forwards;
        }
        .carousel-container {
          scroll-behavior: smooth;
        }
      `}</style>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="w-full overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-b from-gray-50 to-white"
      >
        <div
          className="carousel-container flex gap-4 p-4 transition-transform duration-200 ease-out"
          style={{
            transform: `translateX(-${scrollPos}px)`,
          }}
        >
          {carBrands.map((brand, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
            >
              {/* Oval Blue Frame with Car Image */}
              <div
                className={`
                  flex items-center justify-center
                  w-[50px] h-[90px]
                  border-3 border-blue-500 rounded-full
                  bg-blue-50 overflow-hidden
                  transition-all duration-300 ease-out
                  ${hoveredIndex === index ? 'car-item-hover shadow-lg' : ''}
                `}
              >
                <img
                  src={getCarImage(brand)}
                  alt={brand}
                  className="w-full h-full object-cover object-left pointer-events-none"
                  style={{
                    clipPath: 'inset(0 50% 0 0)',
                    transform: 'scaleX(2)',
                  }}
                />
              </div>

              {/* Brand Name */}
              <p className="text-xs font-semibold text-gray-700 text-center whitespace-nowrap">
                {brand}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
