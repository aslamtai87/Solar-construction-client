import * as z from "zod";
import { WorkingDaysType } from "@/lib/types/schedule";

// Working Days Config Schema
export const workingDaysConfigSchema = z.object({
  type: z.nativeEnum(WorkingDaysType, {
    message: "Working days type is required",
  }),
  includeSaturday: z.boolean().optional(),
  includeSunday: z.boolean().optional(),
});

// Phase Validation
export const createPhaseSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z
    .string()
    .min(1, "Phase title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

export const updatePhaseSchema = z.object({
  title: z
    .string()
    .min(1, "Phase title is required")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .optional(),
  status: z.enum(["not-started", "in-progress", "completed"]).optional(),
  order: z.number().min(0).optional(),
});

// Activity Validation
export const createActivitySchema = z
  .object({
    phaseId: z.string().min(1, "Phase is required"),
    name: z
      .string()
      .min(1, "Activity name is required")
      .max(200, "Name must be less than 200 characters"),
    targetUnits: z
      .number()
      .min(1, "Target units must be at least 1")
      .max(1000000, "Target units is too large"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    parentActivityId: z.string().optional().nullable(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  });

export const updateActivitySchema = z
  .object({
    name: z
      .string()
      .min(1, "Activity name is required")
      .max(200, "Name must be less than 200 characters")
      .optional(),
    targetUnits: z
      .number()
      .min(1, "Target units must be at least 1")
      .max(1000000, "Target units is too large")
      .optional(),
    completedUnits: z
      .number()
      .min(0, "Completed units cannot be negative")
      .optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    workingDaysConfig: workingDaysConfigSchema.optional(),
    order: z.number().min(0).optional(),
    status: z.enum(["not-started", "in-progress", "completed"]).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    }
  );

// Milestone Validation
export const createMilestoneSchema = z.object({
  phaseId: z.string().min(1, "Phase is required"),
  name: z
    .string()
    .min(1, "Milestone name is required")
    .max(200, "Name must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  targetDate: z.string().min(1, "Target date is required"),
  activityIds: z
    .array(z.string())
    .min(1, "At least one activity must be selected"),
});

export const updateMilestoneSchema = z.object({
  name: z
    .string()
    .min(1, "Milestone name is required")
    .max(200, "Name must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .optional(),
  targetDate: z.string().optional(),
  activityIds: z.array(z.string()).min(1, "At least one activity must be selected").optional(),
  status: z.enum(["pending", "achieved"]).optional(),
  completionDate: z.string().nullable().optional(),
});

// Export types
export type CreatePhaseValidationType = z.infer<typeof createPhaseSchema>;
export type UpdatePhaseValidationType = z.infer<typeof updatePhaseSchema>;
export type CreateActivityValidationType = z.infer<typeof createActivitySchema>;
export type UpdateActivityValidationType = z.infer<typeof updateActivitySchema>;
export type CreateMilestoneValidationType = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneValidationType = z.infer<typeof updateMilestoneSchema>;
