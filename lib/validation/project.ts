import * as z from "zod";
import { projectSizeUnits, projectTypes, projectState } from "@/lib/types/project";

export const ProjectValidationSchema = z.object({
    projectNumber: z.string().min(1, "Project number is required"),
    projectName: z.string().min(1, "Project name is required"),
    clientName: z.string().min(1, "Client name is required"),
    projectLocation: z.string().min(1, "Project location is required"),
    projectSize: z.number().min(0, "Project size must be a positive number"),
    projectSizeUnit: z.enum([
        projectSizeUnits.kW,
        projectSizeUnits.MW,
        projectSizeUnits.GW,
    ], "Project size unit is required"),
    projectType: z.enum([
        projectTypes.Rooftop,
        projectTypes.GroundMount,
        projectTypes.SingleAxisTracker,
        projectTypes.Carport,
    ], "Project type is required"),
    projectState: z.enum([
        projectState.preliminaryBidding,
        projectState.finalBidding,
        projectState.awarded,
        projectState.inProgress,
    ], "Project state is required"),
    scope: z.object
    ({
        mechanical: z.string().optional(),
        electrical: z.string().optional(),
        foundational: z.string().optional(),
        civil: z.string().optional(),
    })
    .refine((scope) => Object.values(scope).some((value) => value !== undefined), {
        message: "At least one scope must be selected",
    }),
    // Document URLs after upload
    documents: z.array(z.string().url("Invalid file URL")).optional(),
});

export type ProjectValidationType = z.infer<typeof ProjectValidationSchema>;