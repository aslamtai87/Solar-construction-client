// Daily Production Log Types

// Labourer Time Log (for labourers to log their entry/exit times)
export interface LabourerTimeLog {
  id: string;
  labourerId: string; // Reference to User ID
  labourerName: string;
  labourerType?: string; // Type from Labourer master data
  projectId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  entryTime: string; // HH:mm format
  exitTime?: string; // HH:mm format (optional if they haven't left yet)
  totalHours?: number; // Calculated from entry and exit
  loggedBy: string; // User ID of who logged it (labourer or contractor)
  loggedByRole: "labourer" | "contractor";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabourerTimeLogDTO {
  labourerId?: string; // Optional because contractor can log for others
  labourerName?: string; // For custom entry by contractor
  labourerType?: string;
  projectId: string;
  date: string;
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

export interface CreateEquipmentLogDTO {
  equipmentId: string;
  operator: string;
  operatorId?: string;
  projectId: string;
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
  equipmentId?: string; // Filter by specific equipment
  activityId?: string; // Filter by specific activity
}
