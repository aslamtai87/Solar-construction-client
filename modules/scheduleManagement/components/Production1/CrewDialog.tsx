import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { FormSelectField } from "@/components/global/Form/FormSelectField";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { useGetLabourers } from "@/hooks/ReactQuery/useSchedule";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { useState } from "react";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateCrew } from "@/hooks/ReactQuery/useSchedule";

export const CrewDialog = ({
  open,
  onClose,
  duration,
}: {
  open: boolean;
  onClose: () => void;
  duration: number;
}) => {
  const { selectedProject } = useProjectStore();
  const {
    data: availableLabourers,
    isLoading,
    isError,
  } = useGetLabourers({
    limit: 100,
    projectId: selectedProject?.id || "",
  });

  const crewSchema = z.object({
    name: z.string().min(1, "Crew name is required"),
  });

  const labourerSelectionSchema = z.object({
    labourerId: z.string().min(1, "Please select a labourer"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
  });

  type CrewFormData = z.infer<typeof crewSchema>;
  type LabourerSelectionFormData = z.infer<typeof labourerSelectionSchema>;

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
  interface LabourerSelection {
    labourerId: string;
    quantity: number;
  }

  const [selectedLabourers, setSelectedLabourers] = useState<
    LabourerSelection[]
  >([]);
  const { mutate: createCrew } = useCreateCrew();

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

  const calculateTotalCost = (labourers: LabourerSelection[]) => {
    return labourers.reduce((sum, sl) => {
      const labourer = (availableLabourers?.data.result ?? []).find(
        (l) => l.id === sl.labourerId
      );
      if (!labourer) return sum;
      return sum + Number(labourer.totalRate) * sl.quantity;
    }, 0);
  };

  const handleUpdateLabourerQuantity = (
    labourerId: string,
    quantity: number
  ) => {
    setSelectedLabourers(
      selectedLabourers.map((sl) =>
        sl.labourerId === labourerId ? { ...sl, quantity } : sl
      )
    );
  };

  const handleRemoveLabourer = (labourerId: string) => {
    setSelectedLabourers(
      selectedLabourers.filter((sl) => sl.labourerId !== labourerId)
    );
  };

  const totalCostPerHour = calculateTotalCost(selectedLabourers);
  const totalCostPerDay = totalCostPerHour * 8;
  const totalCostForDuration = totalCostPerDay * duration;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Crew</DialogTitle>
          <DialogDescription>
            Create a crew by giving it a name and adding labourers with their
            quantities
          </DialogDescription>
        </DialogHeader>
        {availableLabourers?.data.result.length === 0 ? (
          <Alert>
            <AlertDescription>
              No labourers available. Please add labourer types first.
            </AlertDescription>
          </Alert>
        ) : (
          <form
            onSubmit={crewForm.handleSubmit((data) => {
              createCrew({
                ...data,
                projectId: selectedProject?.id || "",
                labourers: selectedLabourers,
              });
              onClose();
              crewForm.reset();
              labourerForm.reset();
              setSelectedLabourers([]);
            })}
            className="space-y-6"
          >
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
                <h4 className="text-sm font-semibold mb-2">
                  Add Labourers to Crew
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Select labourer types and specify how many of each you need
                </p>
              </div>

              {availableLabourers?.data.result.length === 0 ? (
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
                      options={(availableLabourers?.data.result ?? []).map(
                        (labourer) => ({
                          value: labourer.id,
                          label: `${labourer.name} - $${Number(
                            labourer.totalRate
                          ).toFixed(2)}/hr`,
                        })
                      )}
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
                      onClick={labourerForm.handleSubmit(
                        handleAddLabourerSubmit
                      )}
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
                            <TableHead className="text-right w-32">
                              Quantity
                            </TableHead>
                            <TableHead className="text-right">
                              Rate ($/hr)
                            </TableHead>
                            <TableHead className="text-right">
                              Subtotal ($/hr)
                            </TableHead>
                            <TableHead className="text-center w-24">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedLabourers.map((sl) => {
                            const labourer = (
                              availableLabourers?.data.result ?? []
                            ).find((l) => l.id === sl.labourerId);
                            if (!labourer) return null;

                            return (
                              <TableRow key={sl.labourerId}>
                                <TableCell className="font-medium">
                                  {labourer.name}
                                </TableCell>
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
                                  ${Number(labourer.totalRate).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  $
                                  {(
                                    Number(labourer.totalRate) * sl.quantity
                                  ).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveLabourer(sl.labourerId)
                                    }
                                    className="h-8 w-8"
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
                      <span className="text-muted-foreground">
                        Total Cost per Hour:
                      </span>
                      <span className="font-semibold">
                        ${totalCostPerHour.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Cost per Day (8hrs):
                      </span>
                      <span className="font-semibold">
                        ${totalCostPerDay.toFixed(2)}
                      </span>
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
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={selectedLabourers.length === 0}>
                Add Crew
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
