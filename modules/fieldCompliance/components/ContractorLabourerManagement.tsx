"use client";

import React, { useState } from "react";
import { Clock, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TimeLogEditableRow, TimeLogData } from "./TimeLogEditableRow";
import { format } from "date-fns";
import { useLabourerTimeLogs } from "@/hooks/ReactQuery/useProductionLog";
import { useProductionLogId, useCreateLabourerLog, useUpdateLabourerLog, useDeleteLabourerLog } from "@/hooks/ReactQuery/useProductionLog";
import { useProjectStore } from "@/store/projectStore";
import { useGetStaffs } from "@/hooks/ReactQuery/useStaffs";
import { CreateLabourerTimeLogDTO } from "@/lib/types/dailyProductionLog";

export const ContractorLabourerManagement = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
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
  
  // Map staff users to labourer options for the dropdown, excluding already logged workers
  const labourerOptions = staffUsers
    .filter(staff => !loggedWorkerIds.includes(staff.id))
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
    // If already in display format (e.g., "3:30 PM"), return empty to avoid conversion issues
    if (isoString.includes("AM") || isoString.includes("PM")) return "";
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


  const handleSave = (data: any) => {
    if (isCreating) {
      // Format times to ISO 8601 for creation
      // Map labourerId (from UI) to workerId (for API)
      const formattedData: CreateLabourerTimeLogDTO = {
        workerId: data.labourerId,
        entryTime: timeToISO(data.entryTime),
        exitTime: data.exitTime ? timeToISO(data.exitTime) : undefined,
      };
      
      onAddLog(formattedData);
      setIsCreating(false);
    } else if (editingId) {
      // Format times to ISO 8601 for update
      const formattedData = {
        entryTime: data.entryTime ? timeToISO(data.entryTime) : undefined,
        exitTime: data.exitTime ? timeToISO(data.exitTime) : undefined,
      };
      
      onUpdateLog({ id: editingId, data: formattedData });
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setEditingLog(null);
  };

  const handleEdit = (id: string, log: any) => {
    setEditingId(id);
    setEditingLog(log);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    onDeleteLog(id);
  };

  const handleAddNew = () => {
    setIsCreating(true);
    setEditingId(null);
  };

  return (
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
            <Button
              onClick={handleAddNew}
              size="sm"
              disabled={isCreating || editingId !== null}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Log
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 && !isCreating ? (
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
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const isEditing = editingId === log.id;
                const timeLogData: TimeLogData = {
                  id: log.id,
                  labourerId: log.workerId,
                  labourerName: log.worker.fullName, // Worker's full name
                  labourerType: log.worker.labourerProfile?.name || "N/A", // Labourer profile name
                  entryTime: isEditing && editingLog ? isoToTime(editingLog.entryTime) : (isEditing ? isoToTime(log.entryTime) : formatTimeDisplay(log.entryTime)),
                  exitTime: isEditing && editingLog ? isoToTime(editingLog.exitTime) : (isEditing ? isoToTime(log.exitTime) : formatTimeDisplay(log.exitTime)),
                };
                
                return (
                  <TimeLogEditableRow
                    key={log.id}
                    timeLog={timeLogData}
                    labourers={labourerOptions}
                    mode={isEditing ? "edit" : "view"}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onEdit={() => handleEdit(log.id, log)}
                    onDelete={() => handleDelete(log.id)}
                    showLabourerSelect={isEditing ? false : true}
                    isLabourer={false}
                  />
                );
              })}
              {isCreating && (
                <TimeLogEditableRow
                  timeLog={{
                    labourerId: "",
                    labourerName: "",
                    entryTime: "",
                    exitTime: "",
                  }}
                  labourers={labourerOptions}
                  mode="create"
                  onSave={handleSave}
                  onCancel={handleCancel}
                  showLabourerSelect={true}
                  isLabourer={false}
                />
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

