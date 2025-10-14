import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import type { Skill } from '@shared/schema';
import { useRef } from 'react';

export const SkillsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);

  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ['/api/skills'],
  });

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const proficiencyWidth = (proficiency: string) => {
    const levels: Record<string, string> = {
      'expert': 'w-full',
      'advanced': 'w-4/5',
      'intermediate': 'w-3/5',
      'beginner': 'w-2/5',
    };
    return levels[proficiency.toLowerCase()] || 'w-1/2';
  };

  const proficiencyPercentage = (proficiency: string) => {
    const levels: Record<string, number> = {
      'expert': 100,
      'advanced': 80,
      'intermediate': 60,
      'beginner': 40,
    };
    return levels[proficiency.toLowerCase()] || 50;
  };

  return (
    <section ref={sectionRef} id="skills" className="min-h-screen py-20 md:py-32 bg-card/20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          style={{ scale, opacity }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: -30, rotateX: -15 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif font-bold text-center mb-6 perspective-1000" 
            data-testid="heading-skills"
          >
            Skills & Expertise
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-20 h-1 bg-primary mx-auto mb-16 origin-center"
          />

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-card-border rounded-xl p-6 h-40 animate-pulse" />
              ))}
            </div>
          ) : Object.keys(groupedSkills).length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-sans text-lg">No skills to display yet</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: categoryIndex * 0.15, duration: 0.6 }}
                  data-testid={`category-${category.toLowerCase()}`}
                >
                  <motion.h3 
                    className="text-2xl font-serif font-semibold mb-6 text-foreground"
                    whileHover={{ x: 10, color: "hsl(var(--primary))" }}
                    transition={{ duration: 0.3 }}
                  >
                    {category}
                  </motion.h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: categoryIndex * 0.15 + skillIndex * 0.05, duration: 0.4 }}
                        whileHover={{ 
                          scale: 1.02,
                          x: 5,
                          transition: { duration: 0.2 }
                        }}
                        className="bg-card border border-card-border rounded-lg p-4 hover-elevate active-elevate-2 cursor-pointer group"
                        data-testid={`skill-${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-sans font-medium text-foreground group-hover:text-primary transition-colors">
                            {skill.name}
                          </span>
                          <motion.span 
                            className="text-xs text-muted-foreground font-mono capitalize px-2 py-1 rounded-md bg-primary/10"
                            whileHover={{ scale: 1.1 }}
                          >
                            {skill.proficiency}
                          </motion.span>
                        </div>
                        <div className="relative w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r from-primary to-[#ff6b35] ${proficiencyWidth(skill.proficiency)}`}
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${proficiencyPercentage(skill.proficiency)}%` } : {}}
                            transition={{ delay: categoryIndex * 0.15 + skillIndex * 0.05 + 0.3, duration: 0.8 }}
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2, 
                              delay: categoryIndex * 0.15 + skillIndex * 0.05 + 1,
                              repeatDelay: 3
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
