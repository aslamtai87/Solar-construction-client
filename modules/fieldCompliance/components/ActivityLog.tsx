"use client";

import React, { useState } from "react";
import { BarChart3, Plus, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SearchableSelect } from "@/components/global/SearchableSelect";
import { ActivityProductionLog } from "@/lib/types/dailyProductionLog";
import { Activity } from "@/lib/types/schedule";
import { ProductionConfiguration } from "@/lib/types/production";
import { format } from "date-fns";

interface ActivityLogRow {
  crewId: string;
  crewName: string;
  forecastedUnits: number;
  actualUnits: number;
}

interface ActivityLogComponentProps {
  activities: Activity[];
  productionConfigs: ProductionConfiguration[];
  existingLogs: ActivityProductionLog[];
  projectId: string;
  date: string;
  onAddLog: (data: {
    activityId: string;
    actualUnitsPerCrew: { [crewId: string]: number };
    notes?: string;
  }) => Promise<void>;
  onUpdateLog: (
    id: string,
    data: {
      actualUnitsPerCrew: { [crewId: string]: number };
      notes?: string;
    }
  ) => Promise<void>;
  onDeleteLog: (id: string) => Promise<void>;
}

export const ActivityLogComponent: React.FC<ActivityLogComponentProps> = ({
  activities,
  productionConfigs,
  existingLogs,
  projectId,
  date,
  onAddLog,
  onUpdateLog,
  onDeleteLog,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [activityRows, setActivityRows] = useState<ActivityLogRow[]>([]);
  const [notes, setNotes] = useState("");
  const [editingLog, setEditingLog] = useState<ActivityProductionLog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activityOptions = activities.map((activity) => ({
    value: activity.id,
    label: `${activity.name} (${activity.units || 0} units)`,
  }));

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId);
    
    // Find production config for this activity
    const config = productionConfigs.find((c) => c.activityId === activityId);
    
    if (config && config.crews.length > 0) {
      // Calculate forecasted units per crew for today
      const todayIndex = config.dailyProduction.findIndex(
        (dp) => dp.date === date
      );
      
      const rows: ActivityLogRow[] = config.crews.map((crew) => {
        const forecastedUnits = todayIndex >= 0 
          ? Math.floor(config.dailyProduction[todayIndex].targetUnits / config.crews.length)
          : 0;
        
        return {
          crewId: crew.id,
          crewName: crew.name,
          forecastedUnits,
          actualUnits: 0,
        };
      });
      
      setActivityRows(rows);
    } else {
      setActivityRows([]);
    }
  };

  const handleOpenDialog = (log?: ActivityProductionLog) => {
    if (log) {
      setEditingLog(log);
      setSelectedActivity(log.activityId);
      setNotes(log.notes || "");
      
      const rows: ActivityLogRow[] = log.crews.map((crew) => ({
        crewId: crew.crewId,
        crewName: crew.crewName,
        forecastedUnits: crew.forecastedUnits,
        actualUnits: crew.actualUnits,
      }));
      
      setActivityRows(rows);
    } else {
      setEditingLog(null);
      setSelectedActivity("");
      setActivityRows([]);
      setNotes("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLog(null);
    setSelectedActivity("");
    setActivityRows([]);
    setNotes("");
    setSearchQuery("");
  };

  const handleRowChange = (crewId: string, actualUnits: number) => {
    setActivityRows(
      activityRows.map((row) =>
        row.crewId === crewId ? { ...row, actualUnits } : row
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const actualUnitsPerCrew: { [crewId: string]: number } = {};
      activityRows.forEach((row) => {
        actualUnitsPerCrew[row.crewId] = row.actualUnits;
      });

      if (editingLog) {
        await onUpdateLog(editingLog.id, {
          actualUnitsPerCrew,
          notes: notes || undefined,
        });
      } else {
        await onAddLog({
          activityId: selectedActivity,
          actualUnitsPerCrew,
          notes: notes || undefined,
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting activity log:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this activity log?")) {
      try {
        await onDeleteLog(id);
      } catch (error) {
        console.error("Error deleting activity log:", error);
      }
    }
  };

  const getVarianceBadge = (variance: number, variancePercentage: number) => {
    if (variance === 0) {
      return <Badge className="bg-green-500">On Target</Badge>;
    } else if (variance > 0) {
      return (
        <Badge className="bg-blue-500 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          +{variancePercentage.toFixed(1)}%
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <TrendingDown className="h-3 w-3" />
          {variancePercentage.toFixed(1)}%
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Activity Production Logs
              </CardTitle>
              <CardDescription>
                Log actual production values for {format(new Date(date), "MMMM dd, yyyy")}
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Forecasted Units</TableHead>
                  <TableHead>Actual Units</TableHead>
                  <TableHead>Variance</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {existingLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No activity logs found for this date
                    </TableCell>
                  </TableRow>
                ) : (
                  existingLogs.map((log) => {
                    const progressPercentage =
                      log.forecastedUnits > 0
                        ? (log.totalActualUnits / log.forecastedUnits) * 100
                        : 0;

                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.activityName}
                        </TableCell>
                        <TableCell>{log.forecastedUnits}</TableCell>
                        <TableCell className="font-semibold">
                          {log.totalActualUnits}
                        </TableCell>
                        <TableCell>
                          {getVarianceBadge(log.variance, log.variancePercentage)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={Math.min(progressPercentage, 100)}
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">
                              {progressPercentage.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.notes || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(log)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(log.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingLog ? "Update Activity Log" : "Add Activity Log"}
            </DialogTitle>
            <DialogDescription>
              {editingLog
                ? "Update the actual production values for this activity"
                : "Select an activity and log actual production per crew"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!editingLog && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Activity *
                </label>
                <SearchableSelect
                  options={activityOptions}
                  value={selectedActivity}
                  onChange={handleActivitySelect}
                  placeholder="Select activity"
                  searchPlaceholder="Search activities..."
                  onSearchChange={setSearchQuery}
                  searchQuery={searchQuery}
                  hasError={!selectedActivity}
                />
              </div>
            )}

            {activityRows.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Production by Crew
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Crew Name</TableHead>
                        <TableHead>Forecasted Units</TableHead>
                        <TableHead>Actual Units *</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityRows.map((row) => (
                        <TableRow key={row.crewId}>
                          <TableCell className="font-medium">
                            {row.crewName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.forecastedUnits}</Badge>
                          </TableCell>
                          <TableCell>
                            <input
                              type="number"
                              min="0"
                              value={row.actualUnits}
                              onChange={(e) =>
                                handleRowChange(
                                  row.crewId,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {activityRows.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about production today..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}

            {selectedActivity && activityRows.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No production configuration found for this activity.</p>
                <p className="text-sm">
                  Please configure crews for this activity in Schedule Management.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedActivity || activityRows.length === 0}
            >
              {editingLog ? "Update" : "Add"} Activity Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
