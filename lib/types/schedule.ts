import { Project } from "next/dist/build/swc/types";

// Working Days Configuration
export enum WorkingDaysType {
  WEEKDAYS_ONLY = "WEEKDAYS_ONLY",
  ALL_DAYS = "ALL_DAYS",
  CUSTOM = "CUSTOM",
}

export interface WorkingDaysConfig {
  type: WorkingDaysType;
  includeSaturday?: boolean;
  includeSunday?: boolean;
  projectId?: string;
}

export interface WorkingDays {
  type: "WEEKDAYS" | "WEEKENDS" | "ALL" | "CUSTOM";
  customDays?: string[];
}

// Phase Types
export interface Phase {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  projectId: string;
  _count: Count;
}

interface Count {
  activities: number;
  milestones: number;
}

export interface CreatePhaseDTO {
  projectId: string;
  name: string;
  description: string;
}

// export interface UpdatePhaseDTO {
//   title?: string;
//   description?: string;
//   status?: Phase["status"];
//   order?: number;
// }

// Activity Types
export interface Activity {
  id: string;
  activityNo: number;
  name: string;
  targetUnit: number;
  startDate: string;
  endDate: string;
  duration: null | number;
  action: null;
  description: null;
  phaseId: string;
  createdAt: string;
  updatedAt: string;
  phase:{
    name:string;
  }
  _count: Count;

}

interface Count {
  subActivities: number;
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
// export interface PhaseWithData extends Phase {
//   activities: Activity[];
//   milestones: Milestone[];
// }

export interface ScheduleTracker {
  id: string;
  activityNo: number;
  name: string;
  status: null;
  startDate: string;
  endDate: string;
  phase: Phase;
  crews: Crew[];
  units: Units;
  duration: Duration;
  productivity: Productivity;
  cost: Cost;
}

interface Cost {
  estimatedPerUnit: number;
  actualPerUnit: number;
  variance: number;
  totalEquipmentCost: number;
  totalLabourCost: number;
  totalCost: number;
}

interface Productivity {
  targetRate: number;
  actualRate: number;
  efficiency: number;
}

interface Duration {
  planned: number;
  actual: number;
  variance: number;
}

interface Units {
  target: number;
  completed: number;
  remaining: number;
  completionPercentage: number;
}

interface Crew {
  id: string;
  name: string;
  description: null;
  labourers: Labourer[];
}

interface Labourer {
  name: string;
  quantity: number;
  rateType: string;
  totalRate: number;
}