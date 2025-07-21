import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../src/components/ui/button';
import { Spinner } from '../src/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';
import { fetchPlayerByPid } from '../src/data/mockData';
import { type BasketballStats } from '../src/types/basketballStats';
import ProfileHeader from '../src/components/ProfileHeader';
import StrengthWeakness from '../src/components/StrengthWeakness';
import PlayerStatsTabs from '../src/components/PlayerStatsTabs';
import PlayerProgression from '../src/components/PlayerProgression';
import Development from '../src/components/Development';
import { Card, CardContent } from '../src/components/ui/card';


const PlayerProfile = () => {
  const { pid } = useParams<{ pid: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<BasketballStats | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const loadPlayer = async () => {
      if (!pid) return;
      
      try {
        setLoading(true);
        const playerData = await fetchPlayerByPid(parseInt(pid));
        setPlayer(playerData);
      } catch (error) {
        console.error('Error loading player:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayer();
  }, [pid]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 mt-16">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-lg text-gray-600">Loading player...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen p-6 mt-16">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-lg text-gray-600">Player not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen p-6 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-white hover:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Player Header Component */}
        <ProfileHeader player={player} />

        {/* Low Sample Size Disclaimer */}
        {(player.Min_per < 15 || player.GP < 15) && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-amber-600 text-lg">⚠️</span>
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">
                    Limited Sample Size
                  </h3>
                  <p className="text-sm text-amber-700">
                    {player.Min_per < 15 && player.GP < 15 
                      ? `This player has limited playing time (${player.Min_per.toFixed(1)} min) and few games played (${player.GP} games). Statistics may not be representative of full performance potential.`
                      : player.Min_per < 15 
                      ? `This player has limited playing time (${player.Min_per.toFixed(1)} min). Statistics may not be representative of full performance potential.`
                      : `This player has played in few games (${player.GP} games). Statistics may not be representative of full performance potential.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Stats */}
        <div className="flex flex-col gap-6">
          {/* Strengths and Weaknesses */}
          <StrengthWeakness player={player} />

          {/* Player Progression */}
          <PlayerProgression playerName={player.player_name} />

          {/* Player Stats Tabs */}
          <PlayerStatsTabs player={player} />
        </div>
        <Development />
      </div>
    </div>
  );
};

export default PlayerProfile;