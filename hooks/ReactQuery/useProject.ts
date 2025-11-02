import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "@/lib/api/project";
import {toast} from "sonner";
import { ProjectByIdResponse, ProjectDTO, ProjectResponse } from "@/lib/types/project";
import { ApiError, APISuccessResponse } from "@/lib/types/api";
import { QUERY_KEYS } from "@/lib/api/endPoints";

export const useGetProjects = () => {
  return useQuery<ProjectResponse[], ApiError>({
    queryKey: [QUERY_KEYS.PROJECTS],
    queryFn: getProjects,
  });
};

export const useCreateProjects = () => {
  return useMutation<APISuccessResponse, ApiError, ProjectDTO>({
    mutationFn: (data) => createProject(data),
    onSuccess: (data) => {
        toast.success(data.message || "Project created successfully");
    }
  });
};

export const useGetProjectById = (id: string) => {
  return useQuery<ProjectByIdResponse, ApiError>({
    queryKey: [QUERY_KEYS.PROJECTS, id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
}

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<APISuccessResponse, ApiError, Partial<ProjectDTO>>({
    mutationFn: (data) => updateProject(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Project updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS, id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project");
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation<APISuccessResponse, ApiError, string>({
    mutationFn: (id) => deleteProject(id),
    onSuccess: (data) => {
      toast.success(data.message || "Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });
};

