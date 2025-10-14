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

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ParticleBackground />
      <FloatingNav />
      <MobileNav />
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <ProjectsSection />
      <SkillsSection />
      <BlogWidget />
      <ContactSection />
      <Footer />
    </div>
  );
}
