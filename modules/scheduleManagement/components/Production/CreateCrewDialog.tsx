"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Loader2 } from "lucide-react";
import { createCrewSchema } from "@/lib/validation/production";
import { Crew } from "@/lib/types/production";
import { z } from "zod";

type CrewFormData = z.infer<typeof createCrewSchema>;

interface CreateCrewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CrewFormData) => void;
  mode?: "create" | "edit";
  initialData?: Crew;
}

export const CreateCrewDialog = ({
  open,
  onClose,
  onSubmit,
  mode = "create",
  initialData,
}: CreateCrewDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CrewFormData>({
    resolver: zodResolver(createCrewSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          numberOfPeople: initialData.numberOfPeople,
        }
      : {
          name: "",
          numberOfPeople: 1,
        },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        numberOfPeople: initialData.numberOfPeople,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: CrewFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Edit Crew" : "Create New Crew"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the crew details below."
              : "Add a new crew to assign to production activities."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4 py-4">
            <FormFieldWrapper
              name="name"
              control={control}
              label="Crew Name"
              placeholder="e.g., Installation Team A"
              description="Enter a descriptive name for the crew"
            />

            <FormFieldWrapper
              name="numberOfPeople"
              control={control}
              label="Number of People"
              type="number"
              placeholder="e.g., 5"
              description="How many people are in this crew?"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Update Crew" : "Create Crew"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCrewDialog;
