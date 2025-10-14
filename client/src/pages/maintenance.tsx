
import { motion } from 'framer-motion';
import { AlertCircle, Wrench } from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';

interface MaintenancePageProps {
  message?: string;
}

export default function MaintenancePage({ message }: MaintenancePageProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center">
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-6 text-center z-10"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="inline-block mb-8"
        >
          <Wrench className="w-24 h-24 text-primary" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
          Under Maintenance
        </h1>
        
        <div className="bg-card border border-card-border rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <p className="text-lg text-muted-foreground text-left">
              {message || "We're currently performing maintenance. Please check back soon."}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Thank you for your patience!
        </p>
      </motion.div>
    </div>
  );
}
