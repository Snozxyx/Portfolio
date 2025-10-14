import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Mail, Twitter, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, MouseEvent } from 'react';

export const ContactSection = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/snozxyx',
      color: 'hover:text-primary'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/in/snozxyx',
      color: 'hover:text-primary'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/snozxyx',
      color: 'hover:text-primary'
    },
    {
      name: 'Discord',
      icon: MessageSquare,
      url: 'https://discord.gg/snozxyx',
      color: 'hover:text-[#ff6b35]'
    },
  ];

  const MagneticCard = ({ children, index }: { children: React.ReactNode; index: number }) => {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const offsetY = (e.clientY - rect.top - rect.height / 2) * 0.15;
      x.set(offsetX);
      y.set(offsetY);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const social = socialLinks[index];

    return (
      <motion.a
        ref={cardRef}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0, rotateY: -180 }}
        animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
        transition={{ 
          delay: index * 0.1, 
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x, y }}
        whileHover={{ scale: 1.1 }}
        className={`bg-card border border-card-border rounded-xl p-6 flex flex-col items-center gap-3 min-w-[120px] hover-elevate active-elevate-2 transition-all cursor-pointer group ${social.color}`}
        data-testid={`link-social-${social.name.toLowerCase()}`}
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <social.icon className="w-8 h-8" />
        </motion.div>
        <span className="font-sans font-medium text-sm">{social.name}</span>
      </motion.a>
    );
  };

  const titleText = "Let's Connect";

  return (
    <section ref={sectionRef} id="contact" className="min-h-screen flex items-center py-20 md:py-32 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        style={{ y }}
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-[#ff6b35]/10 rounded-full blur-3xl"
      />
      
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          style={{ opacity }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-serif font-bold mb-6 perspective-1000" 
            data-testid="heading-contact"
          >
            {titleText.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-20 h-1 bg-primary mx-auto mb-8 origin-center"
          />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            Feel free to reach out through any of these platforms!
          </motion.p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {socialLinks.map((_, index) => (
              <MagneticCard key={index} index={index}>
                {null}
              </MagneticCard>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="font-sans font-medium px-8 relative overflow-hidden group"
              asChild
              data-testid="button-email"
            >
              <a href="mailto:contact@snozxyx.dev">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-[#ff6b35] opacity-0 group-hover:opacity-20 transition-opacity"
                  initial={false}
                />
                <Mail className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Send me an email</span>
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
