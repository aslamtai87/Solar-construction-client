"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, Activity } from "lucide-react";
import CrewManagement from "@/modules/scheduleManagement/components/Production/CrewManagement";
import ConfigureProductionDialog from "@/modules/scheduleManagement/components/Production/ConfigureProductionDialog";
import { Crew, ProductionConfiguration } from "@/lib/types/production";
import { Activity as ActivityType, SubActivity } from "@/lib/types/schedule";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatProductionMethod, calculateDailyProduction } from "@/lib/utils/productionCalculator";

const ProductionPlanningPage = () => {
  // Sample crews data
  const [crews, setCrews] = useState<Crew[]>([
    {
      id: "crew-1",
      name: "Installation Team A",
      numberOfPeople: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  // Sample activities data (would come from Schedule Management)
  const [activities] = useState<ActivityType[]>([
    {
      id: "act-1",
      phaseId: "1",
      phaseName: "Construction",
      name: "Panel Installation",
      units: 1000,
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      duration: 22,
      workingDays: { type: "weekdays" },
      subActivities: [
        {
          id: "sub-1",
          phaseId: "1",
          phaseName: "Construction",
          name: "Roof Mounting",
          units: 400,
          startDate: "2024-03-01",
          endDate: "2024-03-12",
          duration: 8,
          workingDays: { type: "weekdays" },
          parentActivityId: "act-1",
          order: 1,
        },
        {
          id: "sub-2",
          phaseId: "1",
          phaseName: "Construction",
          name: "Panel Placement",
          units: 600,
          startDate: "2024-03-13",
          endDate: "2024-03-31",
          duration: 14,
          workingDays: { type: "weekdays" },
          parentActivityId: "act-1",
          order: 2,
        },
      ],
      order: 1,
    },
  ]);

  const [productionConfigs, setProductionConfigs] = useState<ProductionConfiguration[]>([]);
  const [configuringActivity, setConfiguringActivity] = useState<ActivityType | null>(null);
  const [configuringSubActivity, setConfiguringSubActivity] = useState<SubActivity | null>(null);
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>("all");

  const handleCreateCrew = (data: { name: string; numberOfPeople: number }) => {
    const newCrew: Crew = {
      id: `crew-${Date.now()}`,
      name: data.name,
      numberOfPeople: data.numberOfPeople,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCrews([...crews, newCrew]);
  };

  const handleEditCrew = (
    crewId: string,
    data: { name: string; numberOfPeople: number }
  ) => {
    setCrews(
      crews.map((crew) =>
        crew.id === crewId
          ? {
              ...crew,
              name: data.name,
              numberOfPeople: data.numberOfPeople,
              updatedAt: new Date().toISOString(),
            }
          : crew
      )
    );
  };

  const handleDeleteCrew = (crewId: string) => {
    setCrews(crews.filter((c) => c.id !== crewId));
    // Also remove crew assignments from production configs
    setProductionConfigs(
      productionConfigs.map((config) =>
        config.crewId === crewId
          ? { ...config, crewId: undefined }
          : config
      )
    );
  };

  const handleConfigureActivity = (activity: ActivityType, subActivity?: SubActivity) => {
    setConfiguringActivity(activity);
    setConfiguringSubActivity(subActivity || null);
  };

  const handleSaveProductionConfig = (data: any) => {
    const targetItem = configuringSubActivity || configuringActivity;
    if (!targetItem) return;

    const config: any = {};
    
    switch (data.method) {
      case "constant":
        config.unitsPerDay = data.unitsPerDay;
        break;
      case "ramp-up":
      case "ramp-down":
        config.startUnitsPerDay = data.startUnitsPerDay;
        config.endUnitsPerDay = data.endUnitsPerDay;
        break;
      case "s-curve":
        config.peakUnitsPerDay = data.peakUnitsPerDay;
        break;
    }

    const dailyProduction = calculateDailyProduction(
      data.method,
      targetItem.units,
      targetItem.duration,
      targetItem.startDate,
      config
    );

    const newConfig: ProductionConfiguration = {
      id: `prod-config-${Date.now()}`,
      activityId: data.activityId,
      subActivityId: data.subActivityId,
      activityName: targetItem.name,
      totalUnits: targetItem.units,
      duration: targetItem.duration,
      method: data.method,
      crewId: data.crewId || undefined,
      dailyProduction,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Replace existing config if found, otherwise add new
    const existingIndex = productionConfigs.findIndex(
      (c) =>
        c.activityId === data.activityId &&
        (data.subActivityId
          ? c.subActivityId === data.subActivityId
          : !c.subActivityId)
    );

    if (existingIndex >= 0) {
      const updated = [...productionConfigs];
      updated[existingIndex] = newConfig;
      setProductionConfigs(updated);
    } else {
      setProductionConfigs([...productionConfigs, newConfig]);
    }

    setConfiguringActivity(null);
    setConfiguringSubActivity(null);
  };

  const getActivityConfig = (activityId: string, subActivityId?: string) => {
    return productionConfigs.find(
      (c) =>
        c.activityId === activityId &&
        (subActivityId ? c.subActivityId === subActivityId : !c.subActivityId)
    );
  };

  const getCrewName = (crewId?: string) => {
    if (!crewId) return "No crew assigned";
    const crew = crews.find((c) => c.id === crewId);
    return crew ? crew.name : "Unknown crew";
  };

  const filteredActivities =
    selectedActivityFilter === "all"
      ? activities
      : activities.filter((a) => a.id === selectedActivityFilter);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Production Planning</h1>
        <p className="text-muted-foreground">
          Configure production methods, manage crews, and set daily targets for activities
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-2">
          <TabsTrigger value="configuration" className="gap-2">
            <Settings className="h-4 w-4" />
            Production Configuration
          </TabsTrigger>
          <TabsTrigger value="crews" className="gap-2">
            <Users className="h-4 w-4" />
            Crew Management
          </TabsTrigger>
        </TabsList>

        {/* Production Configuration Tab */}
        <TabsContent value="configuration" className="space-y-4">
          {/* Activity Filter */}
          <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <label htmlFor="activity-filter" className="text-sm font-medium">
                Filter by Activity
              </label>
              <p className="text-xs text-muted-foreground">
                Select an activity to configure production
              </p>
            </div>
            <Select
              value={selectedActivityFilter}
              onValueChange={setSelectedActivityFilter}
            >
              <SelectTrigger id="activity-filter" className="w-[300px]">
                <SelectValue placeholder="Select activity..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                {activities.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const activityConfig = getActivityConfig(activity.id);
              const hasSubActivities = activity.subActivities && activity.subActivities.length > 0;
              
              return (
                <Card key={activity.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{activity.name}</CardTitle>
                        <CardDescription>
                          {activity.units} units over {activity.duration} days ({activity.startDate} to {activity.endDate})
                        </CardDescription>
                        {hasSubActivities && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Configure production at sub-activity level below
                          </p>
                        )}
                        {activityConfig && !hasSubActivities && (
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">
                              {formatProductionMethod(activityConfig.method)}
                            </Badge>
                            <Badge variant="secondary">
                              {getCrewName(activityConfig.crewId)}
                            </Badge>
                          </div>
                        )}
                      </div>
                      {/* Only show configure button if there are NO sub-activities */}
                      {!hasSubActivities && (
                        <Button
                          variant={activityConfig ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleConfigureActivity(activity)}
                        >
                          {activityConfig ? "Reconfigure" : "Configure"}
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  {/* Sub-activities */}
                  {activity.subActivities && activity.subActivities.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold mb-3">Sub-Activities</h4>
                        {activity.subActivities.map((sub) => {
                          const subConfig = getActivityConfig(activity.id, sub.id);
                          
                          return (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">{sub.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {sub.units} units over {sub.duration} days
                                </p>
                                {subConfig && (
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {formatProductionMethod(subConfig.method)}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {getCrewName(subConfig.crewId)}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant={subConfig ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleConfigureActivity(activity, sub)}
                              >
                                {subConfig ? "Reconfigure" : "Configure"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}

            {filteredActivities.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No activities found</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    Create activities in Schedule Management first to configure production.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Crew Management Tab */}
        <TabsContent value="crews">
          <CrewManagement
            crews={crews}
            onCreateCrew={handleCreateCrew}
            onEditCrew={handleEditCrew}
            onDeleteCrew={handleDeleteCrew}
          />
        </TabsContent>
      </Tabs>

      {/* Production Configuration Dialog */}
      <ConfigureProductionDialog
        open={!!configuringActivity}
        onClose={() => {
          setConfiguringActivity(null);
          setConfiguringSubActivity(null);
        }}
        onSubmit={handleSaveProductionConfig}
        activity={configuringActivity}
        subActivity={configuringSubActivity}
        crews={crews}
      />
    </div>
  );
};

export default ProductionPlanningPage;
