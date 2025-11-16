"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Table, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { DateRangePicker } from "@/components/global/DateRangePicker";
import { DateRange } from "./types";
import {
  transformApiDataToActivityChart,
  transformApiDataToCrewChart,
  getActivityNameById,
} from "./utils";
import { ActivityChartView } from "./ActivityChartView";
import { CrewChartView } from "./CrewChartView";
import { ProductionTableView } from "./ProductionTableView";
import { useDailyProductionExecutiveView } from "@/hooks/ReactQuery/useDailyProduction";
import { useProjectStore } from "@/store/projectStore";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DailyProductionTracking = () => {
  const { selectedProject } = useProjectStore();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  // Set default date range (e.g., current month)
  useEffect(() => {
    if (!dateRange) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      setDateRange({ from: firstDayOfMonth, to: today });
    }
  }, [dateRange]);

  const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  const { data: productionResponse, isLoading } = useDailyProductionExecutiveView({
    projectId: selectedProject?.id || "",
    startDate,
    endDate,
    enabled: !!selectedProject?.id && !!startDate && !!endDate,
  });

  const handleDateRangeChange = (range: DateRange | null) => {
    setDateRange(range);
  };

  const handleUpdateActual = async (
    activityId: string,
    crewName: string,
    date: string,
    value: number
  ) => {
    try {
      // TODO: Implement update API call when table view is ready
      console.log("Update actual:", { activityId, crewName, date, value });
    } catch (error) {
      console.error("Error updating actual production:", error);
    }
  };

  // Transform API data for charts
  const activities = productionResponse?.data?.activities || [];
  const activityChartData = transformApiDataToActivityChart(activities);
  const crewChartData = selectedActivity
    ? transformApiDataToCrewChart(selectedActivity, activities)
    : [];
  const selectedActivityName = selectedActivity
    ? getActivityNameById(selectedActivity, activities)
    : "";

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
        <div className="flex gap-2">
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        </div>
      </div>

      {/* Summary Cards */}
      {productionResponse?.data?.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Forecasted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {productionResponse.data.summary.totalForecasted.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {productionResponse.data.summary.activitiesCount} activities
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
                {productionResponse.data.summary.totalActual.toLocaleString()}
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
                  productionResponse.data.summary.totalVariance >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {productionResponse.data.summary.totalVariance >= 0 ? "+" : ""}
                {productionResponse.data.summary.totalVariance.toLocaleString()}
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
                {productionResponse.data.summary.variancePercentage >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <div
                  className={`text-2xl font-bold ${
                    productionResponse.data.summary.variancePercentage >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {productionResponse.data.summary.variancePercentage >= 0
                    ? "+"
                    : ""}
                  {productionResponse.data.summary.variancePercentage.toFixed(1)}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Performance indicator
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs
        value={viewMode}
        onValueChange={(v) => setViewMode(v as "chart" | "table")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">
            <BarChart3 className="h-4 w-4 mr-2" />
            Executive View
          </TabsTrigger>
          <TabsTrigger value="table">
            <Table className="h-4 w-4 mr-2" />
            Detailed Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-6 mt-6">
          {isLoading ? (
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
                  No production data available for the selected date range
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try selecting a different date range or ensure activities are logged
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

        <TabsContent value="table" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Loading production data...</p>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Table view will be implemented with detailed daily breakdown
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyProductionTracking;
