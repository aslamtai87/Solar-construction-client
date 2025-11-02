import {useMutation} from "@tanstack/react-query";
import { createProject } from "@/lib/api/project";
import {toast} from "sonner";
import { ProjectDTO } from "@/lib/types/project";
import { APISuccessResponse } from "@/lib/types/api";

export const useCreateProjects = () => {
  return useMutation<APISuccessResponse, Error, ProjectDTO>({
    mutationFn: (data) => createProject(data),
    onSuccess: (data) => {
        toast.success(data.message || "Project created successfully");
    }
  });
};