"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Users } from "lucide-react";
import { Activity, SubActivity } from "@/lib/types/schedule";
import { DailyProduction, Crew } from "@/lib/types/production";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CrewProgress {
  crew: Crew;
  dailyData: DailyProduction[];
}

interface UpdateProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity;
  subActivities?: SubActivity[];
  crewProgressData: Map<string, CrewProgress[]>; // Map: subActivityId -> array of crew progress
  onSave: (updates: Map<string, Map<string, DailyProduction[]>>) => void; // Map: subActivityId -> Map: crewId -> daily data
}

export const UpdateProgressDialog = ({
  open,
  onOpenChange,
  activity,
  subActivities = [],
  crewProgressData,
  onSave,
}: UpdateProgressDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressData, setProgressData] = useState<Map<string, Map<string, DailyProduction[]>>>(
    new Map()
  );

  useEffect(() => {
    if (open && crewProgressData) {
      // Initialize progress data from crewProgressData
      const newProgressData = new Map<string, Map<string, DailyProduction[]>>();

      crewProgressData.forEach((crewProgresses, subActivityId) => {
        const crewMap = new Map<string, DailyProduction[]>();
        crewProgresses.forEach(({ crew, dailyData }) => {
          crewMap.set(crew.id, dailyData);
        });
        newProgressData.set(subActivityId, crewMap);
      });

      setProgressData(newProgressData);
    }
  }, [open, crewProgressData]);

  const handleActualUnitsChange = (
    subActivityId: string,
    crewId: string,
    dayIndex: number,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    const newProgressData = new Map(progressData);

    if (!newProgressData.has(subActivityId)) {
      newProgressData.set(subActivityId, new Map());
    }

    const crewMap = newProgressData.get(subActivityId)!;
    const dailyData = crewMap.get(crewId) || [];
    const updatedDailyData = [...dailyData];

    if (updatedDailyData[dayIndex]) {
      updatedDailyData[dayIndex] = {
        ...updatedDailyData[dayIndex],
        actualUnits: numValue,
      };
    }

    crewMap.set(crewId, updatedDailyData);
    newProgressData.set(subActivityId, crewMap);
    setProgressData(newProgressData);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave(progressData);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance >= 0) return "text-green-600 dark:text-green-400";
    return "text-red-600 dark:text-red-400";
  };

  const hasData = crewProgressData && crewProgressData.size > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Update Progress</DialogTitle>
          <DialogDescription>
            Update the actual units completed for each crew working on{" "}
            <strong>{activity.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {!hasData ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No production configurations found. Please configure production for sub-activities
                  first.
                </p>
              </CardContent>
            </Card>
          ) : (
            Array.from(crewProgressData.entries()).map(([subActivityId, crewProgresses]) => {
              const subActivity = subActivities.find((sa) => sa.id === subActivityId);
              if (!subActivity) return null;

              return (
                <Card key={subActivityId} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {subActivity.name}
                      <Badge variant="outline">
                        {crewProgresses.length}{" "}
                        {crewProgresses.length === 1 ? "crew" : "crews"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left p-3 font-medium sticky left-0 bg-gray-50 z-10 min-w-[180px]">
                              Crew / Team
                            </th>
                            {crewProgresses[0]?.dailyData.map((day) => (
                              <th
                                key={day.day}
                                className="text-center p-3 font-medium min-w-[120px]"
                              >
                                <div className="text-sm">Day {day.day}</div>
                                <div className="text-xs text-muted-foreground font-normal">
                                  {new Date(day.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </th>
                            ))}
                            <th className="text-center p-3 font-medium min-w-[100px] sticky right-0 bg-gray-50">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {crewProgresses.map(({ crew, dailyData }) => {
                            const crewData =
                              progressData.get(subActivityId)?.get(crew.id) || dailyData;
                            const totalActual = crewData.reduce(
                              (sum, day) => sum + (day.actualUnits || 0),
                              0
                            );
                            const totalTarget = crewData.reduce(
                              (sum, day) => sum + day.targetUnits,
                              0
                            );
                            const totalVariance = totalActual - totalTarget;

                            return (
                              <tr key={crew.id} className="border-b hover:bg-muted/20">
                                <td className="p-3 sticky left-0 bg-background z-10 border-r">
                                  <div className="font-medium">{crew.name}</div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {crew.numberOfPeople} people
                                  </div>
                                </td>
                                {crewData.map((day, dayIndex) => {
                                  const variance = (day.actualUnits || 0) - day.targetUnits;
                                  const isToday =
                                    day.date === new Date().toISOString().split("T")[0];

                                  return (
                                    <td
                                      key={day.day}
                                      className={`p-2 ${
                                        isToday ? "bg-orange-50 dark:bg-orange-900/10" : ""
                                      }`}
                                    >
                                      <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground text-center">
                                          Target: {day.targetUnits.toFixed(1)}
                                        </div>
                                        <Input
                                          type="number"
                                          step="0.1"
                                          min="0"
                                          value={day.actualUnits || ""}
                                          onChange={(e) =>
                                            handleActualUnitsChange(
                                              subActivityId,
                                              crew.id,
                                              dayIndex,
                                              e.target.value
                                            )
                                          }
                                          className="h-8 text-center"
                                          placeholder="0"
                                        />
                                        <div
                                          className={`text-xs text-center font-medium ${getVarianceColor(
                                            variance
                                          )}`}
                                        >
                                          {variance >= 0 ? "+" : ""}
                                          {variance.toFixed(1)}
                                        </div>
                                      </div>
                                    </td>
                                  );
                                })}
                                <td className="p-3 sticky right-0 bg-background border-l">
                                  <div className="text-center space-y-1">
                                    <div className="font-semibold">
                                      {totalActual.toFixed(0)} / {totalTarget.toFixed(0)}
                                    </div>
                                    <div
                                      className={`text-xs font-medium ${getVarianceColor(
                                        totalVariance
                                      )}`}
                                    >
                                      {totalVariance >= 0 ? "+" : ""}
                                      {totalVariance.toFixed(0)}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !hasData} className="gap-2">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4" />
            Save Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProgressDialog;
