import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
    
const Development = () => {
  return (
    <div className="space-y-4">
  <h2 className="text-xl font-semibold">Development Priorities</h2>
  
  <Card className="border-l-4 border-l-red-500">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Priority 1: Improve 3-Point Shooting</CardTitle>
        <Badge variant="destructive">High Impact</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Current: 28.2%</span>
          <span>Target: 33.1% (position avg)</span>
        </div>
        <Progress value={28} className="h-2" />
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm">
            <strong>Impact:</strong> +1.8 PPG, +2.1 team offensive rating
          </p>
          <p className="text-sm mt-1">
            <strong>Focus:</strong> Catch-and-shoot opportunities, corner 3s
          </p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card className="border-l-4 border-l-orange-500">
    {/* Priority 2 */}
  </Card>

  <Card className="border-l-4 border-l-yellow-500">
    {/* Priority 3 */}
  </Card>
</div>
  )
}

export default Development