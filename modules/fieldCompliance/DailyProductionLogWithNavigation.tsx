"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { LabourerTimeHistory } from "./components/LabourerTimeHistory";
import { ContractorLogsHistory } from "./components/ContractorLogsHistory";
import { TodayDetailPage } from "./components/TodayDetailPage";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFakeWeatherData, getFakeLocationData, getDailyConditions } from "@/lib/services/weatherLocation";
import type { DailyConditions } from "@/lib/services/weatherLocation";

// Types matching component interfaces
interface TimeLog {
  id: string;
  date: string;
  entryTime: string;
  exitTime?: string;
  totalHours?: number;
  loggedByRole: "labourer" | "contractor";
}

interface LabourerTimeLog {
  id: string;
  labourerId: string;
  labourerName: string;
  labourerType?: string;
  entryTime: string;
  exitTime?: string;
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
  const [activeTab, setActiveTab] = useState<"labourer" | "contractor">("labourer");
  
  // User context
  const currentUserId = "user-001";
  const currentUserName = "John Smith";
  const userRole: "labourer" | "contractor" = activeTab; // Simulating different roles per tab
  
  // Weather and Location
  const [weatherData, setWeatherData] = useState<DailyConditions | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Fake data - Time logs for labourer's own view
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([
    {
      id: "log-001",
      date: twoDaysAgo,
      entryTime: "07:30",
      exitTime: "16:00",
      totalHours: 8.5,
      loggedByRole: "labourer",
    },
    {
      id: "log-002",
      date: yesterday,
      entryTime: "08:00",
      exitTime: "17:00",
      totalHours: 9,
      loggedByRole: "labourer",
    },
  ]);

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
        { crewId: "crew-1", crewName: "Crew A", forecastedUnits: 50, actualUnits: 55 },
        { crewId: "crew-2", crewName: "Crew B", forecastedUnits: 50, actualUnits: 48 },
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
      crews: [
        { id: "crew-1", name: "Crew A", forecastedUnits: 150 },
      ],
    },
  ];

  // Generate contractor daily summaries
  const dailySummaries: DailyLogSummary[] = [
    {
      date: twoDaysAgo,
      labourerCount: 2,
      equipmentCount: 3,
      activityCount: 2,
      weatherSummary: "Sunny",
      temperature: 24,
      isComplete: true,
    },
    {
      date: yesterday,
      labourerCount: 3,
      equipmentCount: 2,
      activityCount: 1,
      weatherSummary: "Partly Cloudy",
      temperature: 22,
      isComplete: true,
    },
    {
      date: today,
      labourerCount: 1,
      equipmentCount: equipmentLogs.length,
      activityCount: activityLogs.length,
      weatherSummary: weatherData?.weather.condition || "Loading...",
      temperature: weatherData?.weather.temperature,
      isComplete: false,
    },
  ];

  // Fetch weather when in contractor mode
  useEffect(() => {
    const fetchWeatherLocation = async () => {
      setLoadingWeather(true);
      try {
        const conditions = await getDailyConditions();
        setWeatherData(conditions);
      } catch {
        setWeatherData({
          weather: getFakeWeatherData(),
          location: getFakeLocationData(),
          timestamp: new Date().toISOString(),
        });
      } finally {
        setLoadingWeather(false);
      }
    };

    if (activeTab === "contractor" && viewMode === "detail") {
      fetchWeatherLocation();
    }
  }, [activeTab, viewMode]);

  // Handlers
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedDate(null);
  };

  // Handlers for labourer's time log
  const handleLabourerLogTime = (date: string, entryTime: string, exitTime?: string) => {
    const existingLog = timeLogs.find(log => log.date === date);

    if (existingLog) {
      // Calculate total hours if both times provided
      let totalHours: number | undefined = undefined;
      if (exitTime) {
        const [entryHour, entryMinute] = entryTime.split(":").map(Number);
        const [exitHour, exitMinute] = exitTime.split(":").map(Number);
        const totalMinutes = (exitHour * 60 + exitMinute) - (entryHour * 60 + entryMinute);
        totalHours = totalMinutes / 60;
      }

      setTimeLogs(timeLogs.map(log =>
        log.id === existingLog.id
          ? { ...log, entryTime, exitTime, totalHours }
          : log
      ));
    } else {
      const newLog: TimeLog = {
        id: `log-${Date.now()}`,
        date,
        entryTime,
        exitTime,
        loggedByRole: "labourer",
      };
      setTimeLogs([...timeLogs, newLog]);
    }
  };

  // Handlers for contractor managing all labourers
  const handleAddLabourerLog = (log: Omit<LabourerTimeLog, "id" | "totalHours">) => {
    // Calculate total hours if both times provided
    let totalHours: number | undefined = undefined;
    if (log.exitTime) {
      const [entryHour, entryMinute] = log.entryTime.split(":").map(Number);
      const [exitHour, exitMinute] = log.exitTime.split(":").map(Number);
      const totalMinutes = (exitHour * 60 + exitMinute) - (entryHour * 60 + entryMinute);
      totalHours = totalMinutes / 60;
    }

    const newLog: LabourerTimeLog = {
      ...log,
      id: `lab-log-${Date.now()}`,
      totalHours,
    };
    setLabourerLogs([...labourerLogs, newLog]);
  };

  const handleUpdateLabourerLog = (id: string, updates: Partial<LabourerTimeLog>) => {
    setLabourerLogs(labourerLogs.map(log => {
      if (log.id === id) {
        const updated = { ...log, ...updates };
        // Recalculate total hours if both times exist
        if (updated.entryTime && updated.exitTime) {
          const [entryHour, entryMinute] = updated.entryTime.split(":").map(Number);
          const [exitHour, exitMinute] = updated.exitTime.split(":").map(Number);
          const totalMinutes = (exitHour * 60 + exitMinute) - (entryHour * 60 + entryMinute);
          updated.totalHours = totalMinutes / 60;
        }
        return updated;
      }
      return log;
    }));
  };

  const handleDeleteLabourerLog = (id: string) => {
    setLabourerLogs(labourerLogs.filter(log => log.id !== id));
  };

  const handleSaveEquipmentLogs = (logs: Omit<EquipmentLogRow, 'tempId' | 'equipmentName'>[]) => {
    const newLogs = logs.map(log => {
      const eq = equipment.find(e => e.id === log.equipmentId);
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

  const handleAddActivityLog = (logData: Omit<ActivityLogEntry, 'id' | 'activityName' | 'totalForecasted' | 'totalActual' | 'variance' | 'variancePercentage'>) => {
    const activity = activities.find(a => a.id === logData.activityId);
    const totalForecasted = logData.crews.reduce((sum, c) => sum + c.forecastedUnits, 0);
    const totalActual = logData.crews.reduce((sum, c) => sum + c.actualUnits, 0);
    const variance = totalActual - totalForecasted;
    const variancePercentage = totalForecasted > 0 ? (variance / totalForecasted) * 100 : 0;

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

  const handleUpdateActivityLog = (id: string, logData: Partial<ActivityLogEntry>) => {
    setActivityLogs(activityLogs.map(log => {
      if (log.id === id && logData.crews) {
        const totalForecasted = logData.crews.reduce((sum, c) => sum + c.forecastedUnits, 0);
        const totalActual = logData.crews.reduce((sum, c) => sum + c.actualUnits, 0);
        const variance = totalActual - totalForecasted;
        const variancePercentage = totalForecasted > 0 ? (variance / totalForecasted) * 100 : 0;

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
    }));
  };

  const handleDeleteActivityLog = (id: string) => {
    setActivityLogs(activityLogs.filter(log => log.id !== id));
  };

  // Get today's time log for detail view (not used in current flow)
  const todayTimeLog = timeLogs.find(log => log.date === selectedDate);

  return (
    <div className="space-y-4 p-6">
        {/* show navigation url to return to list */}


      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Daily Production Logging</CardTitle>
          <CardDescription className="text-sm">
            {viewMode === "list"
              ? "View and manage production logs"
              : `Logging for ${selectedDate === today ? "Today" : format(new Date(selectedDate!), "MMMM dd, yyyy")}`}
          </CardDescription>
        </CardHeader>
      </Card>

      {viewMode === "list" ? (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "labourer" | "contractor")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="labourer" className="text-sm">My Time Logs</TabsTrigger>
            <TabsTrigger value="contractor" className="text-sm">Production Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="labourer" className="space-y-4 mt-4">
            <LabourerTimeHistory
              logs={timeLogs}
              currentUserName={currentUserName}
              onLogTime={handleLabourerLogTime}
            />
          </TabsContent>

          <TabsContent value="contractor" className="space-y-4 mt-4">
            <ContractorLogsHistory
              logs={dailySummaries}
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
          onAddLabourerLog={handleAddLabourerLog}
          onUpdateLabourerLog={handleUpdateLabourerLog}
          onDeleteLabourerLog={handleDeleteLabourerLog}
          onSaveEquipmentLogs={handleSaveEquipmentLogs}
          onAddActivityLog={handleAddActivityLog}
          onUpdateActivityLog={handleUpdateActivityLog}
          onDeleteActivityLog={handleDeleteActivityLog}
        />
      )}
    </div>
  );
};
