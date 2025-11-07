"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Briefcase, Users, FileText } from "lucide-react";
import { InteractiveTimeEntry } from "./components/InteractiveTimeEntry";
import { EnhancedEquipmentLog } from "./components/EnhancedEquipmentLog";
import { EnhancedActivityLog } from "./components/EnhancedActivityLog";
import { WeatherLocationDisplay } from "./components/WeatherLocationDisplay";
import { format } from "date-fns";
import { getFakeWeatherData, getFakeLocationData, getDailyConditions } from "@/lib/services/weatherLocation";
import type { WeatherData, LocationData } from "@/lib/services/weatherLocation";

// Fake data interfaces
interface TimeLog {
  id: string;
  date: string;
  labourerId: string;
  labourerName: string;
  entryTime: string;
  exitTime?: string;
  totalHours?: number;
  loggedByRole: "labourer" | "contractor";
}

interface EquipmentLogEntry {
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

export const EnhancedDailyProductionLogPage: React.FC = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeTab, setActiveTab] = useState<"labourer" | "contractor">("contractor");
  
  // Weather and Location
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Fake current user data
  const currentUserId = "user-001";
  const currentUserName = "John Smith";

  // State for time logs
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([
    {
      id: "log-001",
      date: today,
      labourerId: "user-002",
      labourerName: "Mike Johnson",
      entryTime: "07:30",
      exitTime: "16:00",
      totalHours: 8.5,
      loggedByRole: "labourer",
    },
    {
      id: "log-002",
      date: today,
      labourerId: "user-003",
      labourerName: "Sarah Williams",
      entryTime: "08:00",
      totalHours: undefined,
      loggedByRole: "labourer",
    },
  ]);

  // State for equipment logs
  const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLogEntry[]>([
    {
      tempId: "eq-log-001",
      equipmentId: "eq-1",
      equipmentName: "Excavator",
      operator: "Mike Johnson",
      operatorId: "user-002",
      quantity: 2,
    },
    {
      tempId: "eq-log-002",
      equipmentId: "eq-2",
      equipmentName: "Crane",
      operator: "Custom Operator",
      quantity: 1,
    },
  ]);

  // State for activity logs
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
      notes: "Great progress today despite wind conditions",
    },
  ]);

  // Fake master data
  const fakeEquipment = [
    { id: "eq-1", name: "Excavator", price: 500, pricingPeriod: "per-day" },
    { id: "eq-2", name: "Crane", price: 800, pricingPeriod: "per-day" },
    { id: "eq-3", name: "Forklift", price: 200, pricingPeriod: "per-day" },
    { id: "eq-4", name: "Generator", price: 150, pricingPeriod: "per-day" },
  ];

  const fakeOperators = [
    { value: "user-002", label: "Mike Johnson" },
    { value: "user-003", label: "Sarah Williams" },
    { value: "user-004", label: "Tom Brown" },
  ];

  const fakeActivities = [
    { id: "act-1", name: "Foundation Work", targetUnits: 100 },
    { id: "act-2", name: "Panel Installation", targetUnits: 200 },
    { id: "act-3", name: "Wiring", targetUnits: 150 },
  ];

  const fakeProductionConfigs = [
    {
      activityId: "act-1",
      totalUnits: 100,
      crews: [
        { id: "crew-1", name: "Crew A" },
        { id: "crew-2", name: "Crew B" },
      ],
    },
    {
      activityId: "act-2",
      totalUnits: 200,
      crews: [
        { id: "crew-1", name: "Crew A" },
        { id: "crew-2", name: "Crew B" },
        { id: "crew-3", name: "Crew C" },
      ],
    },
    {
      activityId: "act-3",
      totalUnits: 150,
      crews: [
        { id: "crew-1", name: "Crew A" },
      ],
    },
  ];

  // Fetch weather and location
  useEffect(() => {
    const fetchWeatherLocation = async () => {
      setLoadingWeather(true);
      try {
        // Try to get real data, fallback to fake
        try {
          const conditions = await getDailyConditions();
          setWeather(conditions.weather);
          setLocation(conditions.location);
        } catch {
          // Use fake data if API fails or user denies location
          setWeather(getFakeWeatherData());
          setLocation(getFakeLocationData());
        }
      } finally {
        setLoadingWeather(false);
      }
    };

    if (activeTab === "contractor") {
      fetchWeatherLocation();
    }
  }, [activeTab]);

  // Time log handlers
  const handleLogTime = (type: "entry" | "exit", time: string) => {
    const existingLog = timeLogs.find(
      (log) => log.labourerId === currentUserId && log.date === selectedDate
    );

    if (type === "entry") {
      if (existingLog) {
        setTimeLogs(
          timeLogs.map((log) =>
            log.id === existingLog.id ? { ...log, entryTime: time } : log
          )
        );
      } else {
        const newLog: TimeLog = {
          id: `log-${Date.now()}`,
          date: selectedDate,
          labourerId: currentUserId,
          labourerName: currentUserName,
          entryTime: time,
          loggedByRole: "labourer",
        };
        setTimeLogs([...timeLogs, newLog]);
      }
    } else if (type === "exit" && existingLog) {
      const [entryHour, entryMinute] = existingLog.entryTime.split(":").map(Number);
      const [exitHour, exitMinute] = time.split(":").map(Number);
      const totalMinutes = (exitHour * 60 + exitMinute) - (entryHour * 60 + entryMinute);
      const totalHours = totalMinutes / 60;

      setTimeLogs(
        timeLogs.map((log) =>
          log.id === existingLog.id
            ? { ...log, exitTime: time, totalHours }
            : log
        )
      );
    }
  };

  // Equipment log handlers
  const handleSaveEquipmentLogs = (logs: any[]) => {
    const newLogs = logs.map((log) => {
      const equipment = fakeEquipment.find((eq) => eq.id === log.equipmentId);
      return {
        tempId: `eq-log-${Date.now()}-${Math.random()}`,
        equipmentId: log.equipmentId,
        equipmentName: equipment?.name || "",
        operator: log.operator,
        operatorId: log.operatorId,
        quantity: log.quantity,
      };
    });
    setEquipmentLogs([...equipmentLogs, ...newLogs]);
  };

  // Activity log handlers
  const handleAddActivityLog = (logData: any) => {
    const activity = fakeActivities.find((a) => a.id === logData.activityId);
    const totalForecasted = logData.crews.reduce((sum: number, c: any) => sum + c.forecastedUnits, 0);
    const totalActual = logData.crews.reduce((sum: number, c: any) => sum + c.actualUnits, 0);
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

  const handleUpdateActivityLog = (id: string, logData: any) => {
    setActivityLogs(
      activityLogs.map((log) => {
        if (log.id === id) {
          const totalForecasted = logData.crews.reduce((sum: number, c: any) => sum + c.forecastedUnits, 0);
          const totalActual = logData.crews.reduce((sum: number, c: any) => sum + c.actualUnits, 0);
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
      })
    );
  };

  const handleDeleteActivityLog = (id: string) => {
    setActivityLogs(activityLogs.filter((log) => log.id !== id));
  };

  const currentUserLog = timeLogs.find(
    (log) => log.labourerId === currentUserId && log.date === selectedDate
  );

  if( loadingWeather ) {
    return (
      <div className="text-center text-gray-500 py-6">Loading weather and location data...</div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Daily Production Log
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Track time, equipment, and production progress
          </p>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
          <Calendar className="h-5 w-5 text-gray-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={today}
            className="text-lg font-semibold border-none focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full max-w-md grid-cols-2 h-14">
          <TabsTrigger value="labourer" className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Labourer View
          </TabsTrigger>
          <TabsTrigger value="contractor" className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Contractor View
          </TabsTrigger>
        </TabsList>

        {/* Labourer Tab */}
        <TabsContent value="labourer" className="space-y-6 mt-8">
          <InteractiveTimeEntry
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            todayLog={currentUserLog}
            onLogTime={handleLogTime}
          />
        </TabsContent>

        {/* Contractor Tab */}
        <TabsContent value="contractor" className="space-y-8 mt-8">
          {/* Weather and Location */}
          {weather && location && !loadingWeather && (
            <WeatherLocationDisplay weather={weather} location={location} />
          )}

          {/* Equipment Log */}
          <EnhancedEquipmentLog
            equipment={fakeEquipment}
            operators={fakeOperators}
            existingLogs={equipmentLogs}
            onSave={handleSaveEquipmentLogs}
          />

          {/* Activity Log */}
          <EnhancedActivityLog
            activities={fakeActivities}
            productionConfigs={fakeProductionConfigs}
            existingLogs={activityLogs}
            onAddLog={handleAddActivityLog}
            onUpdateLog={handleUpdateActivityLog}
            onDeleteLog={handleDeleteActivityLog}
          />

          {/* Daily Summary */}
          <div className="p-6 bg-linear-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Daily Summary</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Labourers</p>
                <p className="text-3xl font-bold text-green-600">{timeLogs.length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Equipment Used</p>
                <p className="text-3xl font-bold text-orange-600">{equipmentLogs.length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Activities Logged</p>
                <p className="text-3xl font-bold text-purple-600">{activityLogs.length}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
