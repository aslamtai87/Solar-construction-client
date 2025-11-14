export interface LabourerTimeLog {
  id: string;
  productionLogId: string;
  workerId: string;
  entryTime: string;
  exitTime: string;
  duration: number;
  notes: null;
  createdAt: string;
  updatedAt: string;
  worker: {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    labourerProfile: {
      id: string;
      name: string;
      rateType: string;
      totalRate: string;
    };
  };
  productionLog: {
    id: string;
    date: string;
    projectId: string;
    project: {
      id: string;
      projectName: string;
      projectNumber: string;
    };
  };
}

export interface CreateLabourerTimeLogDTO {
  workerId: string;
  entryTime: string;
  exitTime?: string;
  notes?: string;
}

export interface UpdateLabourerTimeLogDTO {
  entryTime?: string;
  exitTime?: string;
  notes?: string;
}

export interface EquipmentLog {
  id: string;
  productionLogId: string;
  equipmentId: string;
  operatorName: null;
  quantity: number;
  startTime: null;
  endTime: null;
  hoursUsed: null;
  notes: null;
  createdAt: string;
  updatedAt: string;
  equipment: {
    id: string;
    name: string;
    description: string;
    price: string;
    pricingType: string;
  };
  productionLog: {
    id: string;
    date: string;
    projectId: string;
    project: {
      id: string;
      projectName: string;
      projectNumber: string;
    };
  };
}

export interface UpdateProductionLogDto {
  weatherCondition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  location: string;
  notes: string;
}

export interface CreateEquipmentLogDTO {
  equipmentId: string;
  productionLogId: string;
  quantity: number;
  notes?: string;
}

export interface UpdateEquipmentLogDTO {
  quantity?: number;
  notes?: string;
}

// Activity Production Log (for logging actual production against forecasted activities)
export interface ActivityProductionLog {
  id: string;
  activityId: string;
  activityName: string;
  projectId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  forecastedUnits: number; // From production configuration
  actualUnitsPerCrew: { [crewId: string]: number }; // Actual units produced per crew
  totalActualUnits: number; // Sum of all crew actual units
  crews: ActivityLogCrew[]; // Crews assigned to this activity
  variance: number; // actualUnits - forecastedUnits
  variancePercentage: number; // (variance / forecastedUnits) * 100
  notes?: string;
  loggedBy: string; // User ID of contractor
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogCrew {
  crewId: string;
  crewName: string;
  forecastedUnits: number; // Forecasted for this crew
  actualUnits: number; // Actual produced by this crew
}

export interface CreateActivityProductionLogDTO {
  activityId: string;
  projectId: string;
  date: string;
  actualUnitsPerCrew: { [crewId: string]: number };
  notes?: string;
}

export interface UpdateActivityProductionLogDTO {
  actualUnitsPerCrew?: { [crewId: string]: number };
  notes?: string;
}

// Response types for listing logs
export interface DailyProductionLogSummary {
  date: string;
  labourerLogs: LabourerTimeLog[];
  equipmentLogs: EquipmentLog[];
  activityLogs: ActivityProductionLog[];
  totalLabourHours: number;
  totalEquipmentUnits: number;
  totalActivitiesLogged: number;
}

// Filter options for fetching logs
export interface DailyProductionLogFilters {
  projectId: string;
  date?: string; // Specific date or today by default
  startDate?: string; // For date range
  endDate?: string; // For date range
  labourerId?: string; // Filter by specific labourer
  workerId?: string; // Filter by specific worker (user ID)
  equipmentId?: string; // Filter by specific equipment
  activityId?: string; // Filter by specific activity
  productionLogId?: string; // Filter by specific production log
}

export interface DailyProductionLog {
  id: string;
  projectId: string;
  companyAccessId?: string;
  date: string;
  weatherCondition: string | null;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  location: string | null;
  notes: string | null;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    activityLogs: number;
    labourerLogs: number;
    equipmentLogs: number;
  };
}
