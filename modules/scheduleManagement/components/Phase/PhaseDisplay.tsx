"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, CheckCircle2, Circle } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import CreatePhaseDialog from "./CreatePhaseDialog";

interface Phase {
  id: string;
  title: string;
  description: string;
  status?: "not-started" | "in-progress" | "completed";
  createdAt?: string;
}

const PhaseDisplay = () => {
  const { dialog, openCreateDialog, closeDialog } = useDialog<Phase>();
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: "1",
      title: "Planning & Design",
      description: "Initial project planning, site assessment, and system design phase",
      status: "completed",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Permitting & Approvals",
      description: "Obtaining necessary permits and approvals from local authorities",
      status: "in-progress",
      createdAt: "2024-02-01",
    },
    {
      id: "3",
      title: "Procurement",
      description: "Sourcing and ordering solar panels, inverters, and other equipment",
      status: "not-started",
      createdAt: "2024-02-15",
    },
  ]);

  const handleCreatePhase = (data: { title: string; description: string }) => {
    const newPhase: Phase = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      status: "not-started",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPhases([...phases, newPhase]);
    closeDialog();
  };

  const getStatusIcon = (status?: Phase["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status?: Phase["status"]) => {
    const statusConfig = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "not-started": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };

    const statusLabel = {
      completed: "Completed",
      "in-progress": "In Progress",
      "not-started": "Not Started",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          statusConfig[status || "not-started"]
        }`}
      >
        {getStatusIcon(status)}
        {statusLabel[status || "not-started"]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Phases</h2>
          <p className="text-muted-foreground mt-1">
            Manage and track different phases of your solar project
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Phase
        </Button>
      </div>

      {/* Phases Grid */}
      {phases.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
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
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase, index) => (
            <Card
              key={phase.id}
              className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 hover:border-l-orange-600 cursor-pointer"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <CardTitle className="text-lg line-clamp-1">
                      {phase.title}
                    </CardTitle>
                  </div>
                </div>
                <div>{getStatusBadge(phase.status)}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed line-clamp-3">
                  {phase.description}
                </CardDescription>
                {phase.createdAt && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Created: {new Date(phase.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Phase Dialog */}
      <CreatePhaseDialog
        open={dialog.open}
        onClose={closeDialog}
        onSubmit={handleCreatePhase}
      />
    </div>
  );
};

export default PhaseDisplay;