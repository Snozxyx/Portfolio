import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    
    // Simulate API call - in real implementation, this would call your backend
    setTimeout(() => {
      toast({
        title: 'Subscribed!',
        description: 'You\'ll receive updates about new posts.',
      });
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-card via-card to-primary/5 border border-card-border rounded-xl p-8"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold mb-2">Stay Updated</h3>
          <p className="text-sm text-muted-foreground font-sans">
            Get notified about new posts, updates, and exclusive content directly to your inbox.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="font-sans"
          data-testid="input-newsletter-email"
        />
        <Button
          type="submit"
          disabled={loading || !email}
          className="shrink-0"
          data-testid="button-newsletter-submit"
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-4 font-sans">
        No spam, unsubscribe anytime. Your data is safe with us.
      </p>
    </motion.div>
  );
};
