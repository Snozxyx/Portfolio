import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Home, Search, BookOpen, PenSquare, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export const BlogMobileNav = () => {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Write', href: '/blog/create', icon: PenSquare, authRequired: true },
    { name: 'Dashboard', href: '/dashboard', icon: User, authRequired: true },
  ];

  const visibleItems = navItems.filter(item => !item.authRequired || user);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-card/95 backdrop-blur-xl border-t border-card-border"
      >
        <div className="flex items-center justify-around px-4 py-3">
          {visibleItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== '/' && location.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-sans">{item.name}</span>
                </motion.button>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};
