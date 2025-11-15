"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { FormTextareaField } from "@/components/global/Form/FormTextareaField";
import { Loader2, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormSelectField } from "@/components/global/Form/FormSelectField";
import { Phase } from "@/lib/types/schedule";

const milestoneSchema = z.object({
  phaseId: z.string().min(1, "Phase is required"),
  name: z.string().min(1, "Milestone name is required").max(100, "Name is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  targetDate: z.string().min(1, "Target date is required"),
  activityIds: z.array(z.string()).min(1, "Select at least one activity"),
});

type MilestoneFormData = z.infer<typeof milestoneSchema>;

interface CreateMilestoneDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MilestoneFormData) => void;
  activities: Array<{ id: string; name: string; phaseId: string }>;
  phases: Phase[];
}

export const CreateMilestoneDialog = ({
  open,
  onClose,
  onSubmit,
  activities,
  phases,
}: CreateMilestoneDialogProps) => {
  const [selectedActivities, setSelectedActivities] = React.useState<string[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = React.useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      phaseId: "",
      name: "",
      description: "",
      targetDate: "",
      activityIds: [],
    },
  });

  const phaseId = watch("phaseId");

  const handleFormSubmit = async (data: MilestoneFormData) => {
    onSubmit(data);
    reset();
    setSelectedActivities([]);
    setSelectedPhaseId("");
  };

  const handleClose = () => {
    reset();
    setSelectedActivities([]);
    setSelectedPhaseId("");
    onClose();
  };

  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) => {
      const newSelection = prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId];
      setValue("activityIds", newSelection);
      return newSelection;
    });
  };

  // Filter activities based on selected phase
  const filteredActivities = phaseId
    ? activities.filter((activity) => activity.phaseId === phaseId)
    : [];

  // Reset selected activities when phase changes
  React.useEffect(() => {
    if (phaseId !== selectedPhaseId) {
      setSelectedActivities([]);
      setValue("activityIds", []);
      setSelectedPhaseId(phaseId);
    }
  }, [phaseId, selectedPhaseId, setValue]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Milestone
          </DialogTitle>
          <DialogDescription>
            Define a milestone that will be achieved upon completion of selected activities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4 py-4">
            <FormSelectField
              name="phaseId"
              control={control}
              label="Phase"
              placeholder="Select a phase..."
              description="Choose which phase this milestone belongs to"
              options={phases.map((phase) => ({
                label: phase.name,
                value: phase.id,
              }))}
            />

            <FormFieldWrapper
              name="name"
              control={control}
              label="Milestone Name"
              placeholder="e.g., Foundation Complete"
              description="Enter a clear name for this milestone"
            />

            <FormTextareaField
              name="description"
              control={control}
              label="Description"
              placeholder="Describe what this milestone represents..."
              description="Provide details about this milestone"
              rows={3}
            />

            <FormFieldWrapper
              name="targetDate"
              control={control}
              label="Target Date"
              type="date"
              description="When should this milestone be achieved?"
            />

            {/* Activity Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Linked Activities
                <span className="text-destructive ml-1">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Select activities that must be completed for this milestone
              </p>
              
              {!phaseId ? (
                <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                  Please select a phase first to see available activities
                </p>
              ) : filteredActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                  No activities available in this phase. Create activities first.
                </p>
              ) : (
                <div className="border rounded-lg p-4 space-y-3 max-h-[200px] overflow-y-auto">
                  {filteredActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={activity.id}
                        checked={selectedActivities.includes(activity.id)}
                        onCheckedChange={() => toggleActivity(activity.id)}
                      />
                      <label
                        htmlFor={activity.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {activity.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.activityIds && (
                <p className="text-sm text-destructive">{errors.activityIds.message}</p>
              )}
            </div>
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
            <Button type="submit" disabled={isSubmitting || !phaseId || filteredActivities.length === 0} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Milestone
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMilestoneDialog;
