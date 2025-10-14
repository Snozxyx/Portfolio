import { motion } from 'framer-motion';
import { useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@shared/schema';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      data-testid={`card-project-${index}`}
    >
      <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-card-border overflow-hidden h-full flex flex-col">
        {/* Animated Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,107,53,0.3) 50%, rgba(255,255,255,0.3) 100%)',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs font-mono bg-secondary/50 text-primary border-primary/20"
                data-testid={`badge-tech-${tech.toLowerCase()}`}
              >
                {tech}
              </Badge>
            ))}
          </div>

          <h3 className="text-2xl font-serif font-bold text-foreground mb-3" data-testid={`text-project-name-${index}`}>
            {project.name}
          </h3>
          <p className="text-muted-foreground font-sans mb-4 flex-grow" data-testid={`text-project-description-${index}`}>
            {project.description}
          </p>

          {/* Animated Features List */}
          <motion.div className="space-y-2 mb-6">
            {project.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isHovered ? 1 : 0.7, x: isHovered ? 0 : -20 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="flex items-center text-sm text-muted-foreground font-sans"
              >
                <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full mr-3" />
                {feature}
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive Buttons */}
          <div className="flex gap-3 mt-auto">
            {project.githubUrl && (
              <Button
                variant="default"
                size="sm"
                className="font-sans flex-1"
                asChild
                data-testid={`button-github-${index}`}
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button
                variant="outline"
                size="sm"
                className="font-sans flex-1"
                asChild
                data-testid={`button-live-${index}`}
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
