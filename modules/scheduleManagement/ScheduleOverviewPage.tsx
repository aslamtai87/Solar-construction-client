"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity as ActivityIcon,
  TrendingUp,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  FolderKanban,
} from "lucide-react";
import { Phase, Activity, SubActivity } from "@/lib/types/schedule";
import { ProductionConfiguration, DailyProduction, Crew } from "@/lib/types/production";
import ActivityTrackerItem from "./components/Overview/ActivityTrackerItem";
import ActivityTrackerTable from "./components/Overview/ActivityTrackerTable";
import UpdateProgressDialog from "./components/Overview/UpdateProgressDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ScheduleOverviewPage = () => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | "all">("all");
  const [updatingActivity, setUpdatingActivity] = useState<Activity | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table"); // Toggle between views

  // Sample data - replace with actual data
  const [phases] = useState<Phase[]>([
    {
      id: "1",
      projectId: "project-1",
      title: "Planning & Design",
      description: "Initial project planning and design phase",
      status: "completed",
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      projectId: "project-1",
      title: "Construction",
      description: "Main construction phase",
      status: "in-progress",
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: "act-1",
      phaseId: "2",
      phaseName: "Construction",
      name: "Panel Installation",
      units: 1000,
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      duration: 22,
      workingDays: { type: "weekdays" },
      order: 1,
      subActivities: [
        {
          id: "sub-1",
          parentActivityId: "act-1",
          phaseId: "2",
          name: "Mounting Structure Installation",
          units: 500,
          startDate: "2024-03-01",
          endDate: "2024-03-15",
          duration: 11,
          workingDays: { type: "weekdays" },
          order: 1,
        },
        {
          id: "sub-2",
          parentActivityId: "act-1",
          phaseId: "2",
          name: "Solar Panel Mounting",
          units: 500,
          startDate: "2024-03-16",
          endDate: "2024-03-31",
          duration: 11,
          workingDays: { type: "weekdays" },
          order: 2,
        },
      ],
    },
    {
      id: "act-2",
      phaseId: "2",
      phaseName: "Construction",
      name: "Electrical Wiring",
      units: 800,
      startDate: "2024-03-15",
      endDate: "2024-04-10",
      duration: 18,
      workingDays: { type: "weekdays" },
      order: 2,
      subActivities: [
        {
          id: "sub-3",
          parentActivityId: "act-2",
          phaseId: "2",
          name: "Cable Laying",
          units: 400,
          startDate: "2024-03-15",
          endDate: "2024-03-28",
          duration: 9,
          workingDays: { type: "weekdays" },
          order: 1,
        },
        {
          id: "sub-4",
          parentActivityId: "act-2",
          phaseId: "2",
          name: "Connection & Testing",
          units: 400,
          startDate: "2024-03-29",
          endDate: "2024-04-10",
          duration: 9,
          workingDays: { type: "weekdays" },
          order: 2,
        },
      ],
    },
  ]);

  const [crews] = useState<Crew[]>([
    {
      id: "crew-1",
      name: "Installation Team A",
      numberOfPeople: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "crew-2",
      name: "Electrical Team B",
      numberOfPeople: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [productionConfigs] = useState<ProductionConfiguration[]>([
    // Sub-activity 1: Mounting Structure Installation - Crew 1
    {
      id: "config-1",
      activityId: "act-1",
      subActivityId: "sub-1",
      activityName: "Mounting Structure Installation",
      totalUnits: 500,
      duration: 11,
      method: "constant",
      crewId: "crew-1",
      dailyProduction: Array.from({ length: 11 }, (_, i) => ({
        day: i + 1,
        date: new Date(2024, 2, i + 1).toISOString().split("T")[0],
        targetUnits: 45.45,
        actualUnits: 0,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Sub-activity 2: Solar Panel Mounting - Crew 1 & Crew 2
    {
      id: "config-2",
      activityId: "act-1",
      subActivityId: "sub-2",
      activityName: "Solar Panel Mounting",
      totalUnits: 250,
      duration: 11,
      method: "constant",
      crewId: "crew-1",
      dailyProduction: Array.from({ length: 11 }, (_, i) => ({
        day: i + 1,
        date: new Date(2024, 2, i + 16).toISOString().split("T")[0],
        targetUnits: 22.73,
        actualUnits: 0,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "config-3",
      activityId: "act-1",
      subActivityId: "sub-2",
      activityName: "Solar Panel Mounting",
      totalUnits: 250,
      duration: 11,
      method: "constant",
      crewId: "crew-2",
      dailyProduction: Array.from({ length: 11 }, (_, i) => ({
        day: i + 1,
        date: new Date(2024, 2, i + 16).toISOString().split("T")[0],
        targetUnits: 22.73,
        actualUnits: 0,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Sub-activity 3: Cable Laying - Crew 2
    {
      id: "config-4",
      activityId: "act-2",
      subActivityId: "sub-3",
      activityName: "Cable Laying",
      totalUnits: 400,
      duration: 9,
      method: "constant",
      crewId: "crew-2",
      dailyProduction: Array.from({ length: 9 }, (_, i) => ({
        day: i + 1,
        date: new Date(2024, 2, i + 15).toISOString().split("T")[0],
        targetUnits: 44.44,
        actualUnits: 0,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Sub-activity 4: Connection & Testing - Crew 1 & Crew 2
    {
      id: "config-5",
      activityId: "act-2",
      subActivityId: "sub-4",
      activityName: "Connection & Testing",
      totalUnits: 200,
      duration: 9,
      method: "constant",
      crewId: "crew-1",
      dailyProduction: Array.from({ length: 9 }, (_, i) => ({
        day: i + 1,
        date: new Date(2024, 2, i + 29).toISOString().split("T")[0],
        targetUnits: 22.22,
        actualUnits: 0,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "config-6",
      activityId: "act-2",
      subActivityId: "sub-4",
      activityName: "Connection & Testing",
      totalUnits: 200,
      duration: 9,
      method: "constant",
      crewId: "crew-2",
      dailyProduction: Array.from({ length: 9 }, (_, i) => ({
        day: i + 1,
        date: new Date(2024, 2, i + 29).toISOString().split("T")[0],
        targetUnits: 22.22,
        actualUnits: 0,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [updateProgressOpen, setUpdateProgressOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleUpdateProgress = (activity: Activity) => {
    setSelectedActivity(activity);
    setUpdateProgressOpen(true);
  };

  const handleSaveProgress = (updates: Map<string, Map<string, DailyProduction[]>>) => {
    console.log("Saving progress updates:", updates);
    // Here you would update the actual data
    // updates structure: Map<subActivityId, Map<crewId, DailyProduction[]>>
    setUpdateProgressOpen(false);
  };

  // Prepare crew progress data for the dialog
  const getCrewProgressData = (activity: Activity) => {
    const crewProgressMap = new Map<string, Array<{ crew: Crew; dailyData: DailyProduction[] }>>();

    if (!activity.subActivities) return crewProgressMap;

    activity.subActivities.forEach((subActivity) => {
      // Find all production configs for this sub-activity
      const subActivityConfigs = productionConfigs.filter(
        (config) => config.subActivityId === subActivity.id
      );

      const crewProgressArray = subActivityConfigs.map((config) => {
        const crew = crews.find((c) => c.id === config.crewId);
        return {
          crew: crew || {
            id: config.crewId || "unknown",
            name: "Unknown Crew",
            numberOfPeople: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          dailyData: config.dailyProduction,
        };
      });

      if (crewProgressArray.length > 0) {
        crewProgressMap.set(subActivity.id, crewProgressArray);
      }
    });

    return crewProgressMap;
  };

  // Calculate overview stats
  const totalActivities = activities.length;
  const completedActivities = 0; // Calculate based on actual data
  const onTrackActivities = Math.floor(totalActivities * 0.7);
  const delayedActivities = totalActivities - onTrackActivities - completedActivities;

  const totalUnits = activities.reduce((sum, act) => sum + act.units, 0);
  const completedUnits = Math.floor(totalUnits * 0.45); // 45% completed
  const overallProgress = (completedUnits / totalUnits) * 100;

  const filteredActivities =
    selectedPhaseId === "all"
      ? activities
      : activities.filter((a) => a.phaseId === selectedPhaseId);

  const getProductionConfig = (activityId: string) => {
    return productionConfigs.find((c) => c.activityId === activityId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Schedule Overview</h1>
        <p className="text-muted-foreground">
          Monitor project progress, track activities, and manage performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ActivityIcon className="h-4 w-4" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedUnits.toLocaleString()} / {totalUnits.toLocaleString()} units
            </p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* On Track Activities */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              On Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {onTrackActivities}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((onTrackActivities / totalActivities) * 100).toFixed(0)}% of activities
            </p>
            <Badge variant="default" className="mt-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              Good
            </Badge>
          </CardContent>
        </Card>

        {/* Delayed Activities */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Delayed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {delayedActivities}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((delayedActivities / totalActivities) * 100).toFixed(0)}% of activities
            </p>
            <Badge variant="destructive" className="mt-3">
              <Clock className="h-3 w-3 mr-1" />
              Needs Attention
            </Badge>
          </CardContent>
        </Card>

        {/* Active Phases */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              Active Phases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {phases.filter((p) => p.status === "in-progress").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {phases.length} total phases
            </p>
            <div className="mt-3 flex gap-1">
              {phases.map((phase) => (
                <div
                  key={phase.id}
                  className={`h-2 flex-1 rounded-full ${
                    phase.status === "completed"
                      ? "bg-green-500"
                      : phase.status === "in-progress"
                      ? "bg-orange-500"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-1">
          <TabsTrigger value="tracker" className="gap-2">
            <ActivityIcon className="h-4 w-4" />
            Activity Tracker
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-4">
          {/* Phase Filter & View Toggle */}
          <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <label htmlFor="phase-filter-overview" className="text-sm font-medium">
                Filter by Phase
              </label>
              <p className="text-xs text-muted-foreground">
                View activities for a specific phase
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === "table" ? "default" : "outline"}
                onClick={() => setViewMode("table")}
              >
                Table View
              </Button>
              <Button
                size="sm"
                variant={viewMode === "cards" ? "default" : "outline"}
                onClick={() => setViewMode("cards")}
              >
                Card View
              </Button>
            </div>
            <Select value={selectedPhaseId} onValueChange={setSelectedPhaseId}>
              <SelectTrigger id="phase-filter-overview" className="w-[250px]">
                <SelectValue placeholder="Select phase..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                {phases.map((phase) => (
                  <SelectItem key={phase.id} value={phase.id}>
                    {phase.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Activity Tracker List */}
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <ActivityIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No activities found</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    No activities available for the selected phase.
                  </p>
                </CardContent>
              </Card>
            ) : viewMode === "table" ? (
              <ActivityTrackerTable
                activities={filteredActivities}
                onUpdateProgress={handleUpdateProgress}
              />
            ) : (
              filteredActivities.map((activity) => {
                const config = productionConfigs.find(
                  (c) => c.activityId === activity.id
                );

                // Check if activity has sub-activities
                const hasSubActivities = activity.subActivities && activity.subActivities.length > 0;

                return (
                  <div key={activity.id} className="space-y-2">
                    {/* Parent Activity */}
                    <ActivityTrackerItem
                      activity={activity}
                      productionConfig={config}
                      onUpdateProgress={handleUpdateProgress}
                    />

                    {/* Sub-Activities */}
                    {hasSubActivities && (
                      <div className="ml-8 space-y-2">
                        {activity.subActivities?.map((subActivity) => {
                          const subConfig = productionConfigs.find(
                            (c) => c.subActivityId === subActivity.id
                          );
                          return (
                            <ActivityTrackerItem
                              key={subActivity.id}
                              activity={activity}
                              subActivity={subActivity}
                              productionConfig={subConfig}
                              onUpdateProgress={handleUpdateProgress}
                              isSubActivity={true}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Update Progress Dialog */}
      {selectedActivity && (
        <UpdateProgressDialog
          open={updateProgressOpen}
          onOpenChange={setUpdateProgressOpen}
          activity={selectedActivity}
          subActivities={selectedActivity.subActivities || []}
          crewProgressData={getCrewProgressData(selectedActivity)}
          onSave={handleSaveProgress}
        />
      )}
    </div>
  );
};

export default ScheduleOverviewPage;
