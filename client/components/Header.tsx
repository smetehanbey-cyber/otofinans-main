import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F50071fe254ed4ab8872c9a1fa95b9670%2F8bf84ff4531a4db6bfe9a09d40088813?format=webp&width=800&height=1200"
                alt="Oto Finans Global Logo"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation - Spread Out */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-3 flex-1 justify-center mx-8">
              <Link
                to="/"
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                Ana Sayfa
              </Link>
              <Link
                to="/"
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                Hakkımızda
              </Link>
              <Link
                to="/"
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                Finansmanlar
              </Link>
              <Link
                to="/"
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                Kampanyalar
              </Link>
              <Link
                to="/"
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                Kredi Hesaplama
              </Link>
              <Link
                to="/"
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                İş Ortaklığı
              </Link>
              <Link
                to="/"
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                Bize Ulaş
              </Link>
            </nav>

            {/* CTA Button - Always Visible */}
            <a
              href="tel:+905324098440"
              className="hidden md:inline-block bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-950 hover:via-blue-900 hover:to-blue-800 transition-colors font-semibold text-sm lg:text-base flex-shrink-0 shadow-md"
            >
              Hemen Başvur
            </a>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <nav className="md:hidden pb-4 space-y-2 border-t border-gray-200">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Finansmanlar
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Kampanyalar
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Kredi Hesaplama
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                İş Ortaklığı
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Bize Ulaş
              </Link>
              <a
                href="tel:+905324098440"
                className="block w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-3 py-2 rounded-md text-center hover:from-blue-950 hover:via-blue-900 hover:to-blue-800 transition-colors font-semibold mt-2"
                onClick={() => setIsOpen(false)}
              >
                Hemen Başvur
              </a>
            </nav>
          )}
        </div>
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
