"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { FormSelectField } from "@/components/global/Form/FormSelectField";
import { WorkingDaysSelector } from "@/components/global/WorkingDaysSelector";
import { Loader2, Calendar, Hash, Info } from "lucide-react";
import { createActivitySchema, type CreateActivityValidationType } from "@/lib/validation/schedule";
import { WorkingDaysType, Activity } from "@/lib/types/schedule";
import { calculateDuration, formatDuration } from "@/lib/utils/durationCalculator";
import { Phase } from "@/lib/types/schedule";

interface CreateActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityValidationType) => void;
  phases: Phase[];
  selectedPhaseId?: string;
  mode?: "create" | "edit";
  initialData?: Activity;
}

export const CreateActivityDialog = ({
  open,
  onClose,
  onSubmit,
  phases,
  selectedPhaseId,
  mode = "create",
  initialData,
}: CreateActivityDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateActivityValidationType>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: initialData ? {
      phaseId: initialData.phaseId,
      name: initialData.name,
      targetUnits: initialData.units,
      startDate: initialData.startDate,
      endDate: initialData.endDate,
      workingDaysConfig: initialData.workingDays as any,
      parentActivityId: null,
    } : {
      phaseId: selectedPhaseId || "",
      name: "",
      targetUnits: 0,
      startDate: "",
      endDate: "",
      workingDaysConfig: {
        type: WorkingDaysType.WEEKDAYS_ONLY,
        includeSaturday: false,
        includeSunday: false,
      },
      parentActivityId: null,
    },
  });

  // Watch values for duration calculation
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const workingDaysConfig = watch("workingDaysConfig");

  // Calculate duration
  const duration = React.useMemo(() => {
    if (startDate && endDate && workingDaysConfig) {
      return calculateDuration(startDate, endDate, workingDaysConfig);
    }
    return 0;
  }, [startDate, endDate, workingDaysConfig?.type, workingDaysConfig?.includeSaturday, workingDaysConfig?.includeSunday]);

  // Set default phase if provided
  useEffect(() => {
    if (selectedPhaseId && open) {
      reset({
        ...watch(),
        phaseId: selectedPhaseId,
      });
    }
  }, [selectedPhaseId, open, reset, watch]);

  const handleFormSubmit = async (data: CreateActivityValidationType) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const phaseOptions = phases.map((phase) => ({
    value: phase.id,
    label: phase.title,
  }));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Edit Activity" : "Create New Activity"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit" 
              ? "Update the activity details, target units, and timeline." 
              : "Add a new activity to your project schedule. Define the activity details, target units, and timeline."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-5 py-4">
            {/* Phase Selection */}
            <FormSelectField
              name="phaseId"
              control={control}
              label="Phase"
              placeholder="Select a phase..."
              options={phaseOptions}
              description="Select the phase this activity belongs to"
            />

            {/* Activity Name */}
            <FormFieldWrapper
              name="name"
              control={control}
              label="Activity Name"
              placeholder="e.g., Panel Installation"
              description="Enter a descriptive name for this activity"
            />

            {/* Target Units */}
            <FormFieldWrapper
              name="targetUnits"
              control={control}
              label="Target Units"
              type="number"
              placeholder="0"
              description="Total number of units to complete for this activity"
              valueAsNumber
              inputClassName="text-base"
            />

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldWrapper
                name="startDate"
                control={control}
                label="Start Date"
                type="date"
                description="Activity start date"
                inputClassName="cursor-pointer"
              />

              <FormFieldWrapper
                name="endDate"
                control={control}
                label="End Date"
                type="date"
                description="Activity end date"
                inputClassName="cursor-pointer"
              />
            </div>

            {/* Working Days Configuration */}
            <WorkingDaysSelector
              control={control}
              namePrefix="workingDaysConfig"
              label="Working Days Configuration"
              description="Define which days count as working days for duration calculation"
            />

            {/* Duration Display */}
            {startDate && endDate && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 border">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4 text-orange-500" />
                  <span>Calculated Duration</span>
                </div>
                <div className="flex items-center gap-3 text-lg font-semibold text-orange-600 dark:text-orange-400">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDuration(duration)}</span>
                </div>
                {duration === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Please ensure the end date is after the start date
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Update Activity" : "Create Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActivityDialog;
