import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Gamepad2, ExternalLink, ArrowRight } from 'lucide-react';

export function GamesWidget() {
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  const { data: steamData } = useQuery<any>({
    queryKey: ['/api/steam/profile'],
    enabled: settings?.showGamesWidget && !!settings?.steamProfileId,
  });

  // Don't render if widget is disabled
  if (!settings?.showGamesWidget) {
    return null;
  }

  const steamProfileUrl = settings?.steamProfileId 
    ? `https://steamcommunity.com/id/${settings.steamProfileId}/`
    : 'https://steamcommunity.com/id/Snozxyx/';

  return (
    <section id="games" className="py-20 px-4 sm:px-6 lg:px-8">
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
                Gaming Profile
              </h2>
              <p className="text-lg text-muted-foreground">
                My gaming journey on Steam
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <a href={steamProfileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Steam
                </a>
              </Button>
              {settings?.showGamesPage && (
                <Button asChild>
                  <Link href="/games">
                    View Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-card-border rounded-xl p-8"
          >
            <div className="flex items-center gap-6 mb-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <Gamepad2 className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold mb-2">Steam Profile</h3>
                <p className="text-muted-foreground">
                  Connect with me on Steam to see my full gaming library
                </p>
              </div>
            </div>

            {steamData && (steamData.gameCount > 0 || steamData.totalHours > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background rounded-lg p-6 border border-border text-center">
                  <p className="text-sm text-muted-foreground mb-2">Total Games</p>
                  <p className="text-4xl font-bold text-primary">{steamData.gameCount || 0}</p>
                </div>
                <div className="bg-background rounded-lg p-6 border border-border text-center">
                  <p className="text-sm text-muted-foreground mb-2">Hours Played</p>
                  <p className="text-4xl font-bold text-primary">{steamData.totalHours || 0}h</p>
                </div>
                <div className="bg-background rounded-lg p-6 border border-border text-center">
                  <p className="text-sm text-muted-foreground mb-2">Level</p>
                  <p className="text-4xl font-bold text-primary">{steamData.level || 0}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Steam profile statistics will appear here
                </p>
                <Button asChild variant="outline">
                  <a href={steamProfileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Steam Profile
                  </a>
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
