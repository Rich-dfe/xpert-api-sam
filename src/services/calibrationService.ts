import * as calibrationRepository from "../repositories/calibrationRepository";
import { WaterlevelUpdateCalibrationSettings } from "../types/calibrationSettings";
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
  settings: WaterlevelUpdateCalibrationSettings,
  typeId: string,
) {
  switch (typeId) {
    case "4131":
        const defaultPulseCount = 110;
      // Water Level
      const mfrCalibrationSettings =
        await calibrationRepository.fetchWaterLevelMfrCalibrationSettings(
          loggerId,
        );
      //console.log("WL MFR SETTINGS", mfrCalibrationSettings);
      //console.log("WL FORM SETTINGS", settings.firstReadingLogger,settings.firstReadingReference);
      const lowTargetReportedCounts = settings.firstReadingReference * 10;
      const highTargetReportedCounts = settings.secondReadingReference * 10;
      const lowCalculatedRaw = roundUp(
        (((settings.firstReadingLogger * 10) -
          mfrCalibrationSettings?.e! * settings.temperature * 100 -
          mfrCalibrationSettings?.a!) /
          mfrCalibrationSettings?.b!),
        1
      );
      const highCalculatedRaw = roundUp(
        (((settings.secondReadingLogger * 10) -
          mfrCalibrationSettings?.e! * settings.temperature * 100 -
          mfrCalibrationSettings?.a!) /
          mfrCalibrationSettings?.b!),
        1
      );

      //console.log('POLYA',lowTargetReportedCounts,highTargetReportedCounts,lowCalculatedRaw,highCalculatedRaw);
      
      const polynomialValueB = calculateSlope(lowTargetReportedCounts,highTargetReportedCounts,lowCalculatedRaw,highCalculatedRaw);
      const polynomialValueE = (mfrCalibrationSettings?.e!*mfrCalibrationSettings?.sensorLength!/defaultPulseCount)*polynomialValueB/mfrCalibrationSettings?.b!;
      const polynomialValueA = (10*settings.firstReadingReference)-((settings.temperature*100)*polynomialValueE)-lowCalculatedRaw*polynomialValueB;
      const resolution = roundUpResolution(polynomialValueB/10,1);
      const temperatureCompenation = polynomialValueE*10;
      console.log('CAL VALUES',polynomialValueA,polynomialValueB,polynomialValueE,mfrCalibrationSettings?.K0,mfrCalibrationSettings?.K1,resolution,temperatureCompenation);
      //console.log('POLYA',settings.firstReadingReference,settings.temperature,polynomialValueE,lowCalculatedRaw,polynomialValueB);
      //console.log('POLYE',mfrCalibrationSettings?.e!,mfrCalibrationSettings?.sensorLength!,defaultPulseCount,polynomialValueB,mfrCalibrationSettings?.b!);
      settings.polynomialA = polynomialValueA;
      settings.polynomialB = polynomialValueB;
      settings.polynomialE = polynomialValueE;
      settings.K0 = mfrCalibrationSettings?.K0;
      settings.K1 = mfrCalibrationSettings?.K1;

      return calibrationRepository.updateWaterLevelCalibrationSettings(
        loggerId,
        settings,
      );
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
