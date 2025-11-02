import api from "./api";
import { API_ENDPOINTS } from "./endPoints";
import { APISuccessResponse } from "../types/api";
import { ProjectDTO, ProjectListResponse } from "../types/project";

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

export const getProjects = async (): Promise<ProjectListResponse> => {
  try {
    const response = await api.get<{ data: ProjectListResponse }>(API_ENDPOINTS.PROJECTS);
    return response.data.data;
  } catch (error) {
    console.error("Get Projects Error:", error);
    throw error;
  }
}