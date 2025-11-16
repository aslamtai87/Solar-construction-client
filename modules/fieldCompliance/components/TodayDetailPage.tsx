"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractorLabourerManagement } from "./ContractorLabourerManagement";
import { EnhancedEquipmentLog } from "./EnhancedEquipmentLog";
import { EnhancedActivityLog } from "./EnhancedActivityLog";
import { WeatherLocationDisplay } from "./WeatherLocationDisplay";
import { format } from "date-fns";
import type { DailyConditions } from "@/lib/services/weatherLocation";
import { getDailyConditions } from "@/lib/services/weatherLocation";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUpdateProductionLog, useProductionLogId } from "@/hooks/ReactQuery/useProductionLog";
import { useProjectStore } from "@/store/projectStore";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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


interface TodayDetailPageProps {
  selectedDate: string;
  userRole: "labourer" | "contractor";
  onBack: () => void;
}

export const TodayDetailPage: React.FC<TodayDetailPageProps> = ({
  selectedDate,
  userRole,
  onBack,
}) => {
  const isToday = format(new Date(), "yyyy-MM-dd") === selectedDate;
  const dateDisplay = isToday ? "Today" : 
  format(new Date(selectedDate), "MMMM dd, yyyy");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedProject } = useProjectStore();
  
  const [displayWeather, setDisplayWeather] = useState<DailyConditions | null>(null);
  const [currentTab, setCurrentTab] = useState(searchParams.get('detailTab') || 'labour');
  
  const productionLogQuery = useProductionLogId(
    selectedProject?.id || "",
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  
  const productionLog = productionLogQuery.data?.data;
  const { mutate: updateProductionLog } = useUpdateProductionLog();

  // Sync tab with URL params
  useEffect(() => {
    const detailTabParam = searchParams.get('detailTab');
    if (detailTabParam && ['labour', 'equipment', 'activities'].includes(detailTabParam)) {
      setCurrentTab(detailTabParam);
    }
  }, [searchParams]);

  // Handle tab change with URL params
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('detailTab', value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Helper function to get weather icon
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return '☀️';
    if (lowerCondition.includes('cloud')) return '☁️';
    if (lowerCondition.includes('rain')) return '🌧️';
    if (lowerCondition.includes('snow')) return '❄️';
    if (lowerCondition.includes('storm')) return '⛈️';
    return '🌤️';
  };
  
  // Check if production log has weather data, if yes use it, otherwise fetch live
  useEffect(() => {
    const fetchWeather = async () => {
      if (productionLog) {
        // If production log has weather, use that
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
              address: productionLog.location || "",
              latitude: 0,
              longitude: 0,
            },
            timestamp: new Date().toISOString(),
          });
        } else {
          // Otherwise fetch live weather
          try {
            const liveWeather = await getDailyConditions();
            setDisplayWeather(liveWeather);
          } catch (error) {
            console.error("Failed to fetch weather:", error);
          }
        }
      }
    };
    
    fetchWeather();
  }, [productionLog]);
  
  // Auto-save weather data only if it doesn't exist in production log
  useEffect(() => {
    if (displayWeather && productionLog?.id && userRole === "contractor") {
      // Only save if weather data doesn't exist yet
      if (!productionLog.weatherCondition && !productionLog.temperature) {
        updateProductionLog({
          id: productionLog.id,
          data: {
            weatherCondition: displayWeather.weather.condition,
            temperature: displayWeather.weather.temperature,
            humidity: displayWeather.weather.humidity,
            windSpeed: displayWeather.weather.windSpeed,
            location: displayWeather.location.address || 
              `${displayWeather.location.latitude.toFixed(4)}, ${displayWeather.location.longitude.toFixed(4)}`,
            notes: productionLog.notes || "",
          },
        });
      }
    }
  }, [displayWeather, productionLog?.id, productionLog?.weatherCondition, productionLog?.temperature, userRole, updateProductionLog]);
  
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
    }, {
      onSuccess: () => {
        toast.success("Weather updated successfully");
        // Update display weather as well
        setDisplayWeather(prev => prev ? {
          ...prev,
          weather: {
            ...prev.weather,
            condition: data.weatherCondition,
            temperature: data.temperature,
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            icon: getWeatherIcon(data.weatherCondition),
          },
          location: {
            ...prev.location,
            address: data.location,
          },
        } : null);
      },
      onError: () => {
        toast.error("Failed to update weather");
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-xl font-semibold">
          Production Log - {dateDisplay}
        </h2>
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
            <EnhancedEquipmentLog/>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4 mt-4">
            <EnhancedActivityLog />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
