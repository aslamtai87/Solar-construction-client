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
        <div className="flex items-center gap-4">
          {/* Expand Icon */}
          <button
            className="text-gray-500 hover:text-gray-700"
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
          <div className={cn("flex items-center justify-center w-8 h-8 rounded-full",
            activity.status === "completed" && " text-green-600",
            activity.status === "in progress" && " text-blue-600",
            activity.status === "delayed" && " text-red-600",
            activity.status === "not started" && "text-gray-600"
          )}>
            {getStatusIcon(activity.status)}
          </div>

          {/* Activity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-base truncate">
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
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{activity.crew}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {activity.startDate} → {activity.endDate}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <div className="font-semibold">
                {activity.progress.current.toLocaleString()} /{" "}
                {activity.progress.total.toLocaleString()}
              </div>
              {/* Progress Bar */}
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
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
              {/* <div
                className={cn(
                  "text-xs mt-1",
                  activity.outputVariance >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {activity.outputVariance >= 0 ? "↗" : "↘"}{" "}
                {Math.abs(activity.outputVariance)}%
              </div> */}
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">
                Output/Day
              </div>
              <div className="font-semibold">{activity.outputPerDay}</div>
              <div
                className={cn(
                  "text-xs mt-1",
                  activity.outputVariance >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {activity.outputVariance >= 0 ? "↗" : "↘"}{" "}
                {Math.abs(activity.outputVariance)}%
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">
                Cost/Unit
              </div>
              <div className="font-semibold">${activity.costPerUnit}</div>
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
        <div className="border-t bg-gray-50/50 p-6">
          <div className="grid grid-cols-4 gap-6">
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
          {activity.dependencies && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm">
                <span className="text-muted-foreground">Dependencies: </span>
                <span className="font-medium">{activity.dependencies}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
