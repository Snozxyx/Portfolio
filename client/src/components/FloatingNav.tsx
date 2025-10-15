import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from './ThemeToggle';

export const FloatingNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();
  const [location] = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
      data-testid="nav-floating"
    >
      <div className="bg-card/80 backdrop-blur-md rounded-full px-8 py-4 border border-border shadow-lg">
        <ul className="flex items-center justify-center space-x-8 text-foreground font-sans">
          {navItems.map((item) => (
            <motion.li
              key={item.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="cursor-pointer hover:text-primary transition-colors text-sm font-medium"
                data-testid={`link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </a>
            </motion.li>
          ))}
          <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <ThemeToggle />
          </motion.li>
        </ul>
      </div>
    </motion.nav>
  );
};
