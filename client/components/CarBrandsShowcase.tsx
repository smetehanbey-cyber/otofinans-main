import { useState } from "react";

const carBrands = [
  "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi", "Volkswagen",
  "Hyundai", "Kia", "Mazda", "Renault", "Peugeot", "Citroen", "Fiat",
  "Opel", "Suzuki", "Dacia", "Skoda", "SEAT", "Porsche", "Volvo",
  "Tesla", "MG", "BYD", "GAC", "Geely", "Jeep", "Chevrolet",
  "Nissan", "Subaru", "Mitsubishi", "Isuzu", "Dodge", "Cadillac"
];

// Car image - same for all (can be customized per brand later)
const carImage = "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F369a614627794587a4636344173097f8?format=webp&width=800&height=1200";

export default function CarBrandsShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
      `}</style>

      <div className="w-full overflow-hidden">
        <div className="flex flex-wrap gap-4 justify-center items-center p-4">
          {carBrands.map((brand, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex flex-col items-center gap-2 cursor-pointer"
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
                  src={carImage}
                  alt={brand}
                  className="w-full h-full object-cover object-left"
                  style={{
                    clipPath: 'inset(0 50% 0 0)',
                    transform: 'scaleX(2)',
                  }}
                />
              </div>

              {/* Brand Name */}
              <p className="text-xs font-semibold text-gray-700 text-center whitespace-nowrap">
                {brand} 2020
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
