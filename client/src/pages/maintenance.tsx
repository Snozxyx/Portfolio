
import { motion } from 'framer-motion';
import { AlertCircle, Wrench, Home } from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface MaintenancePageProps {
  message?: string;
}

export default function MaintenancePage({ message }: MaintenancePageProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-6 text-center z-10 relative"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.05, 1, 1.05, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatDelay: 2,
            ease: "easeInOut"
          }}
          className="inline-block mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <Wrench className="w-32 h-32 text-primary relative" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
        >
          Under Maintenance
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/80 backdrop-blur-sm border border-card-border rounded-2xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0" />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-xl font-semibold mb-2">We'll be back soon!</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {message || "We're currently performing maintenance to improve your experience. Please check back soon."}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground mb-6">
            Thank you for your patience and understanding!
          </p>
          
          <Button
            onClick={() => setLocation('/')}
            size="lg"
            className="group"
          >
            <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Try Homepage
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>Working on improvements</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
