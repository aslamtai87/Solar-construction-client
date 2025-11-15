"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkingDaysType } from "@/lib/types/schedule";
import { getWorkingDaysLabel } from "@/lib/utils/durationCalculator";

interface WorkingDaysSelectorProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  namePrefix: Path<TFieldValues>;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function WorkingDaysSelector<TFieldValues extends FieldValues>({
  control,
  namePrefix,
  label = "Working Days",
  description = "Select which days count as working days",
  disabled = false,
}: WorkingDaysSelectorProps<TFieldValues>) {
  return (
    <div className="space-y-4">
      {/* Working Days Type Selector */}
      <Controller
        name={`${namePrefix}.type` as Path<TFieldValues>}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field orientation="vertical">
            <FieldLabel>{label}</FieldLabel>
            <FieldContent>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger className={error ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select working days..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={WorkingDaysType.WEEKDAYS_ONLY}>
                    {getWorkingDaysLabel(WorkingDaysType.WEEKDAYS_ONLY)} (Mon-Fri)
                  </SelectItem>
                  <SelectItem value={WorkingDaysType.ALL_DAYS}>
                    {getWorkingDaysLabel(WorkingDaysType.ALL_DAYS)} (Mon-Sun)
                  </SelectItem>
                  <SelectItem value={WorkingDaysType.CUSTOM}>
                    {getWorkingDaysLabel(WorkingDaysType.CUSTOM)}
                  </SelectItem>
                </SelectContent>
              </Select>
              {description && <FieldDescription>{description}</FieldDescription>}
              {error && <FieldError>{error.message}</FieldError>}
            </FieldContent>
          </Field>
        )}
      />

      {/* Custom Weekend Selection */}
      <Controller
        name={`${namePrefix}.type` as Path<TFieldValues>}
        control={control}
        render={({ field }) => (
          <>
            {field.value === WorkingDaysType.CUSTOM && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <p className="text-sm font-medium">Include Weekends:</p>
                
                {/* Saturday Checkbox */}
                <Controller
                  name={`${namePrefix}.includeSaturday` as Path<TFieldValues>}
                  control={control}
                  render={({ field: satField }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saturday"
                        checked={satField.value || false}
                        onCheckedChange={satField.onChange}
                        disabled={disabled}
                      />
                      <label
                        htmlFor="saturday"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Saturday
                      </label>
                    </div>
                  )}
                />

                {/* Sunday Checkbox */}
                <Controller
                  name={`${namePrefix}.includeSunday` as Path<TFieldValues>}
                  control={control}
                  render={({ field: sunField }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sunday"
                        checked={sunField.value || false}
                        onCheckedChange={sunField.onChange}
                        disabled={disabled}
                      />
                      <label
                        htmlFor="sunday"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sunday
                      </label>
                    </div>
                  )}
                />
              </div>
            )}
          </>
        )}
      />
    </div>
  );
}
