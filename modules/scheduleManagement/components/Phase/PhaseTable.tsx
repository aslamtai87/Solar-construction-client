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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MoreVertical, Edit, Trash2, Calendar, FolderKanban } from "lucide-react";
import { Phase } from "@/lib/types/schedule";
import { useDialog } from "@/hooks/useDialog";
import CreatePhaseDialog from "./CreatePhaseDialog";
import DeleteDialog from "@/components/global/DeleteDialog";

interface PhaseTableProps {
  phases: Phase[];
  onCreatePhase: (data: { title: string; description: string }) => void;
  onEditPhase: (phaseId: string, data: { title: string; description: string }) => void;
  onDeletePhase: (phaseId: string) => void;
}

const PhaseTable = ({
  phases,
  onCreatePhase,
  onEditPhase,
  onDeletePhase,
}: PhaseTableProps) => {
  const { dialog: createDialog, openCreateDialog, closeDialog: closeCreateDialog } = useDialog<Phase>();
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

  const handleCreateSubmit = (data: { title: string; description: string }) => {
    onCreatePhase(data);
    closeCreateDialog();
  };

  const handleEditSubmit = (data: { title: string; description: string }) => {
    if (editingPhase) {
      onEditPhase(editingPhase.id, data);
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <FolderKanban className="h-6 w-6 text-orange-500" />
                Project Phases
              </CardTitle>
              <CardDescription>
                Manage and organize different phases of your solar project
              </CardDescription>
            </div>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Phase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {phases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <div className="rounded-full bg-muted p-4 mb-4">
                <FolderKanban className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No phases yet</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                Get started by creating your first project phase to organize your
                schedule and tasks.
              </p>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Phase
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Phase Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-32">Status</TableHead>
                    <TableHead className="w-32">Created</TableHead>
                    <TableHead className="w-20 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {phases.map((phase, index) => (
                    <TableRow key={phase.id} className="group hover:bg-muted/50">
                      <TableCell>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold text-sm">
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{phase.title}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {phase.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusVariant(
                            phase.status
                          )}`}
                        >
                          {getStatusLabel(phase.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {phase.createdAt
                          ? new Date(phase.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(phase)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(phase)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
            ? `Are you sure you want to delete "${deletingPhase.title}"? This action cannot be undone and will also delete all associated activities and milestones.`
            : ""
        }
      />
    </div>
  );
};

export default PhaseTable;
