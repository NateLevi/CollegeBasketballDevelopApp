import { useState, useMemo, useEffect, useCallback } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { fetchBasketballStats } from '../data/mockData';
import { type BasketballStats } from '../types/basketballStats';
import { getSimplifiedPosition } from '../data/StatAvg';
import PlayerCard from './PlayerCard';
import { Spinner } from './ui/spinner';
import { Separator } from './ui/separator';

interface Filters {
  position: string;
  conference: string;
  team: string;
  classYear: string;
  ppgRange: [number, number];
  shootingRange: [number, number];
  bpmRange: [number, number];
  heightRange: [number, number];
  playerType: string;
}

export default function PlayerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<BasketballStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    position: 'all',
    conference: 'all',
    team: 'all',
    classYear: 'all',
    ppgRange: [0, 30],
    shootingRange: [0, 80], // Increased from 70 to 80 for elite shooters
    bpmRange: [-20, 20], // Expanded from [-10, 10] to include more players
    heightRange: [68, 86], // 5'8" to 7'2" in inches
    playerType: 'all'
  });

  // Helper function to convert height string to inches
  const heightToInches = (heightStr: string): number => {
    if (!heightStr || heightStr === 'N/A' || heightStr === '') return 72; // Default 6'0"
    
    // Handle different height formats: "6'5", "6-5", "6'5"", "6 5", etc.
    const patterns = [
      /(\d+)[''](\d+)[""]?/,  // 6'5" or 6'5
      /(\d+)[-](\d+)/,        // 6-5
      /(\d+)\s+(\d+)/,        // 6 5
      /(\d+)\.(\d+)/          // 6.5 (treating decimal as inches)
    ];
    
    for (const pattern of patterns) {
      const match = heightStr.match(pattern);
      if (match) {
        const feet = parseInt(match[1]);
        const inches = parseInt(match[2]);
        return feet * 12 + inches;
      }
    }
    
    // If no pattern matches, try to extract just feet (assume 0 inches)
    const feetOnly = heightStr.match(/(\d+)/);
    if (feetOnly) {
      return parseInt(feetOnly[1]) * 12;
    }
    
    return 72; // Default fallback
  };

  // Load real data when component mounts
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const data = await fetchBasketballStats();
        const sortedData = data.sort((a: BasketballStats, b: BasketballStats) => a.player_name.localeCompare(b.player_name));
        setPlayers(sortedData);
      } catch (error) {
        console.error('Error loading players:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  // Memoize height conversions to avoid repeated parsing
  const playerHeights = useMemo(() => {
    const heightMap = new Map<number, number>();
    players.forEach(player => {
      if (!heightMap.has(player.pid)) {
        heightMap.set(player.pid, heightToInches(player.ht));
      }
    });
    return heightMap;
  }, [players]);

  // Helper function to format height from inches
  const formatHeight = (inches: number): string => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  // Get unique values for filter options (optimized for performance)
  const filterOptions = useMemo(() => {
    // Early return for empty dataset
    if (players.length === 0) {
      return {
        conferences: [],
        teams: [],
        classYears: [],
        positions: [
          { value: 'G', label: 'Guards' },
          { value: 'F', label: 'Forwards' }, 
          { value: 'C', label: 'Centers' }
        ],
        playerTypes: [
          { value: 'all', label: 'All Players' },
          { value: 'starter', label: 'Starters (25+ min)' },
          { value: 'bench', label: 'Bench (5-25 min)' },
          { value: 'limited', label: 'Limited Role (<5 min)' }
        ]
      };
    }
    
    const conferences = [...new Set(players.map(p => p.conf))].sort();
    const teams = [...new Set(players.map(p => p.team))].sort();
    const classYears = [...new Set(players.map(p => p.yr))].sort();
    
    return {
      conferences,
      teams,
      classYears,
      positions: [
        { value: 'G', label: 'Guards' },
        { value: 'F', label: 'Forwards' }, 
        { value: 'C', label: 'Centers' }
      ],
      playerTypes: [
        { value: 'all', label: 'All Players' },
        { value: 'starter', label: 'Starters (25+ min)' },
        { value: 'bench', label: 'Bench (5-25 min)' },
        { value: 'limited', label: 'Limited Role (<5 min)' }
      ]
    };
  }, [players]); // Only recalculate when players array changes

  // Pre-calculate expensive operations once to avoid repeated calculations
  const preprocessedPlayers = useMemo(() => {
    return players.map(player => ({
      ...player,
      // Pre-calculate expensive operations
      position: getSimplifiedPosition(player.role),
      playerHeight: playerHeights.get(player.pid) || 72,
      searchText: `${player.player_name} ${player.team} ${player.conf}`.toLowerCase(),
      pts: player.pts ?? 0,
      eFG: player.eFG ?? 0,
      bpm: player.bpm ?? -25,
      minPer: player.Min_per ?? 0
    }));
  }, [players, playerHeights]);

  // Fast filters: search and dropdowns (won't recalculate when sliders move)
  const baseFilteredPlayers = useMemo(() => {
    // Early return for empty dataset
    if (preprocessedPlayers.length === 0) return [];
    
    let filtered = preprocessedPlayers;

    // Text search (most selective first for early exit)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(player => player.searchText.includes(searchLower));
      // Early return if search yields no results
      if (filtered.length === 0) return [];
    }

    // Fast dropdown filters
    if (filters.position !== 'all') {
      filtered = filtered.filter(player => player.position === filters.position);
    }
    if (filters.conference !== 'all') {
      filtered = filtered.filter(player => player.conf === filters.conference);
    }
    if (filters.team !== 'all') {
      filtered = filtered.filter(player => player.team === filters.team);
    }
    if (filters.classYear !== 'all') {
      filtered = filtered.filter(player => player.yr === filters.classYear);
    }
    if (filters.playerType !== 'all') {
      filtered = filtered.filter(player => {
        switch (filters.playerType) {
          case 'starter': return player.minPer >= 25;
          case 'bench': return player.minPer >= 5 && player.minPer < 25;
          case 'limited': return player.minPer < 5;
          default: return true;
        }
      });
    }

    return filtered;
  }, [preprocessedPlayers, searchTerm, filters.position, filters.conference, filters.team, filters.classYear, filters.playerType]);

  // Range filters only (recalculates only when sliders change)
  const filteredPlayers = useMemo(() => {
    let filtered = baseFilteredPlayers;

    // Only apply range filters if they've changed from defaults (avoids unnecessary filtering)
    if (filters.ppgRange[0] !== 0 || filters.ppgRange[1] !== 30) {
      const [minPPG, maxPPG] = filters.ppgRange;
      filtered = filtered.filter(player => 
        player.pts >= minPPG && player.pts <= maxPPG
      );
    }

    if (filters.shootingRange[0] !== 0 || filters.shootingRange[1] !== 80) {
      const [minEFG, maxEFG] = filters.shootingRange;
      filtered = filtered.filter(player => 
        player.eFG >= minEFG && player.eFG <= maxEFG
      );
    }

    if (filters.bpmRange[0] !== -20 || filters.bpmRange[1] !== 20) {
      const [minBPM, maxBPM] = filters.bpmRange;
      filtered = filtered.filter(player => 
        player.bpm >= minBPM && player.bpm <= maxBPM
      );
    }

    if (filters.heightRange[0] !== 68 || filters.heightRange[1] !== 86) {
      const [minHeight, maxHeight] = filters.heightRange;
      filtered = filtered.filter(player => 
        player.playerHeight >= minHeight && player.playerHeight <= maxHeight
      );
    }

    return filtered;
  }, [baseFilteredPlayers, filters.ppgRange, filters.shootingRange, filters.bpmRange, filters.heightRange]);

  const clearFilters = () => {
    setFilters({
      position: 'all',
      conference: 'all',
      team: 'all',
      classYear: 'all',
      ppgRange: [0, 30],
      shootingRange: [0, 80],
      bpmRange: [-20, 20],
      heightRange: [68, 86],
      playerType: 'all'
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    clearFilters();
  };

  // Count active filters
  const activeFiltersCount = () => {
    let count = 0;
    if (filters.position !== 'all') count++;
    if (filters.conference !== 'all') count++;
    if (filters.team !== 'all') count++;
    if (filters.classYear !== 'all') count++;
    if (filters.ppgRange[0] !== 0 || filters.ppgRange[1] !== 30) count++;
    if (filters.shootingRange[0] !== 0 || filters.shootingRange[1] !== 80) count++;
    if (filters.bpmRange[0] !== -20 || filters.bpmRange[1] !== 20) count++;
    if (filters.heightRange[0] !== 68 || filters.heightRange[1] !== 86) count++;
    if (filters.playerType !== 'all') count++;
    return count;
  };

  const updateFilter = useCallback((key: keyof Filters, value: string | [number, number]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []); // Empty dependency array since it only uses setState

  return (
    <div className="min-h-screen p-6 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            {/* Illinois Basketball Logo Placeholder */}
            <img 
              src="/basketball.png" 
              alt="Basketball Logo" 
              className="w-16 h-16 rounded-full"
              style={{ color: 'white' }}
            />
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-1">
                College Basketball
              </h1>
              <h2 className="text-2xl font-semibold text-primary">
                Player Development Tool
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced statistical analysis for recruiting and player development
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search players, teams, or conferences..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* Filter Toggle and Active Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-white"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount()}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>

          {/* Active Filter Badges */}
          {filters.position !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Position: {filterOptions.positions.find(p => p.value === filters.position)?.label}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => updateFilter('position', 'all')}
              />
            </Badge>
          )}
          
          {filters.conference !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.conference}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => updateFilter('conference', 'all')}
              />
            </Badge>
          )}

          {filters.team !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.team}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => updateFilter('team', 'all')}
              />
            </Badge>
          )}
          
          {filters.classYear !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.classYear}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => updateFilter('classYear', 'all')}
              />
            </Badge>
          )}
          
          {(filters.ppgRange[0] !== 0 || filters.ppgRange[1] !== 30) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              PPG: {filters.ppgRange[0]} - {filters.ppgRange[1]}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => updateFilter('ppgRange', [0, 30])}
              />
            </Badge>
          )}

          {(filters.shootingRange[0] !== 0 || filters.shootingRange[1] !== 80) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              eFG%: {filters.shootingRange[0]} - {filters.shootingRange[1]}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => updateFilter('shootingRange', [0, 80])}
              />
            </Badge>
          )}

          {(filters.bpmRange[0] !== -20 || filters.bpmRange[1] !== 20) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              BPM: {filters.bpmRange[0]} - {filters.bpmRange[1]}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => updateFilter('bpmRange', [-20, 20])}
              />
            </Badge>
          )}

          {(filters.heightRange[0] !== 68 || filters.heightRange[1] !== 86) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Height: {formatHeight(filters.heightRange[0])} - {formatHeight(filters.heightRange[1])}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => updateFilter('heightRange', [68, 86])}
              />
            </Badge>
          )}

          {filters.playerType !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Player Type: {filters.playerType}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => updateFilter('playerType', 'all')}
              />
            </Badge>
          )}

          {(searchTerm || activeFiltersCount() > 0) && (
            <Button variant="ghost" onClick={clearAllFilters} className="text-white hover:text-gray-300">
              Clear All
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Position Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Position</label>
                  <Select value={filters.position} onValueChange={(value) => updateFilter('position', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Positions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      {filterOptions.positions.map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Conference Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Conference</label>
                  <Select value={filters.conference} onValueChange={(value) => updateFilter('conference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Conferences" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conferences</SelectItem>
                      {filterOptions.conferences.map((conference) => (
                        <SelectItem key={conference} value={conference}>
                          {conference}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Team Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Team</label>
                  <Select value={filters.team} onValueChange={(value) => updateFilter('team', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Teams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teams</SelectItem>
                      {filterOptions.teams.map((team) => (
                        <SelectItem key={team} value={team}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Class Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Class Year</label>
                  <Select value={filters.classYear} onValueChange={(value) => updateFilter('classYear', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {filterOptions.classYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Player Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Player Type</label>
                  <Select value={filters.playerType} onValueChange={(value) => updateFilter('playerType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Player Types" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.playerTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Height Range Filter */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">Height</label>
                    <span className="text-xs text-gray-500">{formatHeight(filters.heightRange[0])} - {formatHeight(filters.heightRange[1])}</span>
                  </div>
                  <Slider
                    value={filters.heightRange}
                    onValueChange={(val) => updateFilter('heightRange', val as [number, number])}
                    min={68}
                    max={86}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PPG Range Filter */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">Points Per Game</label>
                    <span className="text-xs text-gray-500">{filters.ppgRange[0]} - {filters.ppgRange[1]} PPG</span>
                  </div>
                  <Slider
                    value={filters.ppgRange}
                    onValueChange={(val) => updateFilter('ppgRange', val as [number, number])}
                    min={0}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Shooting Efficiency Range Filter */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">Shooting Efficiency (eFG%)</label>
                    <span className="text-xs text-gray-500">{filters.shootingRange[0]}% - {filters.shootingRange[1]}%</span>
                  </div>
                  <Slider
                    value={filters.shootingRange}
                    onValueChange={(val) => updateFilter('shootingRange', val as [number, number])}
                    min={0}
                    max={80}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* BPM Range Filter */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">Box Plus/Minus (BPM)</label>
                    <span className="text-xs text-gray-500">{filters.bpmRange[0]} - {filters.bpmRange[1]}</span>
                  </div>
                  <Slider
                    value={filters.bpmRange}
                    onValueChange={(val) => updateFilter('bpmRange', val as [number, number])}
                    min={-20}
                    max={20}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={clearFilters} className="text-white">
                  Clear Filters
                </Button>
                <Button onClick={() => setShowFilters(false)} className="text-white">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results Info */}
        <div className="flex items-center gap-4 mb-6">
          {!loading && (
            <span className="text-sm text-gray-500">
              {`Showing ${Math.min(filteredPlayers.length, 50)} of ${filteredPlayers.length} matching players`}
              {activeFiltersCount() > 0 && ` (${activeFiltersCount()} filter${activeFiltersCount() > 1 ? 's' : ''} applied)`}
            </span>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Spinner size="lg" />
                  <p className="text-lg text-gray-600">Loading players...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredPlayers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 text-lg">
                  No players found matching your search criteria
                </p>
                <Button variant="outline" onClick={clearAllFilters} className="mt-4 text-white">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPlayers.slice(0, 50).map((player) => (
              <PlayerCard key={player.pid} player={player} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
