"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckboxFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function FormCheckboxField<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  disabled = false,
  className,
}: FormCheckboxFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          data-invalid={fieldState.invalid}
          className={className}
        >
          <Checkbox
            id={field.name}
            name={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
          />
          <div className="flex flex-col gap-1.5">
            <FieldLabel
              htmlFor={field.name}
              className="font-normal cursor-pointer"
            >
              {label}
            </FieldLabel>
            {description && !fieldState.invalid && (
              <FieldDescription>{description}</FieldDescription>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        </Field>
      )}
    />
  );
}
