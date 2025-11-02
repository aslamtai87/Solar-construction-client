// Production Planning Types

export type ProductionMethod = "constant" | "ramp-up" | "ramp-down" | "s-curve";

export interface Crew {
  id: string;
  name: string;
  numberOfPeople: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyProduction {
  day: number;
  date: string;
  targetUnits: number;
  actualUnits?: number;
  crewId?: string;
}

export interface ProductionConfiguration {
  id: string;
  activityId: string;
  subActivityId?: string; // If configuring a sub-activity
  activityName: string;
  totalUnits: number;
  duration: number; // in days
  method: ProductionMethod;
  crewId?: string;
  dailyProduction: DailyProduction[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCrewDTO {
  name: string;
  numberOfPeople: number;
}

export interface UpdateCrewDTO {
  name?: string;
  numberOfPeople?: number;
}

export interface CreateProductionConfigDTO {
  activityId: string;
  subActivityId?: string;
  method: ProductionMethod;
  crewId?: string;
  // For constant method
  unitsPerDay?: number;
  // For ramp-up/ramp-down
  startUnitsPerDay?: number;
  endUnitsPerDay?: number;
  // For s-curve
  peakUnitsPerDay?: number;
}

export interface UpdateProductionConfigDTO {
  method?: ProductionMethod;
  crewId?: string;
  dailyProduction?: DailyProduction[];
}

// Production method configuration details
export interface ConstantConfig {
  unitsPerDay: number;
}

export interface RampConfig {
  startUnitsPerDay: number;
  endUnitsPerDay: number;
  increment: number;
}

export interface SCurveConfig {
  peakUnitsPerDay: number;
  rampUpDays: number;
  steadyDays: number;
  rampDownDays: number;
}

export type ProductionMethodConfig = ConstantConfig | RampConfig | SCurveConfig;
