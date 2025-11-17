export interface DailyProduction {
  date: string;
  forecasted: number;
  actual: number;
}

export interface CrewProduction {
  crewName: string;
  dailyProduction: DailyProduction[];
}

export interface ActivityProduction {
  activityId: string;
  activityName: string;
  type: "activity" | "sub-activity";
  crews: CrewProduction[];
}

// New interfaces for activity-level forecast with crew-level actuals
export interface ActivityLevelProduction {
  date: string;
  forecasted: number;
  totalActual: number; // Sum of all crew actuals
}

export interface CrewLevelProduction {
  date: string;
  actual: number;
}

export interface CrewProductionWithParent {
  crewName: string;
  dailyProduction: CrewLevelProduction[];
}

export interface ActivityProductionWithParent {
  activityId: string;
  activityName: string;
  type: "activity" | "sub-activity";
  activityLevelProduction: ActivityLevelProduction[]; // Parent forecast/variance
  crews: CrewProductionWithParent[]; // Crew actuals only
}

export interface ActivitySummary {
  id: string;
  name: string;
  forecasted: number;
  actual: number;
  variance: number;
  percentVariance: string;
}

export interface CrewSummary {
  name: string;
  forecasted: number;
  actual: number;
  variance: number;
  percentVariance: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

// API Response Types
export interface CrewProductionData {
  crewId: string;
  crewName: string;
  forecasted: number;
  actual: number;
  variance: number;
  variancePercentage: number;
}

export interface ActivityProductionData {
  activityId: string;
  activityNo: number;
  activityName: string;
  forecasted: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  crews: CrewProductionData[];
}

export interface ProductionSummary {
  totalForecasted: number;
  totalActual: number;
  totalVariance: number;
  variancePercentage: number;
  activitiesCount: number;
}

export interface DailyProductionExecutiveViewResponse {
  activities: ActivityProductionData[];
  summary: ProductionSummary;
}

// Detailed Production View Types
export interface DetailedActivity {
  activityId: string;
  activityNo: number;
  activityName: string;
  dailyProduction: DailyProductionEntry[];
}

export interface DailyProductionEntry {
  date: string;
  forecasted: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  crews: Record<string, number>; // Crew name as key, actual value as number
}

export interface DetailedProductionViewResponse {
  activities: DetailedActivity[];
  summary: ProductionSummary;
}
