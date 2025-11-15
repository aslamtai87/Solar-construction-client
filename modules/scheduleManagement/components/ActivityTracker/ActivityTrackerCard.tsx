"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Calendar, Users, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CircleCheckBig, Play, TriangleAlert } from 'lucide-react';

interface ActivityTrackerCardProps {
  activity: {
    id: string;
    name: string;
    status: "completed" | "in progress" | "delayed" | "not started";
    phase: string;
    crew: string;
    startDate: string;
    endDate: string;
    progress: {
      current: number;
      total: number;
    };
    outputPerDay: number;
    costPerUnit: number;
    outputVariance: number;
    costVariance: number;
    duration: {
      target: number;
      actual: number;
      variance: number;
    };
    units: {
      target: number;
      completed: number;
      remaining: number;
    };
    productivity: {
      targetRate: number;
      actualRate: number;
      efficiency: number;
    };
    cost: {
      estimated: number;
      actual: number;
      variance: number;
      totalLabourCost?: number;
      totalEquipmentCost?: number;
      totalCost?: number;
    };
    dependencies?: string;
  };
}

export const ActivityTrackerCard: React.FC<ActivityTrackerCardProps> = ({
  activity,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200";
      case "not started":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CircleCheckBig />;
      case "in progress":
        return <Play />;
      case "delayed":
        return <TriangleAlert />;
      case "not started":
        return <Circle />;
      default:
        return "";
    }
  };

  const progressPercentage = (activity.progress.current / activity.progress.total) * 100;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow p-0">
      {/* Main Row */}
      <div
        className="p-2 px-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start md:items-center gap-2 md:gap-4 flex-wrap md:flex-nowrap">
          {/* Expand Icon */}
          <button
            className="text-gray-500 hover:text-gray-700 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>

          {/* Status Icon */}
          <div className={cn("flex items-center justify-center w-8 h-8 rounded-full shrink-0",
            activity.status === "completed" && " text-green-600",
            activity.status === "in progress" && " text-blue-600",
            activity.status === "delayed" && " text-red-600",
            activity.status === "not started" && "text-gray-600"
          )}>
            {getStatusIcon(activity.status)}
          </div>

          {/* Activity Info */}
          <div className="flex-1 min-w-0 w-full md:w-auto">
            <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
              <h3 className="font-semibold text-sm md:text-base truncate">
                {activity.name}
              </h3>
              <Badge
                variant="outline"
                className={cn("text-xs", getStatusColor(activity.status))}
              >
                {activity.status}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {activity.phase}
              </Badge>
            </div>
            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span className="truncate">{activity.crew}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {activity.startDate} → {activity.endDate}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <div className="font-semibold text-sm md:text-base">
                {activity.progress.current.toLocaleString()} /{" "}
                {activity.progress.total.toLocaleString()}
              </div>
              {/* Progress Bar */}
              <div className="w-20 md:w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    activity.status === "completed" && "bg-green-600",
                    activity.status === "in progress" && "bg-blue-600",
                    activity.status === "delayed" && "bg-red-600"
                  )}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">
                Output/Day
              </div>
              <div className="font-semibold text-sm md:text-base">{activity.outputPerDay}</div>
              <div
                className={cn(
                  "text-xs mt-1",
                  activity.outputVariance >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {activity.outputVariance >= 0 ? "↗" : "↘"}{" "}
                {Math.abs(activity.outputVariance).toFixed(1)}%
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">
                Cost/Unit
              </div>
              <div className="font-semibold text-sm md:text-base">${activity.costPerUnit}</div>
              <div
                className={cn(
                  "text-xs mt-1",
                  activity.costVariance <= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {activity.costVariance <= 0 ? "↗" : "↘"}{" "}
                {Math.abs(activity.costVariance)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t bg-gray-50/50 p-4 md:p-6">
          {/* Total Cost Summary */}
          {activity.cost.totalCost !== undefined && (
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <h4 className="font-semibold text-sm mb-3">Total Cost Breakdown</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Labour Cost</div>
                  <div className="text-lg font-bold text-blue-600">
                    ${(activity.cost.totalLabourCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Equipment Cost</div>
                  <div className="text-lg font-bold text-orange-600">
                    ${(activity.cost.totalEquipmentCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Total Cost</div>
                  <div className="text-lg font-bold text-purple-600">
                    ${(activity.cost.totalCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Duration */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Duration</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-medium">
                    {activity.duration.target} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Actual:</span>
                  <span className="font-medium">
                    {activity.duration.actual} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Variance:</span>
                  <span
                    className={cn(
                      "font-medium",
                      activity.duration.variance < 0
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {activity.duration.variance} days
                  </span>
                </div>
              </div>
            </div>

            {/* Units Installed */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Units Installed</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-medium">
                    {activity.units.target.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-medium">
                    {activity.units.completed.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-medium">
                    {activity.units.remaining.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Productivity */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Productivity</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target Rate:</span>
                  <span className="font-medium">
                    {activity.productivity.targetRate}/day
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Actual Rate:</span>
                  <span className="font-medium">
                    {activity.productivity.actualRate}/day
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-medium">
                    {activity.productivity.efficiency}%
                  </span>
                </div>
              </div>
            </div>

            {/* Cost Performance */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Cost Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Cost/Unit:</span>
                  <span className="font-medium">
                    ${activity.cost.estimated}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Actual Cost/Unit:
                  </span>
                  <span className="font-medium">${activity.cost.actual}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Variance:</span>
                  <span
                    className={cn(
                      "font-medium",
                      activity.cost.variance < 0
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {activity.cost.variance}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dependencies */}
          {/* {activity.dependencies && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm">
                <span className="text-muted-foreground">Dependencies: </span>
                <span className="font-medium">{activity.dependencies}</span>
              </div>
            </div>
          )} */}
        </div>
      )}
    </Card>
  );
};
