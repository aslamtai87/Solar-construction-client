"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { SearchableSelect } from "@/components/global/SearchableSelect";
import { Badge } from "@/components/ui/badge";
import { LabourerTimeLog } from "@/lib/types/dailyProductionLog";
import { format, parseISO } from "date-fns";

const contractorLabourerLogSchema = z.object({
  labourerId: z.string().optional(),
  labourerName: z.string().min(1, "Labourer name is required"),
  labourerType: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  entryTime: z.string().min(1, "Entry time is required"),
  exitTime: z.string().optional(),
  notes: z.string().optional(),
});

type ContractorLabourerLogForm = z.infer<typeof contractorLabourerLogSchema>;

interface ContractorLabourerLogProps {
  logs: LabourerTimeLog[];
  labourers: { value: string; label: string; type?: string }[];
  projectId: string;
  date: string;
  onAddLog: (data: ContractorLabourerLogForm) => Promise<void>;
  onUpdateLog: (id: string, data: Partial<ContractorLabourerLogForm>) => Promise<void>;
  onDeleteLog: (id: string) => Promise<void>;
}

export const ContractorLabourerLog: React.FC<ContractorLabourerLogProps> = ({
  logs,
  labourers,
  projectId,
  date,
  onAddLog,
  onUpdateLog,
  onDeleteLog,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<LabourerTimeLog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<ContractorLabourerLogForm>({
    resolver: zodResolver(contractorLabourerLogSchema),
    defaultValues: {
      labourerId: "",
      labourerName: "",
      labourerType: "",
      date,
      entryTime: "",
      exitTime: "",
      notes: "",
    },
  });

  const handleOpenDialog = (log?: LabourerTimeLog) => {
    if (log) {
      setEditingLog(log);
      form.reset({
        labourerId: log.labourerId || "",
        labourerName: log.labourerName,
        labourerType: log.labourerType || "",
        date: log.date,
        entryTime: log.entryTime,
        exitTime: log.exitTime || "",
        notes: log.notes || "",
      });
    } else {
      setEditingLog(null);
      form.reset({
        labourerId: "",
        labourerName: "",
        labourerType: "",
        date,
        entryTime: "",
        exitTime: "",
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLog(null);
    form.reset();
    setSearchQuery("");
  };

  const handleSubmit = async (data: ContractorLabourerLogForm) => {
    try {
      if (editingLog) {
        await onUpdateLog(editingLog.id, data);
      } else {
        await onAddLog(data);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting labourer log:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this time log?")) {
      try {
        await onDeleteLog(id);
      } catch (error) {
        console.error("Error deleting labourer log:", error);
      }
    }
  };

  const handleLabourerSelect = (value: string) => {
    const selectedLabourer = labourers.find((l) => l.value === value);
    if (selectedLabourer) {
      form.setValue("labourerId", value);
      form.setValue("labourerName", selectedLabourer.label);
      form.setValue("labourerType", selectedLabourer.type || "");
    } else {
      // Custom entry
      form.setValue("labourerId", "");
      form.setValue("labourerName", value);
      form.setValue("labourerType", "");
    }
  };

  const calculateTotalHours = (entryTime: string, exitTime?: string) => {
    if (!exitTime) return null;
    
    const [entryHour, entryMinute] = entryTime.split(":").map(Number);
    const [exitHour, exitMinute] = exitTime.split(":").map(Number);
    
    const entryInMinutes = entryHour * 60 + entryMinute;
    const exitInMinutes = exitHour * 60 + exitMinute;
    
    const diffInMinutes = exitInMinutes - entryInMinutes;
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  // Find labourers who haven't logged today
  const loggedLabourerIds = logs.map((log) => log.labourerId).filter(Boolean);
  const missingLabourers = labourers.filter(
    (labourer) => !loggedLabourerIds.includes(labourer.value)
  );

  return (
    <div className="space-y-6">
      {missingLabourers.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Missing Time Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 mb-3">
              The following labourers haven't logged their time for {format(new Date(date), "MMMM dd, yyyy")}:
            </p>
            <div className="flex flex-wrap gap-2">
              {missingLabourers.map((labourer) => (
                <Badge key={labourer.value} variant="outline" className="bg-white">
                  {labourer.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Labourer Time Logs
              </CardTitle>
              <CardDescription>
                View and manage time logs for {format(new Date(date), "MMMM dd, yyyy")}
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Time Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Labourer Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Entry Time</TableHead>
                  <TableHead>Exit Time</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Logged By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No time logs found for this date
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.labourerName}</TableCell>
                      <TableCell>
                        {log.labourerType ? (
                          <Badge variant="secondary">{log.labourerType}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(log.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">{log.entryTime}</TableCell>
                      <TableCell>
                        {log.exitTime ? (
                          log.exitTime
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50">
                            Not logged out
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.totalHours ? (
                          `${log.totalHours.toFixed(2)}h`
                        ) : log.exitTime ? (
                          calculateTotalHours(log.entryTime, log.exitTime)
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.notes || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.loggedByRole === "contractor" ? "default" : "secondary"}>
                          {log.loggedByRole === "contractor" ? "Contractor" : "Self"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(log)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(log.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLog ? "Update Time Log" : "Add Time Log"}
            </DialogTitle>
            <DialogDescription>
              {editingLog 
                ? "Update the labourer's entry and exit times" 
                : "Add a time log for a labourer"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Labourer *
              </label>
              <SearchableSelect
                options={labourers}
                value={form.watch("labourerName") || ""}
                onChange={handleLabourerSelect}
                placeholder="Select or enter labourer"
                searchPlaceholder="Search labourers..."
                onSearchChange={setSearchQuery}
                searchQuery={searchQuery}
                allowCustomInput={true}
                customInputLabel="Use custom name:"
                hasError={!!form.formState.errors.labourerName}
              />
              {form.formState.errors.labourerName && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.labourerName.message}
                </p>
              )}
            </div>

            <FormFieldWrapper
              name="date"
              control={form.control}
              label="Date"
              type="date"
            />

            <FormFieldWrapper
              name="entryTime"
              control={form.control}
              label="Entry Time"
              type="time"
              placeholder="HH:MM"
            />

            <FormFieldWrapper
              name="exitTime"
              control={form.control}
              label="Exit Time (Optional)"
              type="time"
              placeholder="HH:MM"
            />

            <FormFieldWrapper
              name="notes"
              control={form.control}
              label="Notes (Optional)"
              type="textarea"
              placeholder="Any additional notes..."
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingLog ? "Update" : "Add"} Time Log
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
