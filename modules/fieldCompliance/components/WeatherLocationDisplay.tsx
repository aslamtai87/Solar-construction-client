"use client";

import React, { useState } from "react";
import { Cloud, MapPin, Droplets, Wind, Thermometer, Edit2, Check, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  onSave?: (data: {
    weatherCondition: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    location: string;
  }) => void;
  isEditable?: boolean;
}

export const WeatherLocationDisplay: React.FC<WeatherLocationDisplayProps> = ({
  weather,
  location,
  onSave,
  isEditable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    condition: weather.condition,
    temperature: weather.temperature,
    humidity: weather.humidity,
    windSpeed: weather.windSpeed,
    location: location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      condition: weather.condition,
      temperature: weather.temperature,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      location: location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        weatherCondition: editData.condition,
        temperature: editData.temperature,
        humidity: editData.humidity,
        windSpeed: editData.windSpeed,
        location: editData.location,
      });
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Edit Weather & Location</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="condition" className="text-xs">Weather Condition</Label>
              <Input
                id="condition"
                value={editData.condition}
                onChange={(e) => setEditData({ ...editData, condition: e.target.value })}
                placeholder="e.g., Sunny, Cloudy"
                className="h-9 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-xs">Temperature (°F)</Label>
              <Input
                id="temperature"
                type="number"
                value={editData.temperature}
                onChange={(e) => setEditData({ ...editData, temperature: parseFloat(e.target.value) })}
                className="h-9 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="humidity" className="text-xs">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                value={editData.humidity}
                onChange={(e) => setEditData({ ...editData, humidity: parseFloat(e.target.value) })}
                className="h-9 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="windSpeed" className="text-xs">Wind Speed (mph)</Label>
              <Input
                id="windSpeed"
                type="number"
                value={editData.windSpeed}
                onChange={(e) => setEditData({ ...editData, windSpeed: parseFloat(e.target.value) })}
                className="h-9 text-sm"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location" className="text-xs">Location</Label>
              <Input
                id="location"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                placeholder="Enter location or address"
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Edit Button */}
        {isEditable && (
          <Button size="sm" variant="ghost" onClick={handleEdit} className="shrink-0">
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};
