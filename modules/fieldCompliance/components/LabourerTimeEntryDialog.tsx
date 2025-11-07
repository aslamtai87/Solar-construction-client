"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { format } from "date-fns";

const timeLogSchema = z.object({
  entryTime: z.string().min(1, "Entry time is required"),
  exitTime: z.string().optional(),
});

type TimeLogFormData = z.infer<typeof timeLogSchema>;

interface LabourerTimeEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TimeLogFormData) => void;
  date: string;
  existingLog?: {
    entryTime: string;
    exitTime?: string;
  };
}

export const LabourerTimeEntryDialog: React.FC<LabourerTimeEntryDialogProps> = ({
  open,
  onClose,
  onSubmit,
  date,
  existingLog,
}) => {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<TimeLogFormData>({
    resolver: zodResolver(timeLogSchema),
    defaultValues: {
      entryTime: existingLog?.entryTime || "",
      exitTime: existingLog?.exitTime || "",
    },
  });

  const onFormSubmit = (data: TimeLogFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Work Hours</DialogTitle>
          <DialogDescription>
            Enter your work hours for {format(new Date(date), "MMMM dd, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <FormFieldWrapper
            name="entryTime"
            control={control}
            label="Entry Time"
            type="time"
            placeholder="Select entry time"
          />

          <FormFieldWrapper
            name="exitTime"
            control={control}
            label="Exit Time"
            type="time"
            placeholder="Select exit time (optional)"
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Time Log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
