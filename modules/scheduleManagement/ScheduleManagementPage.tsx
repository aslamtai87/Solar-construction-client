"use client";
import React, { useState } from "react";
import PhaseTable from "./components/Phase/PhaseTable";
import ActivityTable from "./components/Activity/ActivityTable";
import ActivityExcelUpload from "./components/Activity/ActivityExcelUpload";
import MilestoneDisplay from "./components/Milestone/MilestoneDisplay";
import { Phase, Activity, Milestone, SubActivity } from "@/lib/types/schedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ListTodo, Award, FolderKanban, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ScheduleManagementPage = () => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | "all">("all");
  const [excelUploadOpen, setExcelUploadOpen] = useState(false);
  
  // Sample phases data - Replace with actual API call
  const [phases, setPhases] = useState<Phase[]>([
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

  // Sample activities data - Replace with actual API call
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "act-1",
      phaseId: "1",
      phaseName: "Planning & Design",
      name: "Site Survey and Assessment",
      units: 1200,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      duration: 22,
      workingDays: { type: "weekdays" },
      subActivities: [
        {
          id: "sub-1",
          phaseId: "1",
          phaseName: "Planning & Design",
          name: "Initial Site Visit",
          units: 400,
          startDate: "2024-01-15",
          endDate: "2024-01-25",
          duration: 8,
          workingDays: { type: "weekdays" },
          parentActivityId: "act-1",
          order: 1,
        },
        {
          id: "sub-2",
          phaseId: "1",
          phaseName: "Planning & Design",
          name: "Detailed Survey",
          units: 800,
          startDate: "2024-01-26",
          endDate: "2024-02-15",
          duration: 14,
          workingDays: { type: "weekdays" },
          parentActivityId: "act-1",
          order: 2,
        },
      ],
      order: 1,
    },
    {
      id: "act-2",
      phaseId: "1",
      phaseName: "Planning & Design",
      name: "Engineering Design",
      units: 1500,
      startDate: "2024-02-16",
      endDate: "2024-03-20",
      duration: 24,
      workingDays: { type: "weekdays" },
      order: 2,
    },
  ]);

  // Sample milestones data - Replace with actual API call
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "mile-1",
      phaseId: "1",
      name: "Design Approval",
      description: "Complete all design documents and get client approval",
      targetDate: "2024-03-25",
      activityIds: ["act-1", "act-2"],
      completedActivityIds: ["act-1"],
      status: "pending",
      completionDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const handleCreateActivity = (data: any) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      phaseId: data.phaseId,
      phaseName: phases.find((p) => p.id === data.phaseId)?.title,
      name: data.name,
      units: data.targetUnits,
      startDate: data.startDate,
      endDate: data.endDate,
      duration: data.duration || 0,
      workingDays: {
        type: data.workingDaysConfig.type === "weekdays_only" ? "weekdays" : 
              data.workingDaysConfig.type === "all_days" ? "all" : 
              data.workingDaysConfig.type === "weekends_only" ? "weekends" : "custom",
        customDays: data.workingDaysConfig.type === "custom" 
          ? [
              ...(data.workingDaysConfig.includeSaturday ? ["Saturday"] : []),
              ...(data.workingDaysConfig.includeSunday ? ["Sunday"] : [])
            ]
          : undefined
      },
      subActivities: [],
      order: activities.length + 1,
      createdAt: new Date().toISOString(),
    };
    console.log("Creating activity:", newActivity);
    setActivities([...activities, newActivity]);
  };

  const handleEditActivity = (activityId: string, data: any) => {
    setActivities(activities.map(activity => 
      activity.id === activityId 
        ? {
            ...activity,
            phaseId: data.phaseId,
            phaseName: phases.find((p) => p.id === data.phaseId)?.title,
            name: data.name,
            units: data.targetUnits,
            startDate: data.startDate,
            endDate: data.endDate,
            duration: data.duration || 0,
            workingDays: {
              type: data.workingDaysConfig.type === "weekdays_only" ? "weekdays" : 
                    data.workingDaysConfig.type === "all_days" ? "all" : 
                    data.workingDaysConfig.type === "weekends_only" ? "weekends" : "custom",
              customDays: data.workingDaysConfig.type === "custom" 
                ? [
                    ...(data.workingDaysConfig.includeSaturday ? ["Saturday"] : []),
                    ...(data.workingDaysConfig.includeSunday ? ["Sunday"] : [])
                  ]
                : undefined
            },
          }
        : activity
    ));
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(activities.filter(a => a.id !== activityId));
  };

  const handleCreateSubActivity = (activityId: string, data: any) => {
    const parentActivity = activities.find((a) => a.id === activityId);
    if (!parentActivity) return;

    const newSubActivity: SubActivity = {
      id: `sub-${Date.now()}`,
      phaseId: parentActivity.phaseId,
      phaseName: parentActivity.phaseName,
      name: data.name,
      units: data.targetUnits,
      startDate: data.startDate,
      endDate: data.endDate,
      duration: data.duration || 0,
      workingDays: {
        type: data.workingDaysConfig.type === "weekdays_only" ? "weekdays" : 
              data.workingDaysConfig.type === "all_days" ? "all" : 
              data.workingDaysConfig.type === "weekends_only" ? "weekends" : "custom",
        customDays: data.workingDaysConfig.type === "custom" 
          ? [
              ...(data.workingDaysConfig.includeSaturday ? ["Saturday"] : []),
              ...(data.workingDaysConfig.includeSunday ? ["Sunday"] : [])
            ]
          : undefined
      },
      parentActivityId: activityId,
      order: (parentActivity.subActivities?.length || 0) + 1,
      createdAt: new Date().toISOString(),
    };

    setActivities(
      activities.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              subActivities: [...(activity.subActivities || []), newSubActivity],
            }
          : activity
      )
    );
  };

  const handleEditSubActivity = (activityId: string, subActivityId: string, data: any) => {
    setActivities(activities.map(activity => 
      activity.id === activityId && activity.subActivities
        ? {
            ...activity,
            subActivities: activity.subActivities.map(sub =>
              sub.id === subActivityId
                ? {
                    ...sub,
                    name: data.name,
                    units: data.targetUnits,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    duration: data.duration || 0,
                    workingDays: {
                      type: data.workingDaysConfig.type === "weekdays_only" ? "weekdays" : 
                            data.workingDaysConfig.type === "all_days" ? "all" : 
                            data.workingDaysConfig.type === "weekends_only" ? "weekends" : "custom",
                      customDays: data.workingDaysConfig.type === "custom" 
                        ? [
                            ...(data.workingDaysConfig.includeSaturday ? ["Saturday"] : []),
                            ...(data.workingDaysConfig.includeSunday ? ["Sunday"] : [])
                          ]
                        : undefined
                    },
                  }
                : sub
            )
          }
        : activity
    ));
  };

  const handleDeleteSubActivity = (activityId: string, subActivityId: string) => {
    setActivities(activities.map(activity =>
      activity.id === activityId && activity.subActivities
        ? {
            ...activity,
            subActivities: activity.subActivities.filter(sub => sub.id !== subActivityId)
          }
        : activity
    ));
  };

  const handleExcelUpload = (parsedActivities: any[]) => {
    // Convert parsed activities to Activity format
    const newActivities: Activity[] = [];
    const activityMap = new Map<string, Activity>();

    parsedActivities.forEach((parsed) => {
      if (!parsed.isSubActivity) {
        // Create parent activity
        const activity: Activity = {
          id: `act-${Date.now()}-${Math.random()}`,
          phaseId: parsed.phaseId,
          phaseName: parsed.phaseName,
          name: parsed.name,
          units: parsed.targetUnits,
          startDate: parsed.startDate,
          endDate: parsed.endDate,
          duration: parsed.duration || 0,
          workingDays: { type: parsed.workingDaysType },
          order: activities.length + newActivities.length + 1,
          subActivities: [],
        };
        activityMap.set(parsed.name, activity);
        newActivities.push(activity);
      }
    });

    // Add sub-activities
    parsedActivities.forEach((parsed) => {
      if (parsed.isSubActivity && parsed.parentActivityName) {
        const parentActivity = activityMap.get(parsed.parentActivityName);
        if (parentActivity) {
          const subActivity: SubActivity = {
            id: `sub-${Date.now()}-${Math.random()}`,
            parentActivityId: parentActivity.id,
            phaseId: parsed.phaseId,
            name: parsed.name,
            units: parsed.targetUnits,
            startDate: parsed.startDate,
            endDate: parsed.endDate,
            duration: parsed.duration || 0,
            workingDays: { type: parsed.workingDaysType },
            order: (parentActivity.subActivities?.length || 0) + 1,
          };
          parentActivity.subActivities?.push(subActivity);
        }
      }
    });

    setActivities([...activities, ...newActivities]);
    setExcelUploadOpen(false);
  };

  const handleUpdateActivities = (updatedActivities: Activity[]) => {
    setActivities(updatedActivities);
  };

  const handleCreateMilestone = (data: any) => {
    const newMilestone: Milestone = {
      id: `mile-${Date.now()}`,
      phaseId: data.phaseId,
      name: data.name,
      description: data.description,
      targetDate: data.targetDate,
      activityIds: data.activityIds,
      completedActivityIds: [],
      status: "pending",
      completionDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMilestones([...milestones, newMilestone]);
  };

  const handleCreatePhase = (data: { title: string; description: string }) => {
    const newPhase: Phase = {
      id: `phase-${Date.now()}`,
      projectId: "project-1", // Replace with actual project ID
      title: data.title,
      description: data.description,
      status: "not-started",
      order: phases.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPhases([...phases, newPhase]);
  };

  const handleEditPhase = (phaseId: string, data: { title: string; description: string }) => {
    setPhases(phases.map(phase =>
      phase.id === phaseId
        ? {
            ...phase,
            title: data.title,
            description: data.description,
            updatedAt: new Date().toISOString(),
          }
        : phase
    ));
  };

  const handleDeletePhase = (phaseId: string) => {
    // Delete the phase and all associated activities and milestones
    setPhases(phases.filter(p => p.id !== phaseId));
    setActivities(activities.filter(a => a.phaseId !== phaseId));
    setMilestones(milestones.filter(m => m.phaseId !== phaseId));
    
    // Reset selected phase if the deleted phase was selected
    if (selectedPhaseId === phaseId) {
      setSelectedPhaseId("all");
    }
  };

  // Filter activities and milestones based on selected phase
  const filteredActivities = selectedPhaseId === "all" 
    ? activities 
    : activities.filter(a => a.phaseId === selectedPhaseId);

  const filteredMilestones = selectedPhaseId === "all"
    ? milestones
    : milestones.filter(m => m.phaseId === selectedPhaseId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Schedule Management</h1>
        <p className="text-muted-foreground">
          Manage project phases, activities, and milestones
        </p>
      </div>

      {/* Tabs for Phases, Activities, and Milestones */}
      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="phases" className="gap-2">
            <FolderKanban className="h-4 w-4" />
            Phases
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-2">
            <ListTodo className="h-4 w-4" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="milestones" className="gap-2">
            <Award className="h-4 w-4" />
            Milestones
          </TabsTrigger>
        </TabsList>

        {/* Phases Tab */}
        <TabsContent value="phases" className="space-y-4">
          <PhaseTable
            phases={phases}
            onCreatePhase={handleCreatePhase}
            onEditPhase={handleEditPhase}
            onDeletePhase={handleDeletePhase}
          />
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          {/* Phase Filter */}
          <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <label htmlFor="phase-filter" className="text-sm font-medium">
                Filter by Phase
              </label>
              <p className="text-xs text-muted-foreground">
                View activities for a specific phase
              </p>
            </div>
            <Select value={selectedPhaseId} onValueChange={setSelectedPhaseId}>
              <SelectTrigger id="phase-filter" className="w-[250px]">
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

          <ActivityTable
            activities={filteredActivities}
            phases={phases}
            onUpdateActivities={handleUpdateActivities}
            onCreateActivity={handleCreateActivity}
            onCreateSubActivity={handleCreateSubActivity}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
            onEditSubActivity={handleEditSubActivity}
            onDeleteSubActivity={handleDeleteSubActivity}
          />
          
          {/* Excel Upload Button */}
          <div className="flex justify-end mt-4">
            <Button onClick={() => setExcelUploadOpen(true)} variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Import from Excel
            </Button>
          </div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4">
          {/* Phase Filter */}
          <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <label htmlFor="milestone-phase-filter" className="text-sm font-medium">
                Filter by Phase
              </label>
              <p className="text-xs text-muted-foreground">
                View milestones for a specific phase
              </p>
            </div>
            <Select value={selectedPhaseId} onValueChange={setSelectedPhaseId}>
              <SelectTrigger id="milestone-phase-filter" className="w-[250px]">
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

          <MilestoneDisplay
            milestones={filteredMilestones}
            activities={filteredActivities.map((a) => ({ 
              id: a.id, 
              name: a.name,
              phaseId: a.phaseId 
            }))}
            phases={phases}
            onCreateMilestone={handleCreateMilestone}
          />
        </TabsContent>
      </Tabs>

      {/* Excel Upload Dialog */}
      <ActivityExcelUpload
        open={excelUploadOpen}
        onClose={() => setExcelUploadOpen(false)}
        onUpload={handleExcelUpload}
        phases={phases}
      />
    </div>
  );
};

export default ScheduleManagementPage;