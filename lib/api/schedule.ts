import { API_ENDPOINTS } from "./endPoints";
import api from "./api"
import { Phase, CreatePhaseDTO, CreateActivityDTO } from "@/lib/types/schedule";
import { PaginationResponse } from "../types/pagination";
import {APISuccessResponse} from "../types/api";


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
export const createActivity = async (data: CreateActivityDTO): Promise<APISuccessResponse> => {
  const response = await api.post<APISuccessResponse>(API_ENDPOINTS.CREATE_ACTIVITY, data);
  return response.data;
};