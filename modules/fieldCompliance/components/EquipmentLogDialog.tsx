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
import { Plus, Trash2, Wrench, AlertCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SearchableSelect } from "@/components/global/SearchableSelect";
import { useGetActivity } from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const equipmentLogSchema = z.object({
  equipmentId: z.string().min(1, "Equipment is required"),
  isQuantityShared: z.boolean(),
  notes: z.string().optional(),
  activities: z
    .array(
      z.object({
        activityId: z.string().min(1, "Activity is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one activity is required"),
});

type EquipmentLogFormData = z.infer<typeof equipmentLogSchema>;

interface EquipmentLogDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  mode: "create" | "edit";
  equipment: { value: string; label: string }[];
  initialData?: {
    equipmentId?: string;
    equipmentName?: string;
    isQuantityShared?: boolean;
    notes?: string;
    activities?: { activityId: string; quantity: number }[];
  };
}

export const EquipmentLogDialog = ({
  open,
  onClose,
  onSave,
  mode,
  equipment,
  initialData,
}: EquipmentLogDialogProps) => {
  const { selectedProject } = useProjectStore();
  const [activities, setActivities] = useState<
    { activityId: string; quantity: number }[]
  >(initialData?.activities || []);
  const [activitySearchQuery, setActivitySearchQuery] = useState("");

  const { data: activitiesResponse } = useGetActivity({
    projectId: selectedProject?.id || "",
  });
  const availableActivities = activitiesResponse?.data.result || [];

  const form = useForm<EquipmentLogFormData>({
    resolver: zodResolver(equipmentLogSchema),
    defaultValues: {
      equipmentId: initialData?.equipmentId || "",
      isQuantityShared: initialData?.isQuantityShared || false,
      notes: initialData?.notes || "",
      activities: initialData?.activities || [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        equipmentId: initialData.equipmentId || "",
        isQuantityShared: initialData.isQuantityShared || false,
        notes: initialData.notes || "",
        activities: initialData.activities || [],
      });
      setActivities(initialData.activities || []);
    }
  }, [initialData, form]);

  const watchedIsQuantityShared = form.watch("isQuantityShared");

  // Calculate total quantity based on isQuantityShared
  const calculateTotalQuantity = (): number => {
    if (activities.length === 0) return 0;
    
    if (watchedIsQuantityShared) {
      // Shared: return maximum quantity across all activities
      return Math.max(...activities.map((act) => act.quantity));
    } else {
      // Not shared: return sum of all quantities
      return activities.reduce((sum, act) => sum + act.quantity, 0);
    }
  };

  const totalQuantity = calculateTotalQuantity();

  // Base activity options
  const activityOptions = availableActivities.map((act) => ({
    value: act.id,
    label: act.name,
  }));

  console.log("Activity Options:", activityOptions);

  // Get selected activity IDs to filter them out from options
  const selectedActivityIds = activities
    .map((act) => act.activityId)
    .filter(Boolean);

  const getAvailableActivitiesForIndex = (currentIndex: number) => {
    const currentActivityId = activities[currentIndex]?.activityId;
    const otherSelectedIds = selectedActivityIds.filter(
      (id, idx) => idx !== currentIndex
    );

    return activityOptions.filter(
      (opt) =>
        !otherSelectedIds.includes(opt.value) || opt.value === currentActivityId
    );
  };

  const handleAddActivity = () => {
    const newActivity = { activityId: "", quantity: 0 };
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    form.setValue("activities", updatedActivities);
  };

  const handleRemoveActivity = (index: number) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
    form.setValue("activities", updatedActivities);
  };

  const handleActivityChange = (
    index: number,
    field: "activityId" | "quantity",
    value: string | number
  ) => {
    const updatedActivities = [...activities];
    if (field === "quantity") {
      updatedActivities[index][field] = Number(value);
    } else {
      updatedActivities[index][field] = value as string;
    }
    setActivities(updatedActivities);
    form.setValue("activities", updatedActivities);
  };

  const onSubmit = (data: EquipmentLogFormData) => {
    onSave(data);
    onClose();
  };

  const selectedEquipment = equipment.find(
    (eq) => eq.value === form.watch("equipmentId")
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Equipment Log" : "Edit Equipment Log"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Equipment Selection */}
          <div className="space-y-2">
            <Label>Equipment *</Label>
            {mode === "create" ? (
              <Select
                value={form.watch("equipmentId")}
                onValueChange={(value) => form.setValue("equipmentId", value)}
              >
                <SelectTrigger
                  className={
                    form.formState.errors.equipmentId ? "border-destructive" : ""
                  }
                >
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((eq) => (
                    <SelectItem key={eq.value} value={eq.value}>
                      {eq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{initialData?.equipmentName}</span>
              </div>
            )}
            {form.formState.errors.equipmentId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.equipmentId.message}
              </p>
            )}
          </div>

          {/* Shared Equipment Toggle */}
          <div className="flex items-start space-x-3 rounded-lg border p-4 bg-muted/30">
            <Checkbox
              id="isQuantityShared"
              checked={form.watch("isQuantityShared")}
              onCheckedChange={(checked) =>
                form.setValue("isQuantityShared", checked as boolean)
              }
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="isQuantityShared"
                className="text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Shared Equipment
              </Label>
              <p className="text-xs text-muted-foreground">
                {watchedIsQuantityShared
                  ? "Same equipment used across multiple activities (total = maximum quantity)"
                  : "Separate equipment for each activity (total = sum of quantities)"}
              </p>
            </div>
          </div>

          {/* Total Quantity Display */}
          {totalQuantity > 0 && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <Wrench className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Total Equipment:{" "}
                <span className="text-primary">{totalQuantity} units</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({watchedIsQuantityShared ? "maximum across activities" : "sum of all activities"})
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
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Activity
              </Button>
            </div>

            {activities.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Add at least one activity to allocate equipment
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
                    <div className="w-32 space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Quantity *
                      </Label>
                      <Input
                        type="number"
                        step="1"
                        min="1"
                        value={activity.quantity || ""}
                        onChange={(e) =>
                          handleActivityChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        placeholder="0"
                        className={
                          form.formState.errors.activities?.[index]?.quantity
                            ? "border-destructive"
                            : ""
                        }
                      />
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

                {/* Summary */}
                {activities.length > 1 && (
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Calculation Mode:</span>
                      <Badge variant={watchedIsQuantityShared ? "default" : "secondary"}>
                        {watchedIsQuantityShared ? "Shared (Maximum)" : "Dedicated (Sum)"}
                      </Badge>
                    </div>
                    {activities.map((act, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-muted-foreground">
                        <span>Activity {idx + 1}:</span>
                        <span>{act.quantity || 0} units</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-medium pt-2 border-t">
                      <span>Total Equipment:</span>
                      <span className="text-primary">{totalQuantity} units</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {form.formState.errors.activities &&
              !Array.isArray(form.formState.errors.activities) && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.activities.message}
                </p>
              )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              {...form.register("notes")}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={activities.length === 0}>
              {mode === "create" ? "Create Log" : "Update Log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
