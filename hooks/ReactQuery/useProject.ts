import {useMutation, useQuery} from "@tanstack/react-query";
import { createProject, getProjects, getProjectById } from "@/lib/api/project";
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

