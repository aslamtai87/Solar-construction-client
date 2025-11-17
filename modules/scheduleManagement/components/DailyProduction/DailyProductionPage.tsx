"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Table, TrendingUp, TrendingDown, CalendarIcon, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  DateRange, 
  ActivityProduction, 
  CrewProduction, 
  DailyProduction,
  ActivityProductionWithParent,
  CrewProductionWithParent,
  ActivityLevelProduction,
  CrewLevelProduction
} from "./types";
import {
  transformApiDataToActivityChart,
  transformApiDataToCrewChart,
  getActivityNameById,
} from "./utils";
import { ActivityChartView } from "./ActivityChartView";
import { CrewChartView } from "./CrewChartView";
import { ProductionTableView } from "./ProductionTableView";
import { useDailyProductionExecutiveView, useDailyProductionDetailedView } from "@/hooks/ReactQuery/useDailyProduction";
import { useProjectStore } from "@/store/projectStore";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const DailyProductionTracking = () => {
  const { selectedProject } = useProjectStore();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"executive" | "detailed">("executive");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Executive view uses same date for start and end
  const { data: executiveResponse, isLoading: executiveLoading } = useDailyProductionExecutiveView({
    projectId: selectedProject?.id || "",
    startDate: formattedDate,
    enabled: viewMode === "executive" && !!selectedProject?.id,
  });

  // Detailed view uses single date
  const { data: detailedResponse, isLoading: detailedLoading } = useDailyProductionDetailedView({
    projectId: selectedProject?.id || "",
    enabled: viewMode === "detailed" && !!selectedProject?.id,
  });

  // Transform API data for charts (executive view)
  const activities = executiveResponse?.data?.activities || [];
  const activityChartData = transformApiDataToActivityChart(activities);
  const crewChartData = selectedActivity
    ? transformApiDataToCrewChart(selectedActivity, activities)
    : [];
  const selectedActivityName = selectedActivity
    ? getActivityNameById(selectedActivity, activities)
    : "";

  // Transform detailed view data to match ProductionTableView structure
  const transformToProductionTableData = (detailedActivities: any[]): ActivityProductionWithParent[] => {
    return detailedActivities.map((activity) => {
      // Get all unique crew names across all dates
      const allCrewNames = new Set<string>();
      activity.dailyProduction.forEach((dp: any) => {
        Object.keys(dp.crews).forEach((crewName) => allCrewNames.add(crewName));
      });

      // Create activity-level production data (parent forecast and total actual)
      const activityLevelProduction: ActivityLevelProduction[] = activity.dailyProduction.map((dp: any) => {
        const totalActual = Object.values(dp.crews).reduce((sum: number, val: any) => sum + val, 0);
        return {
          date: dp.date,
          forecasted: dp.forecasted,
          totalActual,
        };
      });

      // Create crew production data (only actuals)
      const crews: CrewProductionWithParent[] = Array.from(allCrewNames).map((crewName) => {
        const dailyProduction: CrewLevelProduction[] = activity.dailyProduction.map((dp: any) => ({
          date: dp.date,
          actual: dp.crews[crewName] || 0,
        }));

        return {
          crewName,
          dailyProduction,
        };
      });

      return {
        activityId: activity.activityId,
        activityName: `${activity.activityNo}. ${activity.activityName}`,
        type: "activity" as const,
        activityLevelProduction,
        crews,
      };
    });
  };

  const detailedTableData = detailedResponse?.data?.activities
    ? transformToProductionTableData(detailedResponse.data.activities)
    : [];

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please select a project</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Daily Production Tracking
          </h2>
          <p className="text-gray-500 mt-1">
            Forecasted vs Actual production by crew and activity
          </p>
        </div>
      </div>

      <Tabs
        value={viewMode}
        onValueChange={(v) => setViewMode(v as "executive" | "detailed")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="executive">
            <BarChart3 className="h-4 w-4 mr-2" />
            Executive View
          </TabsTrigger>
          <TabsTrigger value="detailed">
            <Table className="h-4 w-4 mr-2" />
            Detailed View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-6 mt-6">
          {/* Date Picker for Executive View */}
          <div className="flex justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-60 justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Summary Cards */}
          {executiveResponse?.data?.summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Forecasted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {executiveResponse.data.summary.totalForecasted.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {executiveResponse.data.summary.activitiesCount} activities
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Actual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {executiveResponse.data.summary.totalActual.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Units completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Variance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      executiveResponse.data.summary.totalVariance >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {executiveResponse.data.summary.totalVariance >= 0 ? "+" : ""}
                    {executiveResponse.data.summary.totalVariance.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Difference from forecast
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Variance %
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {executiveResponse.data.summary.variancePercentage >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <div
                      className={`text-2xl font-bold ${
                        executiveResponse.data.summary.variancePercentage >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {executiveResponse.data.summary.variancePercentage >= 0
                        ? "+"
                        : ""}
                      {executiveResponse.data.summary.variancePercentage.toFixed(1)}%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Performance indicator
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {executiveLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Loading production data...</p>
              </div>
            </div>
          ) : activities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center">
                  No production data available for the selected date
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try selecting a different date or ensure activities are logged
                </p>
              </CardContent>
            </Card>
          ) : selectedActivity ? (
            <CrewChartView
              activityName={selectedActivityName}
              crewChartData={crewChartData}
              onBack={() => setSelectedActivity(null)}
            />
          ) : (
            <ActivityChartView
              activityChartData={activityChartData}
              onActivitySelect={setSelectedActivity}
            />
          )}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6 mt-6">
          {detailedLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Loading detailed production data...</p>
              </div>
            </div>
          ) : !detailedResponse?.data?.activities || detailedResponse.data.activities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center">
                  No detailed production data available
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Activities have not been logged yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <ProductionTableView 
              productionData={detailedTableData}
              onUpdateActual={() => {}}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyProductionTracking;

