import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ProductDropdown from "./ProductDropdown";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  const handleCreditCalculatorClick = () => {
    navigate("/");
    // Scroll to calculator after navigation
    setTimeout(() => {
      const element = document.getElementById("credit-calculator");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* Top Navigation Bar - Hidden on Admin Page */}
        {!isAdminPage && (
          <div className="border-b border-gray-300" style={{ backgroundColor: "#e5e7eb" }}>
            <div className="max-w-full px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center py-2 hidden md:flex">
                {/* Top Navigation Links - Centered */}
                <nav className="hidden md:flex items-center gap-3 justify-center text-xs">
                  <Link to="/" className="text-gray-700 hover:text-primary font-medium">
                    Ana Sayfa
                  </Link>
                  <Link to="/hakkimizda" className="text-gray-700 hover:text-primary font-medium">
                    Hakkımızda
                  </Link>
                  <Link to="/finansmanlar" className="text-gray-700 hover:text-primary font-medium">
                    Finansmanlar
                  </Link>
                  <Link to="/kampanyalar" className="text-gray-700 hover:text-primary font-medium">
                    Kampanyalar
                  </Link>
                  <button
                    onClick={handleCreditCalculatorClick}
                    className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  >
                    Kredi Hesaplama
                  </button>
                  <Link to="/isortakligi" className="text-gray-700 hover:text-primary font-medium">
                    İş Ortaklığı
                  </Link>
                  <Link to="/bizeulas" className="text-gray-700 hover:text-primary font-medium">
                    Bize Ulaş
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Header Section */}
        <div className="border-b-2" style={{ borderColor: '#0f367e' }}>
          <div className="max-w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-20 gap-6">
              {/* Logo */}
              <Link to="/" className="flex items-center flex-shrink-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F4ab72f175d0542049f90dff7a3b5c790?format=webp&width=800&height=1200"
                  alt="Oto Finans Global Logo"
                  className="h-14 w-auto"
                />
              </Link>

              {/* Center Section - Filters - Hidden on Admin Page */}
              {!isAdminPage && (
                <div className="hidden md:flex items-center gap-6">
                  <ProductDropdown />
                  <div className="h-4 border-l border-gray-300"></div>
                  {/* Aracım İçin Menu */}
                  <div className="flex flex-col items-center">
                    <button className="text-sm font-medium pb-2 text-gray-700 hover:text-primary transition-colors">
                      Aracım İçin
                    </button>
                  </div>
                </div>
              )}

              {/* Search and Buttons - Hidden on Admin Page */}
              {!isAdminPage && (
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  <a
                    href="https://wa.me/905326398440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-1.5 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded text-xs font-semibold hover:from-blue-950 hover:via-blue-900 hover:to-blue-800 transition-colors"
                  >
                    Kredi Kullan
                  </a>
                  <a
                    href="https://wa.me/905326398440?text=Arac%C4%B1m%C4%B1%20Satmak%20%C4%B0stiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 border border-gray-400 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Aracını Hızlı Sat
                  </a>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden inline-flex items-center justify-center p-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-5 w-5 text-foreground" />
                ) : (
                  <Menu className="h-5 w-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden border-t border-gray-200 pb-4 space-y-2 bg-white">
            <Link to="/" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Ana Sayfa
            </Link>
            <Link to="/hakkimizda" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Hakkımızda
            </Link>
            <Link to="/finansmanlar" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Finansmanlar
            </Link>
            <Link to="/kampanyalar" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Kampanyalar
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                handleCreditCalculatorClick();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium"
            >
              Kredi Hesaplama
            </button>
            <Link to="/isortakligi" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              İş Ortaklığı
            </Link>
            <Link to="/bizeulas" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Bize Ulaş
            </Link>
            <Link to="/admin" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Admin
            </Link>
            <div className="px-4 py-2 space-y-2 border-t border-gray-200">
              <a
                href="https://wa.me/905326398440?text=Arac%C4%B1m%C4%B1%20Satmak%20%C4%B0stiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block px-4 py-1.5 border border-gray-400 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 text-center transition-colors"
              >
                Aracını Hızlı Sat
              </a>
              <a
                href="https://wa.me/905326398440?text=Kredi%20Ba%C5%9Fvurusu%20Yapmak%20%C4%B0stiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block px-4 py-1.5 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded text-xs text-center font-semibold hover:from-blue-950 hover:via-blue-900 hover:to-blue-800 transition-colors"
              >
                Kredi Kullan
              </a>
            </div>
          </nav>
        )}
      </header>

    </>
  );
}
