import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { MobileNav } from '@/components/MobileNav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, Gamepad2 } from 'lucide-react';

export default function GamesPage() {
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  const { data: steamData, isLoading } = useQuery<any>({
    queryKey: ['/api/steam/profile'],
    enabled: !!settings?.steamProfileId,
  });

  const steamProfileUrl = settings?.steamProfileId 
    ? `https://steamcommunity.com/id/${settings.steamProfileId}/`
    : 'https://steamcommunity.com/id/Snozxyx/';

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
              Gaming Profile
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              My gaming journey and library from Steam
            </p>
            <Button asChild variant="outline">
              <a href={steamProfileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Steam Profile
              </a>
            </Button>
          </div>

          {/* Steam Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-card-border rounded-xl p-8 mb-8"
          >
            <div className="flex items-center gap-6 mb-6">
              <Gamepad2 className="w-16 h-16 text-primary" />
              <div>
                <h2 className="text-2xl font-serif font-bold mb-2">Steam Profile</h2>
                <p className="text-muted-foreground">
                  Connect with me on Steam to see my full gaming library
                </p>
              </div>
            </div>

            {steamData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Total Games</p>
                  <p className="text-3xl font-bold">{steamData.gameCount || 0}</p>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Hours Played</p>
                  <p className="text-3xl font-bold">{steamData.totalHours || 0}h</p>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Level</p>
                  <p className="text-3xl font-bold">{steamData.level || 0}</p>
                </div>
              </div>
            ) : (
              <div className="bg-background rounded-lg p-6 border border-border text-center">
                <p className="text-muted-foreground">
                  Steam profile data will be displayed here. Configure your Steam ID in the admin dashboard.
                </p>
              </div>
            )}
          </motion.div>

          {/* Games List */}
          {steamData?.recentGames && steamData.recentGames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">Recently Played</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {steamData.recentGames.map((game: any, index: number) => (
                  <motion.div
                    key={game.appid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-card border border-card-border rounded-xl overflow-hidden hover-elevate"
                  >
                    {game.img_logo_url && (
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                        <img
                          src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`}
                          alt={game.name}
                          className="w-full h-full object-contain p-4"
                        />
                      </div>
                    )}
                    
                    <div className="p-4">
                      <h3 className="text-lg font-serif font-bold mb-2 line-clamp-1">
                        {game.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{Math.round(game.playtime_forever / 60)} hours total</span>
                      </div>

                      {game.playtime_2weeks && (
                        <Badge variant="outline" className="mt-2">
                          {Math.round(game.playtime_2weeks / 60)}h last 2 weeks
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Placeholder when no data */}
          {(!steamData || !steamData.recentGames || steamData.recentGames.length === 0) && (
            <div className="text-center py-16 bg-card border border-card-border rounded-xl">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No recent games to display. Visit my Steam profile to see my full library!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
