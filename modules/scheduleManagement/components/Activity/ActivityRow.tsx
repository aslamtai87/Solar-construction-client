"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { Activity } from "@/lib/types/schedule";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActivityRowProps {
  activity: Activity;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onCreateSubActivity: (activity: Activity) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (activityId: string) => void;
}

export const ActivityRow = ({
  activity,
  isExpanded,
  onToggleExpand,
  onCreateSubActivity,
  onEditActivity,
  onDeleteActivity,
}: ActivityRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasSubActivities =
    activity.subActivities && activity.subActivities.length > 0;

  const getWorkingDaysLabel = () => {
    const { type, customDays } = activity.workingDays;
    if (type === "custom" && customDays) {
      return customDays.join(", ");
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <TableRow ref={setNodeRef} style={style} className="hover:bg-muted/50">
      {/* Drag Handle */}
      <TableCell className="w-10 sticky left-0 bg-background z-10">
        <button
          className="cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </TableCell>

      {/* Activity Name with Expand/Collapse */}
      <TableCell className="min-w-[250px] sticky left-10 bg-background z-10">
        <div className="flex items-center gap-2">
          {hasSubActivities ? (
            <button
              onClick={() => onToggleExpand(activity.id)}
              className="p-0.5 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          <span className="font-medium">{activity.name}</span>
        </div>
      </TableCell>

      {/* Phase */}
      <TableCell className="min-w-[150px]">
        <span className="text-sm">{activity.phaseName || "-"}</span>
      </TableCell>

      {/* Units */}
      <TableCell className="min-w-[150px] text-center">
        <span className="font-medium">{activity.units.toLocaleString()}</span>
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
        <span className="font-medium">{activity.duration}</span>
        <span className="text-muted-foreground text-sm ml-1">days</span>
      </TableCell>

      {/* Working Days */}
      <TableCell className="min-w-[150px] text-center">
        <span className="text-sm">{getWorkingDaysLabel()}</span>
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
            <DropdownMenuItem onClick={() => onCreateSubActivity(activity)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sub-Activity
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditActivity(activity)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => onDeleteActivity(activity.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default ActivityRow;
