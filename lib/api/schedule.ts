import { API_ENDPOINTS } from "./endPoints";
import api from "./api";
import { Phase, CreatePhaseDTO, Activity } from "@/lib/types/schedule";
import { APISuccessResponse } from "../types/api";
import { ActivityFormData } from "@/modules/scheduleManagement/components/Activity/ActivityEditableRow";
import { PaginationResponse } from "../types/pagination";
import { CreateEquipmentDTO, CreateLabourerDTO, GetEquipment, GetLabourer } from "../types/production";

export const fetchPhaseById = async (id: string): Promise<Phase> => {
  const response = await api.get<Phase>(
    API_ENDPOINTS.GET_PHASE_BY_ID.replace("{id}", id)
  );
  return response.data;
};

export const createPhase = async (
  data: CreatePhaseDTO
): Promise<APISuccessResponse> => {
  const response = await api.post<APISuccessResponse>(
    API_ENDPOINTS.CREATE_PHASE,
    data
  );
  return response.data;
};

export const updatePhase = async (
  id: string,
  data: Partial<CreatePhaseDTO>
): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(
    API_ENDPOINTS.UPDATE_PHASE.replace("{id}", id),
    data
  );
  return response.data;
};

// Activities
export const createActivity = async (
  data: ActivityFormData
): Promise<APISuccessResponse> => {
  const response = await api.post<APISuccessResponse>(
    API_ENDPOINTS.CREATE_ACTIVITY,
    data
  );
  return response.data;
};

export const fetchActivity = async (): Promise<
  PaginationResponse<Activity>
> => {
  const response = await api.get<PaginationResponse<Activity>>(
    API_ENDPOINTS.GET_ACTIVITY
  );
  return response.data;
};

export const updateActivity = async (
  id: string,
  data: ActivityFormData
): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(
    API_ENDPOINTS.UPDATE_ACTIVITY.replace("{id}", id),
    data
  );
  return response.data;
};

//working days config
export const fetchWorkingDaysConfig = async (
  projectId: string
): Promise<any> => {
  const response = await api.get<any>(
    API_ENDPOINTS.WORKING_DAYS_CONFIG.replace("{projectId}", projectId)
  );
  return response.data.data;
};

export const updateWorkingDaysConfig = async (
  id: string,
  data: any
): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(
    API_ENDPOINTS.UPDATE_WORKING_DAYS_CONFIG.replace("{id}", id),
    data
  );
  return response.data;
};

// production-planning
export const createEquipment = async (
  data: CreateEquipmentDTO
): Promise<APISuccessResponse> => {
  const response = await api.post<APISuccessResponse>(
    API_ENDPOINTS.CREATE_EQUIPMENT,
    data
  );
  return response.data;
};

export const fetchEquipment = async (params?: {
  cursor?: string | null;
  limit?: number;
  search?: string;
  phaseId?: string;
}): Promise<PaginationResponse<GetEquipment>> => {
  const queryParams = new URLSearchParams();

  if (params?.cursor) {
    queryParams.append("cursor", params.cursor);
  }
  if (params?.limit) {
    queryParams.append("limit", params.limit.toString());
  }
  if (params?.search) {
    queryParams.append("search", params.search);
  }
  if (params?.phaseId) {
    queryParams.append("phaseId", params.phaseId);
  }
  const response = await api.get<PaginationResponse<GetEquipment>>(
    API_ENDPOINTS.GET_EQUIPMENT,
    { params: queryParams }
  );
  return response.data;
};

export const updateEquipment = async (
  id: string,
  data: any
): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(
    API_ENDPOINTS.UPDATE_EQUIPMENT.replace("{id}", id),
    data
  );
  return response.data;
};

export const deleteEquipment = async (
  id: string
): Promise<APISuccessResponse> => {
  const response = await api.delete<APISuccessResponse>(
    API_ENDPOINTS.DELETE_EQUIPMENT.replace("{id}", id)
  );
  return response.data;
};


export const getLabourers = async (): Promise<PaginationResponse<GetLabourer>> => {
  const response = await api.get<PaginationResponse<GetLabourer>>(API_ENDPOINTS.GET_LABOURERS);
  return response.data;
};

export const createLabourer = async (
  data: CreateLabourerDTO
): Promise<APISuccessResponse> => {
  const response = await api.post<APISuccessResponse>(
    API_ENDPOINTS.CREATE_LABOURER,
    {...data,rateType: "HOURLY"}
  );
  return response.data;
};


export const updateLabourer = async (
  id: string,
  data: Partial<CreateLabourerDTO>
): Promise<APISuccessResponse> => {
  const response = await api.patch<APISuccessResponse>(
    API_ENDPOINTS.UPDATE_LABOURER.replace("{id}", id),
    data
  );
  return response.data;
}