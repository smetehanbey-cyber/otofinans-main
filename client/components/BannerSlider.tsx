import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  leftImage?: string;
  title?: string;
  subtitle?: string;
  gradient?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F806ff78bb9704eb3b5f3c7b3edb0a7de?format=webp&width=800&height=1200",
    leftImage: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F7457fb25352f4eacb4fae7353cd88308?format=webp&width=800&height=1200",
    title: "Hızlı Kredi Desteği",
    subtitle: "20 Yaş'a Kadar Tüm Araçlarda\nKredi Onayı OtoFinans'ta!",
    gradient: "bg-gradient-to-r from-blue-900/80 to-transparent"
  },
  {
    id: 2,
    image: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fc1e84adb0bf5499caeb0dca48580914d?format=webp&width=800&height=1200"
  },
  {
    id: 3,
    image: "https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2Fe20d5ea14b024c48aa3ec3733755c026?format=webp&width=800&height=1200"
  }
];

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
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
          }`}
        >
          <img
            src={slide.image}
            alt={`Campaign slide ${index + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay and text for slide 1 */}
          {slide.gradient && (
            <div className={`absolute inset-0 ${slide.gradient}`} />
          )}

          {slide.leftImage && slide.title && (
            <div className="absolute inset-0 flex items-center px-4 sm:px-8 z-10">
              <div className="flex gap-4 sm:gap-6 items-center w-full">
                {/* Left Image */}
                <div className="flex-shrink-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 overflow-hidden rounded-lg">
                  <img
                    src={slide.leftImage}
                    alt="Campaign"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text Content */}
                <div className="text-white">
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed whitespace-pre-line">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          )}
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
