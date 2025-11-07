import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createPhase, updatePhase } from "@/lib/api/schedule";
import { APISuccessResponse, ApiError } from "@/lib/types/api";
import { Phase, CreatePhaseDTO } from "@/lib/types/schedule";
import { API_ENDPOINTS, QUERY_KEYS } from "@/lib/api/endPoints";
import { toast } from "sonner";
import { PaginationResponse } from "@/lib/types/pagination";
import api from "@/lib/api/api";

export const usePhases = ({projectId}: {projectId: string}) => {
  return useQuery<Phase[], ApiError>({
    queryKey: [QUERY_KEYS.PHASES, projectId],
    queryFn: async () => {
       const queryParams = new URLSearchParams();
       if (projectId) {
         queryParams.append("projectId", projectId);
       }
      const response = await api.get<PaginationResponse<Phase>>(API_ENDPOINTS.GET_PHASES, {
        params: queryParams,
      });
      return response.data.data.result;
    },
  });
};

export const useCreatePhase = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, CreatePhaseDTO>({
    mutationFn: (data: CreatePhaseDTO) => createPhase(data),
    onSuccess: (data) => {
      toast.success(data.message || "Phase created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PHASES] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create phase");
    },
  });
};

export const useUpdatePhase = () => {
    const queryClient = useQueryClient();
    return useMutation<APISuccessResponse, ApiError, {id: string, data: Partial<CreatePhaseDTO>}>({
        mutationFn: ({id, data}) => updatePhase(id, data),
        onSuccess: (data) => {
            toast.success(data.message || "Phase updated successfully");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PHASES] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update phase");
        },
    });
};

export const useDeletePhase = () => {
    const queryClient = useQueryClient();
    return useMutation<APISuccessResponse, ApiError, string>({
        mutationFn: (id: string) =>
          api.delete(`${API_ENDPOINTS.DELETE_PHASE.replace("{id}", id)}`),
        onSuccess: (data) => {
            toast.success(data.message || "Phase deleted successfully");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PHASES] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete phase");
        },
    });
}

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, any>({
    mutationFn: (data: any) =>
      axios.post<APISuccessResponse>("/api/schedule/activities", data).then(res => res.data),
    onSuccess: (data) => {
      toast.success(data.message || "Activity created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PHASES] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create activity");
    },
  });
}

