"use client";

import React, { useState } from "react";
import { Wrench, Plus, Pencil, Trash2, ListTodo } from "lucide-react";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { CreateEquipmentLogDTO, UpdateEquipmentLogDTO } from "@/lib/types/dailyProductionLog";
import { EquipmentLogDialog } from "./EquipmentLogDialog";
import DeleteDialog from "@/components/global/DeleteDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const EnhancedEquipmentLog = () => {
  // Dialog state management
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingLog, setEditingLog] = useState<any>(null);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null);
  
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

  // Get IDs of equipment already logged today
  const loggedEquipmentIds = logs.map(log => log.equipmentId);

  // Filter equipment options to exclude already logged equipment (only for create mode)
  const equipmentOptions = equipment
    .filter(eq => dialogMode === "edit" || !loggedEquipmentIds.includes(eq.id))
    .map((eq) => ({
      value: eq.id,
      label: eq.name,
    }));

  // Calculate total quantity based on isQuantityShared
  const calculateTotalQuantity = (activities: any[], isQuantityShared: boolean): number => {
    if (activities.length === 0) return 0;
    if (isQuantityShared) {
      return Math.max(...activities.map((act: any) => act.quantity));
    }
    return activities.reduce((sum: number, act: any) => sum + act.quantity, 0);
  };

  const handleSave = (data: any) => {
    if (dialogMode === "create") {
      const formattedData: CreateEquipmentLogDTO = {
        equipmentId: data.equipmentId,
        productionLogId: productionLogId,
        quantity: data.activities.reduce((sum: number, act: any) => 
          data.isQuantityShared ? Math.max(sum, act.quantity) : sum + act.quantity, 0
        ),
        isQuantityShared: data.isQuantityShared,
        notes: data.notes,
        equipmentActivities: data.activities.map((act: any) => ({
          activityId: act.activityId,
          quantity: act.quantity,
        })),
      };
      createLog(formattedData, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingLog(null);
        },
      });
    } else if (editingLog) {
      const formattedData: UpdateEquipmentLogDTO = {
        quantity: data.activities.reduce((sum: number, act: any) => 
          data.isQuantityShared ? Math.max(sum, act.quantity) : sum + act.quantity, 0
        ),
        isQuantityShared: data.isQuantityShared,
        notes: data.notes,
        equipmentActivities: data.activities.map((act: any) => ({
          activityId: act.activityId,
          quantity: act.quantity,
        })),
      };
      updateLog(
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
      deleteLog(deleteLogId, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeleteLogId(null);
        },
      });
    }
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
              onClick={handleOpenCreateDialog}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Equipment
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">
            No equipment logged yet. Click "Add Equipment" to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Shared</TableHead>
                <TableHead className="text-center">Total Quantity</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const activityCount = log.equipmentActivities?.length || 0;
                const totalQty = calculateTotalQuantity(
                  log.equipmentActivities || [],
                  log.isQuantityShared
                );

                return (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {log.equipment?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.isQuantityShared ? "default" : "secondary"} className="text-xs">
                        {log.isQuantityShared ? "Shared" : "Dedicated"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {totalQty} units
                    </TableCell>
                    <TableCell>
                      {activityCount > 0 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary" className="gap-1 cursor-pointer">
                                <ListTodo className="h-3 w-3" />
                                {activityCount} {activityCount === 1 ? "activity" : "activities"}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                {log.equipmentActivities?.map((act: any, idx: number) => (
                                  <div key={idx} className="text-xs">
                                    {act.activity?.name}: {act.quantity} units
                                  </div>
                                )) || <div className="text-xs">No activities</div>}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-xs text-muted-foreground">No activities</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {log.notes || "-"}
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
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {/* Equipment Log Dialog */}
      <EquipmentLogDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        mode={dialogMode}
        equipment={equipmentOptions}
        initialData={
          editingLog
            ? {
                equipmentId: editingLog.equipmentId,
                equipmentName: editingLog.equipment?.name,
                isQuantityShared: editingLog.isQuantityShared,
                notes: editingLog.notes || "",
                activities:
                  editingLog.equipmentActivities?.map((act: any) => ({
                    activityId: act.activityId,
                    quantity: act.quantity,
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
        title="Delete Equipment Log"
        description="Are you sure you want to delete this equipment log? This action cannot be undone."
      />
    </Card>
  );
};
