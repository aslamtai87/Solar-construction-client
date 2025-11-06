"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Table } from "lucide-react";
import { useState, useEffect } from "react";
import { DateRangePicker } from "@/components/global/DateRangePicker";
import { ActivityProduction, DateRange } from "./types";
import { getActivityChartData, getCrewChartData } from "./utils";
import { ActivityChartView } from "./ActivityChartView";
import { CrewChartView } from "./CrewChartView";
import { ProductionTableView } from "./ProductionTableView";
import { getMockProductionData, updateActualProduction } from "./mockData";

export const DailyProductionTracking = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [productionData, setProductionData] = useState<ActivityProduction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadProductionData();
  }, [dateRange]);

  const loadProductionData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call using dateRange
      const data = getMockProductionData();
      setProductionData(data);
    } catch (error) {
      console.error("Error loading production data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      await updateActualProduction(activityId, crewName, date, value);
      // Reload data after update
      await loadProductionData();
    } catch (error) {
      console.error("Error updating actual production:", error);
    }
  };

  // Calculate chart data
  const activityChartData = getActivityChartData(productionData);
  const crewChartData = selectedActivity
    ? getCrewChartData(productionData, selectedActivity)
    : [];
  const selectedActivityData = productionData.find(
    (a) => a.activityId === selectedActivity
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
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
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : selectedActivity ? (
            <CrewChartView
              activityName={selectedActivityData?.activityName || ""}
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
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <ProductionTableView
              productionData={productionData}
              onUpdateActual={handleUpdateActual}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyProductionTracking;
