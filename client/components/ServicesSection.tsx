import { Clock, Shield, TrendingUp } from "lucide-react";

const services = [
  {
    icon: Clock,
    title: "Hızlı İşlem",
    description: "30 dakika içinde başvurunuz değerlendirilir ve sonuç alırsınız",
  },
  {
    icon: Shield,
    title: "Güvenli Sistem",
    description: "Verileriniz en yüksek güvenlik standartlarıyla korunur",
  },
  {
    icon: TrendingUp,
    title: "Kompetitif Oranlar",
    description: "%9.99'dan başlayan uygun faiz oranlarından yararlanın",
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
                      {service.title}
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
