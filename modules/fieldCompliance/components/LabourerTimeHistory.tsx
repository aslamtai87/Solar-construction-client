"use client";

import { useState } from "react";
import { Clock, Plus } from "lucide-react";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TimeLogEditableRow, TimeLogData } from "./TimeLogEditableRow";
import { useLabourerTimeLogs, useCreateLabourerLog, useUpdateLabourerLog, useProductionLogId} from "@/hooks/ReactQuery/useProductionLog";
import { useGetUserProfile } from "@/hooks/ReactQuery/useAuth";
import {
  CreateLabourerTimeLogDTO,
  LabourerTimeLog,
} from "@/lib/types/dailyProductionLog";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/store/projectStore";

// Define TimeLogFormData type to match TimeLogEditableRow expectations
interface TimeLogFormData {
  labourerId: string;
  labourerName?: string;
  entryTime: string;
  exitTime: string;
}

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
  
  const [isCreating, setIsCreating] = useState(false);
  const { mutate: handleLabourerLogTime } = useCreateLabourerLog();
  
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
    // time is in HH:mm format, date is in yyyy-MM-dd format
    // Return ISO 8601 format: yyyy-MM-ddTHH:mm:ss.sssZ
    return `${date}T${time}:00.000Z`;
  };

  const handleSave = (data: TimeLogFormData) => {
    if (isCreating) {
      // Format times to ISO 8601 for creation
      const formattedData: CreateLabourerTimeLogDTO = {
        workerId: currentUserId,
        entryTime: timeToISO(data.entryTime),
        exitTime: data.exitTime ? timeToISO(data.exitTime) : undefined,
        notes: undefined,
      };
      
      handleLabourerLogTime(formattedData);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  const handleAddNew = () => {
    setIsCreating(true);
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
              onClick={handleAddNew}
              size="sm"
              disabled={isCreating || hasTodayLog}
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
        {logs.length === 0 && !isCreating ? (
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
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const timeLogData: TimeLogData = {
                  id: log.id,
                  labourerId: log.workerId,
                  date: log.productionLog?.date || today,
                  entryTime: formatTimeDisplay(log.entryTime),
                  exitTime: formatTimeDisplay(log.exitTime),
                };

                return (
                  <TimeLogEditableRow
                    key={log.id}
                    timeLog={timeLogData}
                    labourers={[]}
                    mode="view"
                    onSave={handleSave}
                    onCancel={handleCancel}
                    showLabourerSelect={false}
                    showDate={true}
                    isLabourer={true}
                    canEdit={false}
                    canDelete={false}
                  />
                );
              })}
              {isCreating && (
                <TimeLogEditableRow
                  timeLog={{
                    labourerId: currentUserId,
                    labourerName: "", // Not sent to API, just for UI
                    date: today,
                    entryTime: "",
                    exitTime: "",
                  }}
                  labourers={[]}
                  mode="create"
                  onSave={handleSave}
                  onCancel={handleCancel}
                  showLabourerSelect={false}
                  showDate={true}
                  isLabourer={true}
                />
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
