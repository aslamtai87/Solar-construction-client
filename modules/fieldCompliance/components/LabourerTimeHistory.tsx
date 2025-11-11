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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TimeLogEditableRow, TimeLogData } from "./TimeLogEditableRow";
import { useGetStaffs } from "@/hooks/ReactQuery/useStaffs";

interface TimeLog {
  id: string;
  date: string;
  entryTime: string;
  exitTime: string;
  totalHours?: number;
  loggedByRole: "labourer" | "contractor";
}

export const LabourerTimeHistory = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
  const twoDaysAgo = format(new Date(Date.now() - 172800000), "yyyy-MM-dd");

  const [logs, setTimeLogs] = useState<TimeLog[]>([
    {
      id: "log-001",
      date: twoDaysAgo,
      entryTime: "07:30",
      exitTime: "16:00",
      totalHours: 8.5,
      loggedByRole: "labourer",
    },
    {
      id: "log-002",
      date: yesterday,
      entryTime: "08:00",
      exitTime: "17:00",
      totalHours: 9,
      loggedByRole: "labourer",
    },
  ]);
  const handleLabourerLogTime = (
    date: string,
    entryTime: string,
    exitTime: string
  ) => {
    const existingLog = logs.find((log) => log.date === date);

    // Calculate total hours
    const [entryHour, entryMinute] = entryTime.split(":").map(Number);
    const [exitHour, exitMinute] = exitTime.split(":").map(Number);
    const totalMinutes =
      exitHour * 60 + exitMinute - (entryHour * 60 + entryMinute);
    const totalHours = totalMinutes / 60;

    if (existingLog) {
      setTimeLogs(
        logs.map((log) =>
          log.id === existingLog.id
            ? { ...log, entryTime, exitTime, totalHours }
            : log
        )
      );
    } else {
      const newLog: TimeLog = {
        id: `log-${Date.now()}`,
        date,
        entryTime,
        exitTime,
        totalHours,
        loggedByRole: "labourer",
      };
      setTimeLogs([...logs, newLog]);
    }
  };
  const currentUserName = "John Smith";
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Check if today's log already exists
  const todayLog = logs.find((log) => log.date === today);
  const canCreateNew = !todayLog && !isCreating;

  const handleSave = (data: any) => {
    if (isCreating) {
      handleLabourerLogTime(today, data.entryTime, data.exitTime);
      setIsCreating(false);
    } else if (editingId) {
      handleLabourerLogTime(editingId, data.entryTime, data.exitTime);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (id: string, logDate: string) => {
    // Only allow editing today's log
    if (logDate === today) {
      setEditingId(id);
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string, logDate: string) => {
    // Only allow deleting today's log
    // if (logDate === today &) {
    //   onDeleteLog(id);
    // }
  };

  const handleAddNew = () => {
    if (canCreateNew) {
      setIsCreating(true);
      setEditingId(null);
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
            {todayLog && (
              <span className="text-xs text-muted-foreground">
                Today's log recorded
              </span>
            )}
            <Button
              onClick={handleAddNew}
              size="sm"
              disabled={!canCreateNew || editingId !== null}
              title={
                todayLog ? "Today's log already exists" : "Log time for today"
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
                  labourerId: "001",
                  labourerName: currentUserName,
                  date: log.date,
                  entryTime: log.entryTime,
                  exitTime: log.exitTime,
                };

                const isToday = log.date === today;
                const canEditLog = isToday;
                const canDeleteLog = isToday;

                return (
                  <TimeLogEditableRow
                    key={log.id}
                    timeLog={timeLogData}
                    labourers={[]}
                    mode={editingId === log.id ? "edit" : "view"}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onEdit={
                      canEditLog
                        ? () => handleEdit(log.id, log.date)
                        : undefined
                    }
                    onDelete={
                      canDeleteLog
                        ? () => handleDelete(log.id, log.date)
                        : undefined
                    }
                    showLabourerSelect={false}
                    showDate={true}
                    isLabourer={true}
                    canEdit={!!canEditLog}
                    canDelete={!!canDeleteLog}
                  />
                );
              })}
              {isCreating && (
                <TimeLogEditableRow
                  timeLog={{
                    id: undefined,
                    labourerId: "001",
                    labourerName: currentUserName,
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
