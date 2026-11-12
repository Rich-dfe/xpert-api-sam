import type { LoggerReading } from "../types/logger";
import type { ChartDataCalibrationSettings,ChartDataCalibrationSettingsWaterLevel } from "../types/calibrationSettings";

export function calibrateChartData(
  rawData: LoggerReading[],
  calibrationArray: ChartDataCalibrationSettings[],
  typeId: number,
): LoggerReading[] {

  switch (typeId) {

    case 4131: {
      // Water Level
      const calibration = calibrationArray[0] as ChartDataCalibrationSettingsWaterLevel;

      if (!calibration) return rawData;

      return rawData.map(reading => ({
        ...reading,
        data1: (reading.data1! * calibration.b + calibration.e * calibration.calibrationTemperature * 100 + calibration.a) / 10,
        data2: (reading.data2!/100)
      }));
    }
    case 4132:
    case 4137:
    case 4161:
    case 4181:
    default:
      return rawData;
  }
}