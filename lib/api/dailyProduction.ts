import { API_ENDPOINTS } from "./endPoints";
import api from "./api";
import { 
  DailyProductionExecutiveViewResponse,
  DetailedProductionViewResponse 
} from "@/modules/scheduleManagement/components/DailyProduction/types";

export const getDailyProductionExecutiveView = async (params: {
  projectId: string;
  phaseId?: string;
  startDate: string;
}): Promise<{ data: DailyProductionExecutiveViewResponse }> => {
  const queryParams = new URLSearchParams({
    projectId: params.projectId,
    startDate: params.startDate,
    ...(params.phaseId && { phaseId: params.phaseId }),
  });

  const response = await api.get<{ data: DailyProductionExecutiveViewResponse }>(
    `${API_ENDPOINTS.DAILY_PRODUCTION_EXECUTIVE_VIEW}?${queryParams.toString()}`
  );
  return response.data;
};

export const getDailyProductionDetailedView = async (params: {
  projectId: string;
}): Promise<{ data: DetailedProductionViewResponse }> => {
  const queryParams = new URLSearchParams({
    projectId: params.projectId,
  });

  const response = await api.get<{ data: DetailedProductionViewResponse }>(
    `${API_ENDPOINTS.DAILY_PRODUCTION_DETAILED_VIEW}?${queryParams.toString()}`
  );
  return response.data;
};
