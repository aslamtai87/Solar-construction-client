import api from "./api";
import { API_ENDPOINTS } from "./endPoints";
import { APISuccessResponse } from "../types/api";
import { ProjectByIdResponse, ProjectDTO, ProjectResponse } from "../types/project";

export const createProject = async (
  data: ProjectDTO
): Promise<APISuccessResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.CREATE_PROJECT, data);
    return response.data;
  } catch (error) {
    console.error("Create Project Error:", error);
    throw error;
  }
}

export const getProjects = async (): Promise<ProjectResponse[]> => {
  try {
    const response = await api.get<{ data: ProjectResponse[] }>(API_ENDPOINTS.PROJECTS);
    return response.data.data;
  } catch (error) {
    console.error("Get Projects Error:", error);
    throw error;
  }
}

export const getProjectById = async (id: string): Promise<ProjectByIdResponse> => {
  try {
    const response = await api.get<{ data: ProjectByIdResponse }>(`${API_ENDPOINTS.PROJECTS}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Get Project By ID Error:", error);
    throw error;
  }
}

export const updateProject = async (
  id: string,
  data: Partial<ProjectDTO>
): Promise<APISuccessResponse> => {
  try {
    const response = await api.patch(`${API_ENDPOINTS.PROJECTS}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Project Error:", error);
    throw error;
  }
}

export const deleteProject = async (id: string): Promise<APISuccessResponse> => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Project Error:", error);
    throw error;
  }
}