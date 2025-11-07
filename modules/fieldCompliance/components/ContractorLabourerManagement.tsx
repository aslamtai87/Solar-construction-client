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

interface LabourerTimeLog {
  id: string;
  labourerId: string;
  labourerName: string;
  labourerType?: string;
  entryTime: string;
  exitTime: string;
}

interface LabourerOption {
  value: string;
  label: string;
  type?: string;
}

interface ContractorLabourerManagementProps {
  date: string;
  logs: LabourerTimeLog[];
  labourers: LabourerOption[];
  onAddLog: (log: Omit<LabourerTimeLog, "id">) => void;
  onUpdateLog: (id: string, log: Partial<LabourerTimeLog>) => void;
  onDeleteLog: (id: string) => void;
}

export const ContractorLabourerManagement: React.FC<ContractorLabourerManagementProps> = ({
  date,
  logs,
  labourers,
  onAddLog,
  onUpdateLog,
  onDeleteLog,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const labourerOptions = labourers.map(l => ({
    value: l.value,
    label: l.label,
    type: l.type,
  }));

  const handleSave = (data: any) => {
    const selectedLabourer = labourers.find(l => l.value === data.labourerId);
    
    if (isCreating) {
      onAddLog({
        labourerId: data.labourerId,
        labourerName: data.labourerName,
        labourerType: selectedLabourer?.type,
        entryTime: data.entryTime,
        exitTime: data.exitTime,
      });
      setIsCreating(false);
    } else if (editingId) {
      onUpdateLog(editingId, {
        labourerId: data.labourerId,
        labourerName: data.labourerName,
        labourerType: selectedLabourer?.type,
        entryTime: data.entryTime,
        exitTime: data.exitTime,
      });
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
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
                Manage time logs for all workers - {format(new Date(date), "MMMM dd, yyyy")}
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
              {logs.map((log) => (
                <TimeLogEditableRow
                  key={log.id}
                  timeLog={log}
                  labourers={labourerOptions}
                  mode={editingId === log.id ? "edit" : "view"}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onEdit={() => handleEdit(log.id)}
                  onDelete={() => handleDelete(log.id)}
                  showLabourerSelect={true}
                  isLabourer={false}
                />
              ))}
              {isCreating && (
                <TimeLogEditableRow
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

