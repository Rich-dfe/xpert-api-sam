import { validateLoggerLicense } from "./licenseService";
import { getChartData } from "../repositories/chartDataRepository";
import { getChartDataCalibrationSettings } from "../repositories/chartDataCalibrationRepository";
import { loggerMeasurementConfig } from "../lib/loggerPrimaryDataConfig";
import { calibrateChartData } from "./chartDataCalibrationService";
import type { LoggerReading } from "../types/logger";
import type { MeasurementConfig } from "../lib/loggerPrimaryDataConfig";
import { fetchCalibrationSettings } from "./calibrationService";

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

  //Get the calibration settings to apply to the dynamodb chart data
  const calibrationSettings = await getChartDataCalibrationSettings(loggerUid, loggerTypeId)
  console.log('CAL DATA',calibrationSettings);

  //Get primary readings from dynamoDB
  const rawReadings = await getChartData(loggerUid, startDate, endDate);
  const readings = calibrateChartData(rawReadings,calibrationSettings,loggerTypeId);

  return {
    success: true,
    readings,
    measurements,
  };
}
