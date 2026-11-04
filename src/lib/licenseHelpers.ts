import { LoggerLicensePeriod } from "../types/license";

export function mergeLicensePeriods(
    periods: LoggerLicensePeriod[],

): LoggerLicensePeriod[]{
    if(periods.length === 0){
        return [];
    }

    const sortedPeriods = [...periods].sort((a,b)=>a.startUnix - b.startUnix);

    const merged: LoggerLicensePeriod[] = [
    { ...sortedPeriods[0] },
  ];

  for (let i = 1; i < sortedPeriods.length; i++) {
    const current = sortedPeriods[i];
    const previous = merged[merged.length - 1];

    if (current.startUnix <= previous.endUnix + 1) {
      previous.endUnix = Math.max(
        previous.endUnix,
        current.endUnix,
      );
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

/**
 * Checks whether the entire requested date range
 * falls within a single continuous licence period.
 *
 * Both start and end timestamps are inclusive.
 */
export function isDateRangeLicensed(
  startDate: number,
  endDate: number,
  periods: LoggerLicensePeriod[],
): boolean {
  if (
    !Number.isSafeInteger(startDate) ||
    !Number.isSafeInteger(endDate) ||
    startDate > endDate
  ) {
    return false;
  }

  return periods.some(
    (period) =>
      startDate >= period.startUnix &&
      endDate <= period.endUnix,
  );
}