"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users, Trash2, Edit, UserPlus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { FormSelectField } from "@/components/global/Form/FormSelectField";
import { CrewComposition, CrewLabourer, Labourer } from "@/lib/types/production";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useDialog } from "@/hooks/useDialog";

const crewSchema = z.object({
  name: z.string().min(1, "Crew name is required"),
});

const labourerSelectionSchema = z.object({
  labourerId: z.string().min(1, "Please select a labourer"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

type CrewFormData = z.infer<typeof crewSchema>;
type LabourerSelectionFormData = z.infer<typeof labourerSelectionSchema>;

interface CrewCompositionBuilderProps {
  availableLabourers: Labourer[];
  crews: CrewComposition[];
  onAddCrew: (crew: Omit<CrewComposition, "id" | "totalCostPerHour">) => void;
  onUpdateCrew: (id: string, crew: Partial<CrewComposition>) => void;
  onDeleteCrew: (id: string) => void;
  duration: number;
}

interface LabourerSelection {
  labourerId: string;
  quantity: number;
}

export const CrewCompositionBuilder: React.FC<CrewCompositionBuilderProps> = ({
  availableLabourers,
  crews,
  onAddCrew,
  onUpdateCrew,
  onDeleteCrew,
  duration,
}) => {
  const crewDialog = useDialog<CrewComposition>();
  const [selectedLabourers, setSelectedLabourers] = useState<LabourerSelection[]>([]);

  const crewForm = useForm<CrewFormData>({
    resolver: zodResolver(crewSchema),
    defaultValues: {
      name: "",
    },
  });

  const labourerForm = useForm<LabourerSelectionFormData>({
    resolver: zodResolver(labourerSelectionSchema),
    defaultValues: {
      labourerId: "",
      quantity: 1,
    },
  });

  // Update form when dialog opens
  useEffect(() => {
    if (crewDialog.dialog.open) {
      if (crewDialog.dialog.mode === "edit" && crewDialog.dialog.data) {
        const crew = crewDialog.dialog.data;
        crewForm.reset({ name: crew.name });
        // Convert crew labourers to selection format
        const selections: LabourerSelection[] = crew.labourers.map((l) => ({
          labourerId: l.labourerId,
          quantity: l.quantity,
        }));
        setSelectedLabourers(selections);
      } else {
        crewForm.reset({ name: "" });
        setSelectedLabourers([]);
      }
      labourerForm.reset({ labourerId: "", quantity: 1 });
    }
  }, [crewDialog.dialog.open, crewDialog.dialog.mode, crewDialog.dialog.data]);

  const handleCloseDialog = () => {
    crewDialog.closeDialog();
    setSelectedLabourers([]);
    crewForm.reset();
    labourerForm.reset();
  };

  const handleAddLabourerSubmit = (data: LabourerSelectionFormData) => {
    // Check if labourer already added
    const existingIndex = selectedLabourers.findIndex(
      (sl) => sl.labourerId === data.labourerId
    );

    if (existingIndex >= 0) {
      // Update quantity
      const updated = [...selectedLabourers];
      updated[existingIndex].quantity = data.quantity;
      setSelectedLabourers(updated);
    } else {
      // Add new
      setSelectedLabourers([
        ...selectedLabourers,
        { labourerId: data.labourerId, quantity: data.quantity },
      ]);
    }

    // Reset labourer form
    labourerForm.reset({ labourerId: "", quantity: 1 });
  };

  const handleRemoveLabourer = (labourerId: string) => {
    setSelectedLabourers(selectedLabourers.filter((sl) => sl.labourerId !== labourerId));
  };

  const handleUpdateLabourerQuantity = (labourerId: string, quantity: number) => {
    setSelectedLabourers(
      selectedLabourers.map((sl) =>
        sl.labourerId === labourerId ? { ...sl, quantity } : sl
      )
    );
  };

  const handleCrewFormSubmit = (data: CrewFormData) => {
    if (selectedLabourers.length === 0) {
      return;
    }

    // Build crew labourers from selections
    const crewLabourers: CrewLabourer[] = selectedLabourers.map((sl) => {
      const labourer = availableLabourers.find((l) => l.id === sl.labourerId);
      if (!labourer) throw new Error("Labourer not found");

      return {
        labourerId: labourer.id,
        labourerType: labourer.type,
        quantity: sl.quantity,
        baseRate: labourer.baseRate,
        fringeRate: labourer.fringeRate,
        totalRate: labourer.totalRate,
      };
    });

    const crewData = {
      name: data.name,
      labourers: crewLabourers,
    };

    if (crewDialog.dialog.mode === "edit" && crewDialog.dialog.data) {
      onUpdateCrew(crewDialog.dialog.data.id, crewData);
    } else {
      onAddCrew(crewData);
    }

    handleCloseDialog();
  };

  // Calculate total cost for selected labourers
  const calculateTotalCost = (labourers: LabourerSelection[]) => {
    return labourers.reduce((sum, sl) => {
      const labourer = availableLabourers.find((l) => l.id === sl.labourerId);
      if (!labourer) return sum;
      return sum + labourer.totalRate * sl.quantity;
    }, 0);
  };

  const totalCostPerHour = calculateTotalCost(selectedLabourers);
  const totalCostPerDay = totalCostPerHour * 8; // 8 hour work day
  const totalCostForDuration = totalCostPerDay * duration;

  // Get available labourers for dropdown (exclude already selected)
  const availableForSelection = availableLabourers.filter(
    (l) => !selectedLabourers.some((sl) => sl.labourerId === l.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Crew Composition</h3>
          <p className="text-sm text-muted-foreground">
            Build crews by assigning labourers and their quantities
          </p>
        </div>
        <Button onClick={() => crewDialog.openCreateDialog()} type="button">
          <Plus className="h-4 w-4 mr-2" />
          Add Crew
        </Button>
      </div>

      {crews.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No crews configured yet</p>
              <Button variant="outline" size="sm" onClick={() => crewDialog.openCreateDialog()} type="button">
                <Plus className="h-4 w-4 mr-2" />
                Add First Crew
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {crews.map((crew) => (
            <Card key={crew.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">{crew.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      ${crew.totalCostPerHour.toFixed(2)}/hr
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => crewDialog.openEditDialog(crew)}
                      type="button"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteCrew(crew.id)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Labourer Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Rate ($/hr)</TableHead>
                      <TableHead className="text-right">Subtotal ($/hr)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crew.labourers.map((labourer, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{labourer.labourerType}</TableCell>
                        <TableCell className="text-right">{labourer.quantity}</TableCell>
                        <TableCell className="text-right">${labourer.totalRate.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          ${(labourer.totalRate * labourer.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold bg-muted/50">
                      <TableCell colSpan={3} className="text-right">Total Cost</TableCell>
                      <TableCell className="text-right">
                        ${crew.totalCostPerHour.toFixed(2)}/hr
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-muted-foreground text-xs">Per Day (8hrs)</p>
                    <p className="font-semibold">${(crew.totalCostPerHour * 8).toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-muted-foreground text-xs">Total ({duration} days)</p>
                    <p className="font-semibold">
                      ${(crew.totalCostPerHour * 8 * duration).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={crewDialog.dialog.open} onOpenChange={(open) => {
        if (!open) handleCloseDialog();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {crewDialog.dialog.mode === "edit" ? "Edit Crew" : "Add New Crew"}
            </DialogTitle>
            <DialogDescription>
              Create a crew by giving it a name and adding labourers with their quantities
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => {
              e.preventDefault();
  e.stopPropagation();
              crewForm.handleSubmit(handleCrewFormSubmit)();
          }} className="space-y-6">
            {/* Crew Name */}
            <FormFieldWrapper
              name="name"
              control={crewForm.control}
              label="Crew Name"
              placeholder="e.g., Installation Crew A, Electrical Team 1"
            />

            <Separator />

            {/* Add Labourers Section */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Add Labourers to Crew</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Select labourer types and specify how many of each you need
                </p>
              </div>

              {availableLabourers.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No labourers available. Please add labourer types first.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {/* Labourer Selection Form */}
                  <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-end">
                    <FormSelectField
                      name="labourerId"
                      control={labourerForm.control}
                      label="Labourer Type"
                      placeholder="Select labourer..."
                      options={availableForSelection.map((labourer) => ({
                        value: labourer.id,
                        label: `${labourer.type} - $${labourer.totalRate.toFixed(2)}/hr`,
                      }))}
                    />

                    <FormFieldWrapper
                      name="quantity"
                      control={labourerForm.control}
                      label="Quantity"
                      type="number"
                      min={1}
                      inputClassName="w-24"
                    />

                    <Button
                      type="button"
                      onClick={labourerForm.handleSubmit(handleAddLabourerSubmit)}
                      className="h-10"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {/* Selected Labourers List */}
                  {selectedLabourers.length > 0 && (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Labourer Type</TableHead>
                            <TableHead className="text-right w-32">Quantity</TableHead>
                            <TableHead className="text-right">Rate ($/hr)</TableHead>
                            <TableHead className="text-right">Subtotal ($/hr)</TableHead>
                            <TableHead className="text-center w-16">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedLabourers.map((sl) => {
                            const labourer = availableLabourers.find((l) => l.id === sl.labourerId);
                            if (!labourer) return null;

                            return (
                              <TableRow key={sl.labourerId}>
                                <TableCell className="font-medium">{labourer.type}</TableCell>
                                <TableCell className="text-right">
                                  <input
                                    type="number"
                                    min={1}
                                    value={sl.quantity}
                                    onChange={(e) =>
                                      handleUpdateLabourerQuantity(
                                        sl.labourerId,
                                        parseInt(e.target.value) || 1
                                      )
                                    }
                                    className="w-20 h-8 text-right rounded-md border border-input bg-background px-2 text-sm"
                                  />
                                </TableCell>
                                <TableCell className="text-right">
                                  ${labourer.totalRate.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  ${(labourer.totalRate * sl.quantity).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveLabourer(sl.labourerId)}
                                  >
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {selectedLabourers.length === 0 && (
                    <div className="border rounded-lg border-dashed py-8 text-center">
                      <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No labourers added to crew yet
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cost Summary */}
            {selectedLabourers.length > 0 && (
              <>
                <Separator />
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Cost Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Cost per Hour:</span>
                      <span className="font-semibold">${totalCostPerHour.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Cost per Day (8hrs):</span>
                      <span className="font-semibold">${totalCostPerDay.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                      <span>Total for {duration} days:</span>
                      <span>${totalCostForDuration.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={selectedLabourers.length === 0} onClick={(e) => {
    e.stopPropagation();
  }}>
                {crewDialog.dialog.mode === "edit" ? "Update Crew" : "Add Crew"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
