"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, ChevronRight, ChevronDown, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Activity, SubActivity } from "@/lib/types/schedule";
import { cn } from "@/lib/utils";

interface ActivityTrackerTableProps {
  activities: Activity[];
  onUpdateProgress: (activity: Activity) => void;
}

const ActivityTrackerTable = ({
  activities,
  onUpdateProgress,
}: ActivityTrackerTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };
  // Mock progress data - replace with real data
  const getProgress = (item: Activity | SubActivity) => {
    return (item.units * 0.45) / item.units * 100; // 45% for demo
  };

  const getActualUnits = (item: Activity | SubActivity) => {
    return Math.floor(item.units * 0.45);
  };

  // Calculate detailed metrics for expanded view
  const getDetailedMetrics = (item: Activity | SubActivity) => {
    const today = new Date();
    const startDate = new Date(item.startDate);
    const totalDays = item.duration;
    const daysPassed = Math.min(
      Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      totalDays
    );
    const daysRemaining = Math.max(totalDays - daysPassed, 0);

    const plannedUnitsToDate = (item.units / totalDays) * daysPassed;
    const actualUnitsCompleted = getActualUnits(item);
    const unitsVariance = actualUnitsCompleted - plannedUnitsToDate;
    const unitsVariancePercent = (unitsVariance / plannedUnitsToDate) * 100;

    const plannedDailyRate = item.units / totalDays;
    const actualDailyRate = daysPassed > 0 ? actualUnitsCompleted / daysPassed : 0;
    const productivityVariance = ((actualDailyRate - plannedDailyRate) / plannedDailyRate) * 100;

    const projectedDaysToComplete = actualDailyRate > 0 ? item.units / actualDailyRate : totalDays;
    const durationVariance = projectedDaysToComplete - totalDays;

    return {
      daysPassed,
      daysRemaining,
      durationVariance,
      plannedUnitsToDate,
      actualUnitsCompleted,
      unitsVariance,
      unitsVariancePercent,
      plannedDailyRate,
      actualDailyRate,
      productivityVariance,
    };
  };

  const getVarianceBadge = (variance: number, label: string) => {
    if (variance >= 0) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{variance.toFixed(1)} {label}
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <TrendingDown className="h-3 w-3 mr-1" />
        {variance.toFixed(1)} {label}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="text-left p-3 font-medium text-sm w-[40%]">Activity / Sub-Activity</th>
            <th className="text-center p-3 font-medium text-sm w-[120px]">Duration</th>
            <th className="text-left p-3 font-medium text-sm w-[180px]">Progress</th>
            <th className="text-center p-3 font-medium text-sm w-[140px]">Units</th>
            <th className="text-center p-3 font-medium text-sm w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => {
            const hasSubActivities = activity.subActivities && activity.subActivities.length > 0;
            const activityProgress = getProgress(activity);
            const activityActual = getActualUnits(activity);
            const isExpanded = expandedRows.has(activity.id);
            const metrics = getDetailedMetrics(activity);

            return (
              <React.Fragment key={activity.id}>
                {/* Parent Activity Row */}
                <tr 
                  className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => toggleRow(activity.id)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <div className="font-medium">{activity.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.phaseName} • {activity.startDate} to {activity.endDate}
                        </div>
                      </div>
                      {hasSubActivities && (
                        <Badge variant="secondary" className="text-xs ml-2">
                          {activity.subActivities?.length} sub-activities
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-sm font-medium">{activity.duration} days</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Progress value={activityProgress} className="h-2 flex-1" />
                      <span className="text-sm font-medium min-w-[45px]">
                        {activityProgress.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-sm font-medium">
                      {activityActual} / {activity.units}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {hasSubActivities && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateProgress(activity);
                        }}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Update
                      </Button>
                    )}
                  </td>
                </tr>

                {/* Expanded Details Row */}
                {isExpanded && (
                  <tr className="border-b bg-muted/20">
                    <td colSpan={5} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Duration */}
                        <div className="space-y-2 p-3 rounded-lg border bg-background">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            <h4 className="font-semibold text-sm">Duration</h4>
                          </div>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Days Passed:</span>
                              <span className="font-medium">{metrics.daysPassed}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Days Remaining:</span>
                              <span className="font-medium">{metrics.daysRemaining}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Duration:</span>
                              <span className="font-medium">{activity.duration} days</span>
                            </div>
                            <div className="pt-2">
                              {getVarianceBadge(metrics.durationVariance, "days")}
                            </div>
                          </div>
                        </div>

                        {/* Units */}
                        <div className="space-y-2 p-3 rounded-lg border bg-background">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <h4 className="font-semibold text-sm">Units</h4>
                          </div>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Planned to Date:</span>
                              <span className="font-medium">{metrics.plannedUnitsToDate.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Actual Completed:</span>
                              <span className="font-medium">{metrics.actualUnitsCompleted}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Units:</span>
                              <span className="font-medium">{activity.units}</span>
                            </div>
                            <div className="pt-2">
                              {getVarianceBadge(metrics.unitsVariancePercent, "%")}
                            </div>
                          </div>
                        </div>

                        {/* Productivity */}
                        <div className="space-y-2 p-3 rounded-lg border bg-background">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <h4 className="font-semibold text-sm">Productivity</h4>
                          </div>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Planned Rate:</span>
                              <span className="font-medium">{metrics.plannedDailyRate.toFixed(1)}/day</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Actual Rate:</span>
                              <span className="font-medium">{metrics.actualDailyRate.toFixed(1)}/day</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Efficiency:</span>
                              <span className="font-medium">
                                {((metrics.actualDailyRate / metrics.plannedDailyRate) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="pt-2">
                              {getVarianceBadge(metrics.productivityVariance, "%")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Sub-Activity Rows */}
                {hasSubActivities &&
                  activity.subActivities?.map((subActivity) => {
                    const subProgress = getProgress(subActivity);
                    const subActual = getActualUnits(subActivity);
                    const isSubExpanded = expandedRows.has(subActivity.id);
                    const subMetrics = getDetailedMetrics(subActivity);

                    return (
                      <React.Fragment key={subActivity.id}>
                        <tr
                          className="border-b bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer"
                          onClick={() => toggleRow(subActivity.id)}
                        >
                          <td className="p-3 pl-12">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                {isSubExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              <div>
                                <div className="font-medium text-sm flex items-center gap-2">
                                  {subActivity.name}
                                  <Badge variant="outline" className="text-xs">
                                    Sub-Activity
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {subActivity.startDate} to {subActivity.endDate}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="text-sm">{subActivity.duration} days</div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Progress value={subProgress} className="h-2 flex-1" />
                              <span className="text-sm min-w-[45px]">
                                {subProgress.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="text-sm">
                              {subActual} / {subActivity.units}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {/* Empty for sub-activities */}
                          </td>
                        </tr>

                        {/* Sub-Activity Expanded Details */}
                        {isSubExpanded && (
                          <tr className="border-b bg-muted/30">
                            <td colSpan={5} className="p-4 pl-16">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Duration */}
                                <div className="space-y-2 p-3 rounded-lg border bg-background">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-orange-500" />
                                    <h4 className="font-semibold text-sm">Duration</h4>
                                  </div>
                                  <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Days Passed:</span>
                                      <span className="font-medium">{subMetrics.daysPassed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Days Remaining:</span>
                                      <span className="font-medium">{subMetrics.daysRemaining}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Total Duration:</span>
                                      <span className="font-medium">{subActivity.duration} days</span>
                                    </div>
                                    <div className="pt-2">
                                      {getVarianceBadge(subMetrics.durationVariance, "days")}
                                    </div>
                                  </div>
                                </div>

                                {/* Units */}
                                <div className="space-y-2 p-3 rounded-lg border bg-background">
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-blue-500" />
                                    <h4 className="font-semibold text-sm">Units</h4>
                                  </div>
                                  <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Planned to Date:</span>
                                      <span className="font-medium">{subMetrics.plannedUnitsToDate.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Actual Completed:</span>
                                      <span className="font-medium">{subMetrics.actualUnitsCompleted}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Total Units:</span>
                                      <span className="font-medium">{subActivity.units}</span>
                                    </div>
                                    <div className="pt-2">
                                      {getVarianceBadge(subMetrics.unitsVariancePercent, "%")}
                                    </div>
                                  </div>
                                </div>

                                {/* Productivity */}
                                <div className="space-y-2 p-3 rounded-lg border bg-background">
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <h4 className="font-semibold text-sm">Productivity</h4>
                                  </div>
                                  <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Planned Rate:</span>
                                      <span className="font-medium">{subMetrics.plannedDailyRate.toFixed(1)}/day</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Actual Rate:</span>
                                      <span className="font-medium">{subMetrics.actualDailyRate.toFixed(1)}/day</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Efficiency:</span>
                                      <span className="font-medium">
                                        {((subMetrics.actualDailyRate / subMetrics.plannedDailyRate) * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                    <div className="pt-2">
                                      {getVarianceBadge(subMetrics.productivityVariance, "%")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTrackerTable;
