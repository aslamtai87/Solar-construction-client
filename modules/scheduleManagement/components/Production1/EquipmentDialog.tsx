import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { FormSelectField } from "@/components/global/Form/FormSelectField";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { EquipmentPricingPeriod } from "@/lib/types/production";
import { useProjectStore } from "@/store/projectStore";
import { useGetEquipment } from "@/hooks/ReactQuery/useSchedule";

const equipmentAssignmentSchema = z.object({
  equipmentId: z.string().min(1, "Equipment is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type EquipmentAssignmentForm = z.infer<typeof equipmentAssignmentSchema>;

const EquipmentPricingPeriodLabels: Record<EquipmentPricingPeriod, string> = {
  [EquipmentPricingPeriod.PER_DAY]: "Per Day",
  [EquipmentPricingPeriod.PER_WEEK]: "Per Week",
  [EquipmentPricingPeriod.PER_MONTH]: "Per Month",
};

const EquipmentDialog = ({
  open,
  onClose,
  setAssignments,
  editData,
  existingEquipmentIds,
}: {
  open: boolean;
  onClose: () => void;
  setAssignments: React.Dispatch<
    React.SetStateAction<
      {
        equipmentId: string;
        equipmentName: string;
        quantity: number;
        price: number;
        pricingType: EquipmentPricingPeriod;
      }[]
    >
  >;
  editData?: {
    equipmentId: string;
    equipmentName: string;
    quantity: number;
    price: number;
    pricingType: EquipmentPricingPeriod;
  };
  existingEquipmentIds?: string[];
}) => {
  const { selectedProject } = useProjectStore();
  const { data: equipmentData } = useGetEquipment({
    projectId: selectedProject?.id || "",
    limit: 100,
  });

  // Filter out already assigned equipment (except when editing)
  const availableEquipment = equipmentData?.data.result.filter((eq) => {
    if (editData && eq.id === editData.equipmentId) {
      return true; // Allow current equipment when editing
    }
    return !existingEquipmentIds?.includes(eq.id);
  }) || [];

  const form = useForm<EquipmentAssignmentForm>({
    resolver: zodResolver(equipmentAssignmentSchema),
    defaultValues: {
      equipmentId: editData?.equipmentId || "",
      quantity: editData?.quantity || 1,
    },
  });

  React.useEffect(() => {
    if (editData) {
      form.reset({
        equipmentId: editData.equipmentId,
        quantity: editData.quantity,
      });
    } else {
      form.reset({
        equipmentId: "",
        quantity: 1,
      });
    }
  }, [editData, form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Assign"} Equipment</DialogTitle>
          <DialogDescription>
            Select equipment and specify quantity
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit((data) => {
              const selectedEquipment = equipmentData?.data.result.find(
                (eq) => eq.id === data.equipmentId
              );

              if (editData) {
                // Update existing assignment
                setAssignments((prev) =>
                  prev.map((assignment) =>
                    assignment.equipmentId === editData.equipmentId
                      ? {
                          equipmentId: data.equipmentId,
                          equipmentName: selectedEquipment?.name || "",
                          quantity: data.quantity,
                          price: Number(selectedEquipment?.price || 0),
                          pricingType: (selectedEquipment?.pricingType ||
                            EquipmentPricingPeriod.PER_DAY) as EquipmentPricingPeriod,
                        }
                      : assignment
                  )
                );
              } else {
                // Add new assignment
                setAssignments((prev) => [
                  ...prev,
                  {
                    equipmentId: data.equipmentId,
                    equipmentName: selectedEquipment?.name || "",
                    quantity: data.quantity,
                    price: Number(selectedEquipment?.price || 0),
                    pricingType: (selectedEquipment?.pricingType ||
                      EquipmentPricingPeriod.PER_DAY) as EquipmentPricingPeriod,
                  },
                ]);
              }
              form.reset();
              onClose();
            })(e);
          }}
          className="space-y-4"
        >
          <FormSelectField
            name="equipmentId"
            control={form.control}
            label="Equipment"
            placeholder="Select equipment"
            options={
              availableEquipment.map((e) => ({
                value: e.id,
                label: `${e.name} - $${Number(e.price).toFixed(2)}/${
                  e.pricingType === EquipmentPricingPeriod.PER_DAY
                    ? "day"
                    : e.pricingType === EquipmentPricingPeriod.PER_WEEK
                    ? "week"
                    : "month"
                }`,
              }))
            }
          />

          <FormFieldWrapper
            name="quantity"
            control={form.control}
            label="Quantity"
            type="number"
            placeholder="1"
            min={1}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editData ? "Update Equipment" : "Assign Equipment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentDialog;
