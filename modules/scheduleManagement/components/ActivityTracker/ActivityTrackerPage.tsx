"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ActivityTrackerCard } from "./ActivityTrackerCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetScheduleTracker, usePhases } from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import { ScheduleTracker } from "@/lib/types/schedule";

export const ActivityTrackerPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  
  const { selectedProject } = useProjectStore();
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch tracker data
  const { data: trackerData, isLoading } = useGetScheduleTracker({
    // projectId: selectedProject?.id!,
    search: debouncedSearch,
    ...(phaseFilter && { phaseId: phaseFilter }),
    limit: 100,
  } as any);

  // Fetch phases for filter dropdown
  const { data: phasesData } = usePhases({ projectId: selectedProject?.id! });

  // Transform API data to ActivityTrackerCard format
  const transformedActivities = useMemo(() => {
    if (!trackerData?.data?.result) return [];

    return trackerData.data.result.map((activity: ScheduleTracker) => {
      // Determine status based on completion and actual duration
      let status: "completed" | "in progress" | "delayed" | "not started" = "not started";
      
      if (activity.units.completionPercentage === 100) {
        status = "completed";
      } else if (activity.units.completionPercentage > 0 && activity.duration.actual > 0) {
        status = "in progress";
      }

      return {
        id: activity.id,
        name: activity.name,
        status,
        phase: activity.phase.name,
        crew: activity.crews.map((c) => c.name).join(", "),
        startDate: new Date(activity.startDate).toLocaleDateString(),
        endDate: new Date(activity.endDate).toLocaleDateString(),
        progress: {
          current: activity.units.completed,
          total: activity.units.target,
        },
        outputPerDay: activity.productivity.actualRate,
        costPerUnit: activity.cost.actualPerUnit,
        outputVariance: activity.productivity.efficiency - 100,
        costVariance: activity.cost.variance,
        duration: {
          target: activity.duration.planned,
          actual: activity.duration.actual,
          variance: activity.duration.variance,
        },
        units: {
          target: activity.units.target,
          completed: activity.units.completed,
          remaining: activity.units.remaining,
        },
        productivity: {
          targetRate: activity.productivity.targetRate,
          actualRate: activity.productivity.actualRate,
          efficiency: activity.productivity.efficiency,
        },
        cost: {
          estimated: activity.cost.estimatedPerUnit,
          actual: activity.cost.actualPerUnit,
          variance: activity.cost.variance,
          totalLabourCost: activity.cost.totalLabourCost,
          totalEquipmentCost: activity.cost.totalEquipmentCost,
          totalCost: activity.cost.totalCost,
        },
      };
    });
  }, [trackerData]);

  // Filter activities by status
  const filteredActivities = useMemo(() => {
    if (statusFilter === "All Status") return transformedActivities;
    return transformedActivities.filter((activity: any) => activity.status === statusFilter);
  }, [transformedActivities, statusFilter]);

  // Available statuses
  const statuses = ["completed", "in progress", "delayed", "not started"];

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-lg border p-2">
        <h2 className="text-xl font-bold mb-4">Activity Search & Filters</h2>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Phase Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {phaseFilter ? phasesData?.find((p: any) => p.id === phaseFilter)?.name || "All Phases" : "All Phases"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setPhaseFilter(undefined)}>
                All Phases
              </DropdownMenuItem>
              {phasesData?.map((phase: any) => (
                <DropdownMenuItem
                  key={phase.id}
                  onClick={() => setPhaseFilter(phase.id)}
                >
                  {phase.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("All Status")}>
                All Status
              </DropdownMenuItem>
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Activity Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center text-muted-foreground">
          No activities found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity: any) => (
            <ActivityTrackerCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};
