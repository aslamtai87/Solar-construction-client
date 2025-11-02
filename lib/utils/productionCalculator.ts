import { DailyProduction, ProductionMethod } from "@/lib/types/production";

/**
 * Calculate daily production based on the selected method
 */
export function calculateDailyProduction(
  method: ProductionMethod,
  totalUnits: number,
  duration: number,
  startDate: string,
  config: {
    unitsPerDay?: number;
    startUnitsPerDay?: number;
    endUnitsPerDay?: number;
    peakUnitsPerDay?: number;
  }
): DailyProduction[] {
  const dailyProduction: DailyProduction[] = [];
  const start = new Date(startDate);

  switch (method) {
    case "constant":
      return calculateConstantProduction(totalUnits, duration, start, config.unitsPerDay!);

    case "ramp-up":
      return calculateRampUpProduction(
        totalUnits,
        duration,
        start,
        config.startUnitsPerDay!,
        config.endUnitsPerDay!
      );

    case "ramp-down":
      return calculateRampDownProduction(
        totalUnits,
        duration,
        start,
        config.startUnitsPerDay!,
        config.endUnitsPerDay!
      );

    case "s-curve":
      return calculateSCurveProduction(
        totalUnits,
        duration,
        start,
        config.peakUnitsPerDay!
      );

    default:
      return [];
  }
}

/**
 * Constant production - same units every day
 */
function calculateConstantProduction(
  totalUnits: number,
  duration: number,
  startDate: Date,
  unitsPerDay: number
): DailyProduction[] {
  const dailyProduction: DailyProduction[] = [];
  let remainingUnits = totalUnits;

  for (let day = 1; day <= duration; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);

    const targetUnits = day === duration
      ? remainingUnits // Last day gets remaining units
      : Math.min(unitsPerDay, remainingUnits);

    dailyProduction.push({
      day,
      date: currentDate.toISOString().split("T")[0],
      targetUnits: Math.round(targetUnits * 100) / 100,
    });

    remainingUnits -= targetUnits;
  }

  return dailyProduction;
}

/**
 * Ramp-up production - gradually increase from start to end units per day
 */
function calculateRampUpProduction(
  totalUnits: number,
  duration: number,
  startDate: Date,
  startUnitsPerDay: number,
  endUnitsPerDay: number
): DailyProduction[] {
  const dailyProduction: DailyProduction[] = [];
  const increment = (endUnitsPerDay - startUnitsPerDay) / (duration - 1);
  let totalAllocated = 0;

  for (let day = 1; day <= duration; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);

    let targetUnits = startUnitsPerDay + increment * (day - 1);
    
    // Last day adjustment
    if (day === duration) {
      targetUnits = totalUnits - totalAllocated;
    }

    dailyProduction.push({
      day,
      date: currentDate.toISOString().split("T")[0],
      targetUnits: Math.round(targetUnits * 100) / 100,
    });

    totalAllocated += targetUnits;
  }

  return dailyProduction;
}

/**
 * Ramp-down production - gradually decrease from start to end units per day
 */
function calculateRampDownProduction(
  totalUnits: number,
  duration: number,
  startDate: Date,
  startUnitsPerDay: number,
  endUnitsPerDay: number
): DailyProduction[] {
  const dailyProduction: DailyProduction[] = [];
  const decrement = (startUnitsPerDay - endUnitsPerDay) / (duration - 1);
  let totalAllocated = 0;

  for (let day = 1; day <= duration; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);

    let targetUnits = startUnitsPerDay - decrement * (day - 1);
    
    // Last day adjustment
    if (day === duration) {
      targetUnits = totalUnits - totalAllocated;
    }

    dailyProduction.push({
      day,
      date: currentDate.toISOString().split("T")[0],
      targetUnits: Math.round(targetUnits * 100) / 100,
    });

    totalAllocated += targetUnits;
  }

  return dailyProduction;
}

/**
 * S-curve production - slow start, peak in middle, slow end
 * Distribution: 30% ramp-up, 40% steady, 30% ramp-down
 */
function calculateSCurveProduction(
  totalUnits: number,
  duration: number,
  startDate: Date,
  peakUnitsPerDay: number
): DailyProduction[] {
  const dailyProduction: DailyProduction[] = [];
  
  // Calculate phase durations
  const rampUpDays = Math.ceil(duration * 0.3);
  const steadyDays = Math.ceil(duration * 0.4);
  const rampDownDays = duration - rampUpDays - steadyDays;

  const startUnitsPerDay = peakUnitsPerDay * 0.3; // Start at 30% of peak
  const endUnitsPerDay = peakUnitsPerDay * 0.3; // End at 30% of peak

  let totalAllocated = 0;

  for (let day = 1; day <= duration; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);

    let targetUnits: number;

    if (day <= rampUpDays) {
      // Ramp-up phase
      const progress = (day - 1) / (rampUpDays - 1 || 1);
      targetUnits = startUnitsPerDay + (peakUnitsPerDay - startUnitsPerDay) * progress;
    } else if (day <= rampUpDays + steadyDays) {
      // Steady phase
      targetUnits = peakUnitsPerDay;
    } else {
      // Ramp-down phase
      const daysInRampDown = day - (rampUpDays + steadyDays);
      const progress = (daysInRampDown - 1) / (rampDownDays - 1 || 1);
      targetUnits = peakUnitsPerDay - (peakUnitsPerDay - endUnitsPerDay) * progress;
    }

    // Last day adjustment
    if (day === duration) {
      targetUnits = totalUnits - totalAllocated;
    }

    dailyProduction.push({
      day,
      date: currentDate.toISOString().split("T")[0],
      targetUnits: Math.round(targetUnits * 100) / 100,
    });

    totalAllocated += targetUnits;
  }

  return dailyProduction;
}

/**
 * Format production method for display
 */
export function formatProductionMethod(method: ProductionMethod): string {
  switch (method) {
    case "constant":
      return "Constant";
    case "ramp-up":
      return "Ramp Up";
    case "ramp-down":
      return "Ramp Down";
    case "s-curve":
      return "S-Curve";
    default:
      return method;
  }
}

/**
 * Get production method description
 */
export function getProductionMethodDescription(method: ProductionMethod): string {
  switch (method) {
    case "constant":
      return "Same production rate every day";
    case "ramp-up":
      return "Gradually increase production from start to end";
    case "ramp-down":
      return "Gradually decrease production from start to end";
    case "s-curve":
      return "Slow start, peak in middle, slow end (30-40-30 distribution)";
    default:
      return "";
  }
}
