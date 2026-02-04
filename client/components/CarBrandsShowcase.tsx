import { useState } from "react";

const carBrands = [
  "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi", "Volkswagen",
  "Hyundai", "Kia", "Mazda", "Renault", "Peugeot", "Citroen", "Fiat",
  "Opel", "Suzuki", "Dacia", "Skoda", "SEAT", "Porsche", "Volvo",
  "Tesla", "MG", "BYD", "GAC", "Geely", "Jeep", "Chevrolet",
  "Nissan", "Subaru", "Mitsubishi", "Isuzu", "Dodge", "Cadillac"
];

export default function CarBrandsShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-6 sm:py-8">
      <div className="h-[90px] w-full overflow-hidden">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3 p-2 sm:p-3 h-full auto-rows-max">
          {carBrands.map((brand, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                flex items-center justify-center
                bg-white border-2 border-gray-200
                rounded-lg px-2 py-1
                text-xs sm:text-sm font-semibold text-gray-700
                cursor-pointer transition-all duration-300 ease-out
                whitespace-nowrap overflow-hidden text-center
                ${hoveredIndex === index 
                  ? 'scale-110 border-primary bg-blue-50 text-primary shadow-md z-10' 
                  : 'hover:border-gray-300'
                }
              `}
            >
              {brand} 2020
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
