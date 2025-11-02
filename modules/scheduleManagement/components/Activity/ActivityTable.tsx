"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Activity, SubActivity, Phase } from "@/lib/types/schedule";
import ActivityRow from "./ActivityRow";
import { useDialog } from "@/hooks/useDialog";
import CreateActivityDialog from "./CreateActivityDialog";
import CreateSubActivityDialog from "./CreateSubActivityDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface ActivityTableProps {
  activities: Activity[];
  phases: Phase[];
  onUpdateActivities: (activities: Activity[]) => void;
  onCreateActivity: (data: any) => void;
  onCreateSubActivity: (activityId: string, data: any) => void;
  onEditActivity: (activityId: string, data: any) => void;
  onDeleteActivity: (activityId: string) => void;
  onEditSubActivity: (activityId: string, subActivityId: string, data: any) => void;
  onDeleteSubActivity: (activityId: string, subActivityId: string) => void;
}

export const ActivityTable = ({
  activities,
  phases,
  onUpdateActivities,
  onCreateActivity,
  onCreateSubActivity,
  onEditActivity,
  onDeleteActivity,
  onEditSubActivity,
  onDeleteSubActivity,
}: ActivityTableProps) => {
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(
    new Set()
  );
  const activityDialog = useDialog<Activity>();
  const subActivityDialog = useDialog<{ activity: Activity; subActivity?: Activity }>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleExpanded = (id: string) => {
    setExpandedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activities.findIndex((item) => item.id === active.id);
      const newIndex = activities.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newActivities = arrayMove(activities, oldIndex, newIndex);
        onUpdateActivities(newActivities);
      }
    }
  };

  const handleCreateSubActivity = (activity: Activity) => {
    subActivityDialog.openCreateDialog();
    subActivityDialog.updateDialog({ data: { activity } });
  };

  const handleEditActivity = (activity: Activity) => {
    activityDialog.openEditDialog(activity);
  };

  const handleDeleteActivity = (activityId: string) => {
    if (confirm('Are you sure you want to delete this activity? This will also delete all sub-activities.')) {
      onDeleteActivity(activityId);
    }
  };

  const handleEditSubActivity = (activity: Activity, subActivity: Activity) => {
    subActivityDialog.openEditDialog({ activity, subActivity });
  };

  const handleDeleteSubActivity = (activityId: string, subActivityId: string) => {
    if (confirm('Are you sure you want to delete this sub-activity?')) {
      onDeleteSubActivity(activityId, subActivityId);
    }
  };

  const handleActivitySubmit = (data: any) => {
    if (activityDialog.dialog.mode === 'edit' && activityDialog.dialog.data) {
      onEditActivity(activityDialog.dialog.data.id, data);
    } else {
      onCreateActivity(data);
    }
    activityDialog.closeDialog();
  };

  const handleSubActivitySubmit = (data: any) => {
    if (subActivityDialog.dialog.data?.activity) {
      if (subActivityDialog.dialog.mode === 'edit' && subActivityDialog.dialog.data.subActivity) {
        onEditSubActivity(
          subActivityDialog.dialog.data.activity.id,
          subActivityDialog.dialog.data.subActivity.id,
          data
        );
      } else {
        onCreateSubActivity(subActivityDialog.dialog.data.activity.id, data);
      }
      subActivityDialog.closeDialog();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Activities</h3>
          <p className="text-sm text-muted-foreground">
            Manage project activities and sub-activities
          </p>
        </div>
        <Button onClick={activityDialog.openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Activity
        </Button>
      </div>

      {/* Table Container with Fixed Column */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead className="w-10 sticky left-0 bg-gray-50 z-10"></TableHead>
                  <TableHead className="min-w-[250px] sticky left-8 bg-gray-50 z-10">
                    Activity Name
                  </TableHead>
                  <TableHead className="min-w-[150px] ">Phase</TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    Units
                  </TableHead>
                  <TableHead className="min-w-[150px] ">Start Date</TableHead>
                  <TableHead className="min-w-[150px] ">End Date</TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    Duration
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    Working Days
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-muted-foreground">
                          No activities yet
                        </p>
                        <Button
                          variant="outline"
                          onClick={activityDialog.openCreateDialog}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Create First Activity
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext
                    items={activities.map((a) => a.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {activities.map((activity) => (
                      <React.Fragment key={activity.id}>
                        <ActivityRow
                          activity={activity}
                          isExpanded={expandedActivities.has(activity.id)}
                          onToggleExpand={toggleExpanded}
                          onCreateSubActivity={handleCreateSubActivity}
                          onEditActivity={handleEditActivity}
                          onDeleteActivity={handleDeleteActivity}
                        />
                        {/* Sub-activities */}
                        {expandedActivities.has(activity.id) &&
                          activity.subActivities &&
                          activity.subActivities.map(
                            (subActivity: SubActivity) => (
                              <TableRow
                                key={subActivity.id}
                                className="bg-gray-50 hover:bg-muted/50"
                              >
                                <TableCell className="sticky left-0 bg-gray-50"></TableCell>
                                <TableCell className="sticky left-10 bg-gray-50">
                                  <div className="pl-8 flex items-center gap-2">
                                    <div className="w-4 h-0.5 bg-border"></div>
                                    <span className="text-sm">
                                      {subActivity.name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  -
                                </TableCell>
                                <TableCell className="text-center text-sm">
                                  {subActivity.units.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {new Date(
                                    subActivity.startDate
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {new Date(
                                    subActivity.endDate
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-center text-sm">
                                  {subActivity.duration} days
                                </TableCell>
                                <TableCell className="text-sm capitalize text-center">
                                  {subActivity.workingDays.type}
                                </TableCell>
                                <TableCell className="text-center">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditSubActivity(activity, subActivity)}>
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="text-destructive"
                                        onClick={() => handleDeleteSubActivity(activity.id, subActivity.id)}
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                      </React.Fragment>
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>

      {/* Create Activity Dialog */}
      <CreateActivityDialog
        open={activityDialog.dialog.open}
        onClose={activityDialog.closeDialog}
        onSubmit={handleActivitySubmit}
        phases={phases}
        mode={activityDialog.dialog.mode}
        initialData={activityDialog.dialog.data || undefined}
      />

      {/* Create Sub-Activity Dialog */}
      {subActivityDialog.dialog.data?.activity && (
        <CreateSubActivityDialog
          open={subActivityDialog.dialog.open}
          onClose={subActivityDialog.closeDialog}
          onSubmit={handleSubActivitySubmit}
          parentActivity={subActivityDialog.dialog.data.activity}
          existingSubActivities={
            subActivityDialog.dialog.data.activity.subActivities || []
          }
          mode={subActivityDialog.dialog.mode}
          initialData={subActivityDialog.dialog.data.subActivity}
        />
      )}
    </div>
  );
};

export default ActivityTable;
