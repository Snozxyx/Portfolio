import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Film, Play, Star, ArrowRight } from 'lucide-react';
import type { AnimeEntry } from '@shared/schema';

export function AnimeWidget() {
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  const { data: animeList = [] } = useQuery<AnimeEntry[]>({
    queryKey: ['/api/anime'],
    enabled: settings?.showAnimeWidget,
  });

  // Don't render if widget is disabled
  if (!settings?.showAnimeWidget) {
    return null;
  }

  // Show only completed or currently watching anime, max 3
  const displayAnime = animeList
    .filter(a => a.status === 'completed' || a.status === 'watching')
    .slice(0, 3);

  if (displayAnime.length === 0) {
    return null;
  }

  return (
    <section id="anime" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                Anime Collection
              </h2>
              <p className="text-lg text-muted-foreground">
                Currently watching and completed series
              </p>
            </div>
            {settings?.showAnimePage && (
              <Button asChild variant="outline">
                <Link href="/anime">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayAnime.map((anime, index) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-card-border rounded-xl overflow-hidden hover-elevate group"
              >
                {anime.imageUrl && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={anime.imageUrl}
                      alt={anime.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {(anime.videoUrl || anime.clipUrl) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Film className="w-12 h-12 text-white" />
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

                  <div className="flex flex-wrap gap-2">
                    <Badge variant={anime.status === 'completed' ? 'default' : 'secondary'}>
                      {anime.status === 'completed' ? 'Completed' : 'Watching'}
                    </Badge>
                    {anime.episodes && (
                      <Badge variant="outline">{anime.episodes} Episodes</Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
