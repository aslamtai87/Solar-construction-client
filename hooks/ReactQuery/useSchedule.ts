import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createActivity, createPhase, fetchWorkingDaysConfig, updatePhase, updateWorkingDaysConfig, updateActivity,createEquipment, fetchEquipment, updateEquipment, deleteEquipment, createLabourer, updateLabourer, createCrew, getCrews, updateCrew, deleteCrew, createProductionPlanning, updateProductionPlanning, deleteProductionPlanning } from "@/lib/api/schedule";
import { APISuccessResponse, ApiError } from "@/lib/types/api";
import { Phase, CreatePhaseDTO, WorkingDaysConfig, Activity } from "@/lib/types/schedule";
import { API_ENDPOINTS, QUERY_KEYS } from "@/lib/api/endPoints";
import { toast } from "sonner";
import { PaginationResponse } from "@/lib/types/pagination";
import api from "@/lib/api/api";
import { ActivityFormData } from "@/modules/scheduleManagement/components/Activity/ActivityEditableRow";
import { CreateCrewDTO, CreateEquipmentDTO, CreateLabourerDTO, GetCrew, GetEquipment, GetLabourer } from "@/lib/types/production";

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
      toast.error(error.response?.data.message || "Failed to create phase");
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
            toast.error(error.response?.data.message || "Failed to update phase");
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
            toast.error(error.response?.data.message || "Failed to delete phase");
        },
    });
}

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, ActivityFormData>({
    mutationFn: (data) => createActivity(data),
    onSuccess: (data) => {
      toast.success(data.message || "Activity created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACTIVITIES] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to create activity");
    },
  });
}

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, {id: string, data: ActivityFormData}>({
    mutationFn: ({id, data}) => updateActivity(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Activity updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACTIVITIES] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to update activity");
    },
  });
};


export const useGetActivity = (params?: {
  cursor?: string | null;
  limit?: number;
  search?: string;
  projectId?: string;
  includeProductionPlanning?: boolean;
}) => {
  return useQuery<PaginationResponse<Activity>>({
    queryKey: [QUERY_KEYS.ACTIVITIES, params?.cursor, params?.limit, params?.search, params?.projectId, params?.includeProductionPlanning],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      if (params?.cursor) {
        queryParams.append('cursor', params.cursor);
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      if (params?.projectId) {
        queryParams.append('projectId', params.projectId);
      }
      if (params?.includeProductionPlanning) {
        queryParams.append('includeProductionPlanning', 'true');
      }
      
      const response = await api.get<PaginationResponse<Activity>>(
        `${API_ENDPOINTS.GET_ACTIVITY}?${queryParams.toString()}`
      );
      return response.data;
    },
  });
};

//working days config
export const useWorkingDaysConfig = (projectId: string) => {
  return useQuery<any, ApiError>({
    queryKey: [QUERY_KEYS.WORKING_DAYS_CONFIG, projectId],
    queryFn: () => fetchWorkingDaysConfig(projectId),
  });
};

export const useUpdateWorkingDaysConfig = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, {id: string, data: WorkingDaysConfig}>({
    mutationFn: ({id, data}) => updateWorkingDaysConfig(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Working days config updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKING_DAYS_CONFIG] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to update working days config");
    },
  });
};

//production-planning
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, CreateEquipmentDTO>({
    mutationFn: (data) => createEquipment(data),
    onSuccess: (data) => {
      toast.success(data.message || "Equipment created successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EQUIPMENT });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to create equipment");
    },
  });
};
  
export const useGetEquipment = (params?: {
  cursor?: string | null;
  limit?: number;
  search?: string;
  projectId?: string;
}) => {
  return useQuery<PaginationResponse<GetEquipment>>({
    queryKey: [QUERY_KEYS.EQUIPMENT, params?.cursor, params?.limit, params?.search, params?.projectId],
    queryFn: () => fetchEquipment(params),
  });
};

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, {id: string, data: Partial<CreateEquipmentDTO>}>({
    mutationFn: ({id, data}) => updateEquipment(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Equipment updated successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EQUIPMENT });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to update equipment");
    },
  });
};

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, string>({
    mutationFn: (id: string) => deleteEquipment(id),
    onSuccess: (data) => {
      toast.success(data.message || "Equipment deleted successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EQUIPMENT });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to delete equipment");
    },
  });
};

export const useGetLabourers = (params?:{
  cursor?: string | null;
  limit?: number;
  search?: string;
  projectId?: string;
}) => {
  return useQuery<PaginationResponse<GetLabourer>>({
    queryKey: [QUERY_KEYS.LABOURERS, params?.cursor, params?.limit, params?.search, params?.projectId],
    queryFn: async () => {
      const response = await api.get<PaginationResponse<GetLabourer>>(
        API_ENDPOINTS.GET_LABOURERS,
        { params }
      );
      return response.data;
    },
  });
};

export const useCreateLabourer = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, CreateLabourerDTO>({
    mutationFn: (data) => createLabourer(data),
    onSuccess: (data) => {
      toast.success(data.message || "Labourer created successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LABOURERS });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to create labourer");
    },
  });
}

export const useUpdateLabourers = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, {id: string, data: Partial<CreateLabourerDTO>}>({
    mutationFn: ({id, data}) => updateLabourer(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Labourer updated successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LABOURERS });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to update labourer");
    },
  });
}

export const useCreateCrew = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, CreateCrewDTO>({
    mutationFn: (data) => createCrew(data),
    onSuccess: (data) => {
      toast.success(data.message || "Crew created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CREWS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACTIVITIES] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to create crew");
    },
  });
}

export const useGetCrews = (params?: {
  cursor?: string | null;
  limit?: number;
  search?: string;
  projectId?: string;
  activityId?: string;
}) => {
  return useQuery<PaginationResponse<GetCrew>>({
    queryKey: [QUERY_KEYS.CREWS, params?.cursor, params?.limit, params?.search, params?.projectId, params?.activityId],
    queryFn: () => getCrews(params),
    enabled: !!params?.projectId,
  });
};

export const useUpdateCrew = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, {id: string, data: any}>({
    mutationFn: ({id, data}) => updateCrew(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Crew updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CREWS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACTIVITIES] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to update crew");
    },
  });
}

export const useDeleteCrew = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, string>({
    mutationFn: (id: string) => deleteCrew(id),
    onSuccess: (data) => {
      toast.success(data.message || "Crew deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CREWS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACTIVITIES] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to delete crew");
    },
  });
}

export const useCreateProductionPlanning = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, any>({
    mutationFn: (data) => createProductionPlanning(data),
    onSuccess: (data) => {
      toast.success(data.message || "Production planning created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACTIVITIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CREWS] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to create production planning");
    },
  });
}

export const useUpdateProductionPlanning = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, { id: string; data: any }>({
    mutationFn: ({ id, data }) => updateProductionPlanning(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Production planning updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACTIVITIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CREWS] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to update production planning");
    },
  });
}

export const useDeleteProductionPlanning = () => {
  const queryClient = useQueryClient();
  return useMutation<APISuccessResponse, ApiError, string>({
    mutationFn: (id: string) => deleteProductionPlanning(id),
    onSuccess: (data) => {
      toast.success(data.message || "Production planning deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACTIVITIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CREWS] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Failed to delete production planning");
    },
  });
}