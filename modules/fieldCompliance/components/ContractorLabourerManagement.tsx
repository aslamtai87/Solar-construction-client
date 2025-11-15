"use client";

import React, { useState } from "react";
import { Clock, Plus, Pencil, Trash2, ListTodo } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useLabourerTimeLogs } from "@/hooks/ReactQuery/useProductionLog";
import { useProductionLogId, useCreateLabourerLog, useUpdateLabourerLog, useDeleteLabourerLog } from "@/hooks/ReactQuery/useProductionLog";
import { useProjectStore } from "@/store/projectStore";
import { useGetStaffs } from "@/hooks/ReactQuery/useStaffs";
import { CreateLabourerTimeLogDTO } from "@/lib/types/dailyProductionLog";
import { TimeLogDialog } from "./TimeLogDialog";
import DeleteDialog from "@/components/global/DeleteDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ContractorLabourerManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingLog, setEditingLog] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null);
  
  const { selectedProject } = useProjectStore();
  
  const productionLogId = useProductionLogId(
    selectedProject?.id || "",
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  
  // Get all staff users for the dropdown
  const { data: staffsData } = useGetStaffs();
  const staffUsers = staffsData?.data.result || [];
  
  // Get all labourer time logs for this production log
  const { data: labourerLogsData } = useLabourerTimeLogs({
    productionLogId: productionLogId.data?.data.id || "",
  });
  const logs = labourerLogsData?.data.result || [];
  
  const { mutate: onAddLog } = useCreateLabourerLog();
  const { mutate: onUpdateLog } = useUpdateLabourerLog();
  const { mutate: onDeleteLog } = useDeleteLabourerLog();
  
  // Get IDs of workers who already have logs today
  const loggedWorkerIds = logs.map(log => log.workerId);
  
  // Map staff users to labourer options for the dropdown, excluding already logged workers (only for create mode)
  const labourerOptions = staffUsers
    .filter(staff => dialogMode === "edit" || !loggedWorkerIds.includes(staff.id))
    .map((staff) => ({
      value: staff.id,
      label: staff.fullName,
      type: staff.labourerProfile?.name || "Staff",
    }));
  
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Helper function to convert time (HH:mm) to ISO 8601 datetime string
  const timeToISO = (time: string, date: string = today): string => {
    return `${date}T${time}:00.000Z`;
  };
  
  // Helper function to convert ISO 8601 to HH:mm format for editing
  const isoToTime = (isoString: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  
  // Helper function to format time to 12-hour format with AM/PM
  const formatTimeDisplay = (isoString: string): string => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const calculateHours = (entry: string, exit: string) => {
    if (!entry || !exit) return "-";
    const entryDate = new Date(entry);
    const exitDate = new Date(exit);
    const diffMs = exitDate.getTime() - entryDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleSave = (data: any) => {
    if (dialogMode === "create") {
      const formattedData: CreateLabourerTimeLogDTO = {
        workerId: data.workerId,
        entryTime: timeToISO(data.entryTime),
        exitTime: data.exitTime ? timeToISO(data.exitTime) : undefined,
        labourerActivities: data.activities.map((act: any) => ({
          activityId: act.activityId,
          hoursWorked: act.hoursWorked,
        })),
      };
      
      onAddLog(formattedData, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingLog(null);
        },
      });
    } else if (editingLog) {
      const formattedData = {
        entryTime: timeToISO(data.entryTime),
        exitTime: timeToISO(data.exitTime),
        labourerActivities: data.activities.map((act: any) => ({
          activityId: act.activityId,
          hoursWorked: act.hoursWorked,
        })),
      };
      
      onUpdateLog(
        { id: editingLog.id, data: formattedData },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingLog(null);
          },
        }
      );
    }
  };

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setEditingLog(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (log: any) => {
    setDialogMode("edit");
    setEditingLog(log);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingLog(null);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setDeleteLogId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteLogId) {
      onDeleteLog(deleteLogId, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeleteLogId(null);
        },
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Labourer Time Logs</CardTitle>
                <CardDescription className="text-sm">
                  Manage time logs for all workers - {format(new Date(), "MMMM dd, yyyy")}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {logs.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {logs.length} {logs.length === 1 ? "worker" : "workers"}
                </Badge>
              )}
              <Button onClick={handleOpenCreateDialog} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Log
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 text-sm">
              No labourer logs found. Click "Add Log" to record worker hours.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entry Time</TableHead>
                  <TableHead>Exit Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Activities</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {log.worker.fullName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.worker.labourerProfile?.name || "N/A"}
                    </TableCell>
                    <TableCell>{formatTimeDisplay(log.entryTime)}</TableCell>
                    <TableCell>{formatTimeDisplay(log.exitTime)}</TableCell>
                    <TableCell className="font-medium">
                      {calculateHours(log.entryTime, log.exitTime)}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary" className="gap-1">
                              <ListTodo className="h-3 w-3" />
                              {log.labourerActivities?.length || 0} activities
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              {log.labourerActivities?.map((act: any, idx: number) => (
                                <div key={idx} className="text-xs">
                                  {act.activity?.name}: {act.hoursWorked}h
                                </div>
                              )) || <div className="text-xs">No activities</div>}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditDialog(log)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(log.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Time Log Dialog */}
      <TimeLogDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        mode={dialogMode}
        workers={labourerOptions}
        initialData={
          editingLog
            ? {
                workerId: editingLog.workerId,
                workerName: editingLog.worker.fullName,
                entryTime: isoToTime(editingLog.entryTime),
                exitTime: isoToTime(editingLog.exitTime),
                activities: editingLog.labourerActivities?.map((act: any) => ({
                  activityId: act.activityId,
                  hoursWorked: act.hoursWorked,
                })) || [],
              }
            : undefined
        }
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Time Log"
        description="Are you sure you want to delete this time log? This action cannot be undone."
      />
    </>
  );
};

