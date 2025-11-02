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
export const createProductionConfigSchema = z
  .object({
    activityId: z.string().min(1, "Activity is required"),
    subActivityId: z.string().optional(),
    method: z.enum(["constant", "ramp-up", "ramp-down", "s-curve"], {
      message: "Production method is required",
    }),
    crewId: z.string().optional(),
    // Constant method
    unitsPerDay: z.number().min(0.1).optional(),
    // Ramp-up/Ramp-down method
    startUnitsPerDay: z.number().min(0.1).optional(),
    endUnitsPerDay: z.number().min(0.1).optional(),
    // S-curve method
    peakUnitsPerDay: z.number().min(0.1).optional(),
  })
  .refine(
    (data) => {
      if (data.method === "constant") {
        return data.unitsPerDay !== undefined && data.unitsPerDay > 0;
      }
      return true;
    },
    {
      message: "Units per day is required for constant method",
      path: ["unitsPerDay"],
    }
  )
  .refine(
    (data) => {
      if (data.method === "ramp-up" || data.method === "ramp-down") {
        return (
          data.startUnitsPerDay !== undefined &&
          data.startUnitsPerDay > 0 &&
          data.endUnitsPerDay !== undefined &&
          data.endUnitsPerDay > 0
        );
      }
      return true;
    },
    {
      message: "Start and end units per day are required for ramp methods",
      path: ["startUnitsPerDay"],
    }
  )
  .refine(
    (data) => {
      if (data.method === "s-curve") {
        return data.peakUnitsPerDay !== undefined && data.peakUnitsPerDay > 0;
      }
      return true;
    },
    {
      message: "Peak units per day is required for S-curve method",
      path: ["peakUnitsPerDay"],
    }
  )
  .refine(
    (data) => {
      if (data.method === "ramp-down") {
        return (
          data.startUnitsPerDay !== undefined &&
          data.endUnitsPerDay !== undefined &&
          data.startUnitsPerDay > data.endUnitsPerDay
        );
      }
      return true;
    },
    {
      message: "Start units must be greater than end units for ramp-down",
      path: ["endUnitsPerDay"],
    }
  )
  .refine(
    (data) => {
      if (data.method === "ramp-up") {
        return (
          data.startUnitsPerDay !== undefined &&
          data.endUnitsPerDay !== undefined &&
          data.startUnitsPerDay < data.endUnitsPerDay
        );
      }
      return true;
    },
    {
      message: "End units must be greater than start units for ramp-up",
      path: ["endUnitsPerDay"],
    }
  );
