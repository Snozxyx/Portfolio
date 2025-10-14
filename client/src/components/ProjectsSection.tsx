import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ProjectCard } from './ProjectCard';
import { useQuery } from '@tanstack/react-query';
import type { Project } from '@shared/schema';
import { useRef } from 'react';

export const ProjectsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const titleWords = "Featured Projects".split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -90
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  return (
    <section ref={sectionRef} id="projects" className="min-h-screen py-20 md:py-32 relative overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div 
        style={{ y }}
        className="absolute top-1/4 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
        className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#ff6b35]/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          style={{ opacity }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-serif font-bold text-center mb-6 perspective-1000" 
            data-testid="heading-projects"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {titleWords.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className="inline-block mr-4"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-20 h-1 bg-primary mx-auto mb-6 origin-center"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center text-muted-foreground font-sans max-w-2xl mx-auto mb-16"
          >
            A showcase of my recent work in streaming technology, Discord bots, and full-stack development
          </motion.p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-card-border rounded-xl p-6 h-80 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-sans text-lg">No projects to display yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="grid-projects">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
