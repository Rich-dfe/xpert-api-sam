import { RowDataPacket } from "mysql2";

export interface Logger extends RowDataPacket {
    id: number;
    loggerName: string;
    productId: number;
    loggerUid: number;
}

export interface LoggerConfigSettings {
  loggerName: string;
  continuousLogging: boolean;
  startDate: number;
  stopDate: number;
  loggingInterval: number;
  loggerSettingsVersion: number;
  timezone: string;
  applyToGroup: boolean;
  loggerNotes: string;
  loggerId: string;
  typeId: number;
}

export interface LoggerLookup extends RowDataPacket{
  user_id: number;
  logger_uid: number; 
  logger_name: string;
  customer_id: number;
}

export interface LoggerConfigSettingsDBResult extends LoggerConfigSettings, RowDataPacket {};

export type LatestDiagnosticData = {
  data1: number,
  data2: number,
  type: number
}

export type LatestDiagnosticDatabaseResponse = {
  loggerUid: string,
  logDateTime: number,
  createdAt: number,
  ttlDate: number,
  diagnostics: LatestDiagnosticData[],
}

export interface GeneralLoggerInfo extends RowDataPacket {
  loggerName: string,
  type: string,
  model: string,
  serialNumber: string,
  serverSettingsVewrsion: number,
  loggerSettingsVersion: number,
  firmwareVersion: number,
}

export interface LoggerReading {
  loggerUid: string;
  logDateTime: number;

  data1?: number;
  data2?: number;
  s1?: number;
  s2?: number;
  s3?: number;
  s4?: number;
  s5?: number;
  s1t?: number;
  s2t?: number;
  s3t?: number;
  s4t?: number;
  s5t?: number;
  s11t?: number;
}