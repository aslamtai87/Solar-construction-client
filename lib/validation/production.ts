import { z } from "zod";

// Crew validation
export const createCrewSchema = z.object({
  name: z.string().min(1, "Crew name is required").max(100, "Name is too long"),
  numberOfPeople: z
    .number()
    .min(1, "At least 1 person is required")
    .max(1000, "Number of people is too large"),
});

export const updateCrewSchema = createCrewSchema.partial();

// Production configuration validation
export const createProductionConfigSchema = z.object({
  activityId: z.string().min(1, "Activity is required"),
  subActivityId: z.string().optional(),
  method: z.enum(["constant", "ramp-up", "ramp-down", "s-curve"], {
    message: "Production method is required",
  }),
  crewId: z.string().optional(),
  // All methods auto-calculate their values
  startUnitsPerDay: z.number().min(0.1).optional(),
  endUnitsPerDay: z.number().min(0.1).optional(),
  peakUnitsPerDay: z.number().min(0.1).optional(),
});
