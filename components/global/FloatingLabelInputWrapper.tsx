"use client";

import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "@/components/icons/EyeIcon";
import { cn } from "@/lib/utils";

interface FloatingLabelInputWrapperProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  required?: boolean;
}

export function FloatingLabelInputWrapper<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  disabled = false,
  autoComplete,
  className,
  inputClassName,
  required = false,
}: FloatingLabelInputWrapperProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("relative w-full", className)}>
          <div className="relative">
            <input
              {...field}
              id={field.name}
              type={inputType}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              autoComplete={autoComplete}
              className={cn(
                "border rounded-sm px-3 py-3 text-sm placeholder-text-400 min-h-14 placeholder:text-xs w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                fieldState.invalid
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#79747E]",
                disabled && "bg-table-row cursor-not-allowed",
                isPasswordField && "pr-10",
                type === "number" &&
                  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                inputClassName  
              )}
            />
            <label
              htmlFor={field.name}
              className={`absolute left-2.5 -top-2.5 bg-gray-50 px-1 text-text text-sm font-semibold pointer-events-none ${fieldState.invalid ? 'text-red-500' : ''}`}
            >
              {label}
            </label>
            {isPasswordField && !disabled && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeIcon color="black" /> : <EyeOffIcon />}
              </button>
            )}
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
