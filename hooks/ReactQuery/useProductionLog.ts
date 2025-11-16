import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLabourerTimeLog,
  getLabourerTimeLogs,
  getProductionLogId,
  getProductionLogs,
  createEquipmentLog,
  updateProductionLog,
  updateLabourerTimeLog,
  deleteLabourerTimeLog,
  getEquipmentLogs,
  updateEquipmentLog,
  deleteEquipmentLog,
  getActivityProductionLogs,
  createActivityProductionLog,
  updateActivityProductionLog,
  deleteActivityProductionLog,
  getCrewAndForecastedDateForActivity,
} from "@/lib/api/dailyProductionLog";
import { useProjectStore } from "@/store/projectStore";
import {
  LabourerTimeLog,
  CreateLabourerTimeLogDTO,
  CreateEquipmentLogDTO,
  UpdateProductionLogDto,
  DailyProductionLog,
  ActivityProductionLog,
  CreateActivityProductionLogDTO,
  GetActivityCrew,
  EquipmentLog,
} from "@/lib/types/dailyProductionLog";
import { QUERY_KEYS } from "@/lib/api/endPoints";
import { PaginationResponse } from "@/lib/types/pagination";
import { toast } from "sonner";
import { ApiError } from "@/lib/types/api";
import { useGetActivity } from "./useSchedule";
import { Equipment } from "@/lib/types/production";

export const useProductionLogId = (projectId: string, timeZone: string) => {
  return useQuery<{ data: DailyProductionLog }>({
    queryKey: [QUERY_KEYS.PRODUCTION_LOG_ID, projectId, timeZone],
    queryFn: () => getProductionLogId(projectId, timeZone),
    enabled: !!projectId,
  });
};

export const useProductionLogs = (projectId: string) => {
  return useQuery<PaginationResponse<DailyProductionLog>>({
    queryKey: [QUERY_KEYS.PRODUCTION_LOGS, projectId],
    queryFn: () => getProductionLogs(projectId),
    enabled: !!projectId,
  });
};

export const useLabourerTimeLogs = (params: {
  labourerId?: string;
  workerId?: string;
  productionLogId?: string;
}) => {
  return useQuery<PaginationResponse<LabourerTimeLog>>({
    queryKey: [
      QUERY_KEYS.LABOURER_TIME_LOGS,
      params.productionLogId,
      params.labourerId,
      params.workerId,
    ],
    queryFn: () => getLabourerTimeLogs(params),
    enabled: !!params.productionLogId,
  });
};

export const useCreateLabourerLog = () => {
  const queryClient = useQueryClient();
  const { selectedProject } = useProjectStore();
  return useMutation({
    mutationFn: async (data: CreateLabourerTimeLogDTO) => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const logData = await getProductionLogId(
        selectedProject?.id || "",
        timeZone
      );
      if (!logData.data.id) {
        throw new Error("Production log ID not found for today");
      }
      return createLabourerTimeLog(data, logData.data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LABOURER_TIME_LOGS],
      });
      toast.success("Labourer time log created successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || "Failed to create labourer time log"
      );
    },
  });
};

export const useUpdateLabourerLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      id,
    }: {
      data: Partial<CreateLabourerTimeLogDTO>;
      id: string;
    }) => {
      return updateLabourerTimeLog(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LABOURER_TIME_LOGS],
      });
      toast.success("Labourer time log updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || "Failed to update labourer time log"
      );
    },
  });
};

export const useDeleteLabourerLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteLabourerTimeLog(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LABOURER_TIME_LOGS],
      });
      toast.success("Labourer time log deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete labourer time log"
      );
    },
  });
};

export const useCreateEquipmentLog = () => {
  const queryClient = useQueryClient();
  const { selectedProject } = useProjectStore();
  return useMutation({
    mutationFn: async (data: CreateEquipmentLogDTO) => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const logData = await getProductionLogId(
        selectedProject?.id || "",
        timeZone
      );
      return createEquipmentLog(data, logData.data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EQUIPMENT_LOGS],
      });
      toast.success("Equipment log created successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || "Failed to create equipment log"
      );
    },
  });
};

export const useUpdateEquipmentLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return updateEquipmentLog(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EQUIPMENT_LOGS],
      });
      toast.success("Equipment log updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || "Failed to update equipment log"
      );
    },
  });
};

export const useDeleteEquipmentLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteEquipmentLog(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EQUIPMENT_LOGS],
      });
      toast.success("Equipment log deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete equipment log"
      );
    },
  });
};

export const useGetEquipmentLogs = (productionLogId: string) => {
  return useQuery<PaginationResponse<EquipmentLog>>({
    queryKey: [QUERY_KEYS.EQUIPMENT_LOGS, productionLogId],
    queryFn: () => getEquipmentLogs({ productionLogId }),
    enabled: !!productionLogId,
  });
};

export const useUpdateProductionLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      id,
    }: {
      data: UpdateProductionLogDto;
      id: string;
    }) => {
      return updateProductionLog(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTION_LOG_ID],
      });
    },
  });
};

export const useActivityProductionLogs = (filters: {
  productionLogId?: string;
  projectId?: string;
  activityId?: string;
}) => {
  const safeFilters = {
    ...filters,
    projectId: filters.projectId ?? "",
  };
  return useQuery<PaginationResponse<ActivityProductionLog>>({
    queryKey: [
      QUERY_KEYS.ACTIVITY_PRODUCTION_LOGS,
      filters.productionLogId,
      safeFilters.projectId,
      filters.activityId,
    ],
    queryFn: () => getActivityProductionLogs(safeFilters),
    enabled: !!filters.productionLogId,
  });
};

export const useCreateActivityProductionLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateActivityProductionLogDTO) => {
      return createActivityProductionLog(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACTIVITY_PRODUCTION_LOGS],
      });
      toast.success("Activity production log created successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create activity production log"
      );
    },
  });
};

export const useGetActivityCrew = (activityId: string, productionId: string) => {
  return useQuery<GetActivityCrew>({
    queryKey: ["ActivityPerDay", activityId, productionId],
    queryFn: () => getCrewAndForecastedDateForActivity(activityId, productionId),
    enabled: !!activityId,
  });
};

export const useUpdateActivityProductionLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateActivityProductionLogDTO;
    }) => {
      return updateActivityProductionLog(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACTIVITY_PRODUCTION_LOGS],
      });
      toast.success("Activity production log updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update activity production log"
      );
    },
  });
};

export const useDeleteActivityProductionLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteActivityProductionLog(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACTIVITY_PRODUCTION_LOGS],
      });
      toast.success("Activity production log deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete activity production log"
      );
    },
  });
};
