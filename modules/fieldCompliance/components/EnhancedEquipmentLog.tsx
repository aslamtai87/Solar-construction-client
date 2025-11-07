"use client";

import React, { useState } from "react";
import { Wrench, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EquipmentLogEditableRow, EquipmentLogData } from "./EquipmentLogEditableRow";

interface Equipment {
  id: string;
  name: string;
  price: number;
  pricingPeriod: string;
}

interface EquipmentLogRow {
  tempId: string;
  equipmentId: string;
  equipmentName: string;
  operator: string;
  operatorId?: string;
  quantity: number;
}

interface EnhancedEquipmentLogProps {
  equipment: Equipment[];
  operators: { value: string; label: string }[];
  existingLogs: EquipmentLogRow[];
  onSave: (logs: Omit<EquipmentLogRow, 'tempId' | 'equipmentName'>[]) => void;
}

export const EnhancedEquipmentLog: React.FC<EnhancedEquipmentLogProps> = ({
  equipment,
  operators,
  existingLogs,
  onSave,
}) => {
  const [logs, setLogs] = useState<EquipmentLogData[]>(
    existingLogs.map((log) => ({ ...log }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const equipmentOptions = equipment.map((eq) => ({
    value: eq.id,
    label: eq.name,
  }));

  const handleSave = (data: any) => {
    if (isCreating) {
      const newLog: EquipmentLogData = {
        tempId: `temp-${Date.now()}`,
        equipmentId: data.equipmentId,
        equipmentName: data.equipmentName,
        operatorId: data.operatorId,
        operator: data.operator,
        quantity: data.quantity,
      };
      setLogs([...logs, newLog]);
      setIsCreating(false);
    } else if (editingId) {
      setLogs(
        logs.map((log) =>
          log.tempId === editingId
            ? {
                ...log,
                equipmentId: data.equipmentId,
                equipmentName: data.equipmentName,
                operatorId: data.operatorId,
                operator: data.operator,
                quantity: data.quantity,
              }
            : log
        )
      );
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
    setLogs(logs.filter((log) => log.tempId !== id));
  };

  const handleAddNew = () => {
    setIsCreating(true);
    setEditingId(null);
  };

  const handleSaveAll = () => {
    const logsToSave = logs.map((log) => ({
      equipmentId: log.equipmentId,
      operator: log.operator,
      operatorId: log.operatorId,
      quantity: log.quantity,
    }));
    onSave(logsToSave);
    setLogs([]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Equipment Logs</CardTitle>
              <CardDescription className="text-sm">
                Record equipment usage for today
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {logs.length} {logs.length === 1 ? "entry" : "entries"}
              </Badge>
            )}
            <Button
              onClick={handleAddNew}
              size="sm"
              disabled={isCreating || editingId !== null}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Equipment
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 && !isCreating ? (
          <div className="text-center text-muted-foreground py-8 text-sm">
            No equipment logged yet. Click "Add Equipment" to get started.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <EquipmentLogEditableRow
                    key={log.tempId}
                    equipmentLog={log}
                    equipment={equipmentOptions}
                    operators={operators}
                    mode={editingId === log.tempId ? "edit" : "view"}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onEdit={() => handleEdit(log.tempId!)}
                    onDelete={() => handleDelete(log.tempId!)}
                  />
                ))}
                {isCreating && (
                  <EquipmentLogEditableRow
                    equipment={equipmentOptions}
                    operators={operators}
                    mode="create"
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                )}
              </TableBody>
            </Table>
            {logs.length > 0 && !isCreating && !editingId && (
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveAll} size="sm">
                  Save All Equipment Logs
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
