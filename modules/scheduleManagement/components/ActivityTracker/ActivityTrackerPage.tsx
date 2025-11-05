"use client";

import React, { useState } from "react";
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

// Sample data - this will come from your API
const sampleActivities = [
  {
    id: "1",
    name: "Install Solar Racking Tables",
    status: "completed" as const,
    phase: "Structural",
    crew: "Ironworkers A",
    startDate: "2025-01-05",
    endDate: "2025-01-14",
    progress: {
      current: 1000,
      total: 1000,
    },
    outputPerDay: 111,
    costPerUnit: 41,
    outputVariance: 11.0,
    costVariance: 8.9,
    duration: {
      target: 10,
      actual: 9,
      variance: -1,
    },
    units: {
      target: 1000,
      completed: 1000,
      remaining: 0,
    },
    productivity: {
      targetRate: 100,
      actualRate: 111,
      efficiency: 111,
    },
    cost: {
      estimated: 45,
      actual: 41,
      variance: -8.9,
    },
    dependencies: "None",
  },
  {
    id: "2",
    name: "Mount Solar Modules",
    status: "in progress" as const,
    phase: "Module Installation",
    crew: "Electrical Crew B",
    startDate: "2025-01-16",
    endDate: "2025-02-08",
    progress: {
      current: 3200,
      total: 5000,
    },
    outputPerDay: 229,
    costPerUnit: 13.5,
    outputVariance: 8.4,
    costVariance: 12.5,
    duration: {
      target: 20,
      actual: 14,
      variance: -6,
    },
    units: {
      target: 5000,
      completed: 3200,
      remaining: 1800,
    },
    productivity: {
      targetRate: 250,
      actualRate: 229,
      efficiency: 91.6,
    },
    cost: {
      estimated: 12,
      actual: 13.5,
      variance: 12.5,
    },
  },
  {
    id: "3",
    name: "Trench & Install DC Conduit",
    status: "in progress" as const,
    phase: "Electrical",
    crew: "Electrical Crew A",
    startDate: "2025-01-20",
    endDate: "2025-02-06",
    progress: {
      current: 1800,
      total: 2500,
    },
    outputPerDay: 164,
    costPerUnit: 9.1,
    outputVariance: 1.8,
    costVariance: 7.1,
    duration: {
      target: 15,
      actual: 11,
      variance: -4,
    },
    units: {
      target: 2500,
      completed: 1800,
      remaining: 700,
    },
    productivity: {
      targetRate: 167,
      actualRate: 164,
      efficiency: 98.2,
    },
    cost: {
      estimated: 8.5,
      actual: 9.1,
      variance: 7.1,
    },
  },
  {
    id: "4",
    name: "Install Combiner Boxes",
    status: "delayed" as const,
    phase: "Electrical",
    crew: "Electrical Crew C",
    startDate: "2025-01-25",
    endDate: "2025-02-10",
    progress: {
      current: 18,
      total: 50,
    },
    outputPerDay: 3,
    costPerUnit: 425,
    outputVariance: -52.0,
    costVariance: 32.8,
    duration: {
      target: 12,
      actual: 6,
      variance: -6,
    },
    units: {
      target: 50,
      completed: 18,
      remaining: 32,
    },
    productivity: {
      targetRate: 4.2,
      actualRate: 3,
      efficiency: 71.4,
    },
    cost: {
      estimated: 320,
      actual: 425,
      variance: 32.8,
    },
  },
  {
    id: "5",
    name: "AC Wiring & Interconnection",
    status: "not started" as const,
    phase: "Electrical",
    crew: "Electrical Crew D",
    startDate: "2025-02-11",
    endDate: "2025-02-25",
    progress: {
      current: 0,
      total: 150,
    },
    outputPerDay: 0,
    costPerUnit: 0,
    outputVariance: 0,
    costVariance: 0,
    duration: {
      target: 14,
      actual: 0,
      variance: 0,
    },
    units: {
      target: 150,
      completed: 0,
      remaining: 150,
    },
    productivity: {
      targetRate: 11,
      actualRate: 0,
      efficiency: 0,
    },
    cost: {
      estimated: 280,
      actual: 0,
      variance: 0,
    },
    dependencies: "Install Combiner Boxes",
  },
];

export const ActivityTrackerPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("All Phases");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Get unique phases from activities
  const uniquePhases = Array.from(
    new Set(sampleActivities.map((activity) => activity.phase))
  );

  // Available statuses
  const statuses = ["completed", "in progress", "delayed", "not started"];

  const filteredActivities = sampleActivities.filter((activity) => {
    const matchesSearch = activity.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPhase =
      phaseFilter === "All Phases" || activity.phase === phaseFilter;
    const matchesStatus =
      statusFilter === "All Status" || activity.status === statusFilter;

    return matchesSearch && matchesPhase && matchesStatus;
  });

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
                {phaseFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setPhaseFilter("All Phases")}>
                All Phases
              </DropdownMenuItem>
              {uniquePhases.map((phase) => (
                <DropdownMenuItem
                  key={phase}
                  onClick={() => setPhaseFilter(phase)}
                >
                  {phase}
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
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <ActivityTrackerCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};
