"use client";

import React, { useEffect, useMemo } from "react";
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
import { Loader2, Info, TrendingUp, TrendingDown, Minus, Activity as ActivityIcon } from "lucide-react";
import { createProductionConfigSchema } from "@/lib/validation/production";
import { ProductionMethod, Crew } from "@/lib/types/production";
import { Activity, SubActivity } from "@/lib/types/schedule";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  formatProductionMethod, 
  getProductionMethodDescription,
  calculateDailyProduction 
} from "@/lib/utils/productionCalculator";

type ProductionConfigFormData = z.infer<typeof createProductionConfigSchema>;

interface ConfigureProductionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductionConfigFormData) => void;
  activity: Activity | null;
  subActivity?: SubActivity | null;
  crews: Crew[];
}

const productionMethods: { value: ProductionMethod; label: string; icon: any }[] = [
  { value: "constant", label: "Constant", icon: Minus },
  { value: "ramp-up", label: "Ramp Up", icon: TrendingUp },
  { value: "ramp-down", label: "Ramp Down", icon: TrendingDown },
  { value: "s-curve", label: "S-Curve", icon: ActivityIcon },
];

export const ConfigureProductionDialog = ({
  open,
  onClose,
  onSubmit,
  activity,
  subActivity,
  crews,
}: ConfigureProductionDialogProps) => {
  const targetItem = subActivity || activity;
  const isSubActivity = !!subActivity;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductionConfigFormData>({
    resolver: zodResolver(createProductionConfigSchema),
    defaultValues: {
      activityId: "",
      subActivityId: undefined,
      method: "constant",
      crewId: "",
      unitsPerDay: undefined,
      startUnitsPerDay: undefined,
      endUnitsPerDay: undefined,
      peakUnitsPerDay: undefined,
    },
  });

  const method = watch("method");
  const unitsPerDay = watch("unitsPerDay");
  const startUnitsPerDay = watch("startUnitsPerDay");
  const endUnitsPerDay = watch("endUnitsPerDay");
  const peakUnitsPerDay = watch("peakUnitsPerDay");

  // Set activity IDs when dialog opens
  useEffect(() => {
    if (activity) {
      setValue("activityId", activity.id);
      if (subActivity) {
        setValue("subActivityId", subActivity.id);
      }
    }
  }, [activity, subActivity, setValue]);

  // Calculate preview of daily production
  const productionPreview = useMemo(() => {
    if (!targetItem) return null;

    const config: any = {};
    
    switch (method) {
      case "constant":
        if (!unitsPerDay) return null;
        config.unitsPerDay = unitsPerDay;
        break;
      case "ramp-up":
      case "ramp-down":
        if (!startUnitsPerDay || !endUnitsPerDay) return null;
        config.startUnitsPerDay = startUnitsPerDay;
        config.endUnitsPerDay = endUnitsPerDay;
        break;
      case "s-curve":
        if (!peakUnitsPerDay) return null;
        config.peakUnitsPerDay = peakUnitsPerDay;
        break;
    }

    try {
      return calculateDailyProduction(
        method,
        targetItem.units,
        targetItem.duration,
        targetItem.startDate,
        config
      );
    } catch (error) {
      return null;
    }
  }, [method, targetItem, unitsPerDay, startUnitsPerDay, endUnitsPerDay, peakUnitsPerDay]);

  const handleFormSubmit = async (data: ProductionConfigFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!targetItem) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Configure Production
          </DialogTitle>
          <DialogDescription>
            Set up production targeting for {isSubActivity ? "sub-activity" : "activity"}: <strong>{targetItem.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4 py-4">
            {/* Activity Info */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="text-sm space-y-1">
                  <p><strong>Total Units:</strong> {targetItem.units}</p>
                  <p><strong>Duration:</strong> {targetItem.duration} days</p>
                  <p><strong>Dates:</strong> {targetItem.startDate} to {targetItem.endDate}</p>
                </div>
              </AlertDescription>
            </Alert>

            {/* Production Method Selection */}
            <FormSelectField
              name="method"
              control={control}
              label="Production Method"
              placeholder="Select production method..."
              description="Choose how units will be distributed over time"
              options={productionMethods.map((pm) => ({
                label: pm.label,
                value: pm.value,
              }))}
            />

            {/* Method Description */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{formatProductionMethod(method)}:</strong> {getProductionMethodDescription(method)}
              </p>
            </div>

            {/* Method-specific fields */}
            {method === "constant" && (
              <FormFieldWrapper
                name="unitsPerDay"
                control={control}
                label="Units Per Day"
                type="number"
                placeholder="e.g., 10"
                description="Number of units to complete each day"
              />
            )}

            {(method === "ramp-up" || method === "ramp-down") && (
              <div className="grid grid-cols-2 gap-4">
                <FormFieldWrapper
                  name="startUnitsPerDay"
                  control={control}
                  label="Start Units Per Day"
                  type="number"
                  placeholder="e.g., 5"
                  description="Starting daily production"
                />
                <FormFieldWrapper
                  name="endUnitsPerDay"
                  control={control}
                  label="End Units Per Day"
                  type="number"
                  placeholder="e.g., 15"
                  description="Ending daily production"
                />
              </div>
            )}

            {method === "s-curve" && (
              <FormFieldWrapper
                name="peakUnitsPerDay"
                control={control}
                label="Peak Units Per Day"
                type="number"
                placeholder="e.g., 20"
                description="Maximum daily production at peak"
              />
            )}

            {/* Crew Assignment */}
            <FormSelectField
              name="crewId"
              control={control}
              label="Assign Crew (Optional)"
              placeholder="Select a crew..."
              description="Assign a crew to this production configuration"
              options={crews.map((crew) => ({
                label: `${crew.name} (${crew.numberOfPeople} people)`,
                value: crew.id,
              }))}
            />

            {/* Production Preview */}
            {productionPreview && productionPreview.length > 0 && (
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">Production Preview</h4>
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {productionPreview.slice(0, 10).map((day) => (
                    <div key={day.day} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Day {day.day} ({day.date})
                      </span>
                      <span className="font-medium">{day.targetUnits} units</span>
                    </div>
                  ))}
                  {productionPreview.length > 10 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      ... and {productionPreview.length - 10} more days
                    </p>
                  )}
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>
                      {productionPreview.reduce((sum, day) => sum + day.targetUnits, 0).toFixed(2)} units
                    </span>
                  </div>
                </div>
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
              Save Configuration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureProductionDialog;
