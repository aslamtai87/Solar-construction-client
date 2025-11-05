"use client";

import React from "react";
import { Activity as ActivityIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DailyProduction } from "@/lib/types/production";

interface ProductionForecastCardProps {
  forecast: DailyProduction[];
  method: string;
}

export const ProductionForecastCard: React.FC<ProductionForecastCardProps> = ({
  forecast,
  method,
}) => {
  const isAI = method !== "constant";
  const totalProduction = forecast.reduce((sum, day) => sum + day.targetUnits, 0);
  const peakDay = Math.max(...forecast.map((d) => d.targetUnits));
  const avgDay = totalProduction / forecast.length;
  const minDay = Math.min(...forecast.map((d) => d.targetUnits));

  return (
    <Card className={isAI ? "border-primary/20 bg-primary/5" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {isAI ? "AI Production Forecast" : "Production Forecast"}
          </CardTitle>
          {isAI && (
            <Badge variant="secondary" className="gap-1">
              <ActivityIcon className="h-3 w-3" />
              AI Generated
            </Badge>
          )}
        </div>
        {isAI && (
          <p className="text-xs text-muted-foreground pt-1">
            Optimized forecast considering real-world construction dynamics
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="max-h-[200px] overflow-y-auto space-y-2">
          {forecast.map((day) => (
            <div
              key={day.day}
              className="flex justify-between items-center text-sm py-1 px-2 hover:bg-muted/50 rounded"
            >
              <span className="text-muted-foreground">
                Day {day.day} ({new Date(day.date).toLocaleDateString()})
              </span>
              <Badge variant="outline">{day.targetUnits.toFixed(1)} units</Badge>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span>Total Production:</span>
            <span>{totalProduction.toFixed(1)} units</span>
          </div>
          {isAI && (
            <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t">
              <div>
                <p className="text-muted-foreground">Peak Day</p>
                <p className="font-semibold">{peakDay.toFixed(1)} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Day</p>
                <p className="font-semibold">{avgDay.toFixed(1)} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">Min Day</p>
                <p className="font-semibold">{minDay.toFixed(1)} units</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
