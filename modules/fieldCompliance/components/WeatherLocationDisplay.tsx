"use client";

import React from "react";
import { Cloud, MapPin, Droplets, Wind, Thermometer } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface WeatherLocationDisplayProps {
  weather: {
    condition: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
  };
}

export const WeatherLocationDisplay: React.FC<WeatherLocationDisplayProps> = ({
  weather,
  location,
}) => {
  return (
    <div className="border-b bg-muted/30 px-4 py-3">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        {/* Weather Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl leading-none">{weather.icon}</span>
            <div>
              <p className="text-sm font-medium leading-tight">{weather.condition}</p>
              <p className="text-xs text-muted-foreground">{weather.temperature}°F</p>
            </div>
          </div>
          
          <Separator orientation="vertical" className="h-10" />
          
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{weather.temperature}°F</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{weather.windSpeed} mph</span>
            </div>
          </div>
        </div>

        <Separator orientation="vertical" className="h-10 hidden md:block" />

        {/* Location Section */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="min-w-0 flex-1">
            {location.address ? (
              <p className="text-sm font-medium truncate">{location.address}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
