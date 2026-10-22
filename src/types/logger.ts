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