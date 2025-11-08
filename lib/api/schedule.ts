import { API_ENDPOINTS } from "./endPoints";
import api from "./api"
import { Phase, CreatePhaseDTO, Activity } from "@/lib/types/schedule";
import {APISuccessResponse} from "../types/api";
import { ActivityFormData } from "@/modules/scheduleManagement/components/Activity/ActivityEditableRow";
import { PaginationResponse } from "../types/pagination";


export const fetchPhaseById = async (id: string): Promise<Phase> => {
  const response = await api.get<Phase>(API_ENDPOINTS.GET_PHASE_BY_ID.replace("{id}", id));
  return response.data;
};

export const createPhase = async (data: CreatePhaseDTO): Promise<APISuccessResponse> => {
  const response = await api.post<APISuccessResponse>(API_ENDPOINTS.CREATE_PHASE, data);
  return response.data;
};


export const updatePhase = async (id: string, data: Partial<CreatePhaseDTO>): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(API_ENDPOINTS.UPDATE_PHASE.replace("{id}", id), data);
  return response.data;
};


// Activities
export const createActivity = async (data: ActivityFormData): Promise<APISuccessResponse> => {
  const response = await api.post<APISuccessResponse>(API_ENDPOINTS.CREATE_ACTIVITY, data);
  return response.data;
};

export const fetchActivity = async (): Promise<PaginationResponse<Activity>> => {
  const response = await api.get<PaginationResponse<Activity>>(API_ENDPOINTS.GET_ACTIVITY);
  return response.data;
}

export const updateActivity = async (id: string, data: ActivityFormData): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(API_ENDPOINTS.UPDATE_ACTIVITY.replace("{id}", id), data);
  return response.data;
}



//working days config
export const fetchWorkingDaysConfig = async (projectId: string): Promise<any> => {
  const response = await api.get<any>(API_ENDPOINTS.WORKING_DAYS_CONFIG.replace("{projectId}", projectId));
  return response.data.data;
};

export const updateWorkingDaysConfig = async (id: string, data: any): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(API_ENDPOINTS.UPDATE_WORKING_DAYS_CONFIG.replace("{id}", id), data);
  return response.data;
}