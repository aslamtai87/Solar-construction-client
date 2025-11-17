import { useQuery } from "@tanstack/react-query";
import { getDailyProductionExecutiveView, getDailyProductionDetailedView } from "@/lib/api/dailyProduction";
import { QUERY_KEYS } from "@/lib/api/endPoints";
import { 
  DailyProductionExecutiveViewResponse,
  DetailedProductionViewResponse 
} from "@/modules/scheduleManagement/components/DailyProduction/types";

export const useDailyProductionExecutiveView = (params: {
  projectId: string;
  phaseId?: string;
  startDate: string;
  enabled?: boolean;
}) => {
  return useQuery<{ data: DailyProductionExecutiveViewResponse }>({
    queryKey: [
      QUERY_KEYS.DAILY_PRODUCTION_EXECUTIVE_VIEW,
      params.projectId,
      params.phaseId,
      params.startDate,
    ],
    queryFn: () => getDailyProductionExecutiveView(params),
    enabled: params.enabled !== false && !!params.projectId && !!params.startDate,
  });
};

export const useDailyProductionDetailedView = (params: {
  projectId: string;
  enabled?: boolean;
}) => {
  return useQuery<{ data: DetailedProductionViewResponse }>({
    queryKey: [
      QUERY_KEYS.DAILY_PRODUCTION_DETAILED_VIEW,
      params.projectId,
    ],
    queryFn: () => getDailyProductionDetailedView(params),
    enabled: params.enabled !== false && !!params.projectId,
  });
};

