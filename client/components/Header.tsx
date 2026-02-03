import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">OTO</span>
              <span className="text-xs font-semibold text-primary -mt-1">FINANS GLOBAL</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
              Ana Sayfa
            </Link>
            <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
              Ürünler
            </Link>
            <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
              Kurumsal
            </Link>
            <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
              İletişim
            </Link>
            <a 
              href="tel:+905324098440"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors font-semibold"
            >
              Hemen Başvur
            </a>
          </nav>

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
          <nav className="md:hidden pb-4 space-y-2">
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
            <a
              href="tel:+905324098440"
              className="block w-full bg-primary text-white px-3 py-2 rounded-md text-center hover:bg-blue-800 transition-colors font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Hemen Başvur
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
