import { useState, useRef } from "react";

const carBrands = [
  "Toyota",
  "Honda",
  "Ford",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Hyundai",
  "Kia",
  "Mazda",
  "Renault",
  "Peugeot",
  "Citroen",
  "Fiat",
  "Opel",
  "Suzuki",
  "Dacia",
  "Skoda",
  "SEAT",
  "Porsche",
  "Volvo",
  "Tesla",
  "MG",
  "BYD",
  "Jeep",
  "Nissan",
  "Mitsubishi",
  "Isuzu",
  "Dodge",
  "Cadillac",
];

// Car images - different per brand
const carImages: Record<string, string> = {
  Toyota:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F7858a8b33a134dc9a7e7d563b1a4375c?format=webp&width=800&height=1200",
  Honda:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fd923228302ae441b96dac9b350dada69?format=webp&width=800&height=1200",
  Ford: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F87367391e7cb461d8ec82b8357d7fb29?format=webp&width=800&height=1200",
  BMW: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Faf3458382a79453b9bbc3345d2afb33a?format=webp&width=800&height=1200",
  "Mercedes-Benz":
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F40a071d38e254e1687678a989d9b85a9?format=webp&width=800&height=1200",
  Audi: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F3f5096328b134666b1529dd9d4e86316?format=webp&width=800&height=1200",
  Volkswagen:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fcada180266e846bea750ff2dcdc73e4c?format=webp&width=800&height=1200",
  Hyundai:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F82642e41247d479fa2eb3a3287662ea0?format=webp&width=800&height=1200",
  Kia: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F802a0a82258443cbb31f6b77c381f1aa?format=webp&width=800&height=1200",
  Mazda:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Ffc7f1ce77aaa416ba4013aec7f4e1b69?format=webp&width=800&height=1200",
  Renault:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F37b957bec89c48618f530096c007e905?format=webp&width=800&height=1200",
  Peugeot:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Ff124e0392ed34e948e3b39b972bed098?format=webp&width=800&height=1200",
  Citroen:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F32d80f27a02c4c17b303f79cb5dabf57?format=webp&width=800&height=1200",
  Fiat: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fd94ef9a5927c481d88c3d14af8d3a0c7?format=webp&width=800&height=1200",
  Opel: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F1434b2dd934f4dea8f8fcbcad908ad37?format=webp&width=800&height=1200",
  Suzuki:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F66bb4986470a4bc7b0d2cc4d7f4ba9fe?format=webp&width=800&height=1200",
  Dacia:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fdc1cbc7d414843dcb89fce47cb63bcfa?format=webp&width=800&height=1200",
  Skoda:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F7ca8483d3b0141ceb6b2f3c598d971c5?format=webp&width=800&height=1200",
  SEAT: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F4bc2f98d59d244169399c24b9cd8019b?format=webp&width=800&height=1200",
  Porsche:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F5eebc55f997e40c386b661353a3a91c1?format=webp&width=800&height=1200",
  Volvo:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F797bc1f00e354ef1b91e0586b3b62bca?format=webp&width=800&height=1200",
  Tesla:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fc400fbfe36b24705a7fd447241f47c8c?format=webp&width=800&height=1200",
  MG: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F482958fbc1e047279e12bf6655844d51?format=webp&width=800&height=1200",
  BYD: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F630ea99f64154da088f74550c584d1fa?format=webp&width=800&height=1200",
  Jeep: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F99f35a8f74f443d39f3a3afec121e877?format=webp&width=800&height=1200",
  Nissan:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F4a67f4b31f61434295a58a548402ce5a?format=webp&width=800&height=1200",
  Mitsubishi:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F019369dedd9c4793ac443b0c24a78c73?format=webp&width=800&height=1200",
  Isuzu:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F846be8b724cd4ca7b8b512f58a4f1d98?format=webp&width=800&height=1200",
  // Default image for all other brands
  default:
    "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F369a614627794587a4636344173097f8?format=webp&width=800&height=1200",
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

    // Calculate total width of all items with gaps
    // Item: 50px width, Gap: 16px (gap-4)
    const itemWidth = 50;
    const gapWidth = 16;

    // Total width: all items + all gaps between items
    // For 35 items: 35 * 50 + 34 * 16 = 1750 + 544 = 2294px
    const totalItemsWidth =
      carBrands.length * itemWidth + (carBrands.length - 1) * gapWidth;

    // Maximum scroll: when Cadillac's right edge aligns with container's right edge
    // Subtract container width to get the scroll distance
    const maxScroll = Math.max(0, totalItemsWidth - containerWidth);

    // Map mouse position to scroll position proportionally
    const mouseRatio = mouseX / containerWidth;
    const newScrollPos = Math.round(mouseRatio * maxScroll);

    // Clamp scroll position to valid range
    const clampedScrollPos = Math.max(0, Math.min(newScrollPos, maxScroll));
    setScrollPos(clampedScrollPos);
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
              {/* Oval Blue Frame with Car Image or Logo */}
              <div
                className={`
                  flex items-center justify-center
                  w-[50px] h-[90px]
                  border-3 border-blue-500 rounded-full
                  bg-blue-50 overflow-hidden
                  transition-all duration-300 ease-out
                  ${hoveredIndex === index ? "car-item-hover shadow-lg" : ""}
                `}
              >
                <img
                  src={getCarImage(brand)}
                  alt={brand}
                  className="pointer-events-none object-contain"
                  style={{
                    width: "190px",
                    height: "190px",
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
