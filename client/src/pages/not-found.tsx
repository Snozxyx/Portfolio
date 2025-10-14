import { motion } from 'framer-motion';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center">
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-6 text-center z-10"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-serif font-bold text-primary">
            404
          </h1>
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
          Page Not Found
        </h2>
        
        <div className="bg-card border border-card-border rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <p className="text-lg text-muted-foreground text-left">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4" />
              Visit Blog
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
