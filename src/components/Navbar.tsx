import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Browse Cars", href: "/browse" },
    { label: "Sell Your Car", href: "/sell" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
      <nav className="container-wide">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Link to="/browse">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Search size={20} />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="default">
                <User size={18} />
                Sign In
              </Button>
            </Link>
            <Link to="/sell">
              <Button variant="default" size="default">
                List Your Car
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden"
            >
              <div className="space-y-1 pb-6 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      <User size={18} />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sell" onClick={() => setIsOpen(false)}>
                    <Button variant="default" className="w-full justify-center">
                      List Your Car
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
