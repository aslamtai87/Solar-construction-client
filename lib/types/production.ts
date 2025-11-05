// Production Planning Types

export type ProductionMethod = "constant" | "ramp-up" | "ramp-down" | "s-curve";

// Equipment Pricing Period
export enum EquipmentPricingPeriod {
  PER_DAY = "per-day",
  PER_WEEK = "per-week",
  PER_MONTH = "per-month",
}

// Labourer Types
export interface Labourer {
  id: string;
  type: string; // e.g., "Electrician", "Installer", "Helper"
  baseRate: number; // Base rate per hour
  fringeRate: number; // Fringe benefits per hour
  totalRate: number; // Total = baseRate + fringeRate
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabourerDTO {
  type: string;
  baseRate?: number;
  fringeRate?: number;
  totalRate?: number; // If user enters total directly
}

// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  price: number;
  pricingPeriod: EquipmentPricingPeriod;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentDTO {
  name: string;
  price: number;
  pricingPeriod: EquipmentPricingPeriod;
}

// Crew Composition (used in production configuration)
export interface CrewLabourer {
  labourerId: string;
  labourerType: string;
  quantity: number;
  baseRate: number;
  fringeRate: number;
  totalRate: number;
}

export interface CrewComposition {
  id: string;
  name: string;
  labourers: CrewLabourer[];
  totalCostPerHour: number; // Sum of all labourers
}

// Equipment Assignment (used in production configuration)
export interface EquipmentAssignment {
  id: string;
  equipmentId: string;
  equipmentName: string;
  price: number;
  pricingPeriod: EquipmentPricingPeriod;
  quantity: number;
}

// Legacy types (keep for backward compatibility)
export interface Crew {
  id: string;
  name: string;
  numberOfPeople: number;
  createdAt: string;
  updatedAt: string;
}

export interface CrewInput {
  id: string;
  name: string;
  numberOfPeople: number;
  costPerHour: number;
}

export interface EquipmentInput {
  id: string;
  name: string;
  costPerDay: number;
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
  activityName: string;
  totalUnits: number;
  duration: number; // User can edit this during configuration
  method: ProductionMethod;
  crews: CrewComposition[];
  equipment: EquipmentAssignment[];
  dailyProduction: DailyProduction[];
  
  // AI-specific fields
  useAI?: boolean;
  aiInsights?: {
    peakDay: number;
    peakUnits: number;
    averageUnits: number;
    minUnits: number;
    recommendations: string[];
    risks: string[];
    confidence: number;
  };
  aiReasoning?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductionConfigDTO {
  activityId: string;
  method: ProductionMethod;
  duration: number; // Editable duration
  crews: CrewComposition[];
  equipment: EquipmentAssignment[];
  useAI?: boolean;
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
