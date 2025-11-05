"use client";
import React, { useState } from "react";
import PhaseTable from "./components/Phase/PhaseTable";
import ActivityTableNew from "./components/Activity/ActivityTableNew";
import ActivityExcelUpload from "./components/Activity/ActivityExcelUpload";
import MilestoneDisplay from "./components/Milestone/MilestoneDisplay";
import { Phase, Activity, Milestone, WorkingDaysConfig, WorkingDaysType } from "@/lib/types/schedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ListTodo, Award, FolderKanban, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculateDuration } from "@/lib/utils/durationCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWorkingDaysLabel } from "@/lib/utils/durationCalculator";

interface ScheduleManagementPageProps {
  projectId?: string;
  workingDaysConfig?: WorkingDaysConfig;
}

const ScheduleManagementPage = ({ 
  projectId, 
  workingDaysConfig: projectWorkingDaysConfig 
}: ScheduleManagementPageProps) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | "all">("all");
  const [excelUploadOpen, setExcelUploadOpen] = useState(false);
  
  // Use project-level working days config or default
  const workingDaysConfig = projectWorkingDaysConfig || {
    type: WorkingDaysType.WEEKDAYS_ONLY,
    includeSaturday: false,
    includeSunday: false,
  };
  
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
    const duration = calculateDuration(data.startDate, data.endDate, workingDaysConfig);
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      phaseId: data.phaseId,
      phaseName: phases.find((p) => p.id === data.phaseId)?.title,
      name: data.name,
      units: data.units,
      startDate: data.startDate,
      endDate: data.endDate,
      duration: duration,
      order: activities.length + 1,
      createdAt: new Date().toISOString(),
    };
    console.log("Creating activity:", newActivity);
    setActivities([...activities, newActivity]);
  };

  const handleEditActivity = (activityId: string, data: any) => {
    const duration = calculateDuration(data.startDate, data.endDate, workingDaysConfig);
    setActivities(activities.map(activity => 
      activity.id === activityId 
        ? {
            ...activity,
            phaseId: data.phaseId,
            phaseName: phases.find((p) => p.id === data.phaseId)?.title,
            name: data.name,
            units: data.units,
            startDate: data.startDate,
            endDate: data.endDate,
            duration: duration,
          }
        : activity
    ));
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(activities.filter(a => a.id !== activityId));
  };

  const handleExcelUpload = (parsedActivities: any[]) => {
    // Convert parsed activities to Activity format
    const newActivities: Activity[] = [];

    parsedActivities.forEach((parsed) => {
      if (!parsed.isSubActivity) {
        const duration = calculateDuration(parsed.startDate, parsed.endDate, workingDaysConfig);
        // Create activity
        const activity: Activity = {
          id: `act-${Date.now()}-${Math.random()}`,
          phaseId: parsed.phaseId,
          phaseName: parsed.phaseName,
          name: parsed.name,
          units: parsed.targetUnits,
          startDate: parsed.startDate,
          endDate: parsed.endDate,
          duration: duration,
          order: activities.length + newActivities.length + 1,
        };
        newActivities.push(activity);
      }
    });

    setActivities([...activities, ...newActivities]);
    setExcelUploadOpen(false);
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
        <TabsList className="grid w-full max-w-2xl grid-cols-2">
          <TabsTrigger value="phases" className="gap-2">
            <FolderKanban className="h-4 w-4" />
            Phases
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-2">
            <ListTodo className="h-4 w-4" />
            Activities
          </TabsTrigger>
          {/* <TabsTrigger value="milestones" className="gap-2">
            <Award className="h-4 w-4" />
            Milestones
          </TabsTrigger> */}
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
          {/* Working Days Configuration Display */}
          {/* <Card className="border-orange-200 dark:border-orange-900/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                Project Working Days Configuration
              </CardTitle>
              <CardDescription>
                This configuration is set at the project level and applies to all activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {getWorkingDaysLabel(workingDaysConfig.type)}
                </Badge>
                {workingDaysConfig.type === WorkingDaysType.CUSTOM && (
                  <span className="text-sm text-muted-foreground">
                    {workingDaysConfig.includeSaturday && workingDaysConfig.includeSunday
                      ? "with Saturday and Sunday"
                      : workingDaysConfig.includeSaturday
                      ? "with Saturday"
                      : workingDaysConfig.includeSunday
                      ? "with Sunday"
                      : "weekdays only"}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                To change this configuration, edit the project settings
              </p>
            </CardContent>
          </Card> */}

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

          <ActivityTableNew
            activities={filteredActivities}
            phases={phases}
            workingDaysConfig={workingDaysConfig}
            onCreateActivity={handleCreateActivity}
            onUpdateActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
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
        {/* <TabsContent value="milestones" className="space-y-4">
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
        </TabsContent> */}
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