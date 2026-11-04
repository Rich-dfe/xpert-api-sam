import { RowDataPacket } from "mysql2";

export interface LoggerLicensePeriod {
  startUnix: number;
  endUnix: number;
}

export interface LoggerLicenseRow extends RowDataPacket {
  startsunix: number;
  endsunix: number;
}

export interface LicenseValidationResult {
  valid: boolean;
  message?: string;
}