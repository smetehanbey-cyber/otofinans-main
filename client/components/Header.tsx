import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* Top Navigation Bar */}
        <div className="border-b border-gray-200">
          <div className="max-w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-12">
              {/* Menu Label */}
              <div className="hidden md:block">
                <span className="text-sm font-bold text-primary">MENÜ</span>
              </div>

              {/* Top Navigation Links - Smaller Font */}
              <nav className="hidden md:flex items-center gap-2 flex-1 justify-center text-xs">
                <Link to="/" className="text-gray-700 hover:text-primary font-medium px-2 py-1 rounded hover:bg-gray-50">
                  Ana Sayfa
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium px-2 py-1 rounded hover:bg-gray-50">
                  Hakkımızda
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium px-2 py-1 rounded hover:bg-gray-50">
                  Finansmanlar
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium px-2 py-1 rounded hover:bg-gray-50">
                  Kampanyalar
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium px-2 py-1 rounded hover:bg-gray-50">
                  Kredi Hesaplama
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium px-2 py-1 rounded hover:bg-gray-50">
                  İş Ortaklığı
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium px-2 py-1 rounded hover:bg-gray-50">
                  Bize Ulaş
                </Link>
              </nav>

              {/* Right Section - Search and CTA */}
              <div className="hidden md:flex items-center gap-3">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Search className="h-4 w-4 text-gray-600" />
                </button>
                <span className="text-xs text-gray-600">Hemen Başvur Formunu</span>
                <a
                  href="tel:+905324098440"
                  className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-4 py-1.5 rounded text-xs font-semibold hover:from-blue-950 hover:via-blue-900 hover:to-blue-800 transition-colors"
                >
                  Kredi Kullan
                </a>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Logo and Filter Row */}
        <div className="border-b border-gray-200">
          <div className="max-w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 gap-4">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F8bf84ff4531a4db6bfe9a09d40088813?format=webp&width=800&height=1200"
                  alt="Oto Finans Global Logo"
                  className="h-10 w-auto"
                />
              </Link>

              {/* Filter Tabs */}
              <div className="hidden md:flex items-center gap-6 flex-1 ml-4 text-xs">
                <button className="text-gray-700 hover:text-primary font-medium pb-2 border-b-2 border-transparent hover:border-primary transition-colors">
                  Kendim İçin
                </button>
                <button className="text-gray-700 hover:text-primary font-medium pb-2 border-b-2 border-transparent hover:border-primary transition-colors">
                  Aracım İçin
                </button>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex items-center gap-2 flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Aracını Bul..."
                  className="bg-transparent text-xs outline-none flex-1 text-gray-600"
                />
              </div>

              {/* Right CTA */}
              <a
                href="tel:+905324098440"
                className="hidden md:inline-block bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-5 py-2 rounded text-xs font-semibold hover:from-blue-950 hover:via-blue-900 hover:to-blue-800 transition-colors flex-shrink-0"
              >
                Kredi Kullan
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden border-t border-gray-200 pb-4 space-y-2 bg-gray-50">
            <Link to="/" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Ana Sayfa
            </Link>
            <Link to="/" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Hakkımızda
            </Link>
            <Link to="/" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Finansmanlar
            </Link>
            <Link to="/" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Kampanyalar
            </Link>
            <Link to="/" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Kredi Hesaplama
            </Link>
            <Link to="/" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              İş Ortaklığı
            </Link>
            <Link to="/" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Bize Ulaş
            </Link>
            <a
              href="tel:+905324098440"
              className="block mx-4 w-auto bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-4 py-2 rounded text-sm text-center hover:from-blue-950 hover:via-blue-900 hover:to-blue-800 transition-colors font-semibold mt-2"
              onClick={() => setIsOpen(false)}
            >
              Kredi Kullan
            </a>
          </nav>
        )}
      </header>

      {/* Tagline Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-3 text-center">
        <p className="text-sm sm:text-base font-semibold px-4">
          Destek Oto Finans'ta Aracın 30 Dakika'da Kapında.
        </p>
      </div>
    </>
  );
}
