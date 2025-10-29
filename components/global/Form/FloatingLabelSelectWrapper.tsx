"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface FloatingLabelSelectWrapperProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options: SelectOption[];
  className?: string;
  triggerClassName?: string;
}

export function FloatingLabelSelectWrapper<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  options,
  className,
  triggerClassName,
}: FloatingLabelSelectWrapperProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("relative w-full", className)}>
          <div className="relative">
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
              name={field.name}
              required={required}
            >
              <SelectTrigger
                id={field.name}
                className={cn(
                  "border rounded-sm px-3 py-3 text-sm w-full h-auto min-h-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out flex items-center justify-between data-placeholder:text-gray-400 data-placeholder:text-xs",
                  fieldState.invalid
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#79747E]",
                  disabled ? "bg-table-row cursor-not-allowed" : "bg-bg-text",
                  triggerClassName
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Label always stays at top */}
            <label
              htmlFor={field.name}
              className={`absolute left-2.5 -top-2.5 bg-gray-50 px-1 text-sm font-semibold pointer-events-none ${fieldState.invalid && "text-red-500"}`}
            >
              {label}
            </label>
          </div>

          {fieldState.invalid && fieldState.error?.message && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
