import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { MobileNav } from '@/components/MobileNav';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { StatsSection } from '@/components/StatsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { SkillsSection } from '@/components/SkillsSection';
import { BlogWidget } from '@/components/BlogWidget';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { SEO } from '@/components/SEO';

export default function Home() {
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const { data: siteSettings } = useQuery({
    queryKey: ['/api/settings'],
  });

  const hasProjects = projects && projects.length > 0;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SEO 
        title={siteSettings?.siteTitle || 'Snozxyx Portfolio'}
        description={siteSettings?.siteDescription || 'Full-stack developer, gamer, and tech enthusiast'}
        image={siteSettings?.ogImage || '/og-image.jpg'}
      />
      <ParticleBackground />
      <FloatingNav />
      <MobileNav />
      <HeroSection />
      <AboutSection />
      <StatsSection />
      {hasProjects || projectsLoading ? (
        <ProjectsSection projects={projects} isLoading={projectsLoading} />
      ) : (
        <section id="projects" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">No Projects Yet</h2>
            <p className="text-muted-foreground">Check back soon for exciting projects!</p>
          </div>
        </section>
      )}
      <SkillsSection />
      <BlogWidget />
      <ContactSection />
      <Footer />
    </div>
  );
}