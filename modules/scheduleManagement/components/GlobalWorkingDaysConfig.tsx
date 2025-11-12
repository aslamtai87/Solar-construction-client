"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { WorkingDaysType, WorkingDaysConfig } from "@/lib/types/schedule";
import { getWorkingDaysLabel } from "@/lib/utils/durationCalculator";

interface GlobalWorkingDaysConfigProps {
  config: WorkingDaysConfig;
  onConfigChange: (config: WorkingDaysConfig) => void;
}

export const GlobalWorkingDaysConfig = ({
  config,
  onConfigChange,
}: GlobalWorkingDaysConfigProps) => {
  const handleTypeChange = (type: WorkingDaysType) => {
    onConfigChange({
      type,
      includeSaturday: type === WorkingDaysType.CUSTOM ? config.includeSaturday : false,
      includeSunday: type === WorkingDaysType.CUSTOM ? config.includeSunday : false,
    });
  };

  const handleSaturdayChange = (checked: boolean) => {
    onConfigChange({
      ...config,
      includeSaturday: checked,
    });
  };

  const handleSundayChange = (checked: boolean) => {
    onConfigChange({
      ...config,
      includeSunday: checked,
    });
  };

  return (
    <Card className="border-orange-200 dark:border-orange-900/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-500" />
          Global Working Days Configuration
        </CardTitle>
        <CardDescription>
          This configuration applies to all activities for duration calculation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900/30">
          <Info className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
          <p className="text-xs text-orange-900 dark:text-orange-200">
            Duration for all activities will be automatically calculated based on this configuration
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="working-days-type">Working Days Type</Label>
          <Select value={config.type} onValueChange={handleTypeChange}>
            <SelectTrigger id="working-days-type">
              <SelectValue placeholder="Select working days type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={WorkingDaysType.WEEKDAYS_ONLY}>
                {getWorkingDaysLabel(WorkingDaysType.WEEKDAYS_ONLY)}
              </SelectItem>
              <SelectItem value={WorkingDaysType.ALL_DAYS}>
                {getWorkingDaysLabel(WorkingDaysType.ALL_DAYS)}
              </SelectItem>
              <SelectItem value={WorkingDaysType.CUSTOM}>
                {getWorkingDaysLabel(WorkingDaysType.CUSTOM)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {config.type === WorkingDaysType.CUSTOM && (
          <div className="space-y-3 pl-4 border-l-2 border-orange-200 dark:border-orange-900/30">
            <p className="text-sm font-medium">Custom Days</p>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-saturday"
                checked={config.includeSaturday || false}
                onCheckedChange={handleSaturdayChange}
              />
              <Label
                htmlFor="include-saturday"
                className="text-sm font-normal cursor-pointer"
              >
                Include Saturday
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-sunday"
                checked={config.includeSunday || false}
                onCheckedChange={handleSundayChange}
              />
              <Label
                htmlFor="include-sunday"
                className="text-sm font-normal cursor-pointer"
              >
                Include Sunday
              </Label>
            </div>
          </div>
        )}

        <div className="pt-2 text-sm text-muted-foreground">
          Current: <span className="font-medium text-foreground">{getWorkingDaysLabel(config.type)}</span>
          {config.type === WorkingDaysType.CUSTOM && (
            <>
              {" "}with{" "}
              {config.includeSaturday && config.includeSunday
                ? "Saturday and Sunday"
                : config.includeSaturday
                ? "Saturday"
                : config.includeSunday
                ? "Sunday"
                : "no weekend days"}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalWorkingDaysConfig;
