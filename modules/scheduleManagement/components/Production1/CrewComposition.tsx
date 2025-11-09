import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { CrewDialog } from "./CrewDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useGetCrews } from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDeleteCrew, useUpdateCrew } from "@/hooks/ReactQuery/useSchedule";

export interface Crew {
  crewId: string;
}

const CrewComposition = ({
  duration,
  crew,
  setCrew,
  onTotalCostChange,
  activityId,
}: {
  duration: number;
  crew: Crew[];
  setCrew: (crew: Crew[]) => void;
  onTotalCostChange?: (totalCost: number) => void;
    activityId: string;
}) => {
  const {
    dialog: crewDialog,
    openCreateDialog: openCrewDialog,
    closeDialog,
  } = useDialog();
  const { selectedProject } = useProjectStore();

  const { data: crews } = useGetCrews({
    limit: 100,
    projectId: selectedProject?.id || "",
    activityId: activityId
  });
  const deleteCrewMutation = useDeleteCrew();
  const updateCrewMutation = useUpdateCrew();

  useEffect(() => {
    if (crews) {
      const crewData: Crew[] = crews.data.result.map((crewItem) => ({
        crewId: crewItem.id,
      }));
      setCrew(crewData);
    }
  }, [crews, setCrew, activityId]);

  // Calculate total cost for all crews
  const totalCrewCost = crews?.data.result.reduce((total, crewItem) => {
    const crewCostPerHour = crewItem.labourers.reduce(
      (crewTotal, labourer) => {
        return (
          crewTotal +
          Number(labourer.labourer.totalRate) * Number(labourer.quantity)
        );
      },
      0
    );
    return total + crewCostPerHour;
  }, 0) || 0;

  const totalCostForDuration = totalCrewCost * duration * 8;

  // Notify parent of cost changes
  useEffect(() => {
    if (onTotalCostChange) {
      onTotalCostChange(totalCostForDuration);
    }
  }, [totalCostForDuration, onTotalCostChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Crew Composition</h3>
          <p className="text-sm text-muted-foreground">
            Build crews by assigning labourers and their quantities
          </p>
        </div>
        <Button onClick={() => openCrewDialog()} type="button">
          <Plus className="h-4 w-4 mr-2" />
          Add Crew
        </Button>
      </div>
      {crews?.data.result.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No crews configured yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCrewDialog()}
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Crew
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        crews?.data.result.map((crewItem) => {
          const displayTotalCost = crewItem.labourers.reduce(
            (total, labourer) => {
              return (
                total +
                Number(labourer.labourer.totalRate) * Number(labourer.quantity)
              );
            },
            0
          );
          return (
            <Card key={crewItem.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">
                    {crewItem.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" type="button">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" type="button">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Labourer</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crewItem.labourers.map((labourer) => (
                      <TableRow key={labourer.id}>
                        <TableCell>{labourer.labourer.name}</TableCell>
                        <TableCell className="text-right">
                          {labourer.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          $
                          {(
                            Number(labourer.labourer.totalRate) *
                            Number(labourer.quantity)
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold bg-muted/50">
                      <TableCell colSpan={2} className="text-right">
                        Total Cost
                      </TableCell>
                      <TableCell className="text-right">
                        ${displayTotalCost.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Total Cost Summary */}
      {crews && crews.data.result.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent>
            <CardTitle className="mb-2 text-lg font-semibold">Total Crew Cost Summary</CardTitle>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Cost per Hour</p>
                <p className="font-semibold text-lg">
                  ${totalCrewCost.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Cost per Day (8hrs)</p>
                <p className="font-semibold text-lg">
                  ${(totalCrewCost * 8).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Total Cost for {duration} days
                </p>
                <p className="font-semibold text-lg text-primary">
                  ${totalCostForDuration.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <CrewDialog
        open={crewDialog.open}
        onClose={closeDialog}
        duration={duration}
      />
    </div>
  );
};

export default CrewComposition;
