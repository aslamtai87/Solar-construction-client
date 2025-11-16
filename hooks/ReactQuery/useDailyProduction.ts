import { useQuery } from "@tanstack/react-query";
import { getDailyProductionExecutiveView } from "@/lib/api/dailyProduction";
import { QUERY_KEYS } from "@/lib/api/endPoints";
import { DailyProductionExecutiveViewResponse } from "@/modules/scheduleManagement/components/DailyProduction/types";

export const useDailyProductionExecutiveView = (params: {
  projectId: string;
  phaseId?: string;
  startDate: string;
  endDate: string;
  enabled?: boolean;
}) => {
  return useQuery<{ data: DailyProductionExecutiveViewResponse }>({
    queryKey: [
      QUERY_KEYS.DAILY_PRODUCTION_EXECUTIVE_VIEW,
      params.projectId,
      params.phaseId,
      params.startDate,
      params.endDate,
    ],
    queryFn: () => getDailyProductionExecutiveView(params),
    enabled: params.enabled !== false && !!params.projectId && !!params.startDate && !!params.endDate,
  });
};
