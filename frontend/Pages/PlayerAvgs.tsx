import { useState, useEffect } from 'react'
import React from 'react'
import { createPortal } from 'react-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card'

// Custom tooltip component for table headers using a portal
const TableHeaderTooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipNode = tooltipRef.current
      
      const top = triggerRect.top - tooltipNode.offsetHeight - 5 // 5px gap
      const left = triggerRect.left + (triggerRect.width / 2) - (tooltipNode.offsetWidth / 2)

      tooltipNode.style.top = `${top}px`
      tooltipNode.style.left = `${left}px`
    }
  }, [isVisible])

  const tooltipContent = isVisible ? createPortal(
    <div 
      ref={tooltipRef}
      className="fixed bg-gray-900 text-white text-sm rounded-lg px-3 py-2 max-w-xs shadow-lg z-[999]"
    >
      <div className="whitespace-normal leading-relaxed">{content}</div>
    </div>,
    document.body
  ) : null

  return (
    <div 
      ref={triggerRef}
      className="relative inline-block cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className="border-b border-dotted border-gray-400">{children}</span>
      {tooltipContent}
    </div>
  )
}
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../src/components/ui/table'
import { Badge } from '../src/components/ui/badge'
import { 
  calculateAllPositionAverages,
  type PositionAverages, 
  type DefensivePositionAverages, 
  type PlaymakingPositionAverages, 
  type OffensivePositionAverages 
} from '../src/data/StatAvg'
import { Spinner } from '../src/components/ui/spinner'

const PlayerAvgs = () => {
  const [shootingAverages, setShootingAverages] = useState<PositionAverages | null>(null)
  const [defensiveAverages, setDefensiveAverages] = useState<DefensivePositionAverages | null>(null)
  const [playmakingAverages, setPlaymakingAverages] = useState<PlaymakingPositionAverages | null>(null)
  const [offensiveAverages, setOffensiveAverages] = useState<OffensivePositionAverages | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllAverages = async () => {
      try {
        setLoading(true)
        const allAverages = await calculateAllPositionAverages()
        
        setShootingAverages(allAverages.shooting)
        setDefensiveAverages(allAverages.defensive)
        setPlaymakingAverages(allAverages.playmaking)
        setOffensiveAverages(allAverages.offensive)
      } catch (error) {
        console.error('Error fetching position averages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllAverages()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen p-6 mt-16">
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-lg text-gray-600">Loading position averages...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Position Averages</h1>
          <p className="text-gray-600">Statistical averages by position: Guards (G), Forwards (F), and Centers (C)</p>
        </div>

        <div className="space-y-6">
          {/* Shooting Averages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🏀</span>
                Shooting Averages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Position</TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Effective Field Goal Percentage - Accounts for 3-point shots being worth more than 2-point shots">
                        eFG%
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="True Shooting Percentage - Accounts for all shots including free throws to measure overall shooting efficiency">
                        TS%
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Three-Point Percentage - Percentage of three-point field goals made">
                        3P%
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Two-Point Percentage - Percentage of two-point field goals made">
                        2P%
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Free Throw Percentage - Percentage of free throws made">
                        FT%
                      </TableHeaderTooltip>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shootingAverages && Object.entries(shootingAverages).map(([position, stats]) => (
                    <TableRow key={position}>
                      <TableCell>
                        <Badge variant="secondary">{position}</Badge>
                      </TableCell>
                      <TableCell>{stats.eFG.toFixed(1)}%</TableCell>
                      <TableCell>{stats.TS_per.toFixed(1)}%</TableCell>
                      <TableCell>{(stats.TP_per * 100).toFixed(1)}%</TableCell>
                      <TableCell>{(stats.twoP_per * 100).toFixed(1)}%</TableCell>
                      <TableCell>{(stats.FT_per * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Defensive Averages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🛡️</span>
                Defensive Averages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Position</TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Steal Percentage - Percentage of opponent possessions that end in a steal while player is on court">
                        STL%
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Block Percentage - Percentage of opponent two-point field goal attempts blocked while player is on court">
                        BLK%
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Defensive Rebound Percentage - Percentage of available defensive rebounds grabbed while player is on court">
                        DRB%
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Defensive Rating - Points allowed per 100 possessions (lower is better)">
                        DRtg
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Defensive Box Plus/Minus - Defensive impact compared to league average player">
                        DBPM
                      </TableHeaderTooltip>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defensiveAverages && Object.entries(defensiveAverages).map(([position, stats]) => (
                    <TableRow key={position}>
                      <TableCell>
                        <Badge variant="secondary">{position}</Badge>
                      </TableCell>
                      <TableCell>{stats.stl_per.toFixed(1)}%</TableCell>
                      <TableCell>{stats.blk_per.toFixed(1)}%</TableCell>
                      <TableCell>{stats.DRB_per.toFixed(1)}%</TableCell>
                      <TableCell>{stats.drtg.toFixed(1)}</TableCell>
                      <TableCell>{stats.dbpm.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Playmaking Averages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎯</span>
                Playmaking Averages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Position</TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Assist Percentage - Percentage of teammate field goals assisted while player is on court">
                        AST%
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Turnover Percentage - Percentage of possessions that end in a turnover while player is on court">
                        TO%
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Assist-to-Turnover Ratio - Assists divided by turnovers (higher is better)">
                        AST/TO
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Usage Percentage - Percentage of team possessions used while player is on court">
                        USG%
                      </TableHeaderTooltip>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playmakingAverages && Object.entries(playmakingAverages).map(([position, stats]) => (
                    <TableRow key={position}>
                      <TableCell>
                        <Badge variant="secondary">{position}</Badge>
                      </TableCell>
                      <TableCell>{stats.AST_per.toFixed(1)}%</TableCell>
                      <TableCell>{stats.TO_per.toFixed(1)}%</TableCell>
                      <TableCell>{stats.astTov.toFixed(1)}</TableCell>
                      <TableCell>{stats.usg.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Offensive Averages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⚡</span>
                Offensive Averages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Position</TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Offensive Rating - Points scored per 100 possessions (higher is better)">
                        ORtg
                      </TableHeaderTooltip>
                    </TableHead>
                    <TableHead>
                      <TableHeaderTooltip content="Usage Percentage - Percentage of team possessions used while player is on court">
                        USG%
                      </TableHeaderTooltip>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offensiveAverages && Object.entries(offensiveAverages).map(([position, stats]) => (
                    <TableRow key={position}>
                      <TableCell>
                        <Badge variant="secondary">{position}</Badge>
                      </TableCell>
                      <TableCell>{stats.ORtg.toFixed(1)}</TableCell>
                      <TableCell>{stats.usg.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PlayerAvgs