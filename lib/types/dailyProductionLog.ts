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

// Equipment Log (for contractors to log daily equipment usage)
export interface EquipmentLog {
  id: string;
  equipmentId: string; // Reference to Equipment master data
  equipmentName: string;
  operator: string; // Name of operator (can be custom or from list)
  operatorId?: string; // Optional reference to User ID if selected from list
  projectId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  quantity: number; // Number of units of this equipment used
  hoursUsed?: number; // Optional: hours the equipment was used
  notes?: string;
  loggedBy: string; // User ID of contractor
  createdAt: string;
  updatedAt: string;
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
  operator?: string;
  operatorId?: string;
  productionLogId: string;
  date: string;
  quantity: number;
  hoursUsed?: number;
  notes?: string;
}

export interface UpdateEquipmentLogDTO {
  operator?: string;
  operatorId?: string;
  quantity?: number;
  hoursUsed?: number;
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
