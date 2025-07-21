import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { type BasketballStats } from '../types/basketballStats';
import Tooltip from './ui/tooltip';

interface PlayerStatsTabsProps {
  player: BasketballStats;
}

const PlayerStatsTabs = ({ player }: PlayerStatsTabsProps) => {
  return (
    <Tabs defaultValue="offensive" className="w-full">
      <TabsList className="bg-transparent gap-10 flex justify-center w-full">
        <TabsTrigger 
          value="offensive"
          className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-300 hover:text-white bg-transparent"
        >
          Offensive
        </TabsTrigger>
        <TabsTrigger 
          value="shooting" 
          className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-slate-300 hover:text-white bg-transparent"
        >
          Shooting
        </TabsTrigger>
        <TabsTrigger 
          value="playmaking"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 hover:text-white bg-transparent"
        >
          Playmaking
        </TabsTrigger>
        <TabsTrigger 
          value="defensive"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 hover:text-white bg-transparent"
        >
          Defensive
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="offensive">
        {/* Offensive Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              📊 Offensive Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Tooltip content="Points produced per 100 possessions when on court">
                <span className="cursor-help border-b border-dotted border-gray-400">Offensive Rating</span>
              </Tooltip>
              <span className="font-medium">{player.ORtg.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Percentage of team possessions used when on court">
                <span className="cursor-help border-b border-dotted border-gray-400">Usage Rate</span>
              </Tooltip>
              <span className="font-medium">{player.usg.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Percentage of available offensive rebounds grabbed">
                <span className="cursor-help border-b border-dotted border-gray-400">Offensive Rebound %</span>
              </Tooltip>
              <span className="font-medium">{player.ORB_per.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Estimate of points per 100 possessions contributed above average">
                <span className="cursor-help border-b border-dotted border-gray-400">Box Plus/Minus</span>
              </Tooltip>
              <span className="font-medium">{player.bpm.toFixed(1)}</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="shooting">
        {/* Shooting Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              🏀 Shooting Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Tooltip content="Field goal percentage adjusted for 3-pointers being worth more">
                <span className="cursor-help border-b border-dotted border-gray-400">Effective Field Goal %</span>
              </Tooltip>
              <span className="font-medium">{player.eFG.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Overall shooting efficiency including free throws">
                <span className="cursor-help border-b border-dotted border-gray-400">True Shooting %</span>
              </Tooltip>
              <span className="font-medium">{player.TS_per.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Three-point shooting percentage">
                <span className="cursor-help border-b border-dotted border-gray-400">Three Point %</span>
              </Tooltip>
              <span className="font-medium">{(player.TP_per * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Two-point shooting percentage">
                <span className="cursor-help border-b border-dotted border-gray-400">Two Point %</span>
              </Tooltip>
              <span className="font-medium">{(player.twoP_per * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Free throw shooting percentage">
                <span className="cursor-help border-b border-dotted border-gray-400">Free Throw %</span>
              </Tooltip>
              <span className="font-medium">{(player.FT_per * 100).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="playmaking">
        {/* Playmaking Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              🤲 Playmaking & Ball Handling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Tooltip content="Percentage of teammate field goals assisted while on court">
                <span className="cursor-help border-b border-dotted border-gray-400">Assist %</span>
              </Tooltip>
              <span className="font-medium">{player.AST_per.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Percentage of possessions that end in turnovers">
                <span className="cursor-help border-b border-dotted border-gray-400">Turnover %</span>
              </Tooltip>
              <span className="font-medium">
                {player.TO_per.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Ratio of assists to turnovers (higher is better)">
                <span className="cursor-help border-b border-dotted border-gray-400">Assist/Turnover Ratio</span>
              </Tooltip>
              <span className="font-medium">{player.astTov.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="defensive">
        {/* Defense & Rebounding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              🛡️ Defense & Rebounding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Tooltip content="Points allowed per 100 possessions when on court (lower is better)">
                <span className="cursor-help border-b border-dotted border-gray-400">Defensive Rating</span>
              </Tooltip>
              <span className="font-medium">{player.drtg.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Percentage of opponent possessions that result in steals">
                <span className="cursor-help border-b border-dotted border-gray-400">Steal %</span>
              </Tooltip>
              <span className="font-medium">{player.stl_per.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Percentage of opponent 2-point attempts blocked">
                <span className="cursor-help border-b border-dotted border-gray-400">Block %</span>
              </Tooltip>
              <span className="font-medium">{player.blk_per.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <Tooltip content="Percentage of available defensive rebounds grabbed">
                <span className="cursor-help border-b border-dotted border-gray-400">Defensive Rebound %</span>
              </Tooltip>
              <span className="font-medium">{player.DRB_per.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PlayerStatsTabs; 