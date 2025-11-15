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
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Activity, Phase, WorkingDaysConfig } from "@/lib/types/schedule";
import ActivityEditableRow from "./ActivityEditableRow";
import { useCreateActivity, useGetActivity, useDeleteActivity } from "@/hooks/ReactQuery/useSchedule";
import { ActivityFormData } from "./ActivityEditableRow";
import { useDebounce } from "@/hooks/useDebounce";
import { useDialog } from "@/hooks/useDialog";
import DeleteDialog from "@/components/global/DeleteDialog";
import CursorPagination from "@/components/global/Table/CursorPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateActivity } from "@/hooks/ReactQuery/useSchedule";


interface ActivityTableNewProps {
  phases: Phase[];
  workingDaysConfig: WorkingDaysConfig;
}

export const ActivityTableNew = ({
  phases,
  workingDaysConfig,
}: ActivityTableNewProps) => {
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>("all");
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();
  
  const { dialog: deleteDialog, openEditDialog: openDeleteDialog, closeDialog: closeDeleteDialog } = useDialog<Activity>();

  const { data: activitiesData, isLoading } = useGetActivity({
    cursor: cursor,
    limit: limit,
    search: debouncedSearch,
    phaseId: selectedPhaseId === "all" ? undefined : selectedPhaseId,
  });
  
  const activities = activitiesData?.data?.result || [];
  const pagination = activitiesData?.data?.pagination;

  const handleCreateActivity = (data: ActivityFormData) => {
    createActivityMutation.mutateAsync(data);
    setIsCreatingActivity(false);
  };

  const handleUpdateActivity = (activityId: string, data: ActivityFormData) => {
    updateActivityMutation.mutateAsync({id: activityId, data});
    setEditingActivityId(null);
  };

  const handleDeleteActivity = (activity: Activity) => {
    openDeleteDialog(activity);
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.data?.id) {
      deleteActivityMutation.mutate(deleteDialog.data.id, {
        onSuccess: () => {
          closeDeleteDialog();
        },
      });
    }
  };

  const handleNextPage = () => {
    if (pagination?.nextCursor) {
      setCursor(pagination.nextCursor);
      setCursors([...cursors, pagination.nextCursor]);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newCursors = cursors.slice(0, -1);
      setCursors(newCursors);
      setCursor(newCursors[newCursors.length - 1]);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCursor(null);
    setCursors([null]);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCursor(null);
    setCursors([null]);
    setCurrentPage(1);
  };

  const handlePhaseFilterChange = (value: string) => {
    setSelectedPhaseId(value);
    setCursor(null);
    setCursors([null]);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Activities</h3>
          <p className="text-sm text-muted-foreground">
            Manage project activities and track progress
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

      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedPhaseId} onValueChange={handlePhaseFilterChange}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="All Phases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            {phases.map((phase) => (
              <SelectItem key={phase.id} value={phase.id}>
                {phase.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              {(!activities || activities.length === 0) && !isCreatingActivity && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">
                        {searchQuery || selectedPhaseId !== "all"
                          ? "No activities found matching your criteria"
                          : "No activities yet"}
                      </p>
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
                  onDelete={() => handleDeleteActivity(activity)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {activities && activities.length > 0 && (
        <CursorPagination
          onNext={handleNextPage}
          onPrevious={handlePreviousPage}
          onFirst={handleFirstPage}
          hasNextPage={!!pagination?.nextCursor}
          hasPreviousPage={currentPage > 1}
          currentPage={currentPage}
          totalItems={pagination?.total}
          currentItems={pagination?.noOfOutput}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Activity"
        description={`Are you sure you want to delete "${deleteDialog.data?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ActivityTableNew;
