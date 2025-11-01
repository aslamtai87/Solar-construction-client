import api from "./api";
import { API_ENDPOINTS } from "./endPoints";
import { APISuccessResponse } from "../types/api";
import { CreateStaff, StaffUser, StaffUserByIdResponse, UpdateStaff } from "../types/user";
import { PaginationResponse } from "../types/pagination";

export const createStaffUser = async (
  data: CreateStaff
): Promise<APISuccessResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.CREATE_STAFF_USER, data);
    return response.data;
  } catch (error) {
    console.error("Create Staff User Error:", error);
    throw error;
  }
};

export const getStaffUsers = async (cursor?: string | null, limit: number = 10): Promise<PaginationResponse<StaffUser>> => {
  try {
    const params = new URLSearchParams();
    if (cursor) {
      params.append('cursor', cursor);
    }
    params.append('limit', limit.toString());
    
    const response = await api.get<PaginationResponse<StaffUser>>(`${API_ENDPOINTS.STAFF_USERS}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Get Staff Users Error:", error);
    throw error;
  }
};

export const getStaffUserById = async (id: string): Promise<StaffUserByIdResponse> => {
  try {
    const response = await api.get<StaffUserByIdResponse>(`${API_ENDPOINTS.STAFF_USERS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Staff User By ID Error:", error);
    throw error;
  }
};

export const updateStaffUser = async (id: string, data: UpdateStaff): Promise<APISuccessResponse> => {
  try {
    const response = await api.patch(`${API_ENDPOINTS.STAFF_USERS}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Staff User Error:", error);
    throw error;
  }
};

export const deleteStaffUser = async (
  id: string
): Promise<APISuccessResponse> => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.DELETE_STAFF_USER}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Staff User Error:", error);
    throw error;
  }
};