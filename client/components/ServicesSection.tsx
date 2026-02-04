import { Clock, Shield, TrendingUp } from "lucide-react";

const services = [
  {
    icon: Clock,
    title: "Esnek Ödeme",
    titleBold: "Esnek",
    description: "İster senetle ister esnek ödeme ile bütçenize göre ödeme planı oluşturun.",
    color: "text-blue-900", // Dark blue
  },
  {
    icon: Shield,
    title: "Hızlı Değerlendirme",
    titleBold: "Hızlı",
    description: "Verileriniz en yüksek güvenlik standartlarıyla korunur",
    color: "text-blue-600", // Regular blue
  },
  {
    icon: TrendingUp,
    title: "Güvenli Süreç",
    titleBold: "Güvenli",
    description: "%9.99'dan başlayan uygun faiz oranlarından yararlanın",
    color: "text-blue-900", // Dark blue
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                      {index === 0 && service.titleBold ? (
                        <>
                          <b>{service.titleBold}</b> Ödeme
                        </>
                      ) : (
                        service.title
                      )}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
