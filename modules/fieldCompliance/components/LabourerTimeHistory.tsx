"use client";

import { useState } from "react";
import { Clock, Plus, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TimeLogDialog } from "./TimeLogDialog";
import DeleteDialog from "@/components/global/DeleteDialog";
import { 
  useLabourerTimeLogs, 
  useCreateLabourerLog, 
  useUpdateLabourerLog, 
  useDeleteLabourerLog,
  useProductionLogId
} from "@/hooks/ReactQuery/useProductionLog";
import { useGetUserProfile } from "@/hooks/ReactQuery/useAuth";
import {
  CreateLabourerTimeLogDTO,
  UpdateLabourerTimeLogDTO,
  LabourerTimeLog,
} from "@/lib/types/dailyProductionLog";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/store/projectStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const LabourerTimeHistory = () => {
  const { data: userProfile } = useGetUserProfile();
  const { selectedProject } = useProjectStore();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Get today's production log ID
  const { data: productionLogData } = useProductionLogId(
    selectedProject?.id || "",
    timeZone
  );
  const productionLogId = productionLogData?.data?.id;
  
  // Fetch labourer time logs using workerId
  const { data: labourerLogsData } = useLabourerTimeLogs({
    productionLogId: productionLogId,
    workerId: userProfile?.data?.id,
  });

  const logs: LabourerTimeLog[] = labourerLogsData?.data?.result || [];
  const currentUserId = userProfile?.data?.id || "";
  const currentUserName = userProfile?.data?.fullName || "";
  
  // Create worker option for the current user
  const currentUserWorker = [
    {
      value: currentUserId,
      label: currentUserName,
      type: "Labourer",
    },
  ];
  
  // Dialog state management
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingLog, setEditingLog] = useState<LabourerTimeLog | undefined>();
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<LabourerTimeLog | undefined>();
  
  const { mutate: createLog } = useCreateLabourerLog();
  const { mutate: updateLog } = useUpdateLabourerLog();
  const { mutate: deleteLog } = useDeleteLabourerLog();
  
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Check if today's log exists
  const todayLog = logs.find(log => {
    const logDate = format(new Date(log.createdAt), "yyyy-MM-dd");
    return logDate === today;
  });
  const hasTodayLog = !!todayLog;

  // Helper function to format ISO time to 12-hour format for display
  const formatTimeDisplay = (isoTime: string): string => {
    try {
      const date = new Date(isoTime);
      return format(date, "h:mm a"); // e.g., "3:30 PM"
    } catch {
      return isoTime;
    }
  };

  // Helper function to convert time (HH:mm) to ISO 8601 datetime string
  const timeToISO = (time: string, date: string = today): string => {
    return `${date}T${time}:00.000Z`;
  };

  // Helper function to convert ISO string to HH:mm format
  const isoToTime = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Calculate duration in hours
  const calculateDuration = (entryTime: string, exitTime: string): string => {
    try {
      const entry = new Date(entryTime);
      const exit = new Date(exitTime);
      const diffMs = exit.getTime() - entry.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch {
      return "N/A";
    }
  };

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setEditingLog(undefined);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (log: LabourerTimeLog) => {
    setDialogMode("edit");
    setEditingLog(log);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingLog(undefined);
  };

  const handleSave = (data: {
    workerId: string;
    entryTime: string;
    exitTime: string;
    activities: Array<{ activityId: string; hoursWorked: number }>;
  }) => {
    if (dialogMode === "create") {
      const formattedData: CreateLabourerTimeLogDTO = {
        workerId: currentUserId,
        entryTime: timeToISO(data.entryTime),
        exitTime: timeToISO(data.exitTime),
        labourerActivities: data.activities.map((act) => ({
          activityId: act.activityId,
          hoursWorked: act.hoursWorked,
        })),
      };
      createLog(formattedData);
    } else if (dialogMode === "edit" && editingLog) {
      const formattedData: UpdateLabourerTimeLogDTO = {
        entryTime: timeToISO(data.entryTime),
        exitTime: timeToISO(data.exitTime),
        labourerActivities: data.activities.map((act) => ({
          activityId: act.activityId,
          hoursWorked: act.hoursWorked,
        })),
      };
      updateLog({ id: editingLog.id, data: formattedData });
    }
    handleCloseDialog();
  };

  const handleOpenDeleteDialog = (log: LabourerTimeLog) => {
    setLogToDelete(log);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (logToDelete) {
      deleteLog(logToDelete.id);
      setDeleteDialogOpen(false);
      setLogToDelete(undefined);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">My Time Logs</CardTitle>
              <CardDescription className="text-sm">
                View and manage your work hours
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {logs.length} {logs.length === 1 ? "entry" : "entries"}
              </Badge>
            )}
            {hasTodayLog && (
              <span className="text-xs text-muted-foreground">
                Today's log recorded
              </span>
            )}
            <Button
              onClick={handleOpenCreateDialog}
              size="sm"
              disabled={hasTodayLog}
              title={
                hasTodayLog ? "Today's log already exists" : "Log time for today"
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Log Time
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">
            No time logs yet. Click "Log Time" to record your work hours.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const activityCount = log.labourerActivities?.length || 0;
                
                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {format(new Date(log.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatTimeDisplay(log.entryTime)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatTimeDisplay(log.exitTime)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {calculateDuration(log.entryTime, log.exitTime)}
                    </TableCell>
                    <TableCell>
                      {activityCount > 0 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="secondary" className="text-xs">
                                {activityCount} {activityCount === 1 ? "activity" : "activities"}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs space-y-1">
                                {log.labourerActivities?.map((act, idx) => (
                                  <div key={idx}>
                                    {act.activity?.name}: {act.hoursWorked}h
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-xs text-muted-foreground">No activities</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditDialog(log)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(log)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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
      
      {/* Time Log Dialog */}
      <TimeLogDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        mode={dialogMode}
        workers={currentUserWorker}
        initialData={
          editingLog
            ? {
                workerId: editingLog.workerId,
                entryTime: isoToTime(editingLog.entryTime),
                exitTime: isoToTime(editingLog.exitTime),
                activities:
                  editingLog.labourerActivities?.map((act) => ({
                    activityId: act.activityId,
                    hoursWorked: act.hoursWorked,
                  })) || [],
              }
            : {
                workerId: currentUserId,
                entryTime: "",
                exitTime: "",
                activities: [],
              }
        }
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Time Log"
        description={
          logToDelete
            ? `Are you sure you want to delete the time log for ${format(
                new Date(logToDelete.createdAt),
                "MMM dd, yyyy"
              )}? This action cannot be undone.`
            : ""
        }
      />
    </Card>
  );
};
