"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractorLabourerManagement } from "./ContractorLabourerManagement";
import { EnhancedEquipmentLog } from "./EnhancedEquipmentLog";
import { EnhancedActivityLog } from "./EnhancedActivityLog";
import { WeatherLocationDisplay } from "./WeatherLocationDisplay";
import { format } from "date-fns";
import type { DailyConditions } from "@/lib/services/weatherLocation";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUpdateProductionLog, useProductionLogId } from "@/hooks/ReactQuery/useProductionLog";
import { useProjectStore } from "@/store/projectStore";
import { toast } from "sonner";

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
  onSaveEquipmentLogs: (logs: Omit<EquipmentLogRow, 'tempId' | 'equipmentName'>[]) => void;
  onAddActivityLog: (log: Omit<ActivityLogEntry, 'id' | 'activityName' | 'totalForecasted' | 'totalActual' | 'variance' | 'variancePercentage'>) => void;
  onUpdateActivityLog: (id: string, log: Partial<ActivityLogEntry>) => void;
  onDeleteActivityLog: (id: string) => void;
}

export const TodayDetailPage: React.FC<TodayDetailPageProps> = ({
  selectedDate,
  userRole,
  equipmentLogs,
  activityLogs,
  equipment,
  operators,
  activities,
  productionConfigs,
  weatherData,
  onBack,
  onSaveEquipmentLogs,
  onAddActivityLog,
  onUpdateActivityLog,
  onDeleteActivityLog,
}) => {
  const isToday = format(new Date(), "yyyy-MM-dd") === selectedDate;
  const dateDisplay = isToday ? "Today" : 
  format(new Date(selectedDate), "MMMM dd, yyyy");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedProject } = useProjectStore();
  
  // Get current tab from URL params or default to 'labour'
  const currentTab = searchParams.get('tab') || 'labour';
  
  const productionLogQuery = useProductionLogId(
    selectedProject?.id || "",
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  
  const { mutate: updateProductionLog } = useUpdateProductionLog();
  
  // State to store displayed weather data (from production log or live data)
  const [displayWeather, setDisplayWeather] = useState<DailyConditions | null>(null);
  
  // Check if production log already has weather data
  useEffect(() => {
    if (productionLogQuery.data?.data) {
      const productionLog = productionLogQuery.data.data;
      
      // If production log has weather data, use it
      if (productionLog.weatherCondition && productionLog.temperature) {
        setDisplayWeather({
          weather: {
            condition: productionLog.weatherCondition,
            temperature: productionLog.temperature,
            humidity: productionLog.humidity || 0,
            windSpeed: productionLog.windSpeed || 0,
            icon: getWeatherIcon(productionLog.weatherCondition),
          },
          location: {
            latitude: 0,
            longitude: 0,
            address: productionLog.location || undefined,
          },
          timestamp: productionLog.updatedAt,
        });
      } else if (weatherData) {
        // If no weather data in production log, use live weather data
        setDisplayWeather(weatherData);
      }
    }
  }, [productionLogQuery.data, weatherData]);
  
  // Auto-save weather data only if not already present in production log
  useEffect(() => {
    if (weatherData && productionLogQuery.data?.data && userRole === "contractor") {
      const productionLog = productionLogQuery.data.data;
      
      // Only save if weather data doesn't exist yet
      if (!productionLog.weatherCondition && !productionLog.temperature) {
        updateProductionLog({
          id: productionLog.id,
          data: {
            weatherCondition: weatherData.weather.condition,
            temperature: weatherData.weather.temperature,
            humidity: weatherData.weather.humidity,
            windSpeed: weatherData.weather.windSpeed,
            location: weatherData.location.address || 
              `${weatherData.location.latitude.toFixed(4)}, ${weatherData.location.longitude.toFixed(4)}`,
            notes: productionLog.notes || "",
          },
        });
      }
    }
  }, [weatherData, productionLogQuery.data?.data, userRole, updateProductionLog]);
  
  const handleWeatherUpdate = (data: {
    weatherCondition: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    location: string;
  }) => {
    if (!productionLogQuery.data?.data.id) {
      toast.error("Production log not found");
      return;
    }
    
    updateProductionLog({
      id: productionLogQuery.data.data.id,
      data: {
        ...data,
        notes: productionLogQuery.data.data.notes || "",
      },
    });
  };
  
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`?${params.toString()}`);
  };
  
  // Helper function to get weather icon from condition string
  const getWeatherIcon = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('storm')) return '⛈️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="space-y-4">
      <div>
        <Button onClick={onBack}>
          Back
        </Button>
      </div>
      {/* Weather and Location (for contractor) */}
      {userRole === "contractor" && displayWeather && (
        <WeatherLocationDisplay
          weather={displayWeather.weather}
          location={displayWeather.location}
          onSave={handleWeatherUpdate}
          isEditable={true}
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
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="labour" className="text-sm">Labour Logs</TabsTrigger>
            <TabsTrigger value="equipment" className="text-sm">Equipment Logs</TabsTrigger>
            <TabsTrigger value="activities" className="text-sm">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="labour" className="space-y-4 mt-4">
            <ContractorLabourerManagement/>
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
