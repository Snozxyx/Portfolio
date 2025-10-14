import { motion } from 'framer-motion';
import { ReactTyped } from 'react-typed';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-muted-foreground font-sans text-lg mb-4"
          >
            Hello, I'm
          </motion.p>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-serif font-bold text-foreground mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
          >
            <span className="bg-gradient-to-r from-primary via-primary to-[#ff6b35] bg-clip-text text-transparent">
              Snozxyx
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-muted-foreground font-sans text-sm md:text-base mb-6"
          >
            Also known as <span className="text-foreground font-medium">Gabhasti Giri</span>
          </motion.p>
          
          <div className="text-xl md:text-3xl text-foreground mb-12 h-16 flex items-center justify-center font-mono">
            <ReactTyped
              strings={[
                "Software Developer",
                "Gaming Enthusiast", 
                "Full-Stack Creator",
                "Stream Tech Pioneer"
              ]}
              typeSpeed={50}
              backSpeed={30}
              loop
              data-testid="text-typewriter"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button 
              size="lg" 
              className="font-sans font-medium px-8"
              onClick={() => scrollToSection('#projects')}
              data-testid="button-view-work"
            >
              View My Work
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="font-sans font-medium px-8"
              onClick={() => scrollToSection('#contact')}
              data-testid="button-contact"
            >
              Get In Touch
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex gap-6 justify-center"
          >
            <a 
              href="https://github.com/snozxyx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-github"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://linkedin.com/in/snozxyx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-linkedin"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="mailto:contact@snozxyx.dev" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
