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
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary">OTO</span>
                <span className="text-xs font-semibold text-primary -mt-1">FINANS GLOBAL</span>
              </div>
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
                Ürünler
              </Link>
              <Link 
                to="/" 
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                Kurumsal
              </Link>
              <Link 
                to="/" 
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                İletişim
              </Link>
              <Link 
                to="/" 
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                SSS
              </Link>
              <Link 
                to="/" 
                className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50 text-sm lg:text-base"
              >
                Blog
              </Link>
            </nav>

            {/* CTA Button - Always Visible */}
            <a 
              href="tel:+905324098440"
              className="hidden md:inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm lg:text-base flex-shrink-0"
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
                Ürünler
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Kurumsal
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                İletişim
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                SSS
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <a
                href="tel:+905324098440"
                className="block w-full bg-red-600 text-white px-3 py-2 rounded-md text-center hover:bg-red-700 transition-colors font-semibold mt-2"
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
          Gülerden İyeş Şahıstan Aracını Bul, Taşıt Kredisi Bize!
        </p>
      </div>
    </>
  );
}
