// Working Days Configuration
export enum WorkingDaysType {
  WEEKDAYS_ONLY = "WEEKDAYS_ONLY",
  WEEKENDS_ONLY = "WEEKENDS_ONLY",
  ALL_DAYS = "ALL_DAYS",
  CUSTOM = "CUSTOM",
}

export interface WorkingDaysConfig {
  type: WorkingDaysType;
  includeSaturday?: boolean;
  includeSunday?: boolean;
}

export interface WorkingDays {
  type: "WEEKDAYS" | "WEEKENDS" | "ALL" | "CUSTOM";
  customDays?: string[];
}

// Phase Types
export interface Phase {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhaseDTO {
  projectId: string;
  title: string;
  description: string;
}

export interface UpdatePhaseDTO {
  title?: string;
  description?: string;
  status?: Phase["status"];
  order?: number;
}

// Activity Types
export interface Activity {
  id: string;
  phaseId: string;
  phaseName?: string;
  name: string;
  units?: number | null;
  startDate: string;
  endDate: string;
  duration: number;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateActivityDTO {
  phaseId: string;
  name: string;
  targetUnits: number;
  startDate: string;
  endDate: string;
}

export interface UpdateActivityDTO {
  name?: string;
  targetUnits?: number;
  completedUnits?: number;
  startDate?: string;
  endDate?: string;
  order?: number;
}

// Milestone Types
export interface Milestone {
  id: string;
  phaseId: string;
  name: string;
  description: string;
  targetDate: string;
  activityIds: string[];
  completedActivityIds: string[];
  status: "pending" | "achieved";
  completionDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMilestoneDTO {
  phaseId: string;
  name: string;
  description: string;
  targetDate: string;
  activityIds: string[];
}

export interface UpdateMilestoneDTO {
  name?: string;
  description?: string;
  targetDate?: string;
  activityIds?: string[];
  status?: Milestone["status"];
  completionDate?: string | null;
}

// Phase with complete data
export interface PhaseWithData extends Phase {
  activities: Activity[];
  milestones: Milestone[];
}
