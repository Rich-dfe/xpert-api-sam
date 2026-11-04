import { validateLoggerLicense } from "./licenseService";
import { getChartData } from "../repositories/chartDataRepository";
import { loggerMeasurementConfig } from "../lib/loggerPrimaryDataConfig";

import type { LoggerReading } from "../types/logger";
import type { MeasurementConfig } from "../lib/loggerPrimaryDataConfig";

export interface ChartDataResult {
  success: boolean;
  message?: string;
  readings?: LoggerReading[];
  measurements?: MeasurementConfig[];
}

export async function getLoggerChartData(
  loggerUid: string,
  loggerTypeId: number,
  startDate: number,
  endDate: number,
): Promise<ChartDataResult> {
  //Validate requested date range
  if (
    !Number.isSafeInteger(startDate) ||
    !Number.isSafeInteger(endDate) ||
    startDate > endDate
  ) {
    return {
      success: false,
      message: "INVALID DATE RANGE",
    };
  }

  // Get the measurement config for the logger type
  const measurements = loggerMeasurementConfig[loggerTypeId];

  if (!measurements) {
    return {
      success: false,
      message: "UNSUPPORTED LOGGER TYPE",
    };
  }

  //Validate the license using the license service
  const licenseResult = await validateLoggerLicense(
    loggerUid,
    startDate,
    endDate,
  );

  if (!licenseResult.valid) {
    return {
      success: false,
      message: licenseResult.message,
    };
  }

  //Get primary readings from dynamoDB
  const readings = await getChartData(loggerUid, startDate, endDate);

  return {
    success: true,
    readings,
    measurements,
  };
}
