"use client";

import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "@/components/icons/EyeIcon";
import { cn } from "@/lib/utils";

interface FormFieldWrapperProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  type?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  orientation?: "vertical" | "horizontal" | "responsive";
}

export function FormFieldWrapper<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  description,
  disabled = false,
  autoComplete,
  className,
  inputClassName,
  orientation = "vertical",
}: FormFieldWrapperProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation={orientation}
          data-invalid={fieldState.invalid}
          className={className}
        >
          <FieldContent>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            
            <div className="relative w-full">
              <Input
                {...field}
                id={field.name}
                type={inputType}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                aria-invalid={fieldState.invalid}
                className={cn(
                  "min-h-14",
                  isPasswordField && "pr-10",
                  inputClassName
                )}
              />
              
              {isPasswordField && !disabled && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeIcon color="black" /> : <EyeOffIcon />}
                </button>
              )}
            </div>

            {description && !fieldState.invalid && (
              <FieldDescription>{description}</FieldDescription>
            )}
            
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
