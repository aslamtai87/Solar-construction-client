"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, TrendingUp, TrendingDown, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const activityLogSchema = z.object({
  activityId: z.string().min(1, "Activity is required"),
  crewActuals: z.record(z.string(), z.number().min(0)),
  notes: z.string().optional(),
});

type ActivityLogFormData = z.infer<typeof activityLogSchema>;

interface ActivityData {
  id: string;
  name: string;
  targetUnits: number;
}

interface ActivityLogEntry {
  id: string;
  activityId: string;
  activityName: string;
  crews: {
    crewId: string;
    crewName: string;
    forecastedUnits: number;
    actualUnits: number;
  }[];
  totalForecasted: number;
  totalActual: number;
  variance: number;
  variancePercentage: number;
  notes?: string;
}

interface EnhancedActivityLogProps {
  activities: ActivityData[];
  productionConfigs: any[];
  existingLogs: ActivityLogEntry[];
  onAddLog: (log: Omit<ActivityLogEntry, 'id' | 'activityName' | 'totalForecasted' | 'totalActual' | 'variance' | 'variancePercentage'>) => void;
  onUpdateLog: (id: string, log: Partial<ActivityLogEntry>) => void;
  onDeleteLog: (id: string) => void;
}

export const EnhancedActivityLog: React.FC<EnhancedActivityLogProps> = ({
  activities,
  productionConfigs,
  existingLogs,
  onAddLog,
  onUpdateLog,
  onDeleteLog,
}) => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>(existingLogs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<ActivityLogEntry | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [selectedCrews, setSelectedCrews] = useState<{ id: string; name: string; forecastedUnits: number }[]>([]);
  const [forecastedUnits, setForecastedUnits] = useState(0);
  const [crewActuals, setCrewActuals] = useState<{ [crewId: string]: number }>({});

  const form = useForm<z.infer<typeof activityLogSchema>>({
    resolver: zodResolver(activityLogSchema),
    defaultValues: {
      activityId: "",
      crewActuals: {},
      notes: "",
    },
  });

  const watchedActivityId = form.watch("activityId");

  useEffect(() => {
    if (watchedActivityId && watchedActivityId !== selectedActivityId) {
      handleActivitySelect(watchedActivityId);
    }
  }, [watchedActivityId]);

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivityId(activityId);
    const selectedActivity = activities.find((a) => a.id === activityId);
    const config = productionConfigs.find((c) => c.activityId === activityId);
    
    if (selectedActivity) {
      setForecastedUnits(selectedActivity.targetUnits);
    }
    
    if (config?.crews) {
      const crews = config.crews.map((crew: any) => ({
        id: crew.id,
        name: crew.name,
        forecastedUnits: crew.forecastedUnits || 0,
      }));
      setSelectedCrews(crews);
      
      // Initialize actual units to 0
      const initActuals: { [key: string]: number } = {};
      crews.forEach((crew: any) => {
        initActuals[crew.id] = 0;
      });
      setCrewActuals(initActuals);
      form.setValue("crewActuals", initActuals);
    }
  };

  const handleOpenDialog = (log?: ActivityLogEntry) => {
    if (log) {
      setEditingLog(log);
      setSelectedActivityId(log.activityId);
      
      const selectedActivity = activities.find((a) => a.id === log.activityId);
      if (selectedActivity) {
        setForecastedUnits(selectedActivity.targetUnits);
      }
      
      setSelectedCrews(log.crews.map((c) => ({ 
        id: c.crewId, 
        name: c.crewName,
        forecastedUnits: c.forecastedUnits 
      })));
      
      const actuals: { [key: string]: number } = {};
      log.crews.forEach((c) => {
        actuals[c.crewId] = c.actualUnits;
      });
      setCrewActuals(actuals);
      
      form.reset({
        activityId: log.activityId,
        crewActuals: actuals,
        notes: log.notes || "",
      });
    } else {
      setEditingLog(null);
      setSelectedActivityId("");
      setSelectedCrews([]);
      setForecastedUnits(0);
      setCrewActuals({});
      form.reset({
        activityId: "",
        crewActuals: {},
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const onFormSubmit = (data: z.infer<typeof activityLogSchema>) => {
    const selectedActivity = activities.find((a) => a.id === data.activityId);
    if (!selectedActivity) return;

    const crewsData = selectedCrews.map((crew) => ({
      crewId: crew.id,
      crewName: crew.name,
      forecastedUnits: crew.forecastedUnits,
      actualUnits: data.crewActuals[crew.id] || 0,
    }));

    const totalActual = crewsData.reduce((sum, c) => sum + c.actualUnits, 0);
    const variance = totalActual - selectedActivity.targetUnits;
    const variancePercentage = selectedActivity.targetUnits > 0 ? (variance / selectedActivity.targetUnits) * 100 : 0;

    if (editingLog) {
      const updatedLog = {
        ...editingLog,
        activityId: data.activityId,
        activityName: selectedActivity.name,
        notes: data.notes,
        crews: crewsData,
        totalForecasted: selectedActivity.targetUnits,
        totalActual,
        variance,
        variancePercentage,
      };
      setLogs(logs.map((l) => (l.id === editingLog.id ? updatedLog : l)));
      onUpdateLog(editingLog.id, updatedLog);
    } else {
      const newLog: ActivityLogEntry = {
        id: Date.now().toString(),
        activityId: data.activityId,
        activityName: selectedActivity.name,
        notes: data.notes,
        crews: crewsData,
        totalForecasted: selectedActivity.targetUnits,
        totalActual,
        variance,
        variancePercentage,
      };
      setLogs([...logs, newLog]);
      onAddLog({
        activityId: newLog.activityId,
        crews: newLog.crews,
        notes: newLog.notes,
      });
    }

    setIsDialogOpen(false);
    setSelectedActivityId("");
    setSelectedCrews([]);
    setForecastedUnits(0);
    setCrewActuals({});
    form.reset();
  };

  const handleDelete = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
    onDeleteLog(id);
  };

  const activityOptions = activities.map((act) => ({
    value: act.id,
    label: act.name,
  }));

  return (
    <Card className="border rounded-lg">
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Activity Production</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track activity completion and crew performance
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} size="sm">
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
                <TableHead className="text-xs text-right">Forecasted</TableHead>
                <TableHead className="text-xs text-right">Actual</TableHead>
                <TableHead className="text-xs text-right">Variance</TableHead>
                <TableHead className="text-xs">Notes</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm font-medium">
                    {log.activityName}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    {log.totalForecasted.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    {log.totalActual.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    <span
                      className={
                        log.variance >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {log.variance >= 0 ? "+" : ""}
                      {log.variance.toFixed(1)} ({log.variancePercentage.toFixed(1)}%)
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {log.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(log)}
                        className="h-8"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(log.id)}
                        className="h-8"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {editingLog ? "Edit Activity" : "Add Activity"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            <FormSelectField
              control={form.control}
              name="activityId"
              label="Select Activity"
              options={activityOptions}
              placeholder="Choose an activity"
            />

            {selectedActivityId && (
              <div className="p-3 bg-primary/5 rounded-lg border">
                <p className="text-sm font-medium">
                  Forecasted Units: <span className="text-primary">{forecastedUnits}</span>
                </p>
              </div>
            )}

            {selectedCrews.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Actual Units Per Crew</label>
                {selectedCrews.map((crew) => (
                  <div key={crew.id} className="flex items-center gap-3">
                    <label className="text-sm flex-1">{crew.name}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={crewActuals[crew.id] || 0}
                      onChange={(e) => {
                        const newActuals = {
                          ...crewActuals,
                          [crew.id]: parseFloat(e.target.value) || 0,
                        };
                        setCrewActuals(newActuals);
                        form.setValue("crewActuals", newActuals);
                      }}
                      className="w-24 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="0"
                    />
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">
                    Total Actual: <span className="text-primary">
                      {Object.values(crewActuals).reduce((sum, val) => sum + val, 0).toFixed(1)}
                    </span>
                  </p>
                </div>
              </div>
            )}

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
                onClick={() => setIsDialogOpen(false)}
                size="sm"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {editingLog ? "Update" : "Add"} Activity
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

