"use client";

import React, { useEffect } from "react";
import { Plus, Wrench, Trash2, Edit, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { FormSelectField } from "@/components/global/Form/FormSelectField";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Equipment, EquipmentAssignment, EquipmentPricingPeriod, GetEquipment } from "@/lib/types/production";
import { useDialog } from "@/hooks/useDialog";

const equipmentAssignmentSchema = z.object({
  equipmentId: z.string().min(1, "Please select equipment"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

type EquipmentAssignmentForm = z.infer<typeof equipmentAssignmentSchema>;

interface EquipmentAssignmentSelectorProps {
  availableEquipment: GetEquipment[];
  assignments: EquipmentAssignment[];
  onAddAssignment: (assignment: Omit<EquipmentAssignment, "id">) => void;
  onUpdateAssignment: (
    id: string,
    assignment: Partial<EquipmentAssignment>
  ) => void;
  onDeleteAssignment: (id: string) => void;
  duration: number;
}

export const EquipmentAssignmentSelector: React.FC<
  EquipmentAssignmentSelectorProps
> = ({
  availableEquipment,
  assignments,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  duration,
}) => {
  const equipmentDialog = useDialog<EquipmentAssignment>();

  const form = useForm<EquipmentAssignmentForm>({
    resolver: zodResolver(equipmentAssignmentSchema),
    defaultValues: {
      equipmentId: "",
      quantity: 1,
    },
  });

  // Update form when dialog opens
  useEffect(() => {
    if (equipmentDialog.dialog.open) {
      if (
        equipmentDialog.dialog.mode === "edit" &&
        equipmentDialog.dialog.data
      ) {
        const assignment = equipmentDialog.dialog.data;
        form.reset({
          equipmentId: assignment.equipmentId,
          quantity: assignment.quantity,
        });
      } else {
        form.reset({
          equipmentId: "",
          quantity: 1,
        });
      }
    }
  }, [
    equipmentDialog.dialog.open,
    equipmentDialog.dialog.mode,
    equipmentDialog.dialog.data,
  ]);

  const handleCloseDialog = () => {
    equipmentDialog.closeDialog();
    form.reset();
  };

  const handleSubmit = (data: EquipmentAssignmentForm) => {
    const equipment = availableEquipment.find((e) => e.id === data.equipmentId);
    if (!equipment) return;

    const assignmentData = {
      equipmentId: data.equipmentId,
      equipmentName: equipment.name,
      price: equipment.price,
      pricingType: equipment.pricingType,
      quantity: data.quantity,
    };

    if (equipmentDialog.dialog.mode === "edit" && equipmentDialog.dialog.data) {
      onUpdateAssignment(equipmentDialog.dialog.data.id, assignmentData);
    } else {
      onAddAssignment(assignmentData);
    }

    handleCloseDialog();
  };

  const calculateTotalEquipmentCost = () => {
    return assignments.reduce((sum, assignment) => {
      // Convert price to daily rate based on pricing period
      let dailyRate = assignment.price;
      if (assignment.pricingType === EquipmentPricingPeriod.PER_WEEK) {
        dailyRate = assignment.price / 7;
      } else if (assignment.pricingType === EquipmentPricingPeriod.PER_MONTH) {
        dailyRate = assignment.price / 30;
      }
      return sum + dailyRate * assignment.quantity * duration;
    }, 0);
  };

  if (availableEquipment.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Equipment Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Wrench className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No equipment available
            </p>
            <p className="text-xs text-muted-foreground">
              Add equipment in the Equipment tab first
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Equipment Assignment</CardTitle>
            <Button
              size="sm"
              onClick={() => equipmentDialog.openCreateDialog()}
              type="button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Assign Equipment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-2">
                  <Settings className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    No equipment assigned yet
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => equipmentDialog.openCreateDialog()}
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Equipment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-start justify-between gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">
                      {assignment.equipmentName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quantity: {assignment.quantity}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">
                        ${assignment.price.toFixed(2)}/{assignment.pricingType === EquipmentPricingPeriod.PER_DAY ? "day" : assignment.pricingType === EquipmentPricingPeriod.PER_WEEK ? "week" : "month"}
                      </Badge>
                      <span className="text-muted-foreground">
                        $
                        {(() => {
                          let dailyRate = assignment.price;
                          if (assignment.pricingType === EquipmentPricingPeriod.PER_WEEK) {
                            dailyRate = assignment.price / 7;
                          } else if (assignment.pricingType === EquipmentPricingPeriod.PER_MONTH) {
                            dailyRate = assignment.price / 30;
                          }
                          return (dailyRate * assignment.quantity * duration).toFixed(2);
                        })()}{" "}
                        total
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => equipmentDialog.openEditDialog(assignment)}
                      type="button"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteAssignment(assignment.id)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Total Equipment Cost:</span>
                  <span>${calculateTotalEquipmentCost().toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={equipmentDialog.dialog.open}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {equipmentDialog.dialog.mode === "edit"
                ? "Edit Equipment Assignment"
                : "Assign Equipment"}
            </DialogTitle>
            <DialogDescription>
              Select equipment and specify quantity
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(handleSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormSelectField
              name="equipmentId"
              control={form.control}
              label="Equipment"
              placeholder="Select equipment"
              options={availableEquipment.map((e) => ({
                value: e.id,
                label: `${e.name} - $${Number(e.price).toFixed(2)}/${e.pricingType === EquipmentPricingPeriod.PER_DAY ? "day" : e.pricingType === EquipmentPricingPeriod.PER_WEEK ? "week" : "month"}`,
              }))}
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
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {equipmentDialog.dialog.mode === "edit" ? "Update" : "Assign"}{" "}
                Equipment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
