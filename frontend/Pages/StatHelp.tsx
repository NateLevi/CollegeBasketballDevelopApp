import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';

const StatHelp = () => {
  const stats = [
    { name: "GP", description: "Games played this season" },
    { name: "Min%", description: "Minutes percentage - % of team minutes played" },
    { name: "PPG", description: "Points per game" },
    { name: "TS%", description: "True shooting % (most complete shooting metric)" },
    { name: "eFG%", description: "Effective field goal % (adjusts for 3-pointers)" },
    { name: "3P%", description: "Three-point percentage" },
    { name: "FT%", description: "Free throw percentage" },
    { name: "AST%", description: "Assist percentage - % of teammate shots assisted" },
    { name: "TO%", description: "Turnover percentage (lower = better)" },
    { name: "AST/TO", description: "Assist-to-turnover ratio (higher = better)" },
    { name: "STL%", description: "Steal percentage" },
    { name: "TRB%", description: "Total rebounding percentage (offensive + defensive)" },
    { name: "BPM", description: "Box plus/minus - overall impact vs average player" },
    { name: "USG%", description: "Usage percentage - % of possessions used when on court" }
  ];

  return (
    <div className="min-h-screen p-6 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Basketball Statistics Guide
          </h1>
          <p className="text-muted-foreground">
            Simple explanations of all statistics used in player analysis
          </p>
        </div>

        {/* Stats List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Statistics Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-start gap-4 py-2 border-b border-gray-100 last:border-b-0">
                  <div className="font-mono text-sm font-semibold text-foreground min-w-[120px] bg-gray-50 px-3 py-1 rounded">
                    {stat.name}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed pt-1">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Higher = Better</h3>
                <p className="text-muted-foreground">TS%, eFG%, 3P%, FT%, AST%, AST/TO, STL%, TRB%, BPM</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Lower = Better</h3>
                <p className="text-muted-foreground">TO%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Source */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Data from <a href="https://barttorvik.com/" target="_blank" rel="noopener noreferrer" className="underline">BartTorvik.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatHelp;