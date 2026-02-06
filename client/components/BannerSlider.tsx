import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  gradient: string;
  rightImage?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Hayalindeki Aracı",
    subtitle: "30 Dakika'da Kapınıza",
    color: "from-blue-700 to-blue-900",
    gradient: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900"
  },
  {
    id: 2,
    title: "En Düşük Faiz Oranları",
    subtitle: "%0.99'dan Başlayan\nEn Düşük Oranlar",
    color: "from-indigo-700 to-indigo-900",
    gradient: "bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900"
  },
  {
    id: 3,
    title: "Oto Finans Global'la",
    subtitle: "İlk Adımınızı Atın Bugün!",
    color: "from-blue-800 to-slate-900",
    gradient: "bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900",
    rightImage: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F192d42a3256c40ff8b7ec93b6430ccb0?format=webp&width=800&height=1200"
  },
  {
    id: 4,
    title: "Oto Finans Global'la",
    subtitle: "İlk Adımınızı Atın Bugün!",
    color: "from-slate-800 to-slate-900",
    gradient: "bg-gradient-to-r from-blue-800 via-slate-800 to-slate-900"
  }
];

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-56 overflow-hidden rounded-xl shadow-lg">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          } ${slide.gradient}`}
        >
          <div className="absolute inset-0 flex items-center justify-start px-4 sm:px-8">
            {/* Left content */}
            <div className="flex flex-col justify-center text-white z-10 max-w-xs sm:max-w-2xl">
              <h2 className="text-xl sm:text-4xl font-bold mb-1 sm:mb-2 italic leading-tight">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-xl font-semibold">
                {slide.subtitle}
              </p>
            </div>

            {/* Decorative element or phone image */}
            {slide.rightImage ? (
              <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center">
                <img src={slide.rightImage} alt={slide.title} className="h-full object-contain" />
              </div>
            ) : (
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
                <div className="w-full h-full bg-white rounded-full ml-1/2 -mr-1/4"></div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 transition-colors text-white p-2 rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 transition-colors text-white p-2 rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 w-2 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
