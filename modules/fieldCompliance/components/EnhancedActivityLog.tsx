"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { SearchableSelect } from "@/components/global/SearchableSelect";
import { useProjectStore } from "@/store/projectStore";
import { useDialog } from "@/hooks/useDialog";
import {
  useActivityProductionLogs,
  useProductionLogId,
  useCreateActivityProductionLog,
  useUpdateActivityProductionLog,
  useDeleteActivityProductionLog,
  useGetActivityCrew,
} from "@/hooks/ReactQuery/useProductionLog";
import { useGetActivity } from "@/hooks/ReactQuery/useSchedule";
import { ActivityProductionLog } from "@/lib/types/dailyProductionLog";
import DeleteDialog from "@/components/global/DeleteDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const activityLogSchema = z.object({
  activityId: z.string().optional(),
  activityName: z.string().min(1, "Activity name is required"),
  forecastedUnits: z.number().min(0, "Forecasted units must be positive"),
  actualUnits: z.number().min(0, "Actual units must be positive"),
  crewActuals: z.record(z.string(), z.number().min(0)).optional(),
  notes: z.string().optional(),
});

type ActivityLogFormData = z.infer<typeof activityLogSchema>;

export const EnhancedActivityLog = () => {
  const { selectedProject } = useProjectStore();
  const { data: productionLogData } = useProductionLogId(
    selectedProject?.id || "",
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const productionLogId = productionLogData?.data.id || "";

  // Fetch existing activity logs
  const { data: activitiesData } = useActivityProductionLogs({
    projectId: selectedProject?.id,
    productionLogId,
  });
  const logs = activitiesData?.data.result || [];

  // Fetch available activities from schedule
  const { data: activitiesResponse } = useGetActivity({ projectId: selectedProject?.id || "" });
  const availableActivities = activitiesResponse?.data.result || [];

  // Mutations
  const { mutate: createActivityLog } = useCreateActivityProductionLog();
  const { mutate: updateActivityLog } = useUpdateActivityProductionLog();
  const { mutate: deleteActivityLog } = useDeleteActivityProductionLog();

  // Dialog management
  const { dialog, openCreateDialog, openEditDialog, closeDialog } =
    useDialog<ActivityProductionLog>();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });

  // Form state
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [activitySearchQuery, setActivitySearchQuery] = useState("");
  const [isCustomActivity, setIsCustomActivity] = useState(false);
  const [crewActuals, setCrewActuals] = useState<{ [crewId: string]: number }>(
    {}
  );

  // Fetch activity crew data when activity is selected
  const { data: activityCrewData } = useGetActivityCrew(selectedActivityId);

  const form = useForm<ActivityLogFormData>({
    resolver: zodResolver(activityLogSchema),
    defaultValues: {
      activityId: "",
      activityName: "",
      forecastedUnits: 0,
      actualUnits: 0,
      crewActuals: {},
      notes: "",
    },
  });

  const watchedActivityId = form.watch("activityId");

  // Handle activity selection
  useEffect(() => {
    if (watchedActivityId && watchedActivityId !== selectedActivityId) {
      setSelectedActivityId(watchedActivityId);
      setIsCustomActivity(false);
      setCrewActuals({});

      const selectedActivity = availableActivities.find(
        (a) => a.id === watchedActivityId
      );
      if (selectedActivity) {
        form.setValue("activityName", selectedActivity.name);
      }
    }
  }, [watchedActivityId, selectedActivityId, availableActivities]);

  // Initialize crew actuals when activity crew data is loaded
  useEffect(() => {
    if (activityCrewData?.crews && !isCustomActivity && selectedActivityId) {
      // Only initialize to 0 if we're creating a new log, not editing
      if (dialog.mode !== "edit") {
        const initActuals: { [key: string]: number } = {};
        activityCrewData.crews.forEach((crew) => {
          initActuals[crew.id] = 0;
        });
        setCrewActuals(initActuals);
        form.setValue("crewActuals", initActuals);
      }
      form.setValue("forecastedUnits", parseFloat(activityCrewData.unitsPerDay || "0"));
    }
  }, [activityCrewData, isCustomActivity, selectedActivityId, dialog.mode]);

  // Handle opening dialog for create
  const handleOpenCreateDialog = () => {
    form.reset({
      activityId: "",
      activityName: "",
      forecastedUnits: 0,
      actualUnits: 0,
      crewActuals: {},
      notes: "",
    });
    setSelectedActivityId("");
    setActivitySearchQuery("");
    setIsCustomActivity(false);
    setCrewActuals({});
    openCreateDialog();
  };

  // Handle opening dialog for edit
  const handleOpenEditDialog = (log: ActivityProductionLog) => {
    const actuals: { [key: string]: number } = {};
    log.crewAllocations.forEach((allocation) => {
      actuals[allocation.crewId] = allocation.actualUnits;
    });

    const totalActual = log.crewAllocations.reduce(
      (sum, allocation) => sum + allocation.actualUnits,
      0
    );

    const isCustom = !log.activityId || log.activityId === "";

    // Set state first before opening dialog
    setIsCustomActivity(isCustom);
    setSelectedActivityId(log.activityId || "");
    setCrewActuals(actuals);
    setActivitySearchQuery(log.activity?.name || log.name || "");

    // Then reset form with all values
    form.reset({
      activityId: log.activityId || "",
      activityName: log.activity?.name || log.name || "",
      forecastedUnits: log.forecastedUnits,
      actualUnits: totalActual,
      crewActuals: actuals,
      notes: log.notes || "",
    });

    // Open dialog last
    openEditDialog(log);
  };

  // Handle custom activity name input
  const handleCustomActivityInput = (customName: string) => {
    setIsCustomActivity(true);
    setSelectedActivityId("");
    form.setValue("activityId", "");
    form.setValue("activityName", customName);
    form.setValue("forecastedUnits", 0);
    form.setValue("actualUnits", 0);
    setCrewActuals({});
  };

  // Handle form submission
  const onFormSubmit = (data: ActivityLogFormData) => {
    if (!productionLogId) return;

    let crews: { crewId: string; actualUnits: number }[] = [];
    let forecastedUnits = 0;
    let activityId = "";

    // For scheduled activities with crews
    if (!isCustomActivity && data.crewActuals) {
      crews = Object.entries(data.crewActuals).map(([crewId, actualUnits]) => ({
        crewId,
        actualUnits,
      }));
      forecastedUnits = data.forecastedUnits; // Use forecasted from API
      activityId = data.activityId || ""; // Send activityId for scheduled activities
    } else if (isCustomActivity) {
      // For custom activities, no forecast (will show "-" in table)
      forecastedUnits = 0;
      activityId = ""; // Empty activityId for custom activities
    }

    const payload = {
      productionLogId,
      activityId,
      name: data.activityName,
      forecastedUnits,
      crews,
      notes: data.notes || "",
    };

    if (dialog.mode === "edit" && dialog.data) {
      updateActivityLog(
        { id: dialog.data.id, data: payload },
        {
          onSuccess: () => {
            closeDialog();
            form.reset();
            setSelectedActivityId("");
            setIsCustomActivity(false);
            setCrewActuals({});
          },
        }
      );
    } else {
      createActivityLog(payload, {
        onSuccess: () => {
          closeDialog();
          form.reset();
          setSelectedActivityId("");
          setIsCustomActivity(false);
          setCrewActuals({});
        },
      });
    }
  };

  // Handle delete
  const handleDeleteConfirm = () => {
    if (deleteDialog.id) {
      deleteActivityLog(deleteDialog.id, {
        onSuccess: () => {
          setDeleteDialog({ open: false, id: null });
        },
      });
    }
  };

  // Activity options for searchable select - filter out already logged activities
  const loggedActivityIds = logs.map(log => log.activityId).filter(Boolean);
  const activityOptions = availableActivities
    .filter((act) => !loggedActivityIds.includes(act.id))
    .map((act) => ({
      value: act.id,
      label: act.name,
    }));

  // Calculate totals for each log
  const getLogTotals = (log: ActivityProductionLog) => {
    const totalActual = log.crewAllocations.reduce(
      (sum, allocation) => sum + allocation.actualUnits,
      0
    );
    const totalForecasted = log.forecastedUnits;
    const variance = totalActual - totalForecasted;
    const variancePercentage =
      totalForecasted > 0 ? (variance / totalForecasted) * 100 : 0;
    const isCustomActivity = !log.activityId || log.forecastedUnits === 0;

    return { totalActual, totalForecasted, variance, variancePercentage, isCustomActivity };
  };

  return (
    <>
      <Card className="border rounded-lg">
        <CardHeader className="py-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Activity Production</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track activity completion and crew performance
              </p>
            </div>
            <Button onClick={handleOpenCreateDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No activities logged yet. Click "Add Activity" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Activity</TableHead>
                  <TableHead className="text-xs text-right">
                    Forecasted
                  </TableHead>
                  <TableHead className="text-xs text-right">Actual</TableHead>
                  <TableHead className="text-xs text-right">Variance</TableHead>
                  <TableHead className="text-xs">Notes</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const totals = getLogTotals(log);
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm font-medium">
                        {log.activity?.name || log.name || "Custom Activity"}
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        {totals.isCustomActivity ? "-" : totals.totalForecasted.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        {totals.totalActual.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        {totals.isCustomActivity ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          <span
                            className={
                              totals.variance >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {totals.variance >= 0 ? "+" : ""}
                            {totals.variance.toFixed(1)} (
                            {totals.variancePercentage.toFixed(1)}%)
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {log.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDialog(log)}
                            className="h-8"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setDeleteDialog({ open: true, id: log.id })
                            }
                            className="h-8"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Activity Log Dialog */}
      <Dialog open={dialog.open} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {dialog.mode === "edit" ? "Edit Activity" : "Add Activity"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4"
          >
            {/* Activity Selection with Custom Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Activity</Label>
              <SearchableSelect
                options={activityOptions}
                value={isCustomActivity ? activitySearchQuery : selectedActivityId}
                placeholder="Select or type custom activity..."
                searchPlaceholder="Search activities..."
                onChange={(value) => {
                  const isExistingActivity = availableActivities.some(
                    (a) => a.id === value
                  );
                  if (isExistingActivity) {
                    const selectedActivity = availableActivities.find(
                      (a) => a.id === value
                    );
                    form.setValue("activityId", value);
                    form.setValue("activityName", selectedActivity?.name || "");
                    setSelectedActivityId(value);
                    setActivitySearchQuery(selectedActivity?.name || "");
                    setIsCustomActivity(false);
                  } else {
                    handleCustomActivityInput(value);
                    setActivitySearchQuery(value);
                  }
                }}
                onSearchChange={setActivitySearchQuery}
                searchQuery={activitySearchQuery}
                allowCustomInput={true}
                customInputLabel="Use custom activity:"
                hasError={!!form.formState.errors.activityName}
              />
              {form.formState.errors.activityName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.activityName.message}
                </p>
              )}
            </div>

            {/* Custom Activity: Simple Units Covered */}
            {isCustomActivity && (
              <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-medium">
                  Custom Activity
                </p>
                <FormFieldWrapper
                  control={form.control}
                  name="actualUnits"
                  label="Units Covered Today"
                  type="number"
                  placeholder="0"
                  min="0"
                />
              </div>
            )}

            {/* Scheduled Activity: Show Forecasted Units and Crew Breakdown */}
            {!isCustomActivity && activityCrewData?.crews && activityCrewData.crews.length > 0 && (
              <>
                <div className="p-3 bg-primary/5 rounded-lg border">
                  <p className="text-sm font-medium">
                    Forecasted Units/Day:{" "}
                    <span className="text-primary">
                      {parseFloat(activityCrewData.unitsPerDay || "0").toFixed(1)}
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Actual Units Per Crew
                  </Label>
                  {activityCrewData.crews.map((crew) => (
                    <div key={crew.id} className="flex items-center gap-3">
                      <label className="text-sm flex-1">{crew.name}</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={crewActuals[crew.id] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const newActuals = {
                            ...crewActuals,
                            [crew.id]: value === "" ? 0 : parseFloat(value) || 0,
                          };
                          setCrewActuals(newActuals);
                          form.setValue("crewActuals", newActuals);
                        }}
                        className="w-24 h-10"
                        placeholder="0"
                      />
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">
                      Total Actual:{" "}
                      <span className="text-primary">
                        {Object.values(crewActuals)
                          .reduce((sum, val) => sum + val, 0)
                          .toFixed(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            <FormFieldWrapper
              control={form.control}
              name="notes"
              label="Notes (Optional)"
              type="textarea"
              placeholder="Add any relevant notes..."
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                size="sm"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {dialog.mode === "edit" ? "Update" : "Add"} Activity
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Activity Log"
        description="Are you sure you want to delete this activity log? This action cannot be undone."
      />
    </>
  );
};

