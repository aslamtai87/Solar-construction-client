import { ActivityProduction, CrewProduction } from "./types";

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
