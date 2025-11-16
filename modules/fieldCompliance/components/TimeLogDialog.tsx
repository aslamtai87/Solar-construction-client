"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SearchableSelect } from "@/components/global/SearchableSelect";
import { useGetActivity } from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";

const timeLogSchema = z.object({
  workerId: z.string().min(1, "Worker is required"),
  entryTime: z.string().min(1, "Entry time is required"),
  exitTime: z.string().min(1, "Exit time is required"),
  activities: z
    .array(
      z.object({
        activityId: z.string().min(1, "Activity is required"),
        hoursWorked: z.number().min(0.1, "Hours must be at least 0.1"),
      })
    )
    .min(1, "At least one activity is required"),
}).refine(
  (data) => {
    if (data.entryTime && data.exitTime) {
      return data.exitTime > data.entryTime;
    }
    return true;
  },
  {
    message: "Exit time must be after entry time",
    path: ["exitTime"],
  }
);

type TimeLogFormData = z.infer<typeof timeLogSchema>;

interface TimeLogDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  mode: "create" | "edit";
  workers: { value: string; label: string; type?: string }[];
  initialData?: {
    workerId?: string;
    workerName?: string;
    entryTime?: string;
    exitTime?: string;
    activities?: { activityId: string; hoursWorked: number }[];
  };
}

export const TimeLogDialog = ({
  open,
  onClose,
  onSave,
  mode,
  workers,
  initialData,
}: TimeLogDialogProps) => {
  const { selectedProject } = useProjectStore();
  const [activities, setActivities] = useState<
    { activityId: string; hoursWorked: number }[]
  >(initialData?.activities || []);
  const [activitySearchQuery, setActivitySearchQuery] = useState("");
  // Store hours and minutes separately for each activity
  const [activityTimes, setActivityTimes] = useState<
    { hours: number; minutes: number }[]
  >([]);

  const { data: activitiesResponse } = useGetActivity({
    projectId: selectedProject?.id || "",
  });
  const availableActivities = activitiesResponse?.data.result || [];

  const form = useForm<TimeLogFormData>({
    resolver: zodResolver(timeLogSchema),
    defaultValues: {
      workerId: initialData?.workerId || "",
      entryTime: initialData?.entryTime || "",
      exitTime: initialData?.exitTime || "",
      activities: initialData?.activities || [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        workerId: initialData.workerId || "",
        entryTime: initialData.entryTime || "",
        exitTime: initialData.exitTime || "",
        activities: initialData.activities || [],
      });
      setActivities(initialData.activities || []);
      
      // Convert hoursWorked to hours and minutes
      const times = (initialData.activities || []).map(act => {
        const hours = Math.floor(act.hoursWorked);
        const minutes = Math.round((act.hoursWorked % 1) * 60);
        return { hours, minutes };
      });
      setActivityTimes(times);
    }
  }, [initialData, form]);

  const watchedEntryTime = form.watch("entryTime");
  const watchedExitTime = form.watch("exitTime");

  const calculateDuration = (entry: string, exit: string): number => {
    if (!entry || !exit) return 0;
    const [entryHours, entryMinutes] = entry.split(":").map(Number);
    const [exitHours, exitMinutes] = exit.split(":").map(Number);
    const entryTotalMinutes = entryHours * 60 + entryMinutes;
    const exitTotalMinutes = exitHours * 60 + exitMinutes;
    const diffMinutes = exitTotalMinutes - entryTotalMinutes;
    return diffMinutes / 60;
  };

  const totalDuration = calculateDuration(watchedEntryTime, watchedExitTime);
  const allocatedHours = activityTimes.reduce(
    (sum, time) => sum + time.hours + time.minutes / 60,
    0
  );
  const remainingHours = totalDuration - allocatedHours;
  const isFullyAllocated = Math.abs(remainingHours) < 0.01;

  // Base activity options
  const activityOptions = availableActivities.map((act) => ({
    value: act.id,
    label: act.name,
  }));

  // Get selected activity IDs to filter them out from options
  const selectedActivityIds = activities.map((act) => act.activityId).filter(Boolean);

  const getAvailableActivitiesForIndex = (currentIndex: number) => {
    // For the current activity being edited, include its own value in available options
    const currentActivityId = activities[currentIndex]?.activityId;
    const otherSelectedIds = selectedActivityIds.filter(
      (id, idx) => idx !== currentIndex
    );
    
    return activityOptions.filter(
      (opt) => !otherSelectedIds.includes(opt.value) || opt.value === currentActivityId
    );
  };

  const handleAddActivity = () => {
    const newActivity = { activityId: "", hoursWorked: 0 };
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    setActivityTimes([...activityTimes, { hours: 0, minutes: 0 }]);
    form.setValue("activities", updatedActivities);
  };

  const handleRemoveActivity = (index: number) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    const updatedTimes = activityTimes.filter((_, i) => i !== index);
    setActivities(updatedActivities);
    setActivityTimes(updatedTimes);
    form.setValue("activities", updatedActivities);
  };

  const handleActivityChange = (
    index: number,
    field: "activityId" | "hours" | "minutes",
    value: string | number
  ) => {
    const updatedActivities = [...activities];
    const updatedTimes = [...activityTimes];
    
    if (field === "activityId") {
      updatedActivities[index].activityId = value as string;
    } else if (field === "hours") {
      updatedTimes[index].hours = Number(value) || 0;
      // Convert to decimal hours for validation
      const decimalHours = updatedTimes[index].hours + updatedTimes[index].minutes / 60;
      updatedActivities[index].hoursWorked = decimalHours;
    } else if (field === "minutes") {
      updatedTimes[index].minutes = Number(value) || 0;
      // Convert to decimal hours for validation
      const decimalHours = updatedTimes[index].hours + updatedTimes[index].minutes / 60;
      updatedActivities[index].hoursWorked = decimalHours;
    }
    
    setActivities(updatedActivities);
    setActivityTimes(updatedTimes);
    form.setValue("activities", updatedActivities);
  };

  const onSubmit = (data: TimeLogFormData) => {
    if (!isFullyAllocated) {
      form.setError("activities", {
        message: `Hours must equal total duration (${totalDuration.toFixed(1)}h)`,
      });
      return;
    }
    onSave(data);
    onClose();
  };

  const selectedWorker = workers.find((w) => w.value === form.watch("workerId"));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Worker Time Log" : "Edit Worker Time Log"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Worker Selection */}
          <div className="space-y-2">
            <Label>Worker *</Label>
            {mode === "create" ? (
              <Select
                value={form.watch("workerId")}
                onValueChange={(value) => form.setValue("workerId", value)}
              >
                <SelectTrigger
                  className={form.formState.errors.workerId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select worker" />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker.value} value={worker.value}>
                      <div className="flex items-center justify-between w-full gap-2">
                        <span>{worker.label}</span>
                        {worker.type && (
                          <Badge variant="secondary" className="text-xs">
                            {worker.type}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <span className="font-medium">{initialData?.workerName}</span>
                {selectedWorker?.type && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedWorker.type}
                  </Badge>
                )}
              </div>
            )}
            {form.formState.errors.workerId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.workerId.message}
              </p>
            )}
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Entry Time *</Label>
              <Input
                type="time"
                {...form.register("entryTime")}
                className={form.formState.errors.entryTime ? "border-destructive" : ""}
              />
              {form.formState.errors.entryTime && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.entryTime.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Exit Time *</Label>
              <Input
                type="time"
                {...form.register("exitTime")}
                className={form.formState.errors.exitTime ? "border-destructive" : ""}
              />
              {form.formState.errors.exitTime && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.exitTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Duration Display */}
          {totalDuration > 0 && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Total Duration:{" "}
                <span className="text-primary">
                  {Math.floor(totalDuration)}h {Math.round((totalDuration % 1) * 60)}m
                </span>
              </span>
            </div>
          )}

          {/* Activity Allocation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Activity Allocation *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddActivity}
                disabled={totalDuration <= 0}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Activity
              </Button>
            </div>

            {totalDuration <= 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Please set entry and exit times first
                </AlertDescription>
              </Alert>
            )}

            {activities.length > 0 && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Activity {index + 1}
                      </Label>
                      <SearchableSelect
                        options={getAvailableActivitiesForIndex(index)}
                        value={activity.activityId}
                        placeholder="Select activity..."
                        searchPlaceholder="Search activities..."
                        onChange={(value) =>
                          handleActivityChange(index, "activityId", value)
                        }
                        onSearchChange={setActivitySearchQuery}
                        searchQuery={activitySearchQuery}
                        hasError={
                          !!form.formState.errors.activities?.[index]?.activityId
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-20 space-y-2">
                        <Label className="text-xs text-muted-foreground">Hours</Label>
                        <Input
                          type="number"
                          min="0"
                          max={Math.floor(totalDuration)}
                          value={activityTimes[index]?.hours || ""}
                          onChange={(e) =>
                            handleActivityChange(index, "hours", e.target.value)
                          }
                          placeholder="0"
                          className={
                            form.formState.errors.activities?.[index]?.hoursWorked
                              ? "border-destructive"
                              : ""
                          }
                        />
                      </div>
                      <div className="w-20 space-y-2">
                        <Label className="text-xs text-muted-foreground">Mins</Label>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={activityTimes[index]?.minutes || ""}
                          onChange={(e) =>
                            handleActivityChange(index, "minutes", e.target.value)
                          }
                          placeholder="0"
                          className={
                            form.formState.errors.activities?.[index]?.hoursWorked
                              ? "border-destructive"
                              : ""
                          }
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveActivity(index)}
                      className="mt-7"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}

                {/* Progress Indicator */}
                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Allocated:</span>
                    <span className="font-medium">{allocatedHours.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Duration:</span>
                    <span className="font-medium">{totalDuration.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span
                      className={
                        isFullyAllocated
                          ? "text-green-600"
                          : remainingHours > 0
                          ? "text-orange-600"
                          : "text-red-600"
                      }
                    >
                      {remainingHours.toFixed(1)}h
                      {isFullyAllocated && " ✓"}
                    </span>
                  </div>
                  {!isFullyAllocated && activities.length > 0 && (
                    <Alert variant={remainingHours < 0 ? "destructive" : "default"}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {remainingHours > 0
                          ? `You still have ${remainingHours.toFixed(1)} hours to allocate`
                          : `You've allocated ${Math.abs(remainingHours).toFixed(1)} hours too many`}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            )}

            {form.formState.errors.activities && !Array.isArray(form.formState.errors.activities) && (
              <p className="text-sm text-destructive">
                {form.formState.errors.activities.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFullyAllocated || activities.length === 0}>
              {mode === "create" ? "Create Log" : "Update Log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
