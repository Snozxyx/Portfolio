import { useQuery } from '@tanstack/react-query';
import { X, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Announcement } from '@shared/schema';

export const AnnouncementBanner = () => {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ['/api/announcements', 'active'],
    queryFn: async () => {
      const res = await fetch('/api/announcements?active=true');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const visibleAnnouncements = announcements
    .filter(a => a.displayType === 'banner' && !dismissed.includes(a.id))
    .slice(0, 1); // Show only one banner at a time

  if (visibleAnnouncements.length === 0) return null;

  const announcement = visibleAnnouncements[0];

  const getIcon = () => {
    switch (announcement.type) {
      case 'alert':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClass = () => {
    switch (announcement.type) {
      case 'alert':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`w-full border ${getColorClass()} py-3 px-4 flex items-center justify-between gap-4 z-40`}
      >
        <div className="flex items-center gap-3 flex-1">
          {getIcon()}
          <div className="flex-1">
            <p className="font-semibold text-sm">{announcement.title}</p>
            <p className="text-xs opacity-90">{announcement.message}</p>
          </div>
        </div>
        <button
          onClick={() => setDismissed([...dismissed, announcement.id])}
          className="hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
