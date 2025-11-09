"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity as ActivityIcon,
} from "lucide-react";
import { 
  ProductionMethod, 
  CrewComposition, 
  EquipmentAssignment,
  EquipmentPricingPeriod,
  GetEquipment,
  GetLabourer
} from "@/lib/types/production";
import { Activity } from "@/lib/types/schedule";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDailyProduction } from "@/lib/utils/productionCalculator";
import { Separator } from "@/components/ui/separator";
import { FormSelectField } from "@/components/global/Form/FormSelectField";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { CrewCompositionBuilder } from "./CrewCompositionBuilder";
import { EquipmentAssignmentSelector } from "./EquipmentAssignmentSelector";
import { ProductionForecastCard } from "./ProductionForecastCard";
import { useGetLabourers } from "@/hooks/ReactQuery/useSchedule";

const configSchema = z.object({
  activityId: z.string(),
  method: z.enum(["constant", "ramp-up", "ramp-down", "s-curve"]),
  duration: z.number().min(1, "Duration must be at least 1 day"),
});

type ConfigFormData = z.infer<typeof configSchema>;

interface ConfigureProductionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    activityId: string;
    method: ProductionMethod;
    duration: number;
    crews: CrewComposition[];
    equipment: EquipmentAssignment[];
  }) => void;
  activity: Activity | null;
  availableLabourers: GetLabourer[];
  availableEquipment: GetEquipment[];
}

const productionMethods: { value: ProductionMethod; label: string; icon: any; description: string }[] = [
  { 
    value: "constant", 
    label: "Constant", 
    icon: Minus,
    description: "AI distributes units evenly across all days (units ÷ days)"
  },
  { 
    value: "ramp-up", 
    label: "Ramp Up", 
    icon: TrendingUp,
    description: "AI will forecast gradually increasing production over time"
  },
  { 
    value: "ramp-down", 
    label: "Ramp Down", 
    icon: TrendingDown,
    description: "AI will forecast gradually decreasing production over time"
  },
  { 
    value: "s-curve", 
    label: "S-Curve", 
    icon: ActivityIcon,
    description: "AI will forecast production starting slow, peaking in middle, then slowing down"
  },
];

export const ConfigureProductionDialog = ({
  open,
  onClose,
  onSubmit,
  activity,
  availableLabourers,
  availableEquipment,
}: ConfigureProductionDialogProps) => {
  const [crews, setCrews] = useState<CrewComposition[]>([]);
  const [equipmentAssignments, setEquipmentAssignments] = useState<EquipmentAssignment[]>([]);
  const { data: labourers } = useGetLabourers({
    limit: 50,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      activityId: "",
      method: "constant",
      duration: 0,
    },
  });

  const method = watch("method");
  const duration = watch("duration");

  // Set activity data when dialog opens
  useEffect(() => {
    if (activity) {
      setValue("activityId", activity.id);
      setValue("duration", activity.duration || 0);
    }
  }, [activity, setValue]);


  // Calculate AI-based production forecast
  const productionForecast = useMemo(() => {
    if (!activity || !duration || !activity.targetUnit) return null;

    const config: any = {};
    
    // Constant method auto-calculates: units ÷ days
    if (method === "constant") {
      config.unitsPerDay = activity.targetUnit / duration;
    }

    try {
      return calculateDailyProduction(
        method,
        activity.targetUnit,
        duration,
        activity.startDate,
        config
      );
    } catch (error) {
      return null;
    }
  }, [method, activity, duration]);

  const handleFormSubmit = async (data: ConfigFormData) => {
    onSubmit({ 
      activityId: data.activityId,
      method: data.method,
      duration: data.duration,
      crews, 
      equipment: equipmentAssignments 
    });
    reset();
    setCrews([]);
    setEquipmentAssignments([]);
  };

  const handleClose = () => {
    reset();
    setCrews([]);
    setEquipmentAssignments([]);
    onClose();
  };

  // Crew management handlers
  const handleAddCrew = (crew: Omit<CrewComposition, "id" | "totalCostPerHour">) => {
    const totalCostPerHour = crew.labourers.reduce(
      (sum, l) => sum + l.totalRate * l.quantity,
      0
    );
    setCrews([...crews, { 
      ...crew, 
      id: `crew-${Date.now()}`,
      totalCostPerHour 
    }]);
  };

  const handleUpdateCrew = (id: string, updates: Partial<CrewComposition>) => {
    setCrews(crews.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        if (updates.labourers) {
          updated.totalCostPerHour = updates.labourers.reduce(
            (sum, l) => sum + l.totalRate * l.quantity,
            0
          );
        }
        return updated;
      }
      return c;
    }));
  };

  const handleDeleteCrew = (id: string) => {
    setCrews(crews.filter(c => c.id !== id));
  };

  // Equipment management handlers
  const handleAddEquipment = (assignment: Omit<EquipmentAssignment, "id">) => {
    setEquipmentAssignments([...equipmentAssignments, { 
      ...assignment, 
      id: `equip-${Date.now()}` 
    }]);
  };

  const handleUpdateEquipment = (id: string, updates: Partial<EquipmentAssignment>) => {
    setEquipmentAssignments(equipmentAssignments.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ));
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipmentAssignments(equipmentAssignments.filter(e => e.id !== id));
  };

  if (!activity) return null;

  // Calculate total cost estimate
  const totalCrewCost = crews.reduce((sum, crew) => 
    sum + (crew.totalCostPerHour * 8 * duration), 0
  );
  const totalEquipmentCost = equipmentAssignments.reduce((sum, equip) => {
    let dailyRate = equip.price;
    if (equip.pricingType === EquipmentPricingPeriod.PER_WEEK) {
      dailyRate = equip.price / 7;
    } else if (equip.pricingType === EquipmentPricingPeriod.PER_MONTH) {
      dailyRate = equip.price / 30;
    }
    return sum + (dailyRate * equip.quantity * duration);
  }, 0);
  const totalEstimatedCost = totalCrewCost + totalEquipmentCost;


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Configure Production - {activity.name}
          </DialogTitle>
          <DialogDescription>
            Set up production method, duration, assign crews, and add equipment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" onKeyDown={(e) => {
          // Prevent Enter key from submitting the form
          if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
            e.preventDefault();
          }
        }}>
          <div className="space-y-6 py-4">
            {/* Activity Info */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Units</p>
                    <p className="font-semibold">{activity.targetUnit?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Original Duration</p>
                    <p className="font-semibold">{activity.duration} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Period</p>
                    <p className="font-semibold text-xs">{activity.startDate} to {activity.endDate}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Duration Input */}
            <FormFieldWrapper
              name="duration"
              control={control}
              label="Duration (Days)"
              type="number"
              placeholder="22"
              min={1}
              description="You can adjust the duration for this production configuration"
            />

            {/* Production Method Selection */}
            <FormSelectField
              name="method"
              control={control}
              label="Production Method"
              placeholder="Select production method..."
              options={productionMethods.map((pm) => ({
                value: pm.value,
                label: `${pm.label}`,
              }))}
              description={productionMethods.find(pm => pm.value === method)?.description}
            />

            {/* Method-specific info */}
            {activity.targetUnit && activity.targetUnit > 0 && method === "constant" && duration > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">Auto-Calculated</p>
                    <p className="text-sm">
                      Units are distributed evenly across all days.
                    </p>
                    <div className="text-sm pt-2 border-t">
                      <p className="text-muted-foreground">
                        {activity.targetUnit.toLocaleString()} units ÷ {duration} days = {(activity.targetUnit / duration).toFixed(2)} units/day
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {activity.targetUnit && activity.targetUnit > 0 && (method === "ramp-up" || method === "ramp-down" || method === "s-curve") && (
              <Alert>
                <ActivityIcon className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">AI Forecast Enabled</p>
                    <p className="text-sm">
                      {method === "ramp-up" && 
                        "AI will analyze optimal ramp-up with learning curves, team efficiency improvements, weekend adjustments, and external factors."
                      }
                      {method === "ramp-down" && 
                        "AI will model realistic ramp-down considering team fatigue, resource depletion, material availability, and project closeout."
                      }
                      {method === "s-curve" && 
                        "AI will simulate complete project lifecycle: mobilization (20%), acceleration (25%), peak efficiency (30%), and controlled closeout (25%)."
                      }
                    </p>
                    {duration > 0 && (
                      <div className="text-xs pt-2 border-t space-y-1">
                        <p className="text-muted-foreground font-semibold">AI Considers:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground ml-2">
                          <li>Team learning curves & efficiency optimization</li>
                          <li>Weekend & holiday productivity adjustments</li>
                          <li>Weather & seasonal variations</li>
                          <li>Resource availability & material flow</li>
                          {method === "s-curve" && <li>Project phase dynamics</li>}
                          {method === "ramp-down" && <li>Team fatigue & closeout complexity</li>}
                          {method === "ramp-up" && <li>Process optimization & coordination</li>}
                        </ul>
                        <p className="text-muted-foreground pt-2">
                          Base capacity: {(activity.targetUnit / duration).toFixed(1)} units/day
                        </p>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            {/* Crew Composition */}
            <div onKeyDown={(e) => {
              // Prevent Enter key in nested dialogs from submitting parent form
              if (e.key === 'Enter') {
                e.stopPropagation();
              }
            }}>
              <CrewCompositionBuilder
                availableLabourers={availableLabourers}
                crews={crews}
                onAddCrew={handleAddCrew}
                onUpdateCrew={handleUpdateCrew}
                onDeleteCrew={handleDeleteCrew}
                duration={duration ?? activity.duration ?? 0}
              />
            </div>

            <Separator />

            {/* Equipment Assignment */}
            <div onKeyDown={(e) => {
              // Prevent Enter key in nested dialogs from submitting parent form
              if (e.key === 'Enter') {
                e.stopPropagation();
              }
            }}>
              <EquipmentAssignmentSelector
                availableEquipment={availableEquipment}
                assignments={equipmentAssignments}
                onAddAssignment={handleAddEquipment}
                onUpdateAssignment={handleUpdateEquipment}
                onDeleteAssignment={handleDeleteEquipment}
                duration={duration ?? activity.duration ?? 0}
              />
            </div>

            {/* Cost Summary */}
            {(crews.length > 0 || equipmentAssignments.length > 0) && duration > 0 && (
              <>
                <Separator />
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Cost Estimate</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {crews.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Crew Costs ({duration} days × 8 hrs):</span>
                        <span className="font-semibold">${totalCrewCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {equipmentAssignments.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Equipment Costs ({duration} days):</span>
                        <span className="font-semibold">${totalEquipmentCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                      <span>Total Estimated Cost:</span>
                      <span>${totalEstimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Production Forecast */}
            {activity.targetUnit && activity.targetUnit > 0 && productionForecast && productionForecast.length > 0 && (
              <>
                <Separator />
                <ProductionForecastCard 
                  forecast={productionForecast} 
                  method={method} 
                />
              </>
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
            <Button type="submit" disabled={isSubmitting || !duration} className="gap-2">
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
