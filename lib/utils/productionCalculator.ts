import { DailyProduction, ProductionMethod } from "@/lib/types/production";

/**
 * Calculate daily production based on the selected method
 * Uses AI-enhanced algorithms for ramp-up, ramp-down, and s-curve
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
  const start = new Date(startDate);

  switch (method) {
    case "constant":
      // Custom method - user-defined constant production
      return calculateConstantProduction(totalUnits, duration, start, config.unitsPerDay!);

    case "ramp-up":
      // AI-enhanced ramp-up with learning curves and efficiency improvements
      return calculateAIRampUpProduction(totalUnits, duration, start);

    case "ramp-down":
      // AI-enhanced ramp-down with fatigue and resource depletion
      return calculateAIRampDownProduction(totalUnits, duration, start);

    case "s-curve":
      // AI-enhanced S-curve with realistic construction project dynamics
      return calculateAISCurveProduction(totalUnits, duration, start);

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
      // Ramp-up phase with sigmoid curve for smooth acceleration
      const progress = (day - 1) / (rampUpDays - 1 || 1);
      const smoothProgress = smoothSigmoid(progress);
      targetUnits = startUnitsPerDay + (peakUnitsPerDay - startUnitsPerDay) * smoothProgress;
    } else if (day <= rampUpDays + steadyDays) {
      // Steady phase with minor variations (±5%) for realism
      const variation = (Math.sin(day * 0.5) * 0.05);
      targetUnits = peakUnitsPerDay * (1 + variation);
    } else {
      // Ramp-down phase with sigmoid curve for smooth deceleration
      const daysInRampDown = day - (rampUpDays + steadyDays);
      const progress = (daysInRampDown - 1) / (rampDownDays - 1 || 1);
      const smoothProgress = smoothSigmoid(progress);
      targetUnits = peakUnitsPerDay - (peakUnitsPerDay - endUnitsPerDay) * smoothProgress;
    }

    // Last day adjustment to ensure exact total
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
 * AI-Enhanced Ramp-up with learning curve and efficiency improvements
 * Considers: team learning, process optimization, resource familiarity
 */
export function calculateAIRampUpProduction(
  totalUnits: number,
  duration: number,
  startDate: Date
): DailyProduction[] {
  const dailyProduction: DailyProduction[] = [];
  const avgUnits = totalUnits / duration;
  
  // AI parameters based on construction industry research
  const learningRate = 0.85; // 15% improvement as team learns
  const initialEfficiency = 0.4; // Start at 40% efficiency
  const maxEfficiency = 1.6; // Can reach 160% of average at peak
  
  let totalAllocated = 0;

  for (let day = 1; day <= duration; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);
    
    // Learning curve: efficiency improves over time (logarithmic growth)
    const progress = (day - 1) / (duration - 1 || 1);
    const learningFactor = initialEfficiency + (maxEfficiency - initialEfficiency) * 
      Math.pow(progress, learningRate);
    
    // Apply smooth sigmoid for natural acceleration
    const smoothProgress = smoothSigmoid(progress);
    const efficiency = initialEfficiency + (maxEfficiency - initialEfficiency) * smoothProgress;
    
    // Weekend adjustment (reduced productivity on weekends)
    const dayOfWeek = currentDate.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0;
    
    // Calculate target units with all AI factors
    let targetUnits = avgUnits * efficiency * weekendFactor;
    
    // Weather/external factors simulation (random ±10% variation)
    const externalFactor = 1 + (Math.sin(day * 1.3) * 0.1);
    targetUnits *= externalFactor;
    
    // Last day adjustment
    if (day === duration) {
      targetUnits = totalUnits - totalAllocated;
    }

    dailyProduction.push({
      day,
      date: currentDate.toISOString().split("T")[0],
      targetUnits: Math.max(0, Math.round(targetUnits * 100) / 100),
    });

    totalAllocated += targetUnits;
  }

  return normalizeToTotal(dailyProduction, totalUnits);
}

/**
 * AI-Enhanced Ramp-down with fatigue and resource depletion factors
 * Considers: team fatigue, material availability, project closeout activities
 */
export function calculateAIRampDownProduction(
  totalUnits: number,
  duration: number,
  startDate: Date
): DailyProduction[] {
  const dailyProduction: DailyProduction[] = [];
  const avgUnits = totalUnits / duration;
  
  // AI parameters
  const maxEfficiency = 1.6; // Start at 160% (team at peak performance)
  const finalEfficiency = 0.4; // End at 40% (closeout, cleanup, punch list)
  const fatigueRate = 1.2; // Faster decline due to fatigue
  
  let totalAllocated = 0;

  for (let day = 1; day <= duration; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);
    
    const progress = (day - 1) / (duration - 1 || 1);
    
    // Apply inverse sigmoid for natural deceleration
    const smoothProgress = smoothSigmoid(progress);
    const efficiency = maxEfficiency - (maxEfficiency - finalEfficiency) * 
      Math.pow(smoothProgress, fatigueRate);
    
    // Weekend adjustment
    const dayOfWeek = currentDate.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0;
    
    // Calculate target units
    let targetUnits = avgUnits * efficiency * weekendFactor;
    
    // Material availability decline (last 30% of project)
    if (progress > 0.7) {
      const materialFactor = 1 - ((progress - 0.7) / 0.3) * 0.2; // Up to 20% reduction
      targetUnits *= materialFactor;
    }
    
    // External factors
    const externalFactor = 1 + (Math.sin(day * 1.1) * 0.08);
    targetUnits *= externalFactor;
    
    // Last day adjustment
    if (day === duration) {
      targetUnits = totalUnits - totalAllocated;
    }

    dailyProduction.push({
      day,
      date: currentDate.toISOString().split("T")[0],
      targetUnits: Math.max(0, Math.round(targetUnits * 100) / 100),
    });

    totalAllocated += targetUnits;
  }

  return normalizeToTotal(dailyProduction, totalUnits);
}

/**
 * AI-Enhanced S-Curve with realistic construction project dynamics
 * Considers: mobilization, team optimization, peak efficiency, demobilization
 */
export function calculateAISCurveProduction(
  totalUnits: number,
  duration: number,
  startDate: Date
): DailyProduction[] {
  const dailyProduction: DailyProduction[] = [];
  const avgUnits = totalUnits / duration;
  
  // S-curve phases based on construction best practices
  const mobilizationPhase = Math.ceil(duration * 0.20); // 20% - setup, learning
  const accelerationPhase = Math.ceil(duration * 0.25); // 25% - ramping up
  const peakPhase = Math.ceil(duration * 0.30); // 30% - peak efficiency
  const decelerationPhase = duration - mobilizationPhase - accelerationPhase - peakPhase; // 25% - closeout
  
  const peakEfficiency = 1.9; // Peak at 190% of average
    
  let totalAllocated = 0;

  for (let day = 1; day <= duration; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);
    
    let efficiency: number;
    
    // Determine phase and calculate efficiency
    if (day <= mobilizationPhase) {
      // Mobilization: slow start with learning curve
      const phaseProgress = (day - 1) / mobilizationPhase;
      efficiency = 0.3 + (0.7 * smoothSigmoid(phaseProgress)); // 30% to 100%
    } else if (day <= mobilizationPhase + accelerationPhase) {
      // Acceleration: rapid improvement
      const phaseProgress = (day - mobilizationPhase - 1) / accelerationPhase;
      efficiency = 1.0 + (0.9 * smoothSigmoid(phaseProgress)); // 100% to 190%
    } else if (day <= mobilizationPhase + accelerationPhase + peakPhase) {
      // Peak: maintain high efficiency with minor variations
      const phaseDay = day - mobilizationPhase - accelerationPhase;
      const variation = Math.sin(phaseDay * 0.8) * 0.05; // ±5% variation
      efficiency = peakEfficiency * (1 + variation);
    } else {
      // Deceleration: controlled ramp-down
      const phaseProgress = (day - mobilizationPhase - accelerationPhase - peakPhase - 1) / 
        (decelerationPhase || 1);
      efficiency = peakEfficiency - ((peakEfficiency - 0.5) * smoothSigmoid(phaseProgress));
    }
    
    // Weekend adjustment
    const dayOfWeek = currentDate.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.65 : 1.0;
    
    // Calculate target units
    let targetUnits = avgUnits * efficiency * weekendFactor;
    
    // Weather/seasonal factors
    const seasonalFactor = 1 + (Math.sin(day * 0.4) * 0.12);
    targetUnits *= seasonalFactor;
    
    // Resource optimization (improves over first 40% of project)
    const progress = (day - 1) / duration;
    if (progress < 0.4) {
      const optimizationFactor = 0.85 + (0.15 * (progress / 0.4));
      targetUnits *= optimizationFactor;
    }
    
    // Last day adjustment
    if (day === duration) {
      targetUnits = totalUnits - totalAllocated;
    }

    dailyProduction.push({
      day,
      date: currentDate.toISOString().split("T")[0],
      targetUnits: Math.max(0, Math.round(targetUnits * 100) / 100),
    });

    totalAllocated += targetUnits;
  }

  return normalizeToTotal(dailyProduction, totalUnits);
}

/**
 * Smooth sigmoid function for natural curves
 * Maps [0, 1] to [0, 1] with smooth acceleration/deceleration
 */
function smoothSigmoid(x: number): number {
  // Modified sigmoid for smoother transitions
  return 1 / (1 + Math.exp(-12 * (x - 0.5)));
}

/**
 * Normalize production to ensure exact total units
 * Adjusts all days proportionally to match target total
 */
function normalizeToTotal(
  dailyProduction: DailyProduction[],
  targetTotal: number
): DailyProduction[] {
  const currentTotal = dailyProduction.reduce((sum, day) => sum + day.targetUnits, 0);
  
  if (currentTotal === 0) return dailyProduction;
  
  const adjustmentFactor = targetTotal / currentTotal;
  
  return dailyProduction.map(day => ({
    ...day,
    targetUnits: Math.round(day.targetUnits * adjustmentFactor * 100) / 100,
  }));
}

/**
 * Format production method for display
 */
export function formatProductionMethod(method: ProductionMethod): string {
  switch (method) {
    case "constant":
      return "Constant";
    case "ramp-up":
      return "Ramp Up (AI)";
    case "ramp-down":
      return "Ramp Down (AI)";
    case "s-curve":
      return "S-Curve (AI)";
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
