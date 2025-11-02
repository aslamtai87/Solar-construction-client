"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity as ActivityIcon,
  Zap,
} from "lucide-react";
import { Activity, SubActivity } from "@/lib/types/schedule";
import { ProductionConfiguration } from "@/lib/types/production";
import { cn } from "@/lib/utils";

interface ActivityTrackerItemProps {
  activity: Activity;
  subActivity?: SubActivity;
  productionConfig?: ProductionConfiguration;
  onUpdateProgress: (activity: Activity) => void; // Only pass activity, not sub-activity
  isSubActivity?: boolean;
}

const ActivityTrackerItem = ({
  activity,
  subActivity,
  productionConfig,
  onUpdateProgress,
  isSubActivity = false,
}: ActivityTrackerItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use sub-activity data if provided, otherwise use activity data
  const targetItem = subActivity || activity;
  const hasSubActivities = !subActivity && activity.subActivities && activity.subActivities.length > 0;

  // Calculate actual progress (mock data - replace with real data)
  const actualUnitsCompleted = targetItem.units * 0.45; // 45% completed (example)
  const progressPercentage = (actualUnitsCompleted / targetItem.units) * 100;

  // Calculate dates
  const startDate = new Date(targetItem.startDate);
  const endDate = new Date(targetItem.endDate);
  const today = new Date();
  const totalDays = targetItem.duration;
  const daysPassed = Math.min(
    Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    totalDays
  );
  const daysRemaining = Math.max(totalDays - daysPassed, 0);

  // Calculate planned vs actual
  const plannedUnitsToDate = productionConfig
    ? productionConfig.dailyProduction
        .slice(0, daysPassed)
        .reduce((sum, day) => sum + day.targetUnits, 0)
    : (targetItem.units / totalDays) * daysPassed;

  const unitsVariance = actualUnitsCompleted - plannedUnitsToDate;
  const unitsVariancePercent = (unitsVariance / plannedUnitsToDate) * 100;

  // Calculate productivity
  const plannedDailyRate = targetItem.units / totalDays;
  const actualDailyRate = daysPassed > 0 ? actualUnitsCompleted / daysPassed : 0;
  const productivityVariance =
    ((actualDailyRate - plannedDailyRate) / plannedDailyRate) * 100;

  // Duration variance
  const projectedDaysToComplete =
    actualDailyRate > 0 ? targetItem.units / actualDailyRate : totalDays;
  const durationVariance = projectedDaysToComplete - totalDays;

  const getVarianceBadge = (variance: number, isPercentage: boolean = false) => {
    const isPositive = variance >= 0;
    const displayValue = isPercentage
      ? `${variance >= 0 ? "+" : ""}${variance.toFixed(1)}%`
      : `${variance >= 0 ? "+" : ""}${variance.toFixed(1)}`;

    return (
      <Badge
        variant={isPositive ? "default" : "destructive"}
        className={cn(
          "text-xs",
          isPositive
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        )}
      >
        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        {displayValue}
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className={cn(
          "cursor-pointer hover:bg-muted/50 transition-colors",
          isSubActivity && "pl-12 bg-muted/20"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                {targetItem.name}
                {isSubActivity && (
                  <Badge variant="outline" className="text-xs">
                    Sub-Activity
                  </Badge>
                )}
                {hasSubActivities && (
                  <Badge variant="secondary" className="text-xs">
                    {activity.subActivities?.length} sub-activities
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Phase: {targetItem.phaseName || "N/A"} • {targetItem.startDate} to {targetItem.endDate}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="text-sm font-semibold">
                {actualUnitsCompleted.toFixed(0)} / {targetItem.units} units
              </p>
            </div>
            <div className="w-32">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-center mt-1">
                {progressPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 pt-6 border-t">
          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Duration */}
            <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                <h4 className="font-semibold text-sm">Duration</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Days Passed:</span>
                  <span className="font-medium">{daysPassed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Days Remaining:</span>
                  <span className="font-medium">{daysRemaining}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Duration:</span>
                  <span className="font-medium">{totalDays} days</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Variance:</span>
                  {getVarianceBadge(durationVariance)}
                </div>
              </div>
            </div>

            {/* Units Installed */}
            <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2">
                <ActivityIcon className="h-4 w-4 text-blue-500" />
                <h4 className="font-semibold text-sm">Units Installed</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Planned to Date:</span>
                  <span className="font-medium">{plannedUnitsToDate.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Actual to Date:</span>
                  <span className="font-medium">{actualUnitsCompleted.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Units:</span>
                  <span className="font-medium">{activity.units}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Variance:</span>
                  {getVarianceBadge(unitsVariancePercent, true)}
                </div>
              </div>
            </div>

            {/* Productivity */}
            <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <h4 className="font-semibold text-sm">Productivity</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Planned Rate:</span>
                  <span className="font-medium">{plannedDailyRate.toFixed(1)}/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Actual Rate:</span>
                  <span className="font-medium">{actualDailyRate.toFixed(1)}/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-medium">
                    {((actualDailyRate / plannedDailyRate) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Variance:</span>
                  {getVarianceBadge(productivityVariance, true)}
                </div>
              </div>
            </div>
          </div>

          {/* Update Progress Button - Only show if HAS sub-activities (parent activity with crews) */}
          {hasSubActivities && !isSubActivity && (
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={() => onUpdateProgress(activity)} className="gap-2">
                <Edit className="h-4 w-4" />
                Update Progress
              </Button>
            </div>
          )}

          {/* Message for parent activities WITHOUT sub-activities */}
          {!hasSubActivities && !isSubActivity && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                This activity has no sub-activities configured. Please create sub-activities and assign crews to track progress.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default ActivityTrackerItem;
