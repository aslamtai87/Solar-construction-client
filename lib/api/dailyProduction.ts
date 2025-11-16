import { API_ENDPOINTS } from "./endPoints";
import api from "./api";
import { DailyProductionExecutiveViewResponse } from "@/modules/scheduleManagement/components/DailyProduction/types";

export const getDailyProductionExecutiveView = async (params: {
  projectId: string;
  phaseId?: string;
  startDate: string;
  endDate: string;
}): Promise<{ data: DailyProductionExecutiveViewResponse }> => {
  const queryParams = new URLSearchParams({
    projectId: params.projectId,
    startDate: params.startDate,
    endDate: params.endDate,
    ...(params.phaseId && { phaseId: params.phaseId }),
  });

  const response = await api.get<{ data: DailyProductionExecutiveViewResponse }>(
    `${API_ENDPOINTS.DAILY_PRODUCTION_EXECUTIVE_VIEW}?${queryParams.toString()}`
  );
  return response.data;
};
