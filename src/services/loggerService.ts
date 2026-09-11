import * as loggerRepository from "../repositories/loggerRespository";
import { LoggerConfigSettings } from "../types/logger";
import { WaterlevelUpdateCalibrationSettings } from "../types/calibrationSettings";

///////////////////////////////////////////
// LOGGER CONFIG SETTINGS
//////////////////////////////////////////
export async function updateLoggerConfigSettings(
  settings: LoggerConfigSettings,
) {
  return loggerRepository.updateLoggerConfig(settings);
}

export async function fetchLoggerConfigSettings(loggerId: string) {
  return loggerRepository.fetchLoggerConfigSettings(loggerId);
}

///////////////////////////////////////////
// ETAG UPDATE
//////////////////////////////////////////
export async function updateEtag(userId: number) {
  return loggerRepository.updateEtag(userId);
}

///////////////////////////////////////////
// SENSOR SETTINGS
//////////////////////////////////////////
export async function fetchSensorConfigSettings(
  loggerId: string,
  typeId: string,
) {
  switch (typeId) {
    case "4131":
      // Water Level
      return loggerRepository.fetchWaterLevelSenorConfig(loggerId);
    case "4132":
      // PAR
      return loggerRepository.fetchParSenorConfig(loggerId);
    case "4137":
      // Rain Gauge
      return loggerRepository.fetchRainGaugeSenorConfig(loggerId);
    case "4161":
      // Multi Profile
      return loggerRepository.fetchMptSenorConfig(loggerId);
    case "4181":
      // Temperature sensor
      return loggerRepository.fetchTemperatureSenorConfig(loggerId);
    default:
    // Code runs if no cases match
  }
}

export async function updateSensorConfigSettings(
  loggerId: number,
  typeId: string,
  value: number
) {
  console.log('SERVICE VARS',loggerId,typeId,value);
  switch (typeId) {
    case "4131":
      // Water Level
      return loggerRepository.updateWaterLevelSensorConfig(loggerId,value);
    case "4132":
      // PAR
      return loggerRepository.updateParSensorConfig(loggerId,value);
    case "4137":
      // Rain Gauge
      return loggerRepository.updateRainGaugeSensorConfig(loggerId,value);
    case "4161":
      // Multi Profile
      return loggerRepository.updateMptSensorConfig(loggerId,value);
    case "4181":
      // Temperature sensor
      return loggerRepository.updateTemperatureSensorConfig(loggerId,value);
    default:
    // Code runs if no cases match
  }
}

///////////////////////////////////////////
// CALIBRATION SETTINGS
//////////////////////////////////////////
export async function fetchCalibrationSettings(
  loggerId: string,
  typeId: string,
) {
  switch (typeId) {
    case "4131":
      // Water Level
      return loggerRepository.fetchWaterLevelCalibration(loggerId);
    case "4132":
      // PAR
      return loggerRepository.fetchParCalibration(loggerId);
    case "4137":
      // Rain Gauge
      return loggerRepository.fetchParCalibration(loggerId);
    case "4161":
      // Multi Profile
      return loggerRepository.fetchMptCalibration(loggerId);
    case "4181":
      // Temperature sensor
      return loggerRepository.fetchTemperatureCalibration(loggerId);
    default:
    // Code runs if no cases match
  }
}

export async function updateCalibrationSettings(
  loggerId: number,
  settings: WaterlevelUpdateCalibrationSettings,
  typeId: string,
) {
  switch (typeId) {
    case "4131":
      // Water Level
      return loggerRepository.updateWaterLevelCalibrationSettings(loggerId,settings);
    case "4132":
      // PAR
      //return loggerRepository.fetchParCalibration(loggerId);
    case "4137":
      // Rain Gauge
      //return loggerRepository.fetchParCalibration(loggerId);
    case "4161":
      // Multi Profile
      //return loggerRepository.fetchMptCalibration(loggerId);
    case "4181":
      // Temperature sensor
      //return loggerRepository.fetchTemperatureCalibration(loggerId);
    default:
    // Code runs if no cases match
  }
}

///////////////////////////////////////////
// OTHER
//////////////////////////////////////////
export async function fetchLoggerUidByLoggerId(
  loggerId: string,
): Promise<string | undefined> {
  return loggerRepository.fetchLoggerUidByLoggerId(loggerId);
}
