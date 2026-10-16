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
  firstReadingLogger: string;
  secondReadingLogger: string;
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
  typeId:4132;
  loggerReadingTotal: number;
  refReadingAverage: number;
  units: number;
  testDuration: number;
}

export interface ParCalibrationUpdateSettings{
  typeId:4132;
  loggerReadingTotal: number;
  refReadingAverage: number;
  units: number;
  testDuration: number;
}

export interface MptCalibrationSettings extends RowDataPacket {
    dry_limit_line: number;
    fc_limit_line: number;
    soil_type_id: number;
    wilt_point: number;
    sat_soil_weight: number;
    dry_soil_weight: number;
    sat_soil_volume: number;
    slope: number;
    offset: number;
    cal_type: number;
    cal_method: number;
    soil_moisture_units: number;
}

export interface MptSensor {
  soilType: string;
  dryPoint: number;
  fieldCapacity: number;
  wiltPoint: number;
  saturatedSoilWeight: number;
  drySoilWeight: number;
  saturatedVolume: number;
  slope: number;
  offset: number;
}

export interface MptCalibrationUpdateSettings {
  units: string;
  calType: boolean;
  calcMethod: boolean;
  sensors: MptSensor[];
  typeId: number;
  loggerId: string;
  loggerUid: number;
}

export type UpdateCalibrationSettings = WaterlevelUpdateCalibrationSettings | ParCalibrationUpdateSettings | MptCalibrationUpdateSettings;

