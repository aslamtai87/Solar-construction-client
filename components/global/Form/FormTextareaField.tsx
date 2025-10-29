"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormTextareaFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  textareaClassName?: string;
  rows?: number;
  orientation?: "vertical" | "horizontal" | "responsive";
}

export function FormTextareaField<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  description,
  disabled = false,
  className,
  textareaClassName,
  rows = 4,
  orientation = "vertical",
}: FormTextareaFieldProps<TFieldValues>) {
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

            <Textarea
              {...field}
              id={field.name}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              rows={rows}
              className={cn("min-h-[120px]", textareaClassName)}
            />

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
