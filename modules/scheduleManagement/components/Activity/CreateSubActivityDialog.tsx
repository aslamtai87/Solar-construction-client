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
import { WorkingDaysSelector } from "@/components/global/WorkingDaysSelector";
import { Loader2, Calendar, Info, AlertCircle } from "lucide-react";
import {
  createSubActivitySchema,
  type CreateSubActivityValidationType,
} from "@/lib/validation/schedule";
import { WorkingDaysType, Activity } from "@/lib/types/schedule";
import { calculateDuration, formatDuration } from "@/lib/utils/durationCalculator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateSubActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CreateSubActivityValidationType, 'parentStartDate' | 'parentEndDate' | 'parentTargetUnits' | 'existingSubActivitiesUnits'>) => void;
  parentActivity: Activity;
  existingSubActivities: Activity[];
  mode?: "create" | "edit";
  initialData?: Activity;
}

export const CreateSubActivityDialog = ({
  open,
  onClose,
  onSubmit,
  parentActivity,
  existingSubActivities,
  mode = "create",
  initialData,
}: CreateSubActivityDialogProps) => {
  const existingSubActivitiesUnits = existingSubActivities
    .filter(sub => mode === "edit" && initialData ? sub.id !== initialData.id : true)
    .reduce((sum, sub) => sum + sub.units, 0);

  const remainingUnits = parentActivity.units - existingSubActivitiesUnits;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateSubActivityValidationType>({
    resolver: zodResolver(createSubActivitySchema) as any,
    defaultValues: initialData ? {
      phaseId: parentActivity.phaseId,
      parentActivityId: parentActivity.id,
      name: initialData.name,
      targetUnits: initialData.units,
      startDate: initialData.startDate,
      endDate: initialData.endDate,
      workingDaysConfig: initialData.workingDays as any,
      parentStartDate: parentActivity.startDate,
      parentEndDate: parentActivity.endDate,
      parentTargetUnits: parentActivity.units,
      existingSubActivitiesUnits,
    } : {
      phaseId: parentActivity.phaseId,
      parentActivityId: parentActivity.id,
      name: "",
      targetUnits: 0,
      startDate: parentActivity.startDate,
      endDate: parentActivity.endDate,
      workingDaysConfig: {
        type: WorkingDaysType.WEEKDAYS_ONLY,
        includeSaturday: false,
        includeSunday: false,
      },
      parentStartDate: parentActivity.startDate,
      parentEndDate: parentActivity.endDate,
      parentTargetUnits: parentActivity.units,
      existingSubActivitiesUnits,
    },
  });

  // Watch values for duration calculation
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const workingDaysConfig = watch("workingDaysConfig");
  const targetUnits = watch("targetUnits");

  // Calculate duration
  const duration = React.useMemo(() => {
    if (startDate && endDate && workingDaysConfig) {
      return calculateDuration(startDate, endDate, workingDaysConfig);
    }
    return 0;
  }, [startDate, endDate, workingDaysConfig?.type, workingDaysConfig?.includeSaturday, workingDaysConfig?.includeSunday]);

  const handleFormSubmit = async (data: CreateSubActivityValidationType) => {
    // Remove parent validation fields before submitting
    const { parentStartDate, parentEndDate, parentTargetUnits, existingSubActivitiesUnits, ...submitData } = data;
    onSubmit(submitData);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Edit Sub-Activity" : "Create Sub-Activity"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit" 
              ? `Update sub-activity under "${parentActivity.name}". Sub-activity must be within parent date range and total units must not exceed parent units.`
              : `Add a sub-activity under "${parentActivity.name}". Sub-activity must be within parent date range and total units must not exceed parent units.`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-5 py-4">
            {/* Parent Activity Info */}
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <Info className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-sm space-y-1">
                <div className="font-medium text-orange-900 dark:text-orange-100">
                  Parent Activity: {parentActivity.name}
                </div>
                <div className="text-orange-800 dark:text-orange-200 space-y-0.5">
                  <div>Date Range: {new Date(parentActivity.startDate).toLocaleDateString()} - {new Date(parentActivity.endDate).toLocaleDateString()}</div>
                  <div>
                    Units: {existingSubActivitiesUnits} / {parentActivity.units} allocated
                    {remainingUnits > 0 && (
                      <span className="font-medium text-green-600 dark:text-green-400 ml-1">
                        ({remainingUnits} remaining)
                      </span>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Remaining Units Warning */}
            {remainingUnits === 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All parent activity units have been allocated to sub-activities.
                  You cannot create more sub-activities unless you increase the parent
                  activity units or remove existing sub-activities.
                </AlertDescription>
              </Alert>
            )}

            {/* Sub-Activity Name */}
            <FormFieldWrapper
              name="name"
              control={control}
              label="Sub-Activity Name"
              placeholder="e.g., Panel Installation - Section A"
              description="Enter a descriptive name for this sub-activity"
              disabled={remainingUnits === 0}
            />

            {/* Target Units */}
            <FormFieldWrapper
              name="targetUnits"
              control={control}
              label="Target Units"
              type="number"
              placeholder="0"
              description={`Max ${remainingUnits} units available`}
              valueAsNumber
              inputClassName="text-base"
              disabled={remainingUnits === 0}
            />

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldWrapper
                name="startDate"
                control={control}
                label="Start Date"
                type="date"
                min={parentActivity.startDate}
                max={parentActivity.endDate}
                description={`Must be between ${new Date(parentActivity.startDate).toLocaleDateString()} and ${new Date(parentActivity.endDate).toLocaleDateString()}`}
                disabled={remainingUnits === 0}
                inputClassName="cursor-pointer"
              />

              <FormFieldWrapper
                name="endDate"
                control={control}
                label="End Date"
                type="date"
                min={parentActivity.startDate}
                max={parentActivity.endDate}
                description={`Must be between ${new Date(parentActivity.startDate).toLocaleDateString()} and ${new Date(parentActivity.endDate).toLocaleDateString()}`}
                disabled={remainingUnits === 0}
                inputClassName="cursor-pointer"
              />
            </div>

            {/* Working Days Configuration */}
            <WorkingDaysSelector
              control={control}
              namePrefix="workingDaysConfig"
              label="Working Days Configuration"
              description="Define which days count as working days for duration calculation"
              disabled={remainingUnits === 0}
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
            <Button
              type="submit"
              disabled={isSubmitting || remainingUnits === 0}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Update Sub-Activity" : "Create Sub-Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubActivityDialog;
