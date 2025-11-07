"use client";
import React, { useState, useEffect } from "react";
import PhaseTable from "./components/Phase/PhaseTable";
import ActivityTableNew from "./components/Activity/ActivityTableNew";
import ActivityExcelUpload from "./components/Activity/ActivityExcelUpload";
import MilestoneDisplay from "./components/Milestone/MilestoneDisplay";
import {
  Activity,
  Milestone,
  WorkingDaysConfig,
  WorkingDaysType,
} from "@/lib/types/schedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ListTodo,
  Award,
  FolderKanban,
  Upload,
  Save,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculateDuration } from "@/lib/utils/durationCalculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWorkingDaysLabel } from "@/lib/utils/durationCalculator";
import { WorkingDaysSelector } from "@/components/global/WorkingDaysSelector";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { usePhases } from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";
import { Phase } from "@/lib/types/schedule";

const workingDaysSchema = z.object({
  type: z.nativeEnum(WorkingDaysType),
  includeSaturday: z.boolean().optional(),
  includeSunday: z.boolean().optional(),
});

interface ScheduleManagementPageProps {
  projectId?: string;
  workingDaysConfig?: WorkingDaysConfig;
}

const ScheduleManagementPage = ({
  projectId,
  workingDaysConfig: projectWorkingDaysConfig,
}: ScheduleManagementPageProps) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | "all">("all");
  const [excelUploadOpen, setExcelUploadOpen] = useState(false);
  const { selectedProject } = useProjectStore();
  const { data: phases } = usePhases({ projectId: selectedProject?.id || "" });

  // Use project-level working days config or default
  const [workingDaysConfig, setWorkingDaysConfig] = useState<WorkingDaysConfig>(
    projectWorkingDaysConfig || {
      type: WorkingDaysType.WEEKDAYS_ONLY,
      includeSaturday: false,
      includeSunday: false,
    }
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const workingDaysForm = useForm<WorkingDaysConfig>({
    resolver: zodResolver(workingDaysSchema),
    defaultValues: workingDaysConfig,
  });

  // Update working days config when project config changes
  useEffect(() => {
    if (projectWorkingDaysConfig) {
      setWorkingDaysConfig(projectWorkingDaysConfig);
      workingDaysForm.reset(projectWorkingDaysConfig);
    }
  }, [projectWorkingDaysConfig]);

  // Watch for changes in the form
  useEffect(() => {
    const subscription = workingDaysForm.watch((value) => {
      const isDifferent =
        JSON.stringify(value) !== JSON.stringify(workingDaysConfig);
      setHasUnsavedChanges(isDifferent);
    });
    return () => subscription.unsubscribe();
  }, [workingDaysForm, workingDaysConfig]);

  const handleSaveWorkingDays = () => {
    const newConfig = workingDaysForm.getValues();
    setWorkingDaysConfig(newConfig);
    setHasUnsavedChanges(false);

    // TODO: Call API to update working days config in backend
    console.log("Saving working days config:", newConfig);
    // Example: updateProjectWorkingDays(projectId, newConfig);
  };

  const handleCancelWorkingDays = () => {
    workingDaysForm.reset(workingDaysConfig);
    setHasUnsavedChanges(false);
  };

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
    const duration = calculateDuration(
      data.startDate,
      data.endDate,
      workingDaysConfig
    );
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      phaseId: data.phaseId,
      phaseName: phases?.find((p) => p.id === data.phaseId)?.name,
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
    const duration = calculateDuration(
      data.startDate,
      data.endDate,
      workingDaysConfig
    );
    setActivities(
      activities.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              phaseId: data.phaseId,
              phaseName: phases?.find((p) => p.id === data.phaseId)?.name,
              name: data.name,
              units: data.units,
              startDate: data.startDate,
              endDate: data.endDate,
              duration: duration,
            }
          : activity
      )
    );
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(activities.filter((a) => a.id !== activityId));
  };

  const handleExcelUpload = (parsedActivities: any[]) => {
    // Convert parsed activities to Activity format
    const newActivities: Activity[] = [];

    parsedActivities.forEach((parsed) => {
      if (!parsed.isSubActivity) {
        const duration = calculateDuration(
          parsed.startDate,
          parsed.endDate,
          workingDaysConfig
        );
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

  // const handleEditPhase = (
  //   phaseId: string,
  //   data: { title: string; description: string }
  // ) => {
  //   setPhases(
  //     phases.map((phase) =>
  //       phase.id === phaseId
  //         ? {
  //             ...phase,
  //             title: data.title,
  //             description: data.description,
  //             updatedAt: new Date().toISOString(),
  //           }
  //         : phase
  //     )
  //   );
  // };

  const handleDeletePhase = (phaseId: string) => {
    // Delete the phase and all associated activities and milestones
    // setPhases(phases.filter((p) => p.id !== phaseId));
    setActivities(activities.filter((a) => a.phaseId !== phaseId));
    setMilestones(milestones.filter((m) => m.phaseId !== phaseId));

    // Reset selected phase if the deleted phase was selected
    if (selectedPhaseId === phaseId) {
      setSelectedPhaseId("all");
    }
  };

  // Filter activities and milestones based on selected phase
  const filteredActivities =
    selectedPhaseId === "all"
      ? activities
      : activities.filter((a) => a.phaseId === selectedPhaseId);

  const filteredMilestones =
    selectedPhaseId === "all"
      ? milestones
      : milestones.filter((m) => m.phaseId === selectedPhaseId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Schedule Management
        </h1>
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
          {phases ? (
            <PhaseTable phases={phases} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-1">No phases yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first project phase to organize
                your schedule and tasks.
              </p>
              <Button onClick={() => {}} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Phase
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          {/* Working Days Configuration Card */}
          <Card className="border-orange-200 dark:border-orange-900/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg font-semibold">
                    Working Days Configuration
                  </CardTitle>
                </div>
                {hasUnsavedChanges && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelWorkingDays}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveWorkingDays}
                      className="gap-2 bg-orange-600 hover:bg-orange-700"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>
                Configure working days for all project activities. Changes will
                affect duration calculations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Working Days Type Selector */}
                <Controller
                  name="type"
                  control={workingDaysForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Working Days Type
                      </label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={false}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select working days type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(WorkingDaysType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {getWorkingDaysLabel(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!error && (
                        <p className="text-xs text-muted-foreground">
                          Select which days count as working days for all
                          project activities
                        </p>
                      )}
                      {error && (
                        <p className="text-sm text-destructive">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Custom Working Days Options */}
                {workingDaysForm.watch("type") === WorkingDaysType.CUSTOM && (
                  <div className="space-y-3 pl-4 border-l-2 border-muted">
                    <p className="text-sm font-medium">Additional Days</p>

                    <Controller
                      name="includeSaturday"
                      control={workingDaysForm.control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeSaturday"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label
                            htmlFor="includeSaturday"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include Saturday as working day
                          </label>
                        </div>
                      )}
                    />

                    <Controller
                      name="includeSunday"
                      control={workingDaysForm.control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeSunday"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label
                            htmlFor="includeSunday"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include Sunday as working day
                          </label>
                        </div>
                      )}
                    />
                  </div>
                )}
              </div>

              {hasUnsavedChanges && (
                <Alert className="mt-4 border-orange-200 dark:border-orange-900/30">
                  <AlertDescription className="text-sm text-orange-800 dark:text-orange-200">
                    You have unsaved changes. Click "Save Changes" to update the
                    working days configuration.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

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
                {phases?.map((phase) => (
                  <SelectItem key={phase.id} value={phase.id}>
                    {phase.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {phases && (
            <ActivityTableNew
              activities={filteredActivities}
              phases={phases}
              workingDaysConfig={workingDaysConfig}
              onCreateActivity={handleCreateActivity}
              onUpdateActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          )}

          {/* Excel Upload Button */}
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setExcelUploadOpen(true)}
              variant="outline"
              className="gap-2"
            >
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
      {/* <ActivityExcelUpload
        open={excelUploadOpen}
        onClose={() => setExcelUploadOpen(false)}
        onUpload={handleExcelUpload}
        phases={phases}
      /> */}
    </div>
  );
};

export default ScheduleManagementPage;
