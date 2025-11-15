import { WorkingDaysConfig, WorkingDaysType } from "@/lib/types/schedule";

/**
 * Calculate the number of working days between two dates based on working days configuration
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @param config - Working days configuration
 * @returns Number of working days
 */
export function calculateDuration(
  startDate: string,
  endDate: string,
  config: WorkingDaysConfig
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0;
  }

  if (end < start) {
    return 0;
  }

  let duration = 0;
  const current = new Date(start);

  while (current <= end) {
    if (isWorkingDay(current, config)) {
      duration++;
    }
    current.setDate(current.getDate() + 1);
  }

  return duration;
}

/**
 * Check if a given date is a working day based on configuration
 * @param date - Date to check
 * @param config - Working days configuration
 * @returns true if it's a working day
 */
function isWorkingDay(date: Date, config: WorkingDaysConfig): boolean {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

  switch (config.type) {
    case WorkingDaysType.ALL_DAYS:
      return true;

    case WorkingDaysType.WEEKDAYS_ONLY:
      // Monday to Friday (1-5)
      return dayOfWeek >= 1 && dayOfWeek <= 5;

    case WorkingDaysType.CUSTOM:
      // Monday to Friday
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      // Saturday
      const isSaturday = dayOfWeek === 6;
      // Sunday
      const isSunday = dayOfWeek === 0;

      if (isWeekday) return true;
      if (isSaturday && config.includeSaturday) return true;
      if (isSunday && config.includeSunday) return true;
      return false;

    default:
      return true;
  }
}

/**
 * Format duration into a human-readable string
 * @param days - Number of days
 * @returns Formatted string (e.g., "5 days", "1 day")
 */
export function formatDuration(days: number): string {
  if (days === 0) return "0 days";
  if (days === 1) return "1 day";
  return `${days} days`;
}

/**
 * Get working days type display label
 * @param type - Working days type
 * @returns Display label
 */
export function getWorkingDaysLabel(type: WorkingDaysType): string {
  switch (type) {
    case WorkingDaysType.ALL_DAYS:
      return "All Days";
    case WorkingDaysType.WEEKDAYS_ONLY:
      return "Weekdays Only";
    case WorkingDaysType.CUSTOM:
      return "Custom";
    default:
      return "Unknown";
  }
}

/**
 * Get detailed working days description
 * @param config - Working days configuration
 * @returns Detailed description
 */
export function getWorkingDaysDescription(config: WorkingDaysConfig): string {
  switch (config.type) {
    case WorkingDaysType.ALL_DAYS:
      return "Monday - Sunday";
    case WorkingDaysType.WEEKDAYS_ONLY:
      return "Monday - Friday";
    case WorkingDaysType.CUSTOM:
      const days = ["Monday - Friday"];
      if (config.includeSaturday) days.push("Saturday");
      if (config.includeSunday) days.push("Sunday");
      return days.join(", ");
    default:
      return "Unknown";
  }
}
