import { ActivityProduction } from "./types";

// Mock data - replace this with actual API call
export const getMockProductionData = (): ActivityProduction[] => {
  return [
    {
      activityId: "act-001",
      activityName: "Foundation & Structural Work",
      type: "activity",
      crews: [
        {
          crewName: "Crew A (Pile Drivers)",
          dailyProduction: [
            { date: "2025-01-05", forecasted: 80, actual: 75 },
            { date: "2025-01-06", forecasted: 95, actual: 90 },
            { date: "2025-01-07", forecasted: 100, actual: 105 },
            { date: "2025-01-08", forecasted: 100, actual: 98 },
            { date: "2025-01-09", forecasted: 100, actual: 102 },
          ],
        },
        {
          crewName: "Crew B (Support)",
          dailyProduction: [
            { date: "2025-01-05", forecasted: 40, actual: 38 },
            { date: "2025-01-06", forecasted: 48, actual: 45 },
            { date: "2025-01-07", forecasted: 50, actual: 52 },
            { date: "2025-01-08", forecasted: 50, actual: 49 },
            { date: "2025-01-09", forecasted: 50, actual: 51 },
          ],
        },
      ],
    },
    {
      activityId: "act-002",
      activityName: "Module Installation",
      type: "activity",
      crews: [
        {
          crewName: "Crew A (Module Installers)",
          dailyProduction: [
            { date: "2025-01-16", forecasted: 200, actual: 185 },
            { date: "2025-01-17", forecasted: 235, actual: 220 },
            { date: "2025-01-18", forecasted: 250, actual: 245 },
            { date: "2025-01-19", forecasted: 250, actual: 255 },
            { date: "2025-01-20", forecasted: 250, actual: 248 },
            { date: "2025-01-21", forecasted: 250, actual: 248 },
            { date: "2025-01-22", forecasted: 250, actual: 248 },
            { date: "2025-01-23", forecasted: 250, actual: 248 },
            { date: "2025-01-24", forecasted: 250, actual: 248 },
            { date: "2025-01-25", forecasted: 250, actual: 248 },
            { date: "2025-01-26", forecasted: 250, actual: 248 },
            { date: "2025-01-27", forecasted: 250, actual: 248 },
            { date: "2025-01-28", forecasted: 250, actual: 248 },
            { date: "2025-01-29", forecasted: 250, actual: 248 },
            { date: "2025-01-30", forecasted: 250, actual: 248 },
            
          ],
        },
        {
          crewName: "Crew B (Module Installers)",
          dailyProduction: [
            { date: "2025-01-16", forecasted: 200, actual: 195 },
            { date: "2025-01-17", forecasted: 235, actual: 240 },
            { date: "2025-01-18", forecasted: 250, actual: 250 },
            { date: "2025-01-19", forecasted: 250, actual: 245 },
            { date: "2025-01-20", forecasted: 250, actual: 252 },
            { date: "2025-01-21", forecasted: 250, actual: 249 },
            { date: "2025-01-22", forecasted: 250, actual: 251 },
            { date: "2025-01-23", forecasted: 250, actual: 248 },
            { date: "2025-01-24", forecasted: 250, actual: 250 },
            { date: "2025-01-25", forecasted: 250, actual: 247 },
            { date: "2025-01-26", forecasted: 250, actual: 253 },
            { date: "2025-01-27", forecasted: 250, actual: 249 },
            { date: "2025-01-28", forecasted: 250, actual: 251 },
            { date: "2025-01-29", forecasted: 250, actual: 248 },
            { date: "2025-01-30", forecasted: 250, actual: 252 }
          ],
        },
      ],
    },
  ];
};

// TODO: Replace with actual API calls
export const fetchProductionData = async (
  projectId: string,
  dateRange: { from: Date; to: Date }
): Promise<ActivityProduction[]> => {
  // Simulated API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockProductionData());
    }, 500);
  });
};

export const updateActualProduction = async (
  activityId: string,
  crewName: string,
  date: string,
  value: number
): Promise<void> => {
  // TODO: Implement actual API call
  console.log("Updating actual:", { activityId, crewName, date, value });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};
