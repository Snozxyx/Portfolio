import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ThumbsUp, Flame, Lightbulb, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReactionButtonProps {
  postId: string;
  initialReactions?: Record<string, number>;
  onReact?: (reaction: string) => void;
}

const reactions = [
  { id: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-400' },
  { id: 'love', icon: Heart, label: 'Love', color: 'text-red-400' },
  { id: 'fire', icon: Flame, label: 'Fire', color: 'text-orange-400' },
  { id: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-yellow-400' },
  { id: 'star', icon: Star, label: 'Star', color: 'text-primary' },
];

export const ReactionButton = ({ 
  postId, 
  initialReactions = {}, 
  onReact 
}: ReactionButtonProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [reactionCounts, setReactionCounts] = useState(initialReactions);

  const handleReaction = (reactionId: string) => {
    setReactionCounts(prev => ({
      ...prev,
      [reactionId]: (prev[reactionId] || 0) + 1,
    }));
    setShowPicker(false);
    onReact?.(reactionId);
  };

  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPicker(!showPicker)}
        className="gap-2"
        data-testid="button-reactions"
      >
        <Heart className="w-4 h-4" />
        {totalReactions > 0 ? totalReactions : 'React'}
      </Button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 bg-card border border-card-border rounded-xl p-2 shadow-xl z-10"
          >
            <div className="flex gap-2">
              {reactions.map((reaction) => (
                <motion.button
                  key={reaction.id}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction(reaction.id)}
                  className={`p-2 rounded-lg hover:bg-primary/10 transition-colors group ${reaction.color}`}
                  title={reaction.label}
                >
                  <reaction.icon className="w-5 h-5" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {totalReactions > 0 && (
        <div className="flex gap-1 mt-2 text-xs text-muted-foreground">
          {reactions.map((reaction) => {
            const count = reactionCounts[reaction.id];
            if (!count) return null;
            return (
              <span key={reaction.id} className="flex items-center gap-1">
                <reaction.icon className={`w-3 h-3 ${reaction.color}`} />
                {count}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
