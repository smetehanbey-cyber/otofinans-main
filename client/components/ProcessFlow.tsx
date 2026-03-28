import { Car, FileText, CheckCircle, Key, Info, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const steps = [
  {
    title: "BAŞVURU YAP",
    shortDescription: "Dakikalar içinde kredi başvurusu",
    icon: FileText,
    color: "#e91e63",
    description: "Hızlı ve güvenli bir şekilde kredi başvurunuzu online olarak tamamlayabilirsiniz. Uzman ekibimiz en kısa sürede sizinle iletişime geçerek süreci başlatacaktır.",
  },
  {
    title: "ARACINI SEÇ",
    shortDescription: "Hayalindeki otomobile karar ver",
    icon: Car,
    color: "#ff5252",
    description: "Geniş araç seçeneklerimiz arasından hayalindeki araca karar ver. Türkiye'nin her yerinden yüzlerce güncel ilan arasından bütçene uygun olanı seçebilirsin.",
  },
  {
    title: "HIZLI ONAY",
    shortDescription: "En hızlı kredi onay süreci",
    icon: CheckCircle,
    color: "#ffc107",
    description: "30 dakika gibi rekor bir sürede kredi ön onayını al. Karmaşık banka süreçleriyle vakit kaybetmeden finansmana en kolay yoldan erişmeni sağlıyoruz.",
  },
  {
    title: "ARACINA KAVUŞ",
    shortDescription: "Aracını teslim al ve yola çık",
    icon: Key,
    color: "#00bcd4",
    description: "Kredi onayın ve resmi işlemlerinin tamamlanmasının ardından aracını keyifle teslim al ve yola çık. Mutluluğa giden en güvenli yol OtoFinans ile başlar.",
  },
];

interface ProcessFlowProps {
  bgTransparent?: boolean;
}

export default function ProcessFlow({ bgTransparent = false }: ProcessFlowProps) {
  const [selectedStep, setSelectedStep] = useState<typeof steps[0] | null>(null);

  return (
    <section className={cn(
      "relative overflow-hidden transition-all duration-300",
      bgTransparent ? "bg-transparent py-4" : "bg-white pt-20 pb-16"
    )}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-center">
            {/* Using max-w-full to allow spreading across the parent container */}
            <div className="relative w-full flex flex-col items-center">
              {/* Steps List - Using discrete vertical layout with Icon as center */}
              <div className="flex flex-col space-y-8 relative w-full items-start py-[10px]">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative w-full flex justify-center">
                    <button 
                      onClick={() => setSelectedStep(step)}
                      className="flex items-center justify-between group h-20 w-full outline-none bg-white rounded-3xl sm:rounded-full px-6 sm:px-10 shadow-sm border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md active:scale-[0.99]"
                    >
                      {/* Left Side: Icon Circle Container */}
                      <div className="relative shrink-0 w-16 sm:w-20 flex justify-start">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white relative z-10 transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: step.color }}
                        >
                          <step.icon className="w-6 h-6 text-white" />
                        </div>

                        {/* 3 Dots Between Icons - Adjusted for card layout */}
                        {idx < steps.length - 1 && (
                          <div className="absolute left-6 top-[62px] h-10 flex flex-col items-center justify-around pointer-events-none -translate-x-1/2 opacity-20">
                            <div className="w-1 h-1 rounded-full bg-[#0f367e]" />
                            <div className="w-1 h-1 rounded-full bg-[#0f367e]" />
                            <div className="w-1 h-1 rounded-full bg-[#0f367e]" />
                          </div>
                        )}
                      </div>

                      {/* Center/Main: Text Content */}
                      <div className="flex flex-col text-center flex-grow px-4">
                        <span className="text-sm font-black tracking-wider text-blue-900 group-hover:text-blue-700 transition-colors uppercase">
                          {step.title}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium leading-tight mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          {step.shortDescription}
                        </span>
                      </div>

                      {/* Right Side: Direction Icon */}
                      <div className="w-16 sm:w-20 flex justify-end shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center transition-all duration-300 group-hover:border-emerald-100 shadow-sm group-hover:bg-emerald-50/50">
                          {step.title === "ARACINA KAVUŞ" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50/50" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-emerald-500 transition-all duration-300 group-hover:translate-y-0.5" />
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step Info Modal */}
        <Dialog open={!!selectedStep} onOpenChange={(open) => !open && setSelectedStep(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-4">
                {selectedStep && (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                    style={{ backgroundColor: selectedStep.color }}
                  >
                    <selectedStep.icon className="w-6 h-6 text-white" />
                  </div>
                )}
                <DialogTitle className="text-xl font-black italic tracking-tighter" style={{ color: "#0f367e" }}>
                  {selectedStep?.title}
                </DialogTitle>
              </div>
              <DialogDescription className="text-base text-gray-700 leading-relaxed font-medium">
                {selectedStep?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setSelectedStep(null)}
                className="px-6 py-2 bg-[#0f367e] text-white font-bold rounded-full text-sm hover:bg-blue-900 transition-colors"
              >
                Anladım
              </button>
            </div>
          </DialogContent>
        </Dialog>
    </section>
  );
}
