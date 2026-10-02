import { getPool } from "../lib/database";
import {
  WaterlevelCalibrationRow,
  WaterlevelUpdateCalibrationSettings,
  WaterlevelCalibrationSettings,
  WaterlevelMfrCalibrationSettings,
  ParCalibrationRow,
} from "../types/calibrationSettings";
import { ResultSetHeader } from "mysql2";
import { createRdsCurrentTimeStamp } from "../lib/helpers";
import { RowDataPacket } from "mysql2/promise";

///////////////////////////////////////////
// CALIBRATION SETTINGS
//////////////////////////////////////////

type LoggerUidRow = RowDataPacket & {
  logger_uid: string;
};

// WATER LEVEL //
export async function fetchWaterLevelMfrCalibrationSettings(
  loggerId: string,
): Promise<WaterlevelMfrCalibrationSettings | undefined> {
  const pool = getPool();

  const [rows] = await pool.execute<WaterlevelMfrCalibrationSettings[]>(
    `SELECT m.a,m.b,m.e,m.K0,m.K1,u.sensor_length as sensorLength 
    FROM mfr_calibration_data_wl m 
    JOIN user_calibration_data_wl u ON m.logger_id = u.logger_id
    WHERE m.logger_id=?`,
    [loggerId],
  );

  if (rows.length === 0) {
    return undefined;
  }

  return rows[0];
}

export async function fetchWaterLevelCalibration(
  loggerId: string,
): Promise<WaterlevelCalibrationSettings | undefined> {
  const pool = getPool();

  const [rows] = await pool.execute<WaterlevelCalibrationRow[]>(
    `SELECT readingA, readingB, actualA, actualB, sensor_length, calibration_temperature, resolution, temperature_compensation, server_side_cal_flag FROM user_calibration_data_wl WHERE logger_id = ?`,
    [loggerId],
  );

  if (rows.length === 0) {
    return undefined;
  }

  return {
    typeId: 4131,
    firstReadingReference: Number(rows[0].actualA),
    secondReadingReference: Number(rows[0].actualB),
    firstReadingLogger: Number(rows[0].readingA),
    secondReadingLogger: Number(rows[0].readingB),
    temperature: Number(rows[0].calibration_temperature),
    resolution: Number(rows[0].resolution),
    temperatureCompensation: Number(rows[0].temperature_compensation),
    serverSideCalFlag: rows[0].server_side_cal_flag === 1, //return true/false dependoing on DB value
  };
}

export async function updateWaterLevelCalibrationSettings(
  loggerId: string,
  settings: WaterlevelUpdateCalibrationSettings,
): Promise<number> {
  const pool = getPool();
  const connection = await pool.getConnection();

  if (settings.K0 === undefined || settings.K1 === undefined) {
    throw new Error("K0 and K1 are required.");
  }
  //const timestamp = Math.floor(Date.now() / 1000);
  try {
    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE user_calibration_data_wl SET a=?,b=?,e=?,K0=?,K1=?,readingA=?, readingB=?, actualA=?, actualB=?, calibration_temperature=?, resolution=?, temperature_compensation=?, server_side_cal_flag=? WHERE logger_id=?`,
      [
        settings.polynomialA,
        settings.polynomialB,
        settings.polynomialE,
        settings.K0,
        settings.K1,
        settings.firstReadingLogger,
        settings.secondReadingLogger,
        settings.firstReadingReference,
        settings.secondReadingReference,
        settings.temperature,
        settings.resolution,
        settings.tempComp,
        settings.serverSideCalFlag,
        loggerId,
      ],
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
}

export async function resetWaterLevelToDefaults(
  loggerId: string,
): Promise<number> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE user_calibration_data_wl AS u
      JOIN mfr_calibration_data_wl AS m ON u.logger_id = m.logger_id
      SET 
      u.a = m.a,
      u.b = m.b,
      u.e = m.e,
      u.K0 = m.K0,
      u.K1 = m.K1,
      u.readingA = NULL,
      u.readingB = NULL,
      u.actualA = NULL,
      u.actualB = NULL,
      u.calibration_temperature = NULL,
      u.resolution = NULL,
      temperature_compensation = NULL
      WHERE m.logger_id = ?`,
      [loggerId],
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
}

// END OF WATER LEVEL //

// PAR //
export async function fetchParCalibration(
  loggerId: string,
): Promise<ParCalibrationRow | undefined> {
  const pool = getPool();

  const [rows] = await pool.execute<ParCalibrationRow[]>(
    `SELECT logger_value AS loggerReadingTotal, reference_value AS refReadingAverage , reference_interval AS testDuration, units  FROM user_calibration_data_par WHERE logger_id = ?`,
    [loggerId],
  );

  if (rows.length === 0) {
    return undefined;
  }

  console.log("PAR ROW", rows);
  rows[0].typeId = 4132;
  return rows[0];
}

export async function updateParCalibrationSettings(
  loggerId: string,
  settings: ParCalibrationRow,
): Promise<number> {
  const pool = getPool();
  const connection = await pool.getConnection();

  //const timestamp = Math.floor(Date.now() / 1000);
  try {
    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE user_calibration_data_par SET logger_value=?,reference_value=?,reference_interval=?,units=? WHERE logger_id=?`,
      [
        settings.loggerReadingTotal,
        settings.refReadingAverage,
        settings.testDuration,
        settings.units,
        loggerId,
      ],
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
}

// END OF PAR //

export async function fetchMptCalibration(
  loggerId: string,
): Promise<string | undefined> {
  const pool = getPool();

  const [rows] = await pool.execute<LoggerUidRow[]>(
    `SELECT mp_user_sensor_count FROM loggers WHERE id = ?`,
    [loggerId],
  );

  if (rows.length === 0) {
    return undefined;
  }

  return rows[0].mp_user_sensor_count;
}

export async function fetchTemperatureCalibration(
  loggerId: string,
): Promise<string | undefined> {
  const pool = getPool();

  const [rows] = await pool.execute<LoggerUidRow[]>(
    `SELECT mp_user_sensor_count FROM loggers WHERE id = ?`,
    [loggerId],
  );

  if (rows.length === 0) {
    return undefined;
  }

  return rows[0].mp_user_sensor_count;
}

///////////////////////////////////////////
// END OF CALIBRATION SETTINGS
//////////////////////////////////////////
