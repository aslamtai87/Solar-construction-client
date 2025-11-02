// Working Days Configuration
export enum WorkingDaysType {
  WEEKDAYS_ONLY = "weekdays_only",
  WEEKENDS_ONLY = "weekends_only",
  ALL_DAYS = "all_days",
  CUSTOM = "custom",
}

export interface WorkingDaysConfig {
  type: WorkingDaysType;
  includeSaturday?: boolean;
  includeSunday?: boolean;
}

export interface WorkingDays {
  type: "weekdays" | "weekends" | "all" | "custom";
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
  units: number;
  startDate: string;
  endDate: string;
  duration: number;
  workingDays: WorkingDays;
  subActivities?: SubActivity[];
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
  workingDaysConfig: WorkingDaysConfig;
  parentActivityId?: string | null;
}

export interface UpdateActivityDTO {
  name?: string;
  targetUnits?: number;
  completedUnits?: number;
  startDate?: string;
  endDate?: string;
  workingDaysConfig?: WorkingDaysConfig;
  order?: number;
}

// Sub-Activity is same as Activity but always has parentActivityId
export interface SubActivity extends Activity {
  parentActivityId: string;
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

// Activity with children for hierarchical display
export interface ActivityWithChildren extends Activity {
  subActivities: SubActivity[];
}

// Phase with complete data
export interface PhaseWithData extends Phase {
  activities: ActivityWithChildren[];
  milestones: Milestone[];
}
