import api from "./api";
import { APISuccessResponse } from "@/lib/types/api";
import {
  LabourerTimeLog,
  CreateLabourerTimeLogDTO,
  UpdateLabourerTimeLogDTO,
  EquipmentLog,
  CreateEquipmentLogDTO,
  UpdateEquipmentLogDTO,
  ActivityProductionLog,
  CreateActivityProductionLogDTO,
  UpdateActivityProductionLogDTO,
  DailyProductionLogFilters,
  UpdateProductionLogDto,
  DailyProductionLog,
  GetActivityCrew
} from "@/lib/types/dailyProductionLog";
import { PaginationResponse } from "../types/pagination";
import { act } from "react";

// API Endpoints
const ENDPOINTS = {
  // Labourer Time Logs
  LABOURER_TIME_LOGS: "/production-logs/labourer-logs",
  LABOURER_TIME_LOG_BY_ID: (id: string) => `/production-logs/labourer-logs/${id}`,
  LABOURER_TIME_LOGS_BY_PROJECT: (projectId: string) => `/production-logs/labourer-logs/project/${projectId}`,
  
  // Equipment Logs
  EQUIPMENT_LOGS: "/production-logs/equipment-logs",
  EQUIPMENT_LOG_BY_ID: (id: string) => `/production-logs/equipment-logs/${id}`,
  EQUIPMENT_LOGS_BY_PROJECT: (projectId: string) => `/production-logs/equipment-logs/project/${projectId}`,
  
  // Activity Production Logs
  ACTIVITY_LOGS: "/production-logs/activity-logs",
  ACTIVITY_LOG_BY_ID: (id: string) => `/production-logs/activity-logs/${id}`,
  ACTIVITY_LOGS_BY_PROJECT: (projectId: string) => `/production-logs/activity-logs/project/${projectId}`,
  
  // Summary
  DAILY_PRODUCTION_SUMMARY: (projectId: string, date: string) => 
    `/production-logs/summary/${projectId}/${date}`,


  GET_PRODUCTION_LOG_ID: "/production-logs/logs/validate-today-log",
  
  // Get production logs list
  PRODUCTION_LOGS_LIST: "/production-logs/logs",

  //get detailed production log
  DETAILED_PRODUCTION_LOG: (id: string) => `/production-logs/logs/${id}`
};


// Update production log APIs

export const updateProductionLog = async (
  id: string,
  data: UpdateProductionLogDto
): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(
    `/production-logs/logs/${id}`,
    data
  );
  return response.data;
}

// ================= GET PRODUCTION LOG ID =================

export const getProductionLogId = async (
  projectId: string,
  timeZone: string
): Promise<{data: DailyProductionLog}> => {
  const response = await api.get<{data: DailyProductionLog}>(
    ENDPOINTS.GET_PRODUCTION_LOG_ID,
    {
      params: { projectId, timeZone },
    }
  );
  return response.data;
};

// ================= GET PRODUCTION LOGS LIST =================

export const getProductionLogs = async (
  projectId: string
): Promise<PaginationResponse<DailyProductionLog>> => {
  const response = await api.get<PaginationResponse<DailyProductionLog>>(
    ENDPOINTS.PRODUCTION_LOGS_LIST,
    {
      params: { projectId },
    }
  );
  return response.data;
};

// ================================== DETAILED PRODUCTION LOG =================
export const getDetailedProductionLog = async (
  id: string
): Promise<DailyProductionLog> => {
  const response = await api.get<{ data: DailyProductionLog }>(
    ENDPOINTS.DETAILED_PRODUCTION_LOG(id)
  );
  return response.data.data;
};


// ================= LABOURER TIME LOG API =================

export const getLabourerTimeLogs = async (
  filters: Partial<DailyProductionLogFilters>
): Promise<PaginationResponse<LabourerTimeLog>> => {
  const params = new URLSearchParams();
  if (filters.labourerId) params.append("labourerId", filters.labourerId);
  if (filters.workerId) params.append("workerId", filters.workerId);
  if (filters.productionLogId) params.append("productionLogId", filters.productionLogId);
  const response = await api.get<PaginationResponse<LabourerTimeLog>>(
    `${ENDPOINTS.LABOURER_TIME_LOGS}?${params.toString()}`
  );
  return response.data;
};

export const getLabourerTimeLogById = async (
  id: string,
): Promise<LabourerTimeLog> => {
  const response = await api.get<{ data: LabourerTimeLog }>(
    ENDPOINTS.LABOURER_TIME_LOG_BY_ID(id)
  );
  return response.data.data;
};

export const createLabourerTimeLog = async (
  data: CreateLabourerTimeLogDTO,
  logId: string
): Promise<APISuccessResponse> => {
  const response = await api.post<APISuccessResponse>(
    ENDPOINTS.LABOURER_TIME_LOGS,
    { ...data, productionLogId: logId}
  );
  return response.data;
};

export const updateLabourerTimeLog = async (
  id: string,
  data: UpdateLabourerTimeLogDTO
): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(
    ENDPOINTS.LABOURER_TIME_LOG_BY_ID(id),
    data
  );
  return response.data;
};

export const deleteLabourerTimeLog = async (
  id: string
): Promise<APISuccessResponse> => {
  const response = await api.delete<APISuccessResponse>(
    ENDPOINTS.LABOURER_TIME_LOG_BY_ID(id)
  );
  return response.data;
};

// ================= EQUIPMENT LOG API =================

export const getEquipmentLogs = async (
  filters: Partial<DailyProductionLogFilters>
): Promise<PaginationResponse<EquipmentLog>> => {
  const params = new URLSearchParams();
  if (filters.productionLogId) params.append("productionLogId", filters.productionLogId);

  const response = await api.get<PaginationResponse<EquipmentLog>>(
    `${ENDPOINTS.EQUIPMENT_LOGS}?${params.toString()}`
  );
  return response.data;
};

export const getEquipmentLogById = async (
  id: string
): Promise<EquipmentLog> => {
  const response = await api.get<{ data: EquipmentLog }>(
    ENDPOINTS.EQUIPMENT_LOG_BY_ID(id)
  );
  return response.data.data;
};

export const createEquipmentLog = async (
  data: CreateEquipmentLogDTO,
  logId: string
): Promise<APISuccessResponse> => {
  const response = await api.post<APISuccessResponse>(
    ENDPOINTS.EQUIPMENT_LOGS,
    { ...data, productionLogId: logId }
  );
  return response.data;
};

export const updateEquipmentLog = async (
  id: string,
  data: UpdateEquipmentLogDTO
): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(
    ENDPOINTS.EQUIPMENT_LOG_BY_ID(id),
    data
  );
  return response.data;
};

export const deleteEquipmentLog = async (
  id: string
): Promise<APISuccessResponse> => {
  const response = await api.delete<APISuccessResponse>(
    ENDPOINTS.EQUIPMENT_LOG_BY_ID(id)
  );
  return response.data;
};

// ================= ACTIVITY PRODUCTION LOG API =================

export const getActivityProductionLogs = async (
  filters: DailyProductionLogFilters
): Promise<PaginationResponse<ActivityProductionLog>> => {
  const params = new URLSearchParams();
  if (filters.productionLogId) params.append("productionLogId", filters.productionLogId);
  if (filters.projectId) params.append("projectId", filters.projectId);
  if (filters.activityId) params.append("activityId", filters.activityId);
  const response = await api.get<PaginationResponse<ActivityProductionLog>>(
    `${ENDPOINTS.ACTIVITY_LOGS}?${params.toString()}`
  );
  return response.data;
};

// export const getActivityProductionLogById = async (
//   id: string
// ): Promise<ActivityProductionLog> => {
//   const response = await api.get<{ data: ActivityProductionLog }>(
//     ENDPOINTS.ACTIVITY_LOG_BY_ID(id)
//   );
//   return response.data.data;
// };

export const createActivityProductionLog = async (
  data: CreateActivityProductionLogDTO
): Promise<APISuccessResponse> => {
  const response = await api.post<APISuccessResponse>(
    ENDPOINTS.ACTIVITY_LOGS,
    data
  );
  return response.data;
};

export const getCrewAndForecastedDateForActivity = async (
  activityId: string,
  productionLogId: string
): Promise<GetActivityCrew> => {
  const response = await api.get<{ data: GetActivityCrew }>(
    `/production-logs/activity-logs/activity/${activityId}/production-log/${productionLogId}/crews`
  );
  return response.data.data;
}

export const updateActivityProductionLog = async (
  id: string,
  data: UpdateActivityProductionLogDTO
): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(
    ENDPOINTS.ACTIVITY_LOG_BY_ID(id),
    data
  );
  return response.data;
};

export const deleteActivityProductionLog = async (
  id: string
): Promise<APISuccessResponse> => {
  const response = await api.delete<APISuccessResponse>(
    ENDPOINTS.ACTIVITY_LOG_BY_ID(id)
  );
  return response.data;
};

// ================= SUMMARY API =================

// export const getDailyProductionSummary = async (
//   projectId: string,
//   date: string
// ): Promise<DailyProductionLogSummary> => {
//   const response = await api.get<{ data: DailyProductionLogSummary }>(
//     ENDPOINTS.DAILY_PRODUCTION_SUMMARY(projectId, date)
//   );
//   return response.data.data;
// };
