import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import ProductDropdown from "./ProductDropdown";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* Top Navigation Bar */}
        <div className="border-b border-gray-200 bg-gray-100">
          <div className="max-w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-10">
              {/* Top Navigation Links */}
              <nav className="hidden md:flex items-center gap-3 flex-1 justify-center text-xs">
                <Link to="/" className="text-gray-700 hover:text-primary font-medium">
                  Ana Sayfa
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium">
                  Hakkımızda
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium">
                  Finansmanlar
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium">
                  Kampanyalar
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium">
                  Kredi Hesaplama
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium">
                  İş Ortaklığı
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium">
                  Bize Ulaş
                </Link>
                <Link to="/" className="text-gray-700 hover:text-primary font-medium">
                  Ürünler
                </Link>
              </nav>

              {/* Right Section */}
              <div className="hidden md:flex items-center gap-2 text-xs ml-auto">
                <button className="text-gray-600 hover:text-primary">English</button>
                <span className="text-gray-400">•</span>
                <button className="text-gray-600 hover:text-primary">Türkçe</button>
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

        {/* Main Header Section */}
        <div className="border-b-2" style={{ borderColor: '#0f367e' }}>
          <div className="max-w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-20 gap-6">
              {/* Logo */}
              <Link to="/" className="flex items-center flex-shrink-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F8bf84ff4531a4db6bfe9a09d40088813?format=webp&width=800&height=1200"
                  alt="Oto Finans Global Logo"
                  className="h-14 w-auto"
                />
              </Link>

              {/* Center Section - Filters */}
              <div className="hidden md:flex items-center gap-4">
                {/* Filter Tabs */}
                <div className="flex items-center gap-6">
                  <ProductDropdown />
                  <div className="h-4 border-l border-gray-300"></div>
                  <button className="text-sm text-gray-700 hover:text-primary font-medium pb-1 border-b-2 border-transparent hover:border-primary transition-colors">
                    Aracım İçin
                  </button>
                </div>
              </div>

              {/* Search and Buttons */}
              <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                {/* Search Box */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Aracını Bul..."
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-primary"
                  />
                  <button className="p-1.5 hover:bg-gray-100 rounded border border-gray-300">
                    <Search className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <button className="px-4 py-1.5 border border-gray-400 rounded text-xs font-medium text-gray-700 hover:bg-gray-50">
                  Aracını Hızlı Sat
                </button>
                <a
                  href="tel:+905324098440"
                  className="px-5 py-1.5 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded text-xs font-semibold hover:from-blue-950 hover:via-blue-900 hover:to-blue-800 transition-colors"
                >
                  Kredi Kullan
                </a>
              </div>

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
            <Link to="/" className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 font-medium" onClick={() => setIsOpen(false)}>
              Ürün ve Hizmet
            </Link>
            <div className="px-4 py-2 flex gap-2 text-xs border-t border-gray-200 mt-2">
              <button className="text-gray-600 hover:text-primary">English</button>
              <span className="text-gray-400">•</span>
              <button className="text-gray-600 hover:text-primary">Türkçe</button>
            </div>
            <div className="px-4 py-2 space-y-2 border-t border-gray-200">
              <button className="w-full px-4 py-1.5 border border-gray-400 rounded text-xs font-medium text-gray-700 hover:bg-gray-100">
                Aracını Hızlı Sat
              </button>
              <a
                href="tel:+905324098440"
                className="w-full block px-4 py-1.5 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded text-xs text-center font-semibold hover:from-blue-950 hover:via-blue-900 hover:to-blue-800 transition-colors"
              >
                Kredi Kullan
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Tagline Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-1.5 text-center">
        <p className="text-sm sm:text-base font-semibold px-4">
          Destek Oto Finans'ta ⇋ Aracın 30 Dakika'da Kapında!
        </p>
      </div>
    </>
  );
}
