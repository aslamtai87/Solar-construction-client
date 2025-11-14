"use client";

import React, { useState } from "react";
import { Wrench, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  EquipmentLogEditableRow,
  EquipmentLogData,
} from "./EquipmentLogEditableRow";
import { format } from "date-fns";
import { useGetEquipment } from "@/hooks/ReactQuery/useSchedule";
import {
  useGetEquipmentLogs,
  useCreateEquipmentLog,
  useUpdateEquipmentLog,
  useDeleteEquipmentLog,
  useProductionLogId,
} from "@/hooks/ReactQuery/useProductionLog";
import { useProjectStore } from "@/store/projectStore";
import { CreateEquipmentLogDTO } from "@/lib/types/dailyProductionLog";

export const EnhancedEquipmentLog = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedProject } = useProjectStore();

  // Get production log ID
  const { data: productionLogData } = useProductionLogId(
    selectedProject?.id || "",
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const productionLogId = productionLogData?.data?.id || "";

  // Get equipment options
  const { data: equipmentData } = useGetEquipment({
    projectId: selectedProject?.id || "",
    search: searchQuery,
    limit: 100,
  });
  const equipment = equipmentData?.data?.result || [];

  // Get existing equipment logs
  const { data: equipmentLogsData } = useGetEquipmentLogs(productionLogId);
  const logs = equipmentLogsData?.data?.result || [];

  // Mutations
  const { mutate: createLog } = useCreateEquipmentLog();
  const { mutate: updateLog } = useUpdateEquipmentLog();
  const { mutate: deleteLog } = useDeleteEquipmentLog();

  const equipmentOptions = equipment.map((eq) => ({
    value: eq.id,
    label: eq.name,
  }));

  const handleSave = (data: any) => {
    if (isCreating) {
      const formattedData: CreateEquipmentLogDTO = {
        equipmentId: data.equipmentId,
        productionLogId: productionLogId,
        quantity: data.quantity,
        notes: data.notes,
      };
      createLog(formattedData);
      setIsCreating(false);
    } else if (editingId) {
      const formattedData = {
        quantity: data.quantity,
        notes: data.notes,
      };
      updateLog({ id: editingId, data: formattedData });
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
    deleteLog(id);
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
            <Wrench className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Equipment Logs</CardTitle>
              <CardDescription className="text-sm">
                Manage equipment usage - {format(new Date(), "MMMM dd, yyyy")}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const isEditing = editingId === log.id;
                const equipmentLogData: EquipmentLogData = {
                  tempId: log.id,
                  equipmentId: log.equipmentId,
                  equipmentName: log.equipment?.name || "N/A",
                  quantity: log.quantity,
                  notes: log.notes || undefined,
                };

                return (
                  <EquipmentLogEditableRow
                    key={log.id}
                    equipmentLog={equipmentLogData}
                    equipment={equipmentOptions}
                    mode={isEditing ? "edit" : "view"}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onEdit={() => handleEdit(log.id)}
                    onDelete={() => handleDelete(log.id)}
                  />
                );
              })}
              {isCreating && (
                <EquipmentLogEditableRow
                  equipment={equipmentOptions}
                  mode="create"
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
