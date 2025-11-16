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
