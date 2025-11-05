"use client";

import React, { useState, useEffect } from "react";
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
import { Activity, Phase, WorkingDaysConfig } from "@/lib/types/schedule";
import * as z from "zod";
import { calculateDuration } from "@/lib/utils/durationCalculator";

const activityFormSchema = z.object({
  phaseId: z.string().min(1, "Phase is required"),
  name: z.string().min(1, "Activity name is required"),
  units: z.union([
    z.number(),
    z.nan(),
    z.null(),
    z.undefined(),
  ]).transform((val) => {
    if (val === null || val === undefined || isNaN(val as number)) return null;
    return val as number;
  }).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

interface ActivityEditableRowProps {
  activity?: Activity;
  phases: Phase[];
  workingDaysConfig: WorkingDaysConfig;
  mode: "view" | "edit" | "create";
  onSave: (data: ActivityFormData) => void;
  onCancel: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ActivityEditableRow = ({
  activity,
  phases,
  workingDaysConfig,
  mode,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: ActivityEditableRowProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: activity
      ? {
          phaseId: activity.phaseId,
          name: activity.name,
          units: activity.units || undefined,
          startDate: activity.startDate,
          endDate: activity.endDate,
        }
      : {
          phaseId: "",
          name: "",
          units: undefined,
          startDate: "",
          endDate: "",
        },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const duration = React.useMemo(() => {
    if (startDate && endDate && workingDaysConfig) {
      return calculateDuration(startDate, endDate, workingDaysConfig);
    }
    return activity?.duration || 0;
  }, [startDate, endDate, workingDaysConfig, activity?.duration]);

  const onSubmit = (data: ActivityFormData) => {
    onSave(data);
  };

  if (mode === "view" && activity) {
    return (
      <TableRow className="hover:bg-muted/50">
        {/* Activity Name */}
        <TableCell className="min-w-[250px] sticky left-0 bg-white z-10 font-medium">
          {activity.name}
        </TableCell>

        {/* Phase */}
        <TableCell className="min-w-[150px]">
          {phases.find((p) => p.id === activity.phaseId)?.title || "-"}
        </TableCell>

        {/* Units */}
        <TableCell className="min-w-[150px] text-center">
          {activity.units && activity.units > 0 ? activity.units.toLocaleString() : "NaN"}
        </TableCell>

        {/* Start Date */}
        <TableCell className="min-w-[150px]">
          {new Date(activity.startDate).toLocaleDateString()}
        </TableCell>

        {/* End Date */}
        <TableCell className="min-w-[150px]">
          {new Date(activity.endDate).toLocaleDateString()}
        </TableCell>

        {/* Duration */}
        <TableCell className="min-w-[150px] text-center">
          {duration} days
        </TableCell>

        {/* Actions */}
        <TableCell className="min-w-[150px] text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  }

  // Edit or Create Mode
  return (
    <TableRow className="bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500">
      {/* Empty expand cell */}
      {/* <TableCell className="sticky left-0 bg-orange-50 dark:bg-orange-950/20 z-10 w-0" /> */}

      {/* Activity Name */}
      <TableCell className="min-w-[250px] sticky left-0 bg-orange-50 dark:bg-orange-950/20 z-10">
        <Input
          {...register("name")}
          placeholder="Activity name"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </TableCell>

      {/* Phase */}
      <TableCell className="min-w-[150px] relative">
        <Select
          value={watch("phaseId")}
          onValueChange={(value) => setValue("phaseId", value)}
        >
          <SelectTrigger className={errors.phaseId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select phase" />
          </SelectTrigger>
          <SelectContent>
            {phases.map((phase) => (
              <SelectItem key={phase.id} value={phase.id}>
                {phase.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.phaseId && (
          <p className="text-xs text-destructive mt-1">{errors.phaseId.message}</p>
        )}
      </TableCell>

      {/* Units */}
      <TableCell className="min-w-[150px]">
        <Input
          {...register("units", { 
            setValueAs: (val) => {
              if (val === "" || val === null || val === undefined) return null;
              const num = Number(val);
              return isNaN(num) ? null : num;
            }
          })}
          type="number"
          placeholder="0"
          className={errors.units ? "border-destructive" : ""}
        />
        {errors.units && (
          <p className="text-xs text-destructive mt-1">{errors.units.message}</p>
        )}
      </TableCell>

      {/* Start Date */}
      <TableCell className="min-w-[150px]">
        <Input
          {...register("startDate")}
          type="date"
          className={errors.startDate ? "border-destructive" : ""}
        />
        {errors.startDate && (
          <p className="text-xs text-destructive mt-1">{errors.startDate.message}</p>
        )}
      </TableCell>

      {/* End Date */}
      <TableCell className="min-w-[150px]">
        <Input
          {...register("endDate")}
          type="date"
          className={errors.endDate ? "border-destructive" : ""}
        />
        {errors.endDate && (
          <p className="text-xs text-destructive mt-1">{errors.endDate.message}</p>
        )}
      </TableCell>

      {/* Duration (Calculated) */}
      <TableCell className="min-w-[150px] text-center">
        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
          {duration} days
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell className="min-w-[150px] text-center">
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

export default ActivityEditableRow;
