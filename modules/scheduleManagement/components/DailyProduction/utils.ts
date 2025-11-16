import { 
  ActivityProduction, 
  CrewProduction,
  ActivityProductionData,
  ActivitySummary,
  CrewSummary
} from "./types";

export const getVariance = (forecasted: number, actual: number) => {
  const variance = actual - forecasted;
  const percentVariance =
    forecasted > 0 ? ((variance / forecasted) * 100).toFixed(1) : "0.0";
  return { variance, percentVariance };
};

export const getDates = (crews: CrewProduction[]) => {
  if (crews.length === 0 || crews[0].dailyProduction.length === 0) return [];
  return crews[0].dailyProduction.map((d) => d.date);
};

export const getActivityChartData = (productionData: ActivityProduction[]) => {
  return productionData
    .filter((activity) => activity.crews.length > 0)
    .map((activity) => {
      let totalForecasted = 0;
      let totalActual = 0;

      activity.crews.forEach((crew) => {
        crew.dailyProduction.forEach((day) => {
          totalForecasted += day.forecasted;
          totalActual += day.actual;
        });
      });

      const variance = totalActual - totalForecasted;
      const percentVariance =
        totalForecasted > 0 ? (variance / totalForecasted) * 100 : 0;

      return {
        id: activity.activityId,
        name: activity.activityName,
        forecasted: totalForecasted,
        actual: totalActual,
        variance: variance,
        percentVariance: percentVariance.toFixed(1),
      };
    });
};

export const getCrewChartData = (
  productionData: ActivityProduction[],
  activityId: string
) => {
  const activity = productionData.find((a) => a.activityId === activityId);
  if (!activity) return [];

  return activity.crews.map((crew) => {
    let totalForecasted = 0;
    let totalActual = 0;

    crew.dailyProduction.forEach((day) => {
      totalForecasted += day.forecasted;
      totalActual += day.actual;
    });

    const variance = totalActual - totalForecasted;
    const percentVariance =
      totalForecasted > 0 ? (variance / totalForecasted) * 100 : 0;

    return {
      name: crew.crewName,
      forecasted: totalForecasted,
      actual: totalActual,
      variance: variance,
      percentVariance: percentVariance.toFixed(1),
    };
  });
};

// Transform API response directly to ActivitySummary format for charts
export const transformApiDataToActivityChart = (
  activities: ActivityProductionData[]
): ActivitySummary[] => {
  return activities.map((activity) => ({
    id: activity.activityId,
    name: activity.activityName,
    forecasted: activity.forecasted,
    actual: activity.actual,
    variance: activity.variance,
    percentVariance: activity.variancePercentage.toFixed(1),
  }));
};

// Transform API response to CrewSummary format for crew charts
export const transformApiDataToCrewChart = (
  activityId: string,
  activities: ActivityProductionData[]
): CrewSummary[] => {
  const activity = activities.find((a) => a.activityId === activityId);
  if (!activity) return [];

  return activity.crews.map((crew) => ({
    name: crew.crewName,
    forecasted: crew.forecasted,
    actual: crew.actual,
    variance: crew.variance,
    percentVariance: crew.variancePercentage.toFixed(1),
  }));
};

// Get activity name by ID
export const getActivityNameById = (
  activityId: string,
  activities: ActivityProductionData[]
): string => {
  const activity = activities.find((a) => a.activityId === activityId);
  return activity?.activityName || "";
};

