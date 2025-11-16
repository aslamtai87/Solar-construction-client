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
  labourerActivities?: {
    id: string;
    activityId: string;
    hoursWorked: number;
    activity?: {
      id: string;
      name: string;
    };
  }[];
}

export interface CreateLabourerTimeLogDTO {
  workerId: string;
  entryTime: string;
  exitTime?: string;
  notes?: string;
  labourerActivities: LabourerActivity[];
}
interface LabourerActivity {
  activityId: string;
  hoursWorked: number;
}
export interface UpdateLabourerTimeLogDTO {
  entryTime?: string;
  exitTime?: string;
  notes?: string;
  labourerActivities?: LabourerActivity[];
}

export interface EquipmentActivity {
  id: string;
  activityId: string;
  qty: number;
  activity?: {
    id: string;
    name: string;
  };
}

export interface EquipmentLog {
  id: string;
  productionLogId: string;
  equipmentId: string;
  operatorName: null;
  quantity: number;
  isQuantityShared: boolean;
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
  equipmentActivities?: EquipmentActivity[];
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
  isQuantityShared: boolean;
  notes?: string;
  equipmentActivities: {
    activityId: string;
    quantity: number;
  }[];
}

export interface UpdateEquipmentLogDTO {
  quantity?: number;
  isQuantityShared?: boolean;
  notes?: string;
  equipmentActivities?: {
    activityId: string;
    quantity: number;
  }[];
}

// Activity Production Log (for logging actual production against forecasted activities)
export interface ActivityProductionLog {
  id: string;
  productionLogId: string;
  activityId: string;
  name: null;
  forecastedUnits: number;
  actualUnits: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  activity: {
    id: string;
    name: string;
    targetUnit: number;
    startDate: string;
    endDate: string;
    duration: number;
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
  crewAllocations: CrewAllocation[];
  _count: {
    crewAllocations: number;
  };
}

interface CrewAllocation {
  id: string;
  crewId: string;
  actualUnits: number;
  crew: {
    id: string;
    name: string;
    description: null;
    _count: {
      labourers: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityProductionLogDTO {
  productionLogId: string;
  activityId: string;
  notes: string;
  name: string;
  forecastedUnits: number;
  crews: Crew[];
}
interface Crew {
  crewId: string;
  actualUnits: number;
}

export interface GetActivityCrew {
  activityId: string;
  activityName: string;
  unitsPerDay: string;
  crews: ActivityCrew[];
}

interface ActivityCrew {
  id: string;
  name: string;
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
