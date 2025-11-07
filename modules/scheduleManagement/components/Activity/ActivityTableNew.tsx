"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Activity, Phase, WorkingDaysConfig } from "@/lib/types/schedule";
import ActivityEditableRow from "./ActivityEditableRow";
import { calculateDuration } from "@/lib/utils/durationCalculator";

interface ActivityFormData {
  phaseId: string;
  name: string;
  units?: number | null;
  startDate: string;
  endDate: string;
}

interface ActivityTableNewProps {
  phases: Phase[];
  workingDaysConfig: WorkingDaysConfig;
}

export const ActivityTableNew = ({
  phases,
  workingDaysConfig,
}: ActivityTableNewProps) => {
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  
 const activities: Activity[] = [];

  const handleCreateActivity = (data: ActivityFormData) => {
    console.log("Creating activity with data:", data);
    setIsCreatingActivity(false);
  };

  const handleUpdateActivity = (activityId: string, data: ActivityFormData) => {
    console.log("Updating activity with ID:", activityId, "and data:", data);
    setEditingActivityId(null);
  };

  const handleDeleteActivity = (activityId: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      console.log("Deleting activity with ID:", activityId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Activities</h3>
          <p className="text-sm text-muted-foreground">
            Click "Add Activity" to create a new activity inline
          </p>
        </div>
        <Button
          onClick={() => setIsCreatingActivity(true)}
          className="gap-2"
          disabled={isCreatingActivity}
        >
          <Plus className="h-4 w-4" />
          Add Activity
        </Button>
      </div>

      {/* Table Container with Fixed Column */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-white">
                {/* <TableHead className="w-10 sticky left-0 bg-gray-50 z-10"></TableHead> */}
                <TableHead className="min-w-[250px] sticky left-0 bg-gray-50 z-10">
                  Activity Name
                </TableHead>
                <TableHead className="min-w-[150px]">Phase</TableHead>
                <TableHead className="min-w-[150px] text-center">
                  Units
                </TableHead>
                <TableHead className="min-w-[150px]">Start Date</TableHead>
                <TableHead className="min-w-[150px]">End Date</TableHead>
                <TableHead className="min-w-[150px] text-center">
                  Duration
                </TableHead>
                <TableHead className="min-w-[150px] text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Create New Activity Row */}
              {isCreatingActivity && (
                <ActivityEditableRow
                  phases={phases}
                  workingDaysConfig={workingDaysConfig}
                  mode="create"
                  onSave={handleCreateActivity}
                  onCancel={() => setIsCreatingActivity(false)}
                />
              )}

              {/* Empty State */}
              {activities?.length === 0 && !isCreatingActivity && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">No activities yet</p>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreatingActivity(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create First Activity
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Activity Rows */}
              {activities?.map((activity) => (
                <ActivityEditableRow
                  key={activity.id}
                  activity={activity}
                  phases={phases}
                  workingDaysConfig={workingDaysConfig}
                  mode={editingActivityId === activity.id ? "edit" : "view"}
                  onSave={(data) => handleUpdateActivity(activity.id, data)}
                  onCancel={() => setEditingActivityId(null)}
                  onEdit={() => setEditingActivityId(activity.id)}
                  onDelete={() => handleDeleteActivity(activity.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ActivityTableNew;
