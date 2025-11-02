"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyProduction } from "@/lib/types/production";
import { BarChart3 } from "lucide-react";

interface ProductionChartProps {
  dailyProduction: DailyProduction[];
  title: string;
}

export const ProductionChart = ({ dailyProduction, title }: ProductionChartProps) => {
  if (dailyProduction.length === 0) return null;

  const maxUnits = Math.max(...dailyProduction.map((d) => d.targetUnits));
  const totalUnits = dailyProduction.reduce((sum, d) => sum + d.targetUnits, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-orange-500" />
          {title}
        </CardTitle>
        <CardDescription>
          Total: {totalUnits.toFixed(2)} units over {dailyProduction.length} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Visual bar chart */}
          <div className="space-y-2">
            {dailyProduction.slice(0, 20).map((day) => {
              const percentage = (day.targetUnits / maxUnits) * 100;
              
              return (
                <div key={day.day} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground w-24">
                      Day {day.day}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {day.date}
                    </span>
                    <span className="font-medium w-24 text-right">
                      {day.targetUnits.toFixed(2)} units
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {dailyProduction.length > 20 && (
            <p className="text-xs text-muted-foreground text-center pt-2 border-t">
              ... and {dailyProduction.length - 20} more days
            </p>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Min/Day</p>
              <p className="text-lg font-bold">
                {Math.min(...dailyProduction.map((d) => d.targetUnits)).toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Avg/Day</p>
              <p className="text-lg font-bold">
                {(totalUnits / dailyProduction.length).toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Max/Day</p>
              <p className="text-lg font-bold">
                {maxUnits.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionChart;
