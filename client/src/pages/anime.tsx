import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { MobileNav } from '@/components/MobileNav';
import { Badge } from '@/components/ui/badge';
import { Play, Star } from 'lucide-react';
import type { AnimeEntry } from '@shared/schema';

export default function AnimePage() {
  const { data: animeList = [], isLoading } = useQuery<AnimeEntry[]>({
    queryKey: ['/api/anime'],
  });

  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  const completedCount = animeList.filter(a => a.status === 'completed').length;
  const watchingCount = animeList.filter(a => a.status === 'watching').length;

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <ParticleBackground />
        <FloatingNav />
        <MobileNav />
        <div className="container mx-auto px-4 md:px-6 py-32">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ParticleBackground />
      <FloatingNav />
      <MobileNav />

      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              Anime Collection
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              My anime watching journey and favorites
            </p>
            <div className="flex gap-4">
              <Badge variant="outline" className="text-sm">
                Completed: {completedCount}
              </Badge>
              <Badge variant="outline" className="text-sm">
                Watching: {watchingCount}
              </Badge>
              <Badge variant="outline" className="text-sm">
                Total: {animeList.length}
              </Badge>
            </div>
          </div>

          {animeList.length === 0 ? (
            <div className="text-center py-16 bg-card border border-card-border rounded-xl">
              <p className="text-muted-foreground">No anime entries yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animeList.map((anime, index) => (
                <motion.div
                  key={anime.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-card-border rounded-xl overflow-hidden hover-elevate"
                >
                  {anime.imageUrl && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={anime.imageUrl}
                        alt={anime.name}
                        className="w-full h-full object-cover"
                      />
                      {(anime.videoUrl || anime.clipUrl) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-serif font-bold flex-1">
                        {anime.name}
                      </h3>
                      {anime.rating && (
                        <div className="flex items-center gap-1 ml-2">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-semibold">{anime.rating}/10</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant={anime.status === 'completed' ? 'default' : 'secondary'}>
                        {anime.status === 'completed' ? 'Completed' : 
                         anime.status === 'watching' ? 'Watching' : 'Plan to Watch'}
                      </Badge>
                      {anime.episodes && (
                        <Badge variant="outline">{anime.episodes} Episodes</Badge>
                      )}
                    </div>

                    {anime.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {anime.notes}
                      </p>
                    )}

                    {(anime.videoUrl || anime.clipUrl) && (
                      <div className="mt-4 pt-4 border-t border-border">
                        {anime.videoUrl && (
                          <a
                            href={anime.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Watch Full
                          </a>
                        )}
                        {anime.clipUrl && anime.videoUrl && <span className="mx-2">•</span>}
                        {anime.clipUrl && (
                          <a
                            href={anime.clipUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Watch Clip
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
