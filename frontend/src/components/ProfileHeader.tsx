import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { fetchPlayerImage } from '../data/mockData';
import { type BasketballStats } from '../types/basketballStats';

interface ProfileHeaderProps {
  player: BasketballStats;
}

export default function ProfileHeader({ player }: ProfileHeaderProps) {
  const [playerImageUrl, setPlayerImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate per-game stats
  const reboundsPerGame = (player.treb); // Total rebounds per game
  const blocksPerGame = (player.blk); // Blocks per game
  const assistsPerGame = (player.ast); // Assists per game
  const stealsPerGame = (player.stl); // Steals per game

  // Fetch player image on component mount
  useEffect(() => {
    const loadPlayerImage = async () => {
      setImageLoading(true);
      const imageUrl = await fetchPlayerImage(player.player_name);
      setPlayerImageUrl(imageUrl);
      setImageLoading(false);
    };

    loadPlayerImage();
  }, [player.player_name]);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {playerImageUrl && !imageLoading ? (
              // Real player image
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
                <img 
                  src={playerImageUrl} 
                  alt={player.player_name}
                  className="w-full h-full object-cover"
                  onError={() => setPlayerImageUrl(null)} // Fallback if image fails to load
                />
              </div>
            ) : (
              // Fallback to initials avatar
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {imageLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                ) : (
                  getInitials(player.player_name)
                )}
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {player.player_name}
                </h1>
                <div className="space-y-1">
                  <p className="text-lg text-muted-foreground">
                    {player.team} • {player.conf}
                  </p>
                  <p className="text-md text-muted-foreground">
                    {player.role}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-col gap-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {player.yr}
                </Badge>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {player.ht}
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <Card className="mt-4 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center h-2">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {player.GP}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Games
                    </div>
                  </div>
                  
                  <div className="h-12 w-px bg-border"></div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground mb-1">
                      {player.pts.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      PPG
                    </div>
                  </div>
                  
                  <div className="h-12 w-px bg-border"></div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground mb-1">
                      {assistsPerGame.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      AST
                    </div>
                  </div>
                  
                  <div className="h-12 w-px bg-border"></div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground mb-1">
                      {reboundsPerGame.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      REB
                    </div>
                  </div>
                  
                  <div className="h-12 w-px bg-border"></div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground mb-1">
                      {stealsPerGame.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      STL
                    </div>
                  </div>
                  
                  <div className="h-12 w-px bg-border"></div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground mb-1">
                      {blocksPerGame.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      BLK
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 