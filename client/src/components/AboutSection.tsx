import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactTyped } from 'react-typed';
import { Code, Gamepad2, Radio, Cpu } from 'lucide-react';
import { useRef } from 'react';

export const AboutSection = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.95]);

  const specialties = [
    {
      icon: Code,
      title: "Full-Stack Development",
      description: "Building scalable applications with modern technologies and best practices"
    },
    {
      icon: Radio,
      title: "Streaming Technology",
      description: "Expertise in live streaming platforms and real-time data processing"
    },
    {
      icon: Gamepad2,
      title: "Discord Bots",
      description: "Creating engaging Discord experiences with custom bot development"
    },
    {
      icon: Cpu,
      title: "Cross-Platform",
      description: "Developing applications that work seamlessly across different platforms"
    }
  ];

  const sentence1 = "I'm Gabhasti Giri, a passionate";
  const sentence2 = "who specializes in creating innovative solutions for streaming technology and community platforms.";
  const sentence3 = "With expertise in full-stack development and a deep love for gaming culture, I bridge the gap between technical excellence and engaging user experiences.";

  const words1 = sentence1.split(" ");
  const words2 = sentence2.split(" ");
  const words3 = sentence3.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: "blur(8px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={sectionRef} id="about" className="min-h-screen flex items-center py-20 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          style={{ opacity, scale }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif font-bold text-center mb-6" 
            data-testid="heading-about"
          >
            About Me
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-20 h-1 bg-primary mx-auto mb-12 origin-center"
          />

          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.p 
              className="text-lg md:text-xl font-sans leading-relaxed mb-6"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {words1.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordVariants}
                  className={word === "Gabhasti" || word === "Giri," ? "text-foreground font-semibold" : "text-muted-foreground"}
                >
                  {word}{" "}
                </motion.span>
              ))}
              {inView && (
                <ReactTyped
                  strings={[
                    "software developer",
                    "gaming enthusiast",
                    "open source contributor",
                    "tech innovator"
                  ]}
                  typeSpeed={60}
                  backSpeed={40}
                  loop
                  className="text-primary font-semibold"
                />
              )}
              {" "}
              {words2.map((word, index) => (
                <motion.span
                  key={`s2-${index}`}
                  variants={wordVariants}
                  className="text-muted-foreground"
                >
                  {word}{" "}
                </motion.span>
              ))}
            </motion.p>
            <motion.p 
              className="text-lg font-sans leading-relaxed"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {words3.map((word, index) => (
                <motion.span
                  key={`s3-${index}`}
                  variants={wordVariants}
                  className="text-muted-foreground"
                >
                  {word}{" "}
                </motion.span>
              ))}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => (
              <motion.div
                key={specialty.title}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ 
                  delay: 0.5 + index * 0.15, 
                  duration: 0.7,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="bg-card border border-card-border rounded-lg p-6 hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer group perspective-1000"
                data-testid={`card-specialty-${index}`}
              >
                <motion.div 
                  className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <specialty.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-lg font-serif font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {specialty.title}
                </h3>
                <p className="text-sm text-muted-foreground font-sans">
                  {specialty.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
