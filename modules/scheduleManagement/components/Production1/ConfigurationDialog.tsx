import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProductionActivity } from "./ActivityList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { FormSelectField } from "@/components/global/Form/FormSelectField";
import { Form, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CrewComposition from "./CrewComposition";
import { Crew } from "./CrewComposition";
import { Separator } from "@/components/ui/separator";
import EquipmentsConf from "./EquipmentsConf";
import { Button } from "@/components/ui/button";
import { EquipmentAssignmentForm } from "./EquipmentDialog";
import { useCreateProductionPlanning, useUpdateProductionPlanning } from "@/hooks/ReactQuery/useSchedule";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/store/projectStore";

enum ProductionMethod {
  CONSTANT = "CONSTANT",
  RAMP_UP = "RAMP_UP",
  RAMP_DOWN = "RAMP_DOWN",
  S_CURVE = "S_CURVE",
}

const ConfigurationDialog = ({
  open,
  data,
  onClose,
}: {
  open: boolean;
  data?: ProductionActivity;
  onClose: () => void;
}) => {
  const { selectedProject } = useProjectStore();
  const isReconfiguring = !!data?.productionPlanning;
  const originalDuration = data?.duration;
  
  const schema = z.object({
    duration: z
      .number()
      .min(1, "Duration must be at least 1 day")
      .refine(
        (val) => {
          if (originalDuration == null) return true;
          return val >= originalDuration;
        },
        {
          message: "Estimated Duration must be greater than or equal to original duration",
        }
      ),
    method: z.nativeEnum(ProductionMethod),
    crew: z.array(
      z.object({
        crewId: z.string(),
      })
    ),
    equipment: z.array(
      z.object({
        equipmentId: z.string(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    ),
  });

  const createProductionPlanning = useCreateProductionPlanning();
  const updateProductionPlanning = useUpdateProductionPlanning();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      duration: data?.productionPlanning?.duration || data?.duration || 0,
      method: (data?.productionPlanning?.productionMethod as ProductionMethod) || ProductionMethod.CONSTANT,
    },
  });

  // Reset form when dialog opens with new data
  React.useEffect(() => {
    if (open && data) {
      form.reset({
        duration: data?.productionPlanning?.duration || data?.duration || 0,
        method: (data?.productionPlanning?.productionMethod as ProductionMethod) || ProductionMethod.CONSTANT,
      });
    }
  }, [open, data, form]);

  const [crew, setCrew] = React.useState<Crew[]>([]);
  const [equipment, setEquipment] = React.useState<EquipmentAssignmentForm[]>([]);
  const [totalCrewCost, setTotalCrewCost] = React.useState<number>(0);
  const [totalEquipmentCost, setTotalEquipmentCost] = React.useState<number>(0);

  // Reset crew and equipment state when dialog opens/closes or activity changes
  React.useEffect(() => {
    if (!open) {
      // Reset when dialog closes
      setCrew([]);
      setEquipment([]);
    }
  }, [open]);

  // Initialize equipment from existing production planning when reconfiguring
  React.useEffect(() => {
    if (data?.productionPlanning?.equipments && open) {
      const existingEquipment = data.productionPlanning.equipments.map((eq) => ({
        equipmentId: eq.equipment.id,
        quantity: eq.quantity,
      }));
      setEquipment(existingEquipment);
    } else if (!data?.productionPlanning && open) {
      setEquipment([]);
    }
  }, [data?.productionPlanning, open]);

  React.useEffect(() => {
    form.setValue("crew", crew);
  }, [crew, form]);

  React.useEffect(() => {
    form.setValue("equipment", equipment);
  }, [equipment, form]);

  const handleTotalCostChange = (cost: number) => {
    setTotalCrewCost(cost);
  };

  const handleEquipmentCostChange = (cost: number) => {
    setTotalEquipmentCost(cost);
  };

  const totalActivityCost = totalCrewCost + totalEquipmentCost;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                {isReconfiguring ? "Reconfigure" : "Configure"} Production - {data?.name}
              </DialogTitle>
              <DialogDescription>
                Set up production method, duration, assign crews, and add equipment
              </DialogDescription>
            </div>
            {isReconfiguring && (
              <Badge variant="secondary" className="ml-2">
                Reconfiguring
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Units</p>
                <p className="font-semibold">
                  {data?.targetUnit?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Original Duration</p>
                <p className="font-semibold">{data?.duration} days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Period</p>
                <p className="font-semibold text-xs">
                  {data?.startDate.split("T")[0]} to{" "}
                  {data?.endDate.split("T")[0]}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Activity Cost</p>
                <p className="font-semibold text-primary">
                  ${totalActivityCost.toFixed(2)}
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            const planningData = {
              projectId: selectedProject?.id || "",
              activityId: data?.id || "",
              duration: values.duration,
              productionMethod: values.method,
              crews: crew,
              equipments: equipment,
              // unitsPerDay: Math.ceil(
              //   (data?.targetUnit || 0) / values.duration
              // ),
            };

            if (isReconfiguring && data?.productionPlanning?.id) {
              updateProductionPlanning.mutate({
                id: data.productionPlanning.id,
                data: planningData,
              });
            } else {
              createProductionPlanning.mutate(planningData);
            }
            onClose();
          })}
        >
          <FormFieldWrapper
            name="duration"
            label="Duration (days)"
            type="number"
            placeholder="e.g., Standard, Accelerated, Custom"
            description="Change this if you want to adjust the estimated duration for planning purposes."
            control={form.control}
          />
          <FormSelectField
            name="method"
            control={form.control}
            label="Production Method"
            placeholder="Select production method..."
            options={Object.values(ProductionMethod).map((method) => ({
              value: method,
              label: method
                .split("_")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" "),
            }))}
          />

          <Separator />

          <CrewComposition
            duration={form.watch("duration") || data?.duration || 0}
            crew={crew}
            setCrew={setCrew}
            onTotalCostChange={handleTotalCostChange}
            activityId={data?.id || ""}
            assignedCrews={data?.productionPlanning?.crews}
          />

          <EquipmentsConf
            duration={form.watch("duration") || data?.duration || 0}
            setEquipment={setEquipment}
            onTotalCostChange={handleEquipmentCostChange}
            existingEquipment={data?.productionPlanning?.equipments}
          />
          <DialogFooter>
            <Button 
              variant={"outline"} 
              type="button" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isReconfiguring ? "Update Configuration" : "Save Configuration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationDialog;
