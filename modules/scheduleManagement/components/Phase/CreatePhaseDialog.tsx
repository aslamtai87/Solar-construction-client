"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { FormTextareaField } from "@/components/global/Form/FormTextareaField";
import { Loader2 } from "lucide-react";
import { Phase } from "@/lib/types/schedule";

const phaseSchema = z.object({
  title: z.string().min(1, "Phase title is required").max(100, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
});

type PhaseFormData = z.infer<typeof phaseSchema>;

interface CreatePhaseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PhaseFormData) => void;
  mode?: "create" | "edit";
  initialData?: Phase;
}

export const CreatePhaseDialog = ({
  open,
  onClose,
  onSubmit,
  mode = "create",
  initialData,
}: CreatePhaseDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PhaseFormData>({
    resolver: zodResolver(phaseSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
        }
      : {
          title: "",
          description: "",
        },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: PhaseFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Edit Phase" : "Create New Phase"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the phase details below."
              : "Add a new phase to organize your project schedule and tasks."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4 py-4">
            <FormFieldWrapper
              name="title"
              control={control}
              label="Phase Title"
              placeholder="e.g., Installation & Setup"
              description="Enter a clear and concise title for this phase"
            />

            <FormTextareaField
              name="description"
              control={control}
              label="Description"
              placeholder="Describe the activities and objectives of this phase..."
              description="Provide details about what this phase entails"
              rows={4}
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
              {mode === "edit" ? "Update Phase" : "Create Phase"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePhaseDialog;