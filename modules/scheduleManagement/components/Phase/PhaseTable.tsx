"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  FolderKanban,
} from "lucide-react";
import { Phase } from "@/lib/types/schedule";
import { useDialog } from "@/hooks/useDialog";
import CreatePhaseDialog from "./CreatePhaseDialog";
import DeleteDialog from "@/components/global/DeleteDialog";
import { useCreatePhase, useDeletePhase, useUpdatePhase } from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";
import { GenericTable } from "@/components/global/Table/GenericTable";

const PhaseTable = ({ phases }: { phases: Phase[] }) => {
  const {
    dialog: createDialog,
    openCreateDialog,
    closeDialog: closeCreateDialog,
  } = useDialog<Phase>();
  const { selectedProject } = useProjectStore();
  const { mutateAsync: onCreatePhase } = useCreatePhase();
  const { mutateAsync: onEditPhase } = useUpdatePhase();
  const { mutateAsync: onDeletePhase } = useDeletePhase();
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [deletingPhase, setDeletingPhase] = useState<Phase | null>(null);


  const handleEdit = (phase: Phase) => {
    setEditingPhase(phase);
  };

  const handleDelete = (phase: Phase) => {
    setDeletingPhase(phase);
  };

  const handleConfirmDelete = () => {
    if (deletingPhase) {
      onDeletePhase(deletingPhase.id);
      setDeletingPhase(null);
    }
  };

  const handleCreateSubmit = (data: { name: string; description: string }) => {
    onCreatePhase({
      ...data,
      projectId: selectedProject?.id || "",
    });
    closeCreateDialog();
  };

  const handleEditSubmit = (data: { name: string; description: string }) => {
    if (editingPhase) {
      onEditPhase({ id: editingPhase.id, data });
      setEditingPhase(null);
    }
  };

  const getStatusVariant = (status?: Phase["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "in-progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status?: Phase["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      default:
        return "Not Started";
    }
  };

  const columns = [
    {
      key: "index",
      header: "#",
      render: (item: Phase, index: number) => (
        <div className="px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold text-sm">
            {index + 1}
          </div>
        </div>
      ),
    },
    {
      key: "name",
      header: "Phase Title",
      render: (item: Phase) => (
        <div className="px-6 py-4 font-medium">{item.name}</div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (item: Phase) => (
        <div className="px-6 py-4 max-w-md">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Phase) => (
        <div className="px-6 py-4">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusVariant(
              item.status
            )}`}
          >
            {getStatusLabel(item.status)}
          </span>
        </div>
      ),
    },
    {
      key: "created",
      header: "Created",
      render: (item: Phase) => (
        <div className="px-6 py-4 text-sm text-muted-foreground">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: Phase) => (
        <div className="px-6 py-4 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(item)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(item)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-4">
      <GenericTable
        data={phases || []}
        columns={columns}
        tableName="Project Phases"
        tableDescription="Manage and organize different phases of your solar project"
        emptyMessage="No phases yet"
        onAdd={openCreateDialog}
        addButtonText="Create Phase"
        addButtonIcon={<Plus className="h-4 w-4" />}
        showSearch={false}
        pagination={false}
      />

      {/* Create Phase Dialog */}
      <CreatePhaseDialog
        open={createDialog.open}
        onClose={closeCreateDialog}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Phase Dialog */}
      {editingPhase && (
        <CreatePhaseDialog
          open={!!editingPhase}
          onClose={() => setEditingPhase(null)}
          onSubmit={handleEditSubmit}
          mode="edit"
          initialData={editingPhase}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={!!deletingPhase}
        onClose={() => setDeletingPhase(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Phase"
        description={
          deletingPhase
            ? `Are you sure you want to delete "${deletingPhase.name}"? This action cannot be undone and will also delete all associated activities and milestones.`
            : ""
        }
      />
    </div>
  );
};

export default PhaseTable;
