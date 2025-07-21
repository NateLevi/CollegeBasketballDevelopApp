import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Spinner } from './ui/spinner';
import { type BasketballStats } from '../types/basketballStats';
import { getSimplifiedPosition } from '../data/StatAvg';
import { API_ENDPOINTS } from '../config/api';

interface PlayerProgressionProps {
  playerName: string;
}

const PlayerProgression = ({ playerName }: PlayerProgressionProps) => {
  const [progression, setProgression] = useState<BasketballStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgression = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(API_ENDPOINTS.playerProgression(playerName));
        const data = await response.json();
        
        if (data.success) {
          setProgression(data.progression);
        } else {
          setError('Failed to fetch progression data');
        }
      } catch (err) {
        console.error('Error fetching progression:', err);
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (playerName) {
      fetchProgression();
    }
  }, [playerName]);

  const getTrendIcon = (current: number, previous: number | undefined, higherIsBetter: boolean = true) => {
    if (previous === undefined) return <Minus className="h-4 w-4 text-gray-400" />;
    
    const isImprovement = higherIsBetter ? current > previous : current < previous;
    const difference = Math.abs(current - previous);
    
    // Only show trend if difference is significant (>2% change)
    if (difference / previous < 0.02) {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
    
    return isImprovement ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const formatStat = (value: number, isPercentage: boolean = false): string => {
    if (isPercentage) {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toFixed(1);
  };

  const getYearLabel = (year: number): string => {
    const academicYear = `${year - 1}-${year.toString().slice(-2)}`;
    return academicYear;
  };

  // Determine player position from most recent season
  const getPlayerPosition = (): 'G' | 'F' | 'C' | null => {
    if (progression.length === 0) return null;
    const mostRecentSeason = progression[progression.length - 1];
    const position = getSimplifiedPosition(mostRecentSeason.role);
    return position as 'G' | 'F' | 'C' | null;
  };

  // Position-specific table headers and cells
  const getPositionSpecificHeaders = (position: 'G' | 'F' | 'C' | null) => {
    const baseHeaders = [
      { key: 'season', label: 'Season', width: 'w-20' },
      { key: 'team', label: 'Team', width: 'w-20' },
      { key: 'gp', label: 'GP', width: 'w-16' },
      { key: 'min', label: 'Min%', width: 'w-20' },
      { key: 'ppg', label: 'PPG', width: 'w-20' }
    ];

    switch (position) {
      case 'G': // Guards - Focus on playmaking and perimeter shooting
        return [...baseHeaders, 
          { key: 'ts', label: 'TS%', width: 'w-24' },
          { key: '3p', label: '3P%', width: 'w-24' },
          { key: 'ft', label: 'FT%', width: 'w-24' },
          { key: 'ast', label: 'AST%', width: 'w-24' },
          { key: 'to', label: 'TO%', width: 'w-24' },
          { key: 'astTov', label: 'AST/TO', width: 'w-24' },
          { key: 'stl', label: 'STL%', width: 'w-24' },
          { key: 'bpm', label: 'BPM', width: 'w-24' },
          { key: 'usg', label: 'USG%', width: 'w-20' }
        ];
      
      case 'F': // Forwards - Focus on versatility and two-way impact  
        return [...baseHeaders,
          { key: 'efg', label: 'eFG%', width: 'w-24' },
          { key: '3p', label: '3P%', width: 'w-24' },
          { key: '2p', label: '2P%', width: 'w-24' },
          { key: 'orb', label: 'ORB%', width: 'w-24' },
          { key: 'drb', label: 'DRB%', width: 'w-24' },
          { key: 'stl', label: 'STL%', width: 'w-24' },
          { key: 'blk', label: 'BLK%', width: 'w-24' },
          { key: 'bpm', label: 'BPM', width: 'w-24' },
          { key: 'usg', label: 'USG%', width: 'w-20' }
        ];
      
      case 'C': // Centers - Focus on interior game and rebounding
        return [...baseHeaders,
          { key: 'efg', label: 'eFG%', width: 'w-24' },
          { key: '2p', label: '2P%', width: 'w-24' },
          { key: 'ft', label: 'FT%', width: 'w-24' },
          { key: 'ftr', label: 'FTr', width: 'w-24' },
          { key: 'orb', label: 'ORB%', width: 'w-24' },
          { key: 'drb', label: 'DRB%', width: 'w-24' },
          { key: 'blk', label: 'BLK%', width: 'w-24' },
          { key: 'bpm', label: 'BPM', width: 'w-24' },
          { key: 'usg', label: 'USG%', width: 'w-20' }
        ];
      
      default: // Fallback to general stats
        return [...baseHeaders,
          { key: 'efg', label: 'eFG%', width: 'w-24' },
          { key: '3p', label: '3P%', width: 'w-24' },
          { key: 'ft', label: 'FT%', width: 'w-24' },
          { key: 'ast', label: 'AST%', width: 'w-24' },
          { key: 'to', label: 'TO%', width: 'w-24' },
          { key: 'bpm', label: 'BPM', width: 'w-24' },
          { key: 'usg', label: 'USG%', width: 'w-20' }
        ];
    }
  };

  // Position-specific cell rendering
  const renderPositionSpecificCells = (season: BasketballStats, previousSeason: BasketballStats | undefined, position: 'G' | 'F' | 'C' | null) => {
    const cells = [];
    
    // Base cells (same for all positions)
    cells.push(
      <TableCell key="season" className="font-medium">{getYearLabel(season.year)}</TableCell>,
      <TableCell key="team" className="font-medium text-blue-600">{season.team}</TableCell>,
      <TableCell key="gp">{season.GP}</TableCell>,
      <TableCell key="min">
        <div className="flex items-center gap-1">
          {season.Min_per.toFixed(1)}
          {getTrendIcon(season.Min_per, previousSeason?.Min_per)}
        </div>
      </TableCell>,
      <TableCell key="ppg">
        <div className="flex items-center gap-1">
          {formatStat(season.pts)}
          {getTrendIcon(season.pts / season.GP, previousSeason ? previousSeason.pts / previousSeason.GP : undefined)}
        </div>
      </TableCell>
    );

    // Position-specific cells
    switch (position) {
      case 'G': // Guards
        cells.push(
          <TableCell key="ts">
            <div className="flex items-center gap-1">
              {formatStat(season.TS_per / 100, true)}
              {getTrendIcon(season.TS_per, previousSeason?.TS_per)}
            </div>
          </TableCell>,
          <TableCell key="3p">
            <div className="flex items-center gap-1">
              {formatStat(season.TP_per, true)}
              {getTrendIcon(season.TP_per, previousSeason?.TP_per)}
            </div>
          </TableCell>,
          <TableCell key="ft">
            <div className="flex items-center gap-1">
              {formatStat(season.FT_per, true)}
              {getTrendIcon(season.FT_per, previousSeason?.FT_per)}
            </div>
          </TableCell>,
          <TableCell key="ast">
            <div className="flex items-center gap-1">
              {formatStat(season.AST_per)}%
              {getTrendIcon(season.AST_per, previousSeason?.AST_per)}
            </div>
          </TableCell>,
          <TableCell key="to">
            <div className="flex items-center gap-1">
              {formatStat(season.TO_per)}%
              {getTrendIcon(season.TO_per, previousSeason?.TO_per, false)}
            </div>
          </TableCell>,
          <TableCell key="astTov">
            <div className="flex items-center gap-1">
              {formatStat(season.astTov)}
              {getTrendIcon(season.astTov, previousSeason?.astTov)}
            </div>
          </TableCell>,
          <TableCell key="stl">
            <div className="flex items-center gap-1">
              {formatStat(season.stl_per)}%
              {getTrendIcon(season.stl_per, previousSeason?.stl_per)}
            </div>
          </TableCell>
        );
        break;
        
      case 'F': // Forwards
        cells.push(
          <TableCell key="efg">
            <div className="flex items-center gap-1">
              {formatStat(season.eFG / 100, true)}
              {getTrendIcon(season.eFG, previousSeason?.eFG)}
            </div>
          </TableCell>,
          <TableCell key="3p">
            <div className="flex items-center gap-1">
              {formatStat(season.TP_per, true)}
              {getTrendIcon(season.TP_per, previousSeason?.TP_per)}
            </div>
          </TableCell>,
          <TableCell key="2p">
            <div className="flex items-center gap-1">
              {formatStat(season.twoP_per, true)}
              {getTrendIcon(season.twoP_per, previousSeason?.twoP_per)}
            </div>
          </TableCell>,
          <TableCell key="orb">
            <div className="flex items-center gap-1">
              {formatStat(season.ORB_per)}%
              {getTrendIcon(season.ORB_per, previousSeason?.ORB_per)}
            </div>
          </TableCell>,
          <TableCell key="drb">
            <div className="flex items-center gap-1">
              {formatStat(season.DRB_per)}%
              {getTrendIcon(season.DRB_per, previousSeason?.DRB_per)}
            </div>
          </TableCell>,
          <TableCell key="stl">
            <div className="flex items-center gap-1">
              {formatStat(season.stl_per)}%
              {getTrendIcon(season.stl_per, previousSeason?.stl_per)}
            </div>
          </TableCell>,
          <TableCell key="blk">
            <div className="flex items-center gap-1">
              {formatStat(season.blk_per)}%
              {getTrendIcon(season.blk_per, previousSeason?.blk_per)}
            </div>
          </TableCell>
        );
        break;
        
      case 'C': // Centers
        cells.push(
          <TableCell key="efg">
            <div className="flex items-center gap-1">
              {formatStat(season.eFG / 100, true)}
              {getTrendIcon(season.eFG, previousSeason?.eFG)}
            </div>
          </TableCell>,
          <TableCell key="2p">
            <div className="flex items-center gap-1">
              {formatStat(season.twoP_per, true)}
              {getTrendIcon(season.twoP_per, previousSeason?.twoP_per)}
            </div>
          </TableCell>,
          <TableCell key="ft">
            <div className="flex items-center gap-1">
              {formatStat(season.FT_per, true)}
              {getTrendIcon(season.FT_per, previousSeason?.FT_per)}
            </div>
          </TableCell>,
          <TableCell key="ftr">
            <div className="flex items-center gap-1">
              {formatStat(season.ftr)}
              {getTrendIcon(season.ftr, previousSeason?.ftr)}
            </div>
          </TableCell>,
          <TableCell key="orb">
            <div className="flex items-center gap-1">
              {formatStat(season.ORB_per)}%
              {getTrendIcon(season.ORB_per, previousSeason?.ORB_per)}
            </div>
          </TableCell>,
          <TableCell key="drb">
            <div className="flex items-center gap-1">
              {formatStat(season.DRB_per)}%
              {getTrendIcon(season.DRB_per, previousSeason?.DRB_per)}
            </div>
          </TableCell>,
          <TableCell key="blk">
            <div className="flex items-center gap-1">
              {formatStat(season.blk_per)}%
              {getTrendIcon(season.blk_per, previousSeason?.blk_per)}
            </div>
          </TableCell>
        );
        break;
    }

    // BPM and USG (common to all positions)
    cells.push(
      <TableCell key="bpm">
        <div className="flex items-center gap-1">
          {formatStat(season.bpm)}
          {getTrendIcon(season.bpm, previousSeason?.bpm)}
        </div>
      </TableCell>,
      <TableCell key="usg">
        <div className="flex items-center gap-1">
          {formatStat(season.usg)}%
          {getTrendIcon(season.usg, previousSeason?.usg)}
        </div>
      </TableCell>
    );

    return cells;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Player Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="lg" />
            <p className="text-sm text-gray-600 mt-3">Loading progression data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Player Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (progression.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Player Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">No historical data available for this player.</p>
            <p className="text-sm text-gray-500 mt-2">This might be their first year or data is not available for previous seasons.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort progression by year
  const sortedProgression = [...progression].sort((a, b) => a.year - b.year);
  const position = getPlayerPosition();
  const headers = getPositionSpecificHeaders(position);

  // Position labels for display
  const getPositionLabel = (pos: 'G' | 'F' | 'C' | null): string => {
    switch (pos) {
      case 'G': return 'Guard';
      case 'F': return 'Forward'; 
      case 'C': return 'Center';
      default: return 'Player';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Player Progression
          <Badge variant="secondary" className="text-xs">
            {sortedProgression.length} Season{sortedProgression.length > 1 ? 's' : ''}
          </Badge>
          {position && (
            <Badge variant="outline" className="text-xs">
              {getPositionLabel(position)} Focus
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {position ? `${getPositionLabel(position)}-specific development metrics and key performance indicators` : 'Year-over-year development and key performance indicators'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header.key} className={header.width}>
                    {header.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProgression.map((season, index) => {
                const previousSeason = index > 0 ? sortedProgression[index - 1] : undefined;
                
                return (
                  <TableRow key={season.year}>
                    {renderPositionSpecificCells(season, previousSeason, position)}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">
            Legend: {position && `${getPositionLabel(position)} Development Focus`}
          </h4>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>Improvement</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-600" />
              <span>Decline</span>
            </div>
            <div className="flex items-center gap-1">
              <Minus className="h-3 w-3 text-gray-400" />
              <span>No significant change</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>* Trends shown for changes greater than 2%. Lower values are better for TO%.</p>
            {position === 'G' && (
              <p>* Guard focus: Shooting efficiency, playmaking, ball security, and defensive activity</p>
            )}
            {position === 'F' && (
              <p>* Forward focus: Shooting versatility, rebounding, two-way impact, and overall efficiency</p>
            )}
            {position === 'C' && (
              <p>* Center focus: Interior efficiency, rebounding dominance, rim protection, and physical impact</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProgression; 