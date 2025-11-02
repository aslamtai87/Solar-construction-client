"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, CheckCircle2, Clock, Award } from "lucide-react";
import { Milestone, Phase } from "@/lib/types/schedule";
import { useDialog } from "@/hooks/useDialog";
import CreateMilestoneDialog from "./CreateMilestoneDialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MilestoneDisplayProps {
  milestones: Milestone[];
  activities: Array<{ id: string; name: string; phaseId: string }>;
  phases: Phase[];
  onCreateMilestone: (data: any) => void;
}

export const MilestoneDisplay = ({
  milestones,
  activities,
  phases,
  onCreateMilestone,
}: MilestoneDisplayProps) => {
  const { dialog, openCreateDialog, closeDialog } = useDialog<Milestone>();

  const getCompletionPercentage = (milestone: Milestone) => {
    if (milestone.activityIds.length === 0) return 0;
    return Math.round(
      (milestone.completedActivityIds.length / milestone.activityIds.length) * 100
    );
  };

  const getStatusBadge = (milestone: Milestone) => {
    if (milestone.status === "achieved") {
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Achieved
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-500" />
            Milestones
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track project milestones and achievements
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Add Milestone
        </Button>
      </div>

      {/* Milestones Grid */}
      {milestones.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Target className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">No milestones created yet</p>
            <Button onClick={openCreateDialog} variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Milestone
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone) => {
            const completion = getCompletionPercentage(milestone);
            return (
              <Card
                key={milestone.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-1">
                        {milestone.name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1 line-clamp-2">
                        {milestone.description}
                      </CardDescription>
                    </div>
                    {getStatusBadge(milestone)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{completion}%</span>
                    </div>
                    <Progress value={completion} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {milestone.completedActivityIds.length} of{" "}
                      {milestone.activityIds.length} activities completed
                    </p>
                  </div>

                  {/* Target Date */}
                  <div className="flex items-center gap-2 text-sm pt-2 border-t">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-medium">
                      {new Date(milestone.targetDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Completion Date */}
                  {milestone.completionDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="font-medium">
                        {new Date(milestone.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Milestone Dialog */}
      <CreateMilestoneDialog
        open={dialog.open}
        onClose={closeDialog}
        onSubmit={onCreateMilestone}
        activities={activities}
        phases={phases}
      />
    </div>
  );
};

export default MilestoneDisplay;
