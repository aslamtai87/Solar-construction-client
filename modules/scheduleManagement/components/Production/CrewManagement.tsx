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
import { Plus, MoreVertical, Edit, Trash2, Users } from "lucide-react";
import { Crew } from "@/lib/types/production";
import { useDialog } from "@/hooks/useDialog";
import CreateCrewDialog from "./CreateCrewDialog";
import DeleteDialog from "@/components/global/DeleteDialog";

interface CrewManagementProps {
  crews: Crew[];
  onCreateCrew: (data: { name: string; numberOfPeople: number }) => void;
  onEditCrew: (crewId: string, data: { name: string; numberOfPeople: number }) => void;
  onDeleteCrew: (crewId: string) => void;
}

const CrewManagement = ({
  crews,
  onCreateCrew,
  onEditCrew,
  onDeleteCrew,
}: CrewManagementProps) => {
  const { dialog: createDialog, openCreateDialog, closeDialog: closeCreateDialog } = useDialog<Crew>();
  const [editingCrew, setEditingCrew] = useState<Crew | null>(null);
  const [deletingCrew, setDeletingCrew] = useState<Crew | null>(null);

  const handleEdit = (crew: Crew) => {
    setEditingCrew(crew);
  };

  const handleDelete = (crew: Crew) => {
    setDeletingCrew(crew);
  };

  const handleConfirmDelete = () => {
    if (deletingCrew) {
      onDeleteCrew(deletingCrew.id);
      setDeletingCrew(null);
    }
  };

  const handleCreateSubmit = (data: { name: string; numberOfPeople: number }) => {
    onCreateCrew(data);
    closeCreateDialog();
  };

  const handleEditSubmit = (data: { name: string; numberOfPeople: number }) => {
    if (editingCrew) {
      onEditCrew(editingCrew.id, data);
      setEditingCrew(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-orange-500" />
                Crew Management
              </CardTitle>
              <CardDescription>
                Create and manage crews to assign to production activities
              </CardDescription>
            </div>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Crew
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {crews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No crews yet</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                Get started by creating your first crew to assign to production activities.
              </p>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Crew
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">SN</TableHead>
                    <TableHead>Crew Name</TableHead>
                    <TableHead className="w-40">Number of People</TableHead>
                    <TableHead className="w-32">Created</TableHead>
                    <TableHead className="w-20 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crews.map((crew, index) => (
                    <TableRow key={crew.id} className="group hover:bg-muted/50">
                      <TableCell>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold text-sm">
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{crew.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{crew.numberOfPeople} {crew.numberOfPeople === 1 ? "person" : "people"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {crew.createdAt
                          ? new Date(crew.createdAt).toLocaleDateString()
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
                            <DropdownMenuItem onClick={() => handleEdit(crew)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(crew)}
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

      {/* Create Crew Dialog */}
      <CreateCrewDialog
        open={createDialog.open}
        onClose={closeCreateDialog}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Crew Dialog */}
      {editingCrew && (
        <CreateCrewDialog
          open={!!editingCrew}
          onClose={() => setEditingCrew(null)}
          onSubmit={handleEditSubmit}
          mode="edit"
          initialData={editingCrew}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={!!deletingCrew}
        onClose={() => setDeletingCrew(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Crew"
        description={
          deletingCrew
            ? `Are you sure you want to delete "${deletingCrew.name}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
};

export default CrewManagement;
