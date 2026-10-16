import * as calibrationRepository from "../repositories/calibrationRepository";
import { WaterlevelUpdateCalibrationSettings, UpdateCalibrationSettings, ParCalibrationRow } from "../types/calibrationSettings";
import { roundUp, calculateSlope, roundUpResolution } from "../lib/helpers";

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
      return calibrationRepository.fetchWaterLevelCalibration(loggerId);
    case "4132":
      // PAR
      return calibrationRepository.fetchParCalibration(loggerId);
    case "4137":
      // Rain Gauge
      return calibrationRepository.fetchParCalibration(loggerId);
    case "4161":
      // Multi Profile
      return calibrationRepository.fetchMptCalibration(loggerId);
    case "4181":
      // Temperature sensor
      return calibrationRepository.fetchTemperatureCalibration(loggerId);
    default:
    // Code runs if no cases match
  }
}

export async function updateCalibrationSettings(
  loggerId: string,
  settings: UpdateCalibrationSettings,
  typeId: string,
) {
  switch (typeId) {
    case "4131":
      const waterLevelSettings = settings as WaterlevelUpdateCalibrationSettings;
      if(waterLevelSettings.reset){
        //If the reset flag is set copy the manufacturing settings to the user settings table
        return calibrationRepository.resetWaterLevelToDefaults(
        loggerId
      );
      }else{
      //const waterLevelSettings = settings as WaterlevelUpdateCalibrationSettings;

      const defaultPulseCount = 110;
      // Water Level
      const mfrCalibrationSettings =
        await calibrationRepository.fetchWaterLevelMfrCalibrationSettings(
          loggerId,
        );
      //console.log("WL MFR SETTINGS", mfrCalibrationSettings);
      //console.log("WL FORM SETTINGS", settings.firstReadingLogger,settings.firstReadingReference);
      
      const formattedFirstLoggerReading = formatNumber(Number(waterLevelSettings.firstReadingLogger));
      console.log('FIRST READING CONVERTED',waterLevelSettings.firstReadingLogger);
      waterLevelSettings.firstReadingLogger = formattedFirstLoggerReading;
      
      const formattedSecondLoggerReading = formatNumber(Number(waterLevelSettings.secondReadingLogger));
      console.log('SECOND READING CONVERTED',formattedSecondLoggerReading);
      waterLevelSettings.secondReadingLogger = formattedSecondLoggerReading;

      const lowTargetReportedCounts = waterLevelSettings.firstReadingReference * 10;
      const highTargetReportedCounts = waterLevelSettings.secondReadingReference * 10;
      const lowCalculatedRaw = roundUp(
        (((Number(waterLevelSettings.firstReadingLogger) * 10) -
          mfrCalibrationSettings?.e! * waterLevelSettings.temperature * 100 -
          mfrCalibrationSettings?.a!) /
          mfrCalibrationSettings?.b!),
        1
      );
      const highCalculatedRaw = roundUp(
        (((Number(waterLevelSettings.secondReadingLogger) * 10) -
          mfrCalibrationSettings?.e! * waterLevelSettings.temperature * 100 -
          mfrCalibrationSettings?.a!) /
          mfrCalibrationSettings?.b!),
        1
      );

      //console.log('POLYA',lowTargetReportedCounts,highTargetReportedCounts,lowCalculatedRaw,highCalculatedRaw);
      
      const polynomialValueB = calculateSlope(lowTargetReportedCounts,highTargetReportedCounts,lowCalculatedRaw,highCalculatedRaw);
      const polynomialValueE = (mfrCalibrationSettings?.e!*mfrCalibrationSettings?.sensorLength!/defaultPulseCount)*polynomialValueB/mfrCalibrationSettings?.b!;
      const polynomialValueA = (10*waterLevelSettings.firstReadingReference)-((waterLevelSettings.temperature*100)*polynomialValueE)-lowCalculatedRaw*polynomialValueB;
      const resolution = roundUpResolution(polynomialValueB/10,1);
      const temperatureCompenation = polynomialValueE*10;
      //console.log('CAL VALUES',polynomialValueA,polynomialValueB,polynomialValueE,mfrCalibrationSettings?.K0,mfrCalibrationSettings?.K1,resolution,temperatureCompenation);
      //console.log('POLYA',settings.firstReadingReference,settings.temperature,polynomialValueE,lowCalculatedRaw,polynomialValueB);
      //console.log('POLYE',mfrCalibrationSettings?.e!,mfrCalibrationSettings?.sensorLength!,defaultPulseCount,polynomialValueB,mfrCalibrationSettings?.b!);
      waterLevelSettings.polynomialA = polynomialValueA;
      waterLevelSettings.polynomialB = polynomialValueB;
      waterLevelSettings.polynomialE = polynomialValueE;
      waterLevelSettings.K0 = mfrCalibrationSettings?.K0;
      waterLevelSettings.K1 = mfrCalibrationSettings?.K1;
      waterLevelSettings.resolution = resolution;
      waterLevelSettings.tempComp = temperatureCompenation;

      console.log('ALL CAL SETTINGS',waterLevelSettings);

      return calibrationRepository.updateWaterLevelCalibrationSettings(
        loggerId,
        waterLevelSettings,
      );
    }
    case "4132":
    // PAR
    const ParSettings = settings as ParCalibrationRow;
    //Covert the minutes from the UI to seconds for the DB column
    ParSettings.testDuration = ParSettings.testDuration*60;
    return calibrationRepository.updateParCalibrationSettings(loggerId, ParSettings);
    case "4137":
    // Rain Gauge
    //return loggerRepository.fetchParCalibration(loggerId);
    case "4161":
    // Multi Profile
    console.log('MPT UPDATE SETTINGS', settings);
    //return loggerRepository.fetchMptCalibration(loggerId);
    case "4181":
    // Temperature sensor
    //return loggerRepository.fetchTemperatureCalibration(loggerId);
    default:
    // Code runs if no cases match
  }
}

function formatNumber(num:number) {
  if (num >= 10000 && num <= 99999) {
    num /= 10;
  }

  return num.toFixed(1);
}
