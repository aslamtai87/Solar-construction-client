import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Settings, Wrench } from "lucide-react";
import { useGetEquipment } from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";
import { EquipmentPricingPeriod } from "@/lib/types/production";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/useDialog";
import EquipmentDialog from "./EquipmentDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export interface EquipmentAssignment {
  equipmentId: string;
  quantity: number;
}
const EquipmentsConf = ({
  duration,
  setEquipment,
  onTotalCostChange,
  existingEquipment,
}: {
  duration: number;
  setEquipment: (assignments: EquipmentAssignment[]) => void;
  onTotalCostChange?: (totalCost: number) => void;
  existingEquipment?: Array<{
    equipment: {
      id: string;
      name: string;
      price: string;
      pricingType: string;
    };
    quantity: number;
  }>;
}) => {
  const { selectedProject } = useProjectStore();
  const { data: equipmentData } = useGetEquipment({
    limit: 100,
    projectId: selectedProject?.id || "",
  });

  const availableEquipment = equipmentData?.data.result || [];
  const {
    dialog: equipmentDialog,
    openCreateDialog: openEquipmentDialog,
    closeDialog: closeEquipmentDialog,
  } = useDialog();

  const [assignments, setAssignments] = useState<
    {
      equipmentId: string;
      equipmentName: string;
      quantity: number;
      price: number;
      pricingType: EquipmentPricingPeriod;
    }[]
  >([]);
  const [editingEquipment, setEditingEquipment] = useState<{
    equipmentId: string;
    equipmentName: string;
    quantity: number;
    price: number;
    pricingType: EquipmentPricingPeriod;
  } | null>(null);

  // Initialize with existing equipment when available
  useEffect(() => {
    if (existingEquipment && existingEquipment.length > 0) {
      const mappedEquipment = existingEquipment.map((eq) => ({
        equipmentId: eq.equipment.id,
        equipmentName: eq.equipment.name,
        quantity: eq.quantity,
        price: Number(eq.equipment.price),
        pricingType: eq.equipment.pricingType as EquipmentPricingPeriod,
      }));
      setAssignments(mappedEquipment);
    }
  }, [existingEquipment]);
  
  useEffect(() => {
    setEquipment(
      assignments.map((assignment) => ({
        equipmentId: assignment.equipmentId,
        quantity: assignment.quantity,
      }))
    );
  }, [assignments]);

  const calculateTotalEquipmentCost = () => {
    return assignments.reduce((sum, assignment) => {
      let dailyRate = assignment.price;
      if (assignment.pricingType === EquipmentPricingPeriod.PER_WEEK) {
        dailyRate = assignment.price / 7;
      } else if (assignment.pricingType === EquipmentPricingPeriod.PER_MONTH) {
        dailyRate = assignment.price / 30;
      }
      return sum + dailyRate * assignment.quantity * duration;
    }, 0);
  };

  useEffect(() => {
    const totalCost = calculateTotalEquipmentCost();
    if (onTotalCostChange) {
      onTotalCostChange(totalCost);
    }
  }, [assignments, duration]);

  const handleDeleteAssignment = (equipmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.equipmentId !== equipmentId));
  };

  const handleEditAssignment = (assignment: {
    equipmentId: string;
    equipmentName: string;
    quantity: number;
    price: number;
    pricingType: EquipmentPricingPeriod;
  }) => {
    setEditingEquipment(assignment);
    openEquipmentDialog();
  };

  const handleCloseDialog = () => {
    setEditingEquipment(null);
    closeEquipmentDialog();
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
              onClick={() => openEquipmentDialog()}
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
                    onClick={() => openEquipmentDialog()}
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
                  key={assignment.equipmentId}
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
                      <Badge variant={"outline"}>
                        ${assignment.price.toFixed(2)}/
                        {assignment.pricingType ===
                        EquipmentPricingPeriod.PER_DAY
                          ? "day"
                          : assignment.pricingType ===
                            EquipmentPricingPeriod.PER_WEEK
                          ? "week"
                          : "month"}
                      </Badge>
                      <span className="text-muted-foreground">
                        $
                        {(() => {
                          let dailyRate = assignment.price;
                          if (
                            assignment.pricingType ===
                            EquipmentPricingPeriod.PER_WEEK
                          ) {
                            dailyRate = assignment.price / 7;
                          } else if (
                            assignment.pricingType ===
                            EquipmentPricingPeriod.PER_MONTH
                          ) {
                            dailyRate = assignment.price / 30;
                          }
                          return (
                            dailyRate *
                            assignment.quantity *
                            duration
                          ).toFixed(2);
                        })()}{" "}
                        total
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditAssignment(assignment)}
                      type="button"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAssignment(assignment.equipmentId)}
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

      {/* Equipment Cost Summary */}
      {/* {assignments.length > 0 && (
        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="pt-6">
            <CardTitle className="mb-4 text-lg font-semibold">
              Total Equipment Cost Summary
            </CardTitle>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Equipment Units</p>
                <p className="font-semibold text-lg">
                  {assignments.reduce((sum, a) => sum + a.quantity, 0)} units
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Total Cost for {duration} days
                </p>
                <p className="font-semibold text-lg text-primary">
                  ${calculateTotalEquipmentCost().toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      <EquipmentDialog
        onClose={handleCloseDialog}
        open={equipmentDialog.open}
        setAssignments={setAssignments}
        editData={editingEquipment || undefined}
        existingEquipmentIds={assignments.map((a) => a.equipmentId)}
      />
    </>
  );
};

export default EquipmentsConf;
