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
  assignedCrews,
}: {
  duration: number;
  crew: Crew[];
  setCrew: (crew: Crew[]) => void;
  onTotalCostChange?: (totalCost: number) => void;
  activityId: string;
  assignedCrews?: Array<{
    crew: {
      id: string;
      name: string;
      description: string | null;
      activityId: string | null;
      labourers: Array<{
        id: string;
        quantity: number;
        labourer: {
          id: string;
          name: string;
          totalRate: string;
        };
      }>;
    };
  }>;
}) => {
  const {
    dialog: crewDialog,
    openCreateDialog: openCrewDialog,
    openEditDialog: openEditCrewDialog,
    closeDialog,
  } = useDialog();
  const { selectedProject } = useProjectStore();

  // Fetch all crews for this activity (for adding new ones)
  const { data: availableCrews } = useGetCrews({
    limit: 100,
    projectId: selectedProject?.id || "",
    activityId: activityId,
  });

  const deleteCrewMutation = useDeleteCrew();
  const updateCrewMutation = useUpdateCrew();

  // Get assigned crew IDs from production planning
  const assignedCrewIds = assignedCrews?.map((ac) => ac.crew.id) || [];

  // Get IDs of crews in the form state (selected by user)
  const selectedCrewIds = crew.map(c => c.crewId);

  // Fetch all available crews to show newly created ones
  const allAvailableCrews = availableCrews?.data.result || [];

  // Display crews that are either:
  // 1. In the assignedCrews (from production planning) OR
  // 2. In the crew form state (newly created/selected during this session)
  const displayedCrews = allAvailableCrews.filter(c => 
    selectedCrewIds.includes(c.id)
  );

  // Initialize crew state from production planning
  useEffect(() => {
    if (assignedCrews && assignedCrews.length > 0) {
      const crewData: Crew[] = assignedCrews.map((ac) => ({
        crewId: ac.crew.id,
      }));
      setCrew(crewData);
    } else {
      setCrew([]);
    }
  }, [assignedCrews, setCrew]);

  // When new crews are fetched and we don't have production planning,
  // automatically add all crews to the state
  useEffect(() => {
    if (!assignedCrews || assignedCrews.length === 0) {
      if (allAvailableCrews.length > 0 && crew.length === 0) {
        const allCrewData: Crew[] = allAvailableCrews.map((c) => ({
          crewId: c.id,
        }));
        setCrew(allCrewData);
      } else if (allAvailableCrews.length > selectedCrewIds.length) {
        // New crew was added, update the crew state
        const newCrewIds = allAvailableCrews
          .map(c => c.id)
          .filter(id => !selectedCrewIds.includes(id));
        
        if (newCrewIds.length > 0) {
          const updatedCrew = [
            ...crew,
            ...newCrewIds.map(id => ({ crewId: id }))
          ];
          setCrew(updatedCrew);
        }
      }
    }
  }, [allAvailableCrews, assignedCrews]);

  // Calculate total cost for all assigned crews
  const totalCrewCost = displayedCrews.reduce((total, crewItem) => {
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
            Create and configure crews for this activity
          </p>
        </div>
        <Button onClick={() => openCrewDialog()} type="button">
          <Plus className="h-4 w-4 mr-2" />
          Create Crew
        </Button>
      </div>
      {displayedCrews.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No crews configured for this activity</p>
              <p className="text-xs text-muted-foreground">Create a crew to assign labourers to this activity</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCrewDialog()}
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Crew
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        displayedCrews.map((crewItem) => {
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
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => {
                        openEditCrewDialog(crewItem);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete crew "${crewItem.name}"? This will remove it from the configuration and delete it permanently.`
                          )
                        ) {
                          // Remove from configuration state
                          setCrew(crew.filter(c => c.crewId !== crewItem.id));
                          // Delete from database
                          deleteCrewMutation.mutate(crewItem.id);
                        }
                      }}
                    >
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
      {displayedCrews.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-muted">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Total Cost/Hour</p>
              <p className="font-semibold">${totalCrewCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Cost/Day (8hrs)</p>
              <p className="font-semibold">${(totalCrewCost * 8).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total for {duration} days</p>
              <p className="font-semibold text-primary">${totalCostForDuration.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <CrewDialog
        open={crewDialog.open}
        onClose={closeDialog}
        duration={duration}
        activityId={activityId}
        editData={crewDialog.data}
      />
    </div>
  );
};

export default CrewComposition;
