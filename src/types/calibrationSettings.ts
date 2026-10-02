import { RowDataPacket } from "mysql2";
import { OnDatagramStatusCallback } from "node:quic";
import { updateWaterLevelCalibrationSettings } from "../repositories/calibrationRepository";


//WATER LEVEL
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
  serverSideCalFlag: boolean;
}

//The settings expected by the database when updating the calibration 
export interface WaterlevelUpdateCalibrationSettings {
  typeId:4131,
  firstReadingReference: number;
  secondReadingReference: number;
  firstReadingLogger: number;
  secondReadingLogger: number;
  temperature: number;
  polynomialA: number;
  polynomialB: number;
  polynomialE: number;
  K0?: number;
  K1?: number;
  serverSideCalFlag:boolean;
  reset:boolean;
  resolution:number;
  tempComp:number;
}

//The manufacturing settings returned from the database
export interface WaterlevelMfrCalibrationSettings extends RowDataPacket {
  a: number;
  b: number;
  e: number;
  K0: number;
  K1: number;
  sensorLength: number;
}

//PAR
export interface ParCalibrationRow extends RowDataPacket {
  typeId:4132,
  loggerReadingTotal: number;
  refReadingAverage: number;
  units: number;
  testDuration: number;
}

export type UpdateCalibrationSettings = WaterlevelUpdateCalibrationSettings | ParCalibrationRow;