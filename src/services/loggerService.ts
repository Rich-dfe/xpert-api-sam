import * as loggerRepository from "../repositories/loggerRespository";
import { LoggerConfigSettings } from "../types/logger";


///////////////////////////////////////////
// LOGGER CONFIG SETTINGS
//////////////////////////////////////////
export async function updateLoggerConfigSettings(
  settings: LoggerConfigSettings,
) {
  return loggerRepository.updateLoggerConfig(settings);
}

export async function fetchLoggerConfigSettings(
  loggerId: string,
){
  return loggerRepository.fetchLoggerConfigSettings(loggerId);
}

///////////////////////////////////////////
// ETAG UPDATE
//////////////////////////////////////////
export async function updateEtag(userId:number){
  return loggerRepository.updateEtag(userId);
}

///////////////////////////////////////////
// SENSOR SETTINGS
//////////////////////////////////////////

///////////////////////////////////////////
// CALIBRATION SETTINGS
//////////////////////////////////////////

///////////////////////////////////////////
// OTHER
//////////////////////////////////////////
export async function fetchLoggerUidByLoggerId(loggerId: string): Promise<string | undefined> {
  return loggerRepository.fetchLoggerUidByLoggerId(loggerId);
}
