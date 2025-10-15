import { Github, Linkedin, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const Footer = () => {
  const { data: siteSettings } = useQuery({
    queryKey: ['/api/settings'],
  });

  return (
    <footer className="relative bg-card/50 backdrop-blur-sm border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold mb-2">Snozxyx</h3>
            <p className="text-muted-foreground font-sans">Building the future, one line of code at a time.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(`#${item.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-sans font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://github.com/snozxyx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/in/snozxyx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@snozxyx.dev"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center text-muted-foreground font-sans text-sm">
            <p>{siteSettings?.footerMessage || '© 2024 Snozxyx. All rights reserved.'}</p>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            Built with React, Framer Motion & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};