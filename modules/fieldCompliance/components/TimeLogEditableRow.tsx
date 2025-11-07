"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, X, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import * as z from "zod";

const timeLogFormSchema = z
  .object({
    labourerId: z.string(),
    labourerName: z.string().optional(),
    entryTime: z.string().min(1, "Entry time is required"),
    exitTime: z.string().min(1, "Exit time is required"),
  })
  .refine(
    (data) => {
      if (data.entryTime && data.exitTime) {
        return data.exitTime > data.entryTime;
      }
      return true;
    },
    {
      message: "Exit time must be after entry time",
      path: ["exitTime"],
    }
  );

type TimeLogFormData = z.infer<typeof timeLogFormSchema>;

export interface TimeLogData {
  id?: string;
  labourerId: string;
  labourerName: string;
  labourerType?: string;
  date?: string;
  entryTime: string;
  exitTime: string;
}

interface TimeLogEditableRowProps {
  timeLog?: TimeLogData;
  labourers: { value: string; label: string; type?: string }[];
  mode: "view" | "edit" | "create";
  onSave: (data: TimeLogFormData) => void;
  onCancel: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showLabourerSelect?: boolean;
  showDate?: boolean;
  isLabourer?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const TimeLogEditableRow = ({
  timeLog,
  labourers,
  mode,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  showLabourerSelect = true,
  showDate = false,
  isLabourer = false,
  canEdit = true,
  canDelete = true,
}: TimeLogEditableRowProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<TimeLogFormData>({
    resolver: zodResolver(timeLogFormSchema),
    defaultValues: timeLog
      ? {
          labourerId: timeLog.labourerId || "",
          labourerName: timeLog.labourerName || "",
          entryTime: timeLog.entryTime || "",
          exitTime: timeLog.exitTime || "",
        }
      : {
          labourerId: "",
          labourerName: "",
          entryTime: "",
          exitTime: "",
        },
  });

  const selectedLabourerId = watch("labourerId");

  const onSubmit = (data: TimeLogFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", errors);
    
    // Validate labourerId if showLabourerSelect is true
    if (showLabourerSelect && !data.labourerId) {
      setError("labourerId", {
        type: "manual",
        message: "Labourer is required",
      });
      return;
    }
    
    const selectedLabourer = labourers.find((l) => l.value === data.labourerId);
    onSave({
      ...data,
      labourerId: data.labourerId || timeLog?.labourerId || "",
      labourerName: selectedLabourer?.label || data.labourerName || timeLog?.labourerName || "",
    });
  };

  const calculateHours = (entry: string, exit: string) => {
    if (!entry || !exit) return "-";
    const [entryHours, entryMinutes] = entry.split(":").map(Number);
    const [exitHours, exitMinutes] = exit.split(":").map(Number);
    const entryTotalMinutes = entryHours * 60 + entryMinutes;
    const exitTotalMinutes = exitHours * 60 + exitMinutes;
    const diffMinutes = exitTotalMinutes - entryTotalMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  if (mode === "view" && timeLog) {
    return (
      <TableRow className="hover:bg-muted/50">
        {showDate && timeLog.date && (
          <TableCell className="font-medium text-sm">
            {new Date(timeLog.date).toLocaleDateString()}
          </TableCell>
        )}
        {showLabourerSelect && (
          <>
            <TableCell className="font-medium">{timeLog.labourerName}</TableCell>
            {timeLog.labourerType && (
              <TableCell className="text-sm text-muted-foreground">
                {timeLog.labourerType}
              </TableCell>
            )}
          </>
        )}
        <TableCell>{timeLog.entryTime}</TableCell>
        <TableCell>{timeLog.exitTime}</TableCell>
        <TableCell>
          {calculateHours(timeLog.entryTime, timeLog.exitTime)}
        </TableCell>
        <TableCell className="text-center">
          {(onEdit || onDelete) ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-xs text-muted-foreground">Read-only</span>
          )}
        </TableCell>
      </TableRow>
    );
  }

  // Edit or Create Mode
  return (
    <TableRow className="bg-primary/5 border-l-4 border-primary">
      {showDate && timeLog?.date && (
        <TableCell className="font-medium text-sm">
          {new Date(timeLog.date).toLocaleDateString()}
        </TableCell>
      )}
      {showLabourerSelect ? (
        <>
          <TableCell className="min-w-[200px]">
            <Select
              value={selectedLabourerId}
              onValueChange={(value) => setValue("labourerId", value)}
            >
              <SelectTrigger className={errors.labourerId ? "border-destructive" : ""}>
                <SelectValue placeholder="Select labourer" />
              </SelectTrigger>
              <SelectContent>
                {labourers.map((labourer) => (
                  <SelectItem key={labourer.value} value={labourer.value}>
                    {labourer.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.labourerId && (
              <p className="text-xs text-destructive mt-1">{errors.labourerId.message}</p>
            )}
          </TableCell>
          <TableCell className="text-sm text-muted-foreground">
            {labourers.find((l) => l.value === selectedLabourerId)?.type || "-"}
          </TableCell>
        </>
      ) : null}
      
      {/* Hidden input for labourerId when not showing select */}
      {!showLabourerSelect && timeLog?.labourerId && (
        <input type="hidden" {...register("labourerId")} value={timeLog.labourerId} />
      )}
      
      <TableCell className="min-w-[150px]">
        <Input
          {...register("entryTime")}
          type="time"
          className={errors.entryTime ? "border-destructive" : ""}
        />
        {errors.entryTime && (
          <p className="text-xs text-destructive mt-1">{errors.entryTime.message}</p>
        )}
      </TableCell>

      <TableCell className="min-w-[150px]">
        <Input
          {...register("exitTime")}
          type="time"
          className={errors.exitTime ? "border-destructive" : ""}
        />
        {errors.exitTime && (
          <p className="text-xs text-destructive mt-1">{errors.exitTime.message}</p>
        )}
      </TableCell>

      <TableCell className="text-center text-sm font-medium text-primary">
        {calculateHours(watch("entryTime"), watch("exitTime"))}
      </TableCell>

      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            className="h-8 gap-1"
          >
            <Check className="h-3 w-3" />
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="h-8 gap-1"
          >
            <X className="h-3 w-3" />
            Cancel
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TimeLogEditableRow;
