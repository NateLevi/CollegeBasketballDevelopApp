import { type BasketballStats } from "../types/basketballStats";
import { fetchBasketballStats } from "./mockData";

export const positions = ['G', 'F', 'C'] as const;

const positionMapping: Record<string, string> = {
  "Pure PG": "G",
  "Scoring PG": "G", 
  "Combo G": "G",
  "Wing G": "G",
  "Wing F": "F",
  "Stretch 4": "F", 
  "PF/C": "F",
  "C": "C"
};

export type GroupedPlayers = {
  G: BasketballStats[];
  F: BasketballStats[];
  C: BasketballStats[];
};

export const fetchPlayersByPosition = async (): Promise<GroupedPlayers> => {
  const players = await fetchBasketballStats();
  
  const grouped: GroupedPlayers = {
    G: [],
    F: [],
    C: []
  };
  
  players.forEach((player: BasketballStats) => {
    const mappedPosition = positionMapping[player.role];
    if (mappedPosition && mappedPosition in grouped) {
      grouped[mappedPosition as keyof GroupedPlayers].push(player);
    }
  });
  
  return grouped;
};

// Helper function to get simplified position from role
export const getSimplifiedPosition = (role: string): string | null => {
  return positionMapping[role] || null;
};

export type ShootingStats = {
  eFG: number;
  TS_per: number;
  TP_per: number;
  twoP_per: number;
  FT_per: number;
};

export type PositionAverages = {
  G: ShootingStats;
  F: ShootingStats;
  C: ShootingStats;
};

// Defensive stats type
export type DefensiveStats = {
  stl_per: number;    // Steals percentage
  blk_per: number;    // Blocks percentage
  DRB_per: number;    // Defensive rebounds percentage
  drtg: number;       // Defensive rating
  dbpm: number;       // Defensive box plus/minus
};

export type DefensivePositionAverages = {
  G: DefensiveStats;
  F: DefensiveStats;
  C: DefensiveStats;
};

// Calculate average for a specific defensive stat across players
const calculateDefensiveAverage = (players: BasketballStats[], statKey: keyof DefensiveStats): number => {
  if (players.length === 0) return 0;
  
  const total = players.reduce((sum, player) => sum + player[statKey], 0);
  return total / players.length;
};

// Calculate position averages for defensive stats
export const calculateDefensivePositionAverages = async (): Promise<DefensivePositionAverages> => {
  const groupedPlayers = await fetchPlayersByPosition();
  
  const averages: DefensivePositionAverages = {
    G: {
      stl_per: 0,
      blk_per: 0,
      DRB_per: 0,
      drtg: 0,
      dbpm: 0
    },
    F: {
      stl_per: 0,
      blk_per: 0,
      DRB_per: 0,
      drtg: 0,
      dbpm: 0
    },
    C: {
      stl_per: 0,
      blk_per: 0,
      DRB_per: 0,
      drtg: 0,
      dbpm: 0
    }
  };

  // Calculate averages for each position
  positions.forEach(position => {
    const players = groupedPlayers[position];
    
    averages[position].stl_per = calculateDefensiveAverage(players, 'stl_per');
    averages[position].blk_per = calculateDefensiveAverage(players, 'blk_per');
    averages[position].DRB_per = calculateDefensiveAverage(players, 'DRB_per');
    averages[position].drtg = calculateDefensiveAverage(players, 'drtg');
    averages[position].dbpm = calculateDefensiveAverage(players, 'dbpm');
  });

  return averages;
};

// Get defensive averages for a specific position
export const getDefensivePositionAverages = async (position: 'G' | 'F' | 'C'): Promise<DefensiveStats> => {
  const allAverages = await calculateDefensivePositionAverages();
  return allAverages[position];
};

// Compare a player's defensive stats to their position average
export const compareDefensiveToPositionAverage = async (player: BasketballStats): Promise<{
  playerStats: DefensiveStats;
  positionAverage: DefensiveStats;
  differences: DefensiveStats;
} | null> => {
  const playerPosition = getSimplifiedPosition(player.role);
  
  if (!playerPosition || !['G', 'F', 'C'].includes(playerPosition)) {
    return null;
  }

  const positionAverage = await getDefensivePositionAverages(playerPosition as 'G' | 'F' | 'C');
  
  const playerStats: DefensiveStats = {
    stl_per: player.stl_per,
    blk_per: player.blk_per,
    DRB_per: player.DRB_per,
    drtg: player.drtg,
    dbpm: player.dbpm
  };

  const differences: DefensiveStats = {
    stl_per: player.stl_per - positionAverage.stl_per,
    blk_per: player.blk_per - positionAverage.blk_per,
    DRB_per: player.DRB_per - positionAverage.DRB_per,
    drtg: player.drtg - positionAverage.drtg,
    dbpm: player.dbpm - positionAverage.dbpm
  };

  return {
    playerStats,
    positionAverage,
    differences
  };
};

// Playmaking stats type
export type PlaymakingStats = {
  AST_per: number;    // Assist rate
  TO_per: number;     // Turnover rate
  astTov: number;     // Assist/turnover ratio
  usg: number;        // Usage rate
};

export type PlaymakingPositionAverages = {
  G: PlaymakingStats;
  F: PlaymakingStats;
  C: PlaymakingStats;
};

// Calculate average for a specific playmaking stat across players
const calculatePlaymakingAverage = (players: BasketballStats[], statKey: keyof PlaymakingStats): number => {
  if (players.length === 0) return 0;
  
  const total = players.reduce((sum, player) => sum + player[statKey], 0);
  return total / players.length;
};

// Calculate position averages for playmaking stats
export const calculatePlaymakingPositionAverages = async (): Promise<PlaymakingPositionAverages> => {
  const groupedPlayers = await fetchPlayersByPosition();
  
  const averages: PlaymakingPositionAverages = {
    G: {
      AST_per: 0,
      TO_per: 0,
      astTov: 0,
      usg: 0
    },
    F: {
      AST_per: 0,
      TO_per: 0,
      astTov: 0,
      usg: 0
    },
    C: {
      AST_per: 0,
      TO_per: 0,
      astTov: 0,
      usg: 0
    }
  };

  // Calculate averages for each position
  positions.forEach(position => {
    const players = groupedPlayers[position];
    
    averages[position].AST_per = calculatePlaymakingAverage(players, 'AST_per');
    averages[position].TO_per = calculatePlaymakingAverage(players, 'TO_per');
    averages[position].astTov = calculatePlaymakingAverage(players, 'astTov');
    averages[position].usg = calculatePlaymakingAverage(players, 'usg');
  });

  return averages;
};

// Get playmaking averages for a specific position
export const getPlaymakingPositionAverages = async (position: 'G' | 'F' | 'C'): Promise<PlaymakingStats> => {
  const allAverages = await calculatePlaymakingPositionAverages();
  return allAverages[position];
};

// Compare a player's playmaking stats to their position average
export const comparePlaymakingToPositionAverage = async (player: BasketballStats): Promise<{
  playerStats: PlaymakingStats;
  positionAverage: PlaymakingStats;
  differences: PlaymakingStats;
} | null> => {
  const playerPosition = getSimplifiedPosition(player.role);
  
  if (!playerPosition || !['G', 'F', 'C'].includes(playerPosition)) {
    return null;
  }

  const positionAverage = await getPlaymakingPositionAverages(playerPosition as 'G' | 'F' | 'C');
  
  const playerStats: PlaymakingStats = {
    AST_per: player.AST_per,
    TO_per: player.TO_per,
    astTov: player.astTov,
    usg: player.usg
  };

  const differences: PlaymakingStats = {
    AST_per: player.AST_per - positionAverage.AST_per,
    TO_per: player.TO_per - positionAverage.TO_per,
    astTov: player.astTov - positionAverage.astTov,
    usg: player.usg - positionAverage.usg
  };

  return {
    playerStats,
    positionAverage,
    differences
  };
};

// Offensive stats type
export type OffensiveStats = {
  ORtg: number;    // Offensive rating
  usg: number;     // Usage rate
};

export type OffensivePositionAverages = {
  G: OffensiveStats;
  F: OffensiveStats;
  C: OffensiveStats;
};

// Calculate average for a specific offensive stat across players
const calculateOffensiveAverage = (players: BasketballStats[], statKey: keyof OffensiveStats): number => {
  if (players.length === 0) return 0;
  
  const total = players.reduce((sum, player) => sum + player[statKey], 0);
  return total / players.length;
};

// Calculate position averages for offensive stats
export const calculateOffensivePositionAverages = async (): Promise<OffensivePositionAverages> => {
  const groupedPlayers = await fetchPlayersByPosition();
  
  const averages: OffensivePositionAverages = {
    G: {
      ORtg: 0,
      usg: 0
    },
    F: {
      ORtg: 0,
      usg: 0
    },
    C: {
      ORtg: 0,
      usg: 0
    }
  };

  // Calculate averages for each position
  positions.forEach(position => {
    const players = groupedPlayers[position];
    
    averages[position].ORtg = calculateOffensiveAverage(players, 'ORtg');
    averages[position].usg = calculateOffensiveAverage(players, 'usg');
  });

  return averages;
};

// Get offensive averages for a specific position
export const getOffensivePositionAverages = async (position: 'G' | 'F' | 'C'): Promise<OffensiveStats> => {
  const allAverages = await calculateOffensivePositionAverages();
  return allAverages[position];
};

// Compare a player's offensive stats to their position average
export const compareOffensiveToPositionAverage = async (player: BasketballStats): Promise<{
  playerStats: OffensiveStats;
  positionAverage: OffensiveStats;
  differences: OffensiveStats;
} | null> => {
  const playerPosition = getSimplifiedPosition(player.role);
  
  if (!playerPosition || !['G', 'F', 'C'].includes(playerPosition)) {
    return null;
  }

  const positionAverage = await getOffensivePositionAverages(playerPosition as 'G' | 'F' | 'C');
  
  const playerStats: OffensiveStats = {
    ORtg: player.ORtg,
    usg: player.usg
  };

  const differences: OffensiveStats = {
    ORtg: player.ORtg - positionAverage.ORtg,
    usg: player.usg - positionAverage.usg
  };

  return {
    playerStats,
    positionAverage,
    differences
  };
};

// Calculate average for a specific stat across players
const calculateAverage = (players: BasketballStats[], statKey: keyof ShootingStats): number => {
  if (players.length === 0) return 0;
  
  const total = players.reduce((sum, player) => sum + player[statKey], 0);
  return total / players.length;
};

// Calculate position averages for shooting stats
export const calculatePositionAverages = async (): Promise<PositionAverages> => {
  const groupedPlayers = await fetchPlayersByPosition();
  
  const averages: PositionAverages = {
    G: {
      eFG: 0,
      TS_per: 0,
      TP_per: 0,
      twoP_per: 0,
      FT_per: 0
    },
    F: {
      eFG: 0,
      TS_per: 0,
      TP_per: 0,
      twoP_per: 0,
      FT_per: 0
    },
    C: {
      eFG: 0,
      TS_per: 0,
      TP_per: 0,
      twoP_per: 0,
      FT_per: 0
    }
  };

  // Calculate averages for each position
  positions.forEach(position => {
    const players = groupedPlayers[position];
    
    averages[position].eFG = calculateAverage(players, 'eFG');
    averages[position].TS_per = calculateAverage(players, 'TS_per');
    averages[position].TP_per = calculateAverage(players, 'TP_per');
    averages[position].twoP_per = calculateAverage(players, 'twoP_per');
    averages[position].FT_per = calculateAverage(players, 'FT_per');
  });

  return averages;
};

// Get averages for a specific position
export const getPositionAverages = async (position: 'G' | 'F' | 'C'): Promise<ShootingStats> => {
  const allAverages = await calculatePositionAverages();
  return allAverages[position];
};

// Compare a player's stats to their position average
export const compareToPositionAverage = async (player: BasketballStats): Promise<{
  playerStats: ShootingStats;
  positionAverage: ShootingStats;
  differences: ShootingStats;
} | null> => {
  const playerPosition = getSimplifiedPosition(player.role);
  
  if (!playerPosition || !['G', 'F', 'C'].includes(playerPosition)) {
    return null;
  }

  const positionAverage = await getPositionAverages(playerPosition as 'G' | 'F' | 'C');
  
  const playerStats: ShootingStats = {
    eFG: player.eFG,
    TS_per: player.TS_per,
    TP_per: player.TP_per,
    twoP_per: player.twoP_per,
    FT_per: player.FT_per
  };

  const differences: ShootingStats = {
    eFG: player.eFG - positionAverage.eFG,
    TS_per: player.TS_per - positionAverage.TS_per,
    TP_per: player.TP_per - positionAverage.TP_per,
    twoP_per: player.twoP_per - positionAverage.twoP_per,
    FT_per: player.FT_per - positionAverage.FT_per
  };

  return {
    playerStats,
    positionAverage,
    differences
  };
};

// Optimized versions that accept pre-fetched data
export const calculatePositionAveragesFromData = (groupedPlayers: GroupedPlayers): PositionAverages => {
  const averages: PositionAverages = {
    G: { eFG: 0, TS_per: 0, TP_per: 0, twoP_per: 0, FT_per: 0 },
    F: { eFG: 0, TS_per: 0, TP_per: 0, twoP_per: 0, FT_per: 0 },
    C: { eFG: 0, TS_per: 0, TP_per: 0, twoP_per: 0, FT_per: 0 }
  };

  positions.forEach(position => {
    const players = groupedPlayers[position];
    averages[position].eFG = calculateAverage(players, 'eFG');
    averages[position].TS_per = calculateAverage(players, 'TS_per');
    averages[position].TP_per = calculateAverage(players, 'TP_per');
    averages[position].twoP_per = calculateAverage(players, 'twoP_per');
    averages[position].FT_per = calculateAverage(players, 'FT_per');
  });

  return averages;
};

export const calculateDefensivePositionAveragesFromData = (groupedPlayers: GroupedPlayers): DefensivePositionAverages => {
  const averages: DefensivePositionAverages = {
    G: { stl_per: 0, blk_per: 0, DRB_per: 0, drtg: 0, dbpm: 0 },
    F: { stl_per: 0, blk_per: 0, DRB_per: 0, drtg: 0, dbpm: 0 },
    C: { stl_per: 0, blk_per: 0, DRB_per: 0, drtg: 0, dbpm: 0 }
  };

  positions.forEach(position => {
    const players = groupedPlayers[position];
    averages[position].stl_per = calculateDefensiveAverage(players, 'stl_per');
    averages[position].blk_per = calculateDefensiveAverage(players, 'blk_per');
    averages[position].DRB_per = calculateDefensiveAverage(players, 'DRB_per');
    averages[position].drtg = calculateDefensiveAverage(players, 'drtg');
    averages[position].dbpm = calculateDefensiveAverage(players, 'dbpm');
  });

  return averages;
};

export const calculatePlaymakingPositionAveragesFromData = (groupedPlayers: GroupedPlayers): PlaymakingPositionAverages => {
  const averages: PlaymakingPositionAverages = {
    G: { AST_per: 0, TO_per: 0, astTov: 0, usg: 0 },
    F: { AST_per: 0, TO_per: 0, astTov: 0, usg: 0 },
    C: { AST_per: 0, TO_per: 0, astTov: 0, usg: 0 }
  };

  positions.forEach(position => {
    const players = groupedPlayers[position];
    averages[position].AST_per = calculatePlaymakingAverage(players, 'AST_per');
    averages[position].TO_per = calculatePlaymakingAverage(players, 'TO_per');
    averages[position].astTov = calculatePlaymakingAverage(players, 'astTov');
    averages[position].usg = calculatePlaymakingAverage(players, 'usg');
  });

  return averages;
};

export const calculateOffensivePositionAveragesFromData = (groupedPlayers: GroupedPlayers): OffensivePositionAverages => {
  const averages: OffensivePositionAverages = {
    G: { ORtg: 0, usg: 0 },
    F: { ORtg: 0, usg: 0 },
    C: { ORtg: 0, usg: 0 }
  };

  positions.forEach(position => {
    const players = groupedPlayers[position];
    averages[position].ORtg = calculateOffensiveAverage(players, 'ORtg');
    averages[position].usg = calculateOffensiveAverage(players, 'usg');
  });

  return averages;
};

// Combined function to calculate all averages at once
export const calculateAllPositionAverages = async () => {
  const groupedPlayers = await fetchPlayersByPosition();
  
  return {
    shooting: calculatePositionAveragesFromData(groupedPlayers),
    defensive: calculateDefensivePositionAveragesFromData(groupedPlayers),
    playmaking: calculatePlaymakingPositionAveragesFromData(groupedPlayers),
    offensive: calculateOffensivePositionAveragesFromData(groupedPlayers)
  };
};



//Position Averages

