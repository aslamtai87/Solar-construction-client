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
import { format, parseISO } from "date-fns";
import { TimeLogEditableRow, TimeLogData } from "./TimeLogEditableRow";

interface TimeLog {
  id: string;
  date: string;
  entryTime: string;
  exitTime: string;
}

interface LabourerTimeHistoryProps {
  logs: TimeLog[];
  currentUserName: string;
  labourerId: string;
  onLogTime: (date: string, entryTime: string, exitTime: string) => void;
  onUpdateLog?: (id: string, entryTime: string, exitTime: string) => void;
  onDeleteLog?: (id: string) => void;
}

export const LabourerTimeHistory: React.FC<LabourerTimeHistoryProps> = ({
  logs,
  currentUserName,
  labourerId,
  onLogTime,
  onUpdateLog,
  onDeleteLog,
}) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Check if today's log already exists
  const todayLog = logs.find(log => log.date === today);
  const canCreateNew = !todayLog && !isCreating;

  const handleSave = (data: any) => {
    if (isCreating) {
      onLogTime(today, data.entryTime, data.exitTime);
      setIsCreating(false);
    } else if (editingId && onUpdateLog) {
      onUpdateLog(editingId, data.entryTime, data.exitTime);
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
    if (logDate === today && onDeleteLog) {
      onDeleteLog(id);
    }
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
              <CardDescription className="text-sm">View and manage your work hours</CardDescription>
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
              title={todayLog ? "Today's log already exists" : "Log time for today"}
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
                  labourerId: labourerId,
                  labourerName: currentUserName,
                  date: log.date,
                  entryTime: log.entryTime,
                  exitTime: log.exitTime,
                };

                const isToday = log.date === today;
                const canEditLog = isToday && onUpdateLog;
                const canDeleteLog = isToday && onDeleteLog;
                
                return (
                  <TimeLogEditableRow
                    key={log.id}
                    timeLog={timeLogData}
                    labourers={[]}
                    mode={editingId === log.id ? "edit" : "view"}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onEdit={canEditLog ? () => handleEdit(log.id, log.date) : undefined}
                    onDelete={canDeleteLog ? () => handleDelete(log.id, log.date) : undefined}
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
                    labourerId: labourerId,
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

