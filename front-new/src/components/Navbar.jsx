import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Accueil", url: "/" },
  { title: "À vendre", url: "/Avendre" },
  { title: "À louer", url: "/Alouer" },
  { title: "Prestations", url: "/Prestation" },
  { title: "À propos", url: "/Apropos" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const hasDarkHero = location.pathname === '/' || location.pathname === '/Apropos';
  const isSolid = isScrolled || !hasDarkHero;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid ? "bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span
              className={`text-2xl font-bold transition-colors ${
                isSolid ? "text-primary" : "text-white"
              }`}
            >
              Immo<span className="text-accent">Tuléar</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isSolid ? "text-foreground hover:text-primary hover:bg-secondary"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.title}
              </Link>
            ))}
            <Button 
              variant="accent" 
              size="sm" 
              className="ml-4"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            >
              Nous contacter
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className={isSolid ? "text-foreground" : "text-white"} />
            ) : (
              <Menu className={isSolid ? "text-foreground" : "text-white"} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white rounded-b-lg shadow-lg border-t">
            <div className="px-4 py-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.url}
                  to={item.url}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-md text-foreground hover:bg-secondary transition-colors font-medium"
                >
                  {item.title}
                </Link>
              ))}
              <div className="pt-2 pb-1">
                <Button 
                  variant="accent" 
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                >
                  Nous contacter
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


