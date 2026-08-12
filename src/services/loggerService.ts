import * as loggerRepository from "../repositories/loggerRespository";
import { LoggerConfigSettings } from "../types/logger";



export async function updateLoggerConfigSettings(
  settings: LoggerConfigSettings,
) {
  return loggerRepository.updateLoggerConfig(settings);
}
