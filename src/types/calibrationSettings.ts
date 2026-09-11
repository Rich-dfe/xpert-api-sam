import { RowDataPacket } from "mysql2";

export interface WaterlevelCalibrationRow extends RowDataPacket {
  readingA: number;
  readingB: number;
  actualA: number;
  actualB: number;
  sensor_length: number;
  calibration_temperature: number;
  resolution: number;
  temperature_compensation: number;
  server_side_cal_flag: number;
}

//This is the format expected by client side code (camelCase) 
export interface WaterlevelCalibrationSettings {
  typeId: number;
  firstReadingReference: number;
  secondReadingReference: number;
  firstReadingLogger: number;
  secondReadingLogger: number;
  temperature: number;
  resolution: number;
  temperatureCompensation: number;
  serverSideCalFlag: number;
}

//The settings expected by the database when updating the calibration 
export interface WaterlevelUpdateCalibrationSettings {
  firstReadingReference: number;
  secondReadingReference: number;
  firstReadingLogger: number;
  secondReadingLogger: number;
  temperature: number;
}