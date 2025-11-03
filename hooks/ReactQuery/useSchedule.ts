import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createPhase, fetchPhases, updatePhase } from "@/lib/api/schedule";
import { APISuccessResponse, ApiError } from "@/lib/types/api";
import { Phase, CreatePhaseDTO } from "@/lib/types/schedule";
import { QUERY_KEYS } from "@/lib/api/endPoints";
import { toast } from "sonner";

export const usePhases = () => {
  return useQuery<Phase[], ApiError>({
    queryKey: QUERY_KEYS.PHASES,
    queryFn: fetchPhases,
  });
};

export const useCreatePhase = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, CreatePhaseDTO>({
    mutationFn: (data: CreatePhaseDTO) => createPhase(data),
    onSuccess: (data) => {
      toast.success(data.message || "Phase created successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PHASES });
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
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PHASES });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update phase");
        },
    });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, any>({
    mutationFn: (data: any) =>
      axios.post<APISuccessResponse>("/api/schedule/activities", data).then(res => res.data),
    onSuccess: (data) => {
      toast.success(data.message || "Activity created successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PHASES });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create activity");
    },
  });
}

