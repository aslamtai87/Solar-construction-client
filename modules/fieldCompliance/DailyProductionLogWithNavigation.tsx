"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { LabourerTimeHistory } from "./components/LabourerTimeHistory";
import { ContractorLogsHistory } from "./components/ContractorLogsHistory";
import { TodayDetailPage } from "./components/TodayDetailPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DailyConditions } from "@/lib/services/weatherLocation";

// Types matching component interfaces

interface LabourerTimeLog {
  id: string;
  labourerId: string;
  labourerName: string;
  labourerType?: string;
  entryTime: string;
  exitTime: string;
  totalHours?: number;
}

interface EquipmentLogRow {
  tempId: string;
  equipmentId: string;
  equipmentName: string;
  operator: string;
  operatorId?: string;
  quantity: number;
}

interface ActivityLogEntry {
  id: string;
  activityId: string;
  activityName: string;
  crews: {
    crewId: string;
    crewName: string;
    forecastedUnits: number;
    actualUnits: number;
  }[];
  totalForecasted: number;
  totalActual: number;
  variance: number;
  variancePercentage: number;
  notes?: string;
}

interface DailyLogSummary {
  date: string;
  labourerCount: number;
  equipmentCount: number;
  activityCount: number;
  weatherSummary?: string;
  temperature?: number;
  isComplete: boolean;
}

export const DailyProductionLogWithNavigation: React.FC = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
  const twoDaysAgo = format(new Date(Date.now() - 172800000), "yyyy-MM-dd");

  // Navigation state
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"labourer" | "contractor">(
    "labourer"
  );

  // User context
  const currentUserId = "user-001";
  const currentUserName = "John Smith";
  const userRole: "labourer" | "contractor" = activeTab; // Simulating different roles per tab

  // Weather and Location
  const [weatherData, setWeatherData] = useState<DailyConditions | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Fake data - Labourer time logs (for contractor's view of all labourers)
  const [labourerLogs, setLabourerLogs] = useState<LabourerTimeLog[]>([
    {
      id: "lab-log-001",
      labourerId: "user-002",
      labourerName: "Mike Johnson",
      labourerType: "Electrician",
      entryTime: "07:30",
      exitTime: "16:00",
      totalHours: 8.5,
    },
    {
      id: "lab-log-002",
      labourerId: "user-003",
      labourerType: "Welder",
      labourerName: "Sarah Williams",
      entryTime: "08:00",
      exitTime: "17:00",
      totalHours: 9,
    },
  ]);

  // Fake labourers list
  const labourers = [
    { value: "user-002", label: "Mike Johnson" },
    { value: "user-003", label: "Sarah Williams" },
    { value: "user-004", label: "Tom Brown" },
    { value: "user-005", label: "Emma Davis" },
  ];

  // Fake data - Equipment logs
  const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLogRow[]>([
    {
      tempId: "eq-log-001",
      equipmentId: "eq-1",
      equipmentName: "Excavator",
      operator: "Mike Johnson",
      operatorId: "user-002",
      quantity: 2,
    },
  ]);

  // Fake data - Activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([
    {
      id: "act-log-001",
      activityId: "act-1",
      activityName: "Foundation Work",
      crews: [
        {
          crewId: "crew-1",
          crewName: "Crew A",
          forecastedUnits: 50,
          actualUnits: 55,
        },
        {
          crewId: "crew-2",
          crewName: "Crew B",
          forecastedUnits: 50,
          actualUnits: 48,
        },
      ],
      totalForecasted: 100,
      totalActual: 103,
      variance: 3,
      variancePercentage: 3,
      notes: "Great progress today",
    },
  ]);

  // Fake master data
  const equipment = [
    { id: "eq-1", name: "Excavator", price: 500, pricingPeriod: "per-day" },
    { id: "eq-2", name: "Crane", price: 800, pricingPeriod: "per-day" },
    { id: "eq-3", name: "Forklift", price: 200, pricingPeriod: "per-day" },
    { id: "eq-4", name: "Generator", price: 150, pricingPeriod: "per-day" },
  ];

  const operators = [
    { value: "user-002", label: "Mike Johnson" },
    { value: "user-003", label: "Sarah Williams" },
    { value: "user-004", label: "Tom Brown" },
  ];

  const activities = [
    { id: "act-1", name: "Foundation Work", targetUnits: 100 },
    { id: "act-2", name: "Panel Installation", targetUnits: 200 },
    { id: "act-3", name: "Wiring", targetUnits: 150 },
  ];

  const productionConfigs = [
    {
      activityId: "act-1",
      crews: [
        { id: "crew-1", name: "Crew A", forecastedUnits: 50 },
        { id: "crew-2", name: "Crew B", forecastedUnits: 50 },
      ],
    },
    {
      activityId: "act-2",
      crews: [
        { id: "crew-1", name: "Crew A", forecastedUnits: 70 },
        { id: "crew-2", name: "Crew B", forecastedUnits: 70 },
        { id: "crew-3", name: "Crew C", forecastedUnits: 60 },
      ],
    },
    {
      activityId: "act-3",
      crews: [{ id: "crew-1", name: "Crew A", forecastedUnits: 150 }],
    },
  ];

  // Handlers
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedDate(null);
  };

  const handleSaveEquipmentLogs = (
    logs: Omit<EquipmentLogRow, "tempId" | "equipmentName">[]
  ) => {
    const newLogs = logs.map((log) => {
      const eq = equipment.find((e) => e.id === log.equipmentId);
      return {
        tempId: `eq-log-${Date.now()}-${Math.random()}`,
        equipmentId: log.equipmentId,
        equipmentName: eq?.name || "",
        operator: log.operator,
        operatorId: log.operatorId,
        quantity: log.quantity,
      };
    });
    setEquipmentLogs([...equipmentLogs, ...newLogs]);
  };

  const handleAddActivityLog = (
    logData: Omit<
      ActivityLogEntry,
      | "id"
      | "activityName"
      | "totalForecasted"
      | "totalActual"
      | "variance"
      | "variancePercentage"
    >
  ) => {
    const activity = activities.find((a) => a.id === logData.activityId);
    const totalForecasted = logData.crews.reduce(
      (sum, c) => sum + c.forecastedUnits,
      0
    );
    const totalActual = logData.crews.reduce(
      (sum, c) => sum + c.actualUnits,
      0
    );
    const variance = totalActual - totalForecasted;
    const variancePercentage =
      totalForecasted > 0 ? (variance / totalForecasted) * 100 : 0;

    const newLog: ActivityLogEntry = {
      id: `act-log-${Date.now()}`,
      activityId: logData.activityId,
      activityName: activity?.name || "",
      crews: logData.crews,
      totalForecasted,
      totalActual,
      variance,
      variancePercentage,
      notes: logData.notes,
    };

    setActivityLogs([...activityLogs, newLog]);
  };

  const handleUpdateActivityLog = (
    id: string,
    logData: Partial<ActivityLogEntry>
  ) => {
    setActivityLogs(
      activityLogs.map((log) => {
        if (log.id === id && logData.crews) {
          const totalForecasted = logData.crews.reduce(
            (sum, c) => sum + c.forecastedUnits,
            0
          );
          const totalActual = logData.crews.reduce(
            (sum, c) => sum + c.actualUnits,
            0
          );
          const variance = totalActual - totalForecasted;
          const variancePercentage =
            totalForecasted > 0 ? (variance / totalForecasted) * 100 : 0;

          return {
            ...log,
            ...logData,
            totalForecasted,
            totalActual,
            variance,
            variancePercentage,
          };
        }
        return log;
      })
    );
  };

  const handleDeleteActivityLog = (id: string) => {
    setActivityLogs(activityLogs.filter((log) => log.id !== id));
  };

  return (
    <div className="space-y-4 p-6">
      {/* show navigation url to return to list */}

      {viewMode === "list" ? (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "labourer" | "contractor")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="labourer" className="text-sm">
              My Time Logs
            </TabsTrigger>
            <TabsTrigger value="contractor" className="text-sm">
              Production Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="labourer" className="space-y-4 mt-4">
            <LabourerTimeHistory />
          </TabsContent>

          <TabsContent value="contractor" className="space-y-4 mt-4">
            <ContractorLogsHistory
              onSelectDate={handleSelectDate}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <TodayDetailPage
          selectedDate={selectedDate!}
          userRole={userRole}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          labourerLogs={labourerLogs}
          labourers={labourers}
          equipmentLogs={equipmentLogs}
          activityLogs={activityLogs}
          equipment={equipment}
          operators={operators}
          activities={activities}
          productionConfigs={productionConfigs}
          weatherData={weatherData}
          onBack={handleBack}
          onSaveEquipmentLogs={handleSaveEquipmentLogs}
          onAddActivityLog={handleAddActivityLog}
          onUpdateActivityLog={handleUpdateActivityLog}
          onDeleteActivityLog={handleDeleteActivityLog}
        />
      )}
    </div>
  );
};
