"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabourerTimeEntryDialog } from "./LabourerTimeEntryDialog";
import { ContractorLabourerManagement } from "./ContractorLabourerManagement";
import { EnhancedEquipmentLog } from "./EnhancedEquipmentLog";
import { EnhancedActivityLog } from "./EnhancedActivityLog";
import { WeatherLocationDisplay } from "./WeatherLocationDisplay";
import { format } from "date-fns";
import type { DailyConditions } from "@/lib/services/weatherLocation";

interface Equipment {
  id: string;
  name: string;
  price: number;
  pricingPeriod: string;
}

interface Operator {
  value: string;
  label: string;
}

interface ActivityData {
  id: string;
  name: string;
  targetUnits: number;
}

interface ProductionConfig {
  activityId: string;
  crews: {
    id: string;
    name: string;
    forecastedUnits: number;
  }[];
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

interface LabourerTimeLog {
  id: string;
  labourerId: string;
  labourerName: string;
  labourerType?: string;
  entryTime: string;
  exitTime: string;
}

interface LabourerOption {
  value: string;
  label: string;
}

interface TodayDetailPageProps {
  selectedDate: string;
  userRole: "labourer" | "contractor";
  currentUserId: string;
  currentUserName: string;
  
  // Data
  labourerLogs: LabourerTimeLog[];
  labourers: LabourerOption[];
  equipmentLogs: EquipmentLogRow[];
  activityLogs: ActivityLogEntry[];
  equipment: Equipment[];
  operators: Operator[];
  activities: ActivityData[];
  productionConfigs: ProductionConfig[];
  weatherData: DailyConditions | null;
  
  // Handlers
  onBack: () => void;
  onAddLabourerLog: (log: Omit<LabourerTimeLog, "id" | "totalHours">) => void;
  onUpdateLabourerLog: (id: string, log: Partial<LabourerTimeLog>) => void;
  onDeleteLabourerLog: (id: string) => void;
  onSaveEquipmentLogs: (logs: Omit<EquipmentLogRow, 'tempId' | 'equipmentName'>[]) => void;
  onAddActivityLog: (log: Omit<ActivityLogEntry, 'id' | 'activityName' | 'totalForecasted' | 'totalActual' | 'variance' | 'variancePercentage'>) => void;
  onUpdateActivityLog: (id: string, log: Partial<ActivityLogEntry>) => void;
  onDeleteActivityLog: (id: string) => void;
}

export const TodayDetailPage: React.FC<TodayDetailPageProps> = ({
  selectedDate,
  userRole,
  currentUserId,
  currentUserName,
  labourerLogs,
  labourers,
  equipmentLogs,
  activityLogs,
  equipment,
  operators,
  activities,
  productionConfigs,
  weatherData,
  onBack,
  onAddLabourerLog,
  onUpdateLabourerLog,
  onDeleteLabourerLog,
  onSaveEquipmentLogs,
  onAddActivityLog,
  onUpdateActivityLog,
  onDeleteActivityLog,
}) => {
  const isToday = format(new Date(), "yyyy-MM-dd") === selectedDate;
  const dateDisplay = isToday ? "Today" : format(new Date(selectedDate), "MMMM dd, yyyy");

  return (
    <div className="space-y-4">
      {/* Weather and Location (for contractor) */}
      {userRole === "contractor" && weatherData && (
        <WeatherLocationDisplay
          weather={weatherData.weather}
          location={weatherData.location}
        />
      )}

      {/* Labourer View - Not used in current flow, kept for compatibility */}
      {userRole === "labourer" && (
        <div className="text-center text-muted-foreground py-8 text-sm">
          Please use the time log dialog from the history page.
        </div>
      )}

      {/* Contractor View */}
      {userRole === "contractor" && (
        <Tabs defaultValue="labour" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="labour" className="text-sm">Labour Logs</TabsTrigger>
            <TabsTrigger value="equipment" className="text-sm">Equipment Logs</TabsTrigger>
            <TabsTrigger value="activities" className="text-sm">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="labour" className="space-y-4 mt-4">
            <ContractorLabourerManagement
              date={selectedDate}
              logs={labourerLogs}
              labourers={labourers}
              onAddLog={onAddLabourerLog}
              onUpdateLog={onUpdateLabourerLog}
              onDeleteLog={onDeleteLabourerLog}
            />
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4 mt-4">
            <EnhancedEquipmentLog
              equipment={equipment}
              operators={operators}
              existingLogs={equipmentLogs}
              onSave={onSaveEquipmentLogs}
            />
          </TabsContent>

          <TabsContent value="activities" className="space-y-4 mt-4">
            <EnhancedActivityLog
              activities={activities}
              productionConfigs={productionConfigs}
              existingLogs={activityLogs}
              onAddLog={onAddActivityLog}
              onUpdateLog={onUpdateActivityLog}
              onDeleteLog={onDeleteActivityLog}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
