import React, { useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { type BasketballStats } from '../types/basketballStats';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchPlayerImage } from '../data/mockData';
import { TrendingUp, Target, Users, Shield } from 'lucide-react';

interface PlayerCardProps {
  player: BasketballStats;
}

const PlayerCard = React.memo(({ player }: PlayerCardProps) => {
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch player image when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadPlayerImage = async () => {
      try {
        // Add random delay to stagger requests (0-2 seconds)
        const delay = Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Check if component is still mounted before making request
        if (!isMounted) return;
        
        const imageUrl = await fetchPlayerImage(player.player_name);
        
        // Check again before setting state
        if (isMounted) {
          setPlayerImage(imageUrl);
        }
      } catch (error) {
        if (isMounted) {
          console.warn(`Failed to load image for ${player.player_name}:`, error);
          setPlayerImage(null);
        }
      }
    };

    loadPlayerImage();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [player.player_name]);

  // Helper function to safely format numbers
  const formatNumber = (value: number | null, decimals: number = 1): string => {
    if (value === null || value === undefined) return 'N/A';
    return value.toFixed(decimals);
  };

  // Helper function to format percentages
  const formatPercent = (value: number | null, decimals: number = 1): string => {
    if (value === null || value === undefined) return 'N/A';
    return `${(value * 100).toFixed(decimals)}%`;
  };

  // Memoize expensive calculations
  const playerStats = useMemo(() => {
    const totalReboundingPercent = player.ORB_per + player.DRB_per;
    
    let developmentPriority = "Development Focus: Consistency";
    if (player.TO_per > 20) developmentPriority = "Development Focus: Ball Security";
    else if (player.eFG < 45) developmentPriority = "Development Focus: Shot Selection";
    else if (player.AST_per < 10) developmentPriority = "Development Focus: Playmaking";
    else if (totalReboundingPercent < 15) developmentPriority = "Development Focus: Rebounding";
    
    return {
      totalReboundingPercent,
      developmentPriority
    };
  }, [player.TO_per, player.eFG, player.AST_per, player.ORB_per, player.DRB_per]);

  const handleCardClick = () => {
    navigate(`/player/${player.pid}`);
  };

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer border-gray-200 hover:border-gray-300"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            {/* Player Image */}
            <div className="flex-shrink-0">
              {playerImage ? (
                <img 
                  src={playerImage} 
                  alt={player.player_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTMyIDMzQzM2LjQxODMgMzMgNDAgMjkuNDE4MyA0MCAyNUM0MCAyMC41ODE3IDM2LjQxODMgMTcgMzIgMTdDMjcuNTgxNyAxNyAyNCAyMC41ODE3IDI0IDI1QzI0IDI5LjQxODMgMjcuNTgxNyAzMyAzMiAzM1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2IDQ4QzE2IDQwLjI2ODEgMjIuMjY4MSAzNCAzMCAzNEgzNEM0MS43MzE5IDM0IDQ4IDQwLjI2ODEgNDggNDhWNTJIMTZWNDhaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-100 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#9CA3AF"/>
                    <path d="M12 14C16.4183 14 20 17.5817 20 22H4C4 17.5817 7.58172 14 12 14Z" fill="#9CA3AF"/>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 truncate">{player.player_name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {player.team} • {player.conf}
              </p>
              <p className="text-sm text-gray-500">
                {player.role}
              </p>
            </div>
          </div>
          
          {/* Class Year Badge */}
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-0">
            {player.yr}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Production */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">Production</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">PPG</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(player.pts)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">BPM</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(player.bpm)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Min%</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(player.Min_per)}</span>
              </div>
            </div>
          </div>

          {/* Shooting */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">Shooting</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">eFG%</span>
                <span className="text-sm font-semibold text-gray-900">{formatPercent(player.eFG / 100)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">3P%</span>
                <span className="text-sm font-semibold text-gray-900">{formatPercent(player.TP_per)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">FT%</span>
                <span className="text-sm font-semibold text-gray-900">{formatPercent(player.FT_per)}</span>
              </div>
            </div>
          </div>

          {/* Playmaking */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">Playmaking</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">AST%</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(player.AST_per)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">TO%</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(player.TO_per)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">AST/TO</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(player.astTov)}</span>
              </div>
            </div>
          </div>

          {/* Defense & Impact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">Defense</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">STL%</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(player.stl_per)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">TRB%</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(playerStats.totalReboundingPercent)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Usage%</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(player.usg)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Development Priority */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Badge variant="outline" className="text-gray-600 border-gray-300 bg-gray-50">
            {playerStats.developmentPriority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
});

export default PlayerCard; 