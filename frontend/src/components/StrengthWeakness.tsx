import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Spinner } from './ui/spinner';
import { 
  calculateAllPositionAverages,
  type PositionAverages, 
  type DefensivePositionAverages,
  type PlaymakingPositionAverages,
  type OffensivePositionAverages,
  getSimplifiedPosition
} from '../data/StatAvg';
import { useEffect, useState } from 'react';
import type { BasketballStats } from '../types/basketballStats';

// Helper function to determine position based on role - using the same logic as StatAvg.tsx
const getPositionFromRole = (role: string): 'G' | 'F' | 'C' => {
  const position = getSimplifiedPosition(role);
  return (position as 'G' | 'F' | 'C') || 'C'; // Default to 'C' if no match
};

const SIGNIFICANT_FACTOR = 1.1; // 10% better or worse than average
const NEGLIGIBLE_FACTOR = 0.9;

// For stats where higher is better (e.g., points, percentages)
const isStrength = (playerStat: number, avgStat: number): boolean => {
  return playerStat > avgStat * SIGNIFICANT_FACTOR;
};

const isWeakness = (playerStat: number, avgStat: number): boolean => {
  return playerStat < avgStat * NEGLIGIBLE_FACTOR && playerStat !== 0;
};

// For stats where lower is better (e.g., turnovers, defensive rating)
const isNegativeStrength = (playerStat: number, avgStat: number): boolean => {
  return playerStat < avgStat * NEGLIGIBLE_FACTOR;
};

const isNegativeWeakness = (playerStat: number, avgStat: number): boolean => {
  return playerStat > avgStat * SIGNIFICANT_FACTOR && playerStat !== 0;
};

export default function StrengthWeakness({ 
  player, 
  onWeaknessesChange 
}: { 
  player: BasketballStats;
  onWeaknessesChange?: (weaknesses: Array<{text: string, stat: string, avgStat: string}>) => void;
}) {
  const [allAverages, setAllAverages] = useState<{
    shooting: PositionAverages;
    defensive: DefensivePositionAverages;
    playmaking: PlaymakingPositionAverages;
    offensive: OffensivePositionAverages;
  } | null>(null);
  const [dynamicStrengths, setDynamicStrengths] = useState<Array<{text: string, stat: string, avgStat: string}>>([]);
  const [dynamicWeaknesses, setDynamicWeaknesses] = useState<Array<{text: string, stat: string, avgStat: string}>>([]);
  const [loading, setLoading] = useState(true);

  // Single API call to get all averages
  useEffect(() => {
    const fetchAllAverages = async () => {
      try {
        setLoading(true);
        const averages = await calculateAllPositionAverages();
        setAllAverages(averages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching averages:', error);
        setLoading(false);
      }
    };
    fetchAllAverages();
  }, []);

  // Calculate dynamic strengths and weaknesses when data is available
  useEffect(() => {
    if (player && allAverages) {
      const position = getPositionFromRole(player.role);
      const positionShootingAvg = allAverages.shooting[position];
      const positionDefensiveAvg = allAverages.defensive[position];
      const positionPlaymakingAvg = allAverages.playmaking[position];
      const positionOffensiveAvg = allAverages.offensive[position];
      
      const newStrengths: Array<{text: string, stat: string, avgStat: string}> = [];
      const newWeaknesses: Array<{text: string, stat: string, avgStat: string}> = [];
      
      // Three-point percentage comparison
      if (isStrength(player.TP_per, positionShootingAvg.TP_per)) {
        newStrengths.push({
          text: "Strong 3-point shooter",
          stat: `${(player.TP_per * 100).toFixed(1)}%`,
          avgStat: `Position Avg: ${(positionShootingAvg.TP_per * 100).toFixed(1)}%`
        });
      } else if (isWeakness(player.TP_per, positionShootingAvg.TP_per)) {
        newWeaknesses.push({
          text: "Below-average 3-point shooter",
          stat: `${(player.TP_per * 100).toFixed(1)}%`,
          avgStat: `Position Avg: ${(positionShootingAvg.TP_per * 100).toFixed(1)}%`
        });
      }
      
      // Free throw percentage comparison
      if (isStrength(player.FT_per, positionShootingAvg.FT_per)) {
        newStrengths.push({
          text: "Strong free throw shooter",
          stat: `${(player.FT_per * 100).toFixed(1)}%`,
          avgStat: `Position Avg: ${(positionShootingAvg.FT_per * 100).toFixed(1)}%`
        });
      } else if (isWeakness(player.FT_per, positionShootingAvg.FT_per)) {
        newWeaknesses.push({
          text: "Below-average free throw shooter",
          stat: `${(player.FT_per * 100).toFixed(1)}%`,
          avgStat: `Position Avg: ${(positionShootingAvg.FT_per * 100).toFixed(1)}%`
        });
      }

      // Steal percentage comparison
      if (isStrength(player.stl_per, positionDefensiveAvg.stl_per)) {
        newStrengths.push({
          text: "Excellent steal rate",
          stat: `${player.stl_per.toFixed(1)}%`,
          avgStat: `Position Avg: ${positionDefensiveAvg.stl_per.toFixed(1)}%`
        });
      } else if (isWeakness(player.stl_per, positionDefensiveAvg.stl_per)) {
        newWeaknesses.push({
          text: "Below-average steal rate",
          stat: `${player.stl_per.toFixed(1)}%`,
          avgStat: `Position Avg: ${positionDefensiveAvg.stl_per.toFixed(1)}%`
        });
      }

      // Defensive rating comparison (lower is better)
      if (isNegativeStrength(player.drtg, positionDefensiveAvg.drtg)) {
        newStrengths.push({
          text: "Strong defensive impact",
          stat: `${player.drtg.toFixed(1)} DRtg`,
          avgStat: `Position Avg: ${positionDefensiveAvg.drtg.toFixed(1)} DRtg`
        });
      } else if (isNegativeWeakness(player.drtg, positionDefensiveAvg.drtg)) {
        newWeaknesses.push({
          text: "Below-average defensive impact",
          stat: `${player.drtg.toFixed(1)} DRtg`,
          avgStat: `Position Avg: ${positionDefensiveAvg.drtg.toFixed(1)} DRtg`
        });
      }

      // Assist percentage comparison (higher is better)
      if (isStrength(player.AST_per, positionPlaymakingAvg.AST_per)) {
        newStrengths.push({
          text: "Excellent playmaker",
          stat: `${player.AST_per.toFixed(1)}% AST`,
          avgStat: `Position Avg: ${positionPlaymakingAvg.AST_per.toFixed(1)}% AST`
        });
      } else if (isWeakness(player.AST_per, positionPlaymakingAvg.AST_per)) {
        newWeaknesses.push({
          text: "Below-average playmaking",
          stat: `${player.AST_per.toFixed(1)}% AST`,
          avgStat: `Position Avg: ${positionPlaymakingAvg.AST_per.toFixed(1)}% AST`
        });
      }

      // Turnover percentage comparison (lower is better)
      if (isNegativeStrength(player.TO_per, positionPlaymakingAvg.TO_per)) {
        newStrengths.push({
          text: "Great ball security",
          stat: `${player.TO_per.toFixed(1)}% TO`,
          avgStat: `Position Avg: ${positionPlaymakingAvg.TO_per.toFixed(1)}% TO`
        });
      } else if (isNegativeWeakness(player.TO_per, positionPlaymakingAvg.TO_per)) {
        newWeaknesses.push({
          text: "High turnover rate",
          stat: `${player.TO_per.toFixed(1)}% TO`,
          avgStat: `Position Avg: ${positionPlaymakingAvg.TO_per.toFixed(1)}% TO`
        });
      }

      // Offensive rating comparison (higher is better)
      if (isStrength(player.ORtg, positionOffensiveAvg.ORtg)) {
        newStrengths.push({
          text: "Strong offensive efficiency",
          stat: `${player.ORtg.toFixed(1)} ORtg`,
          avgStat: `Position Avg: ${positionOffensiveAvg.ORtg.toFixed(1)} ORtg`
        });
      } else if (isWeakness(player.ORtg, positionOffensiveAvg.ORtg)) {
        newWeaknesses.push({
          text: "Below-average offensive efficiency",
          stat: `${player.ORtg.toFixed(1)} ORtg`,
          avgStat: `Position Avg: ${positionOffensiveAvg.ORtg.toFixed(1)} ORtg`
        });
      }

      // Usage rate comparison (higher is better)
      if (isStrength(player.usg, positionOffensiveAvg.usg)) {
        newStrengths.push({
          text: "High offensive involvement",
          stat: `${player.usg.toFixed(1)}% USG`,
          avgStat: `Position Avg: ${positionOffensiveAvg.usg.toFixed(1)}% USG`
        });
      } else if (isWeakness(player.usg, positionOffensiveAvg.usg)) {
        newWeaknesses.push({
          text: "Limited offensive role",
          stat: `${player.usg.toFixed(1)}% USG`,
          avgStat: `Position Avg: ${positionOffensiveAvg.usg.toFixed(1)}% USG`
        });
      }
      
      setDynamicStrengths(newStrengths);
      setDynamicWeaknesses(newWeaknesses);
      
      // Pass weaknesses to parent component if callback provided
      if (onWeaknessesChange) {
        onWeaknessesChange(newWeaknesses);
      }
    }
  }, [player, allAverages, onWeaknessesChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Player Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="lg" />
            <p className="text-sm text-gray-600 mt-3">Analyzing player...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Strengths Section */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">✅</span>
                <h3 className="font-semibold text-green-700 uppercase tracking-wide">
                  Strengths
                </h3>
              </div>
              <div className="space-y-2">
                {dynamicStrengths.length > 0 ? (
                  dynamicStrengths.map((strength, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">
                          {strength.text}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {strength.stat}
                          </Badge>
                          <span className="text-xs text-green-600 font-medium">
                            {strength.avgStat}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No significant strengths identified</p>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block">
              <Separator orientation="vertical" className="h-full" />
            </div>
            <div className="md:hidden">
              <Separator orientation="horizontal" />
            </div>

            {/* Weaknesses Section */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚠️</span>
                <h3 className="font-semibold text-amber-700 uppercase tracking-wide">
                  Weaknesses
                </h3>
              </div>
              <div className="space-y-2">
                {dynamicWeaknesses.length > 0 ? (
                  dynamicWeaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">
                          {weakness.text}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="destructive" className="text-xs">
                            {weakness.stat}
                          </Badge>
                          <span className="text-xs text-red-600 font-medium">
                            {weakness.avgStat}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No significant weaknesses identified</p>
                )}
              </div>
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  );
}