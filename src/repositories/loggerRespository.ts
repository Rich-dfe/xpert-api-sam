import { getPool } from "../lib/database";
import {
  LoggerConfigSettings,
  LoggerConfigSettingsDBResult,
} from "../types/logger";
import { ResultSetHeader } from "mysql2";
import { createRdsCurrentTimeStamp } from "../lib/helpers";
import { RowDataPacket } from "mysql2/promise";

export async function updateLoggerConfig(
  settings: LoggerConfigSettings,
): Promise<number> {
  const pool = getPool();
  const rdsTimestamp = createRdsCurrentTimeStamp();

  // 1. Get a dedicated connection from the pool
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result1] = await connection.execute<ResultSetHeader>(
      `
      UPDATE user_settings
      SET
        x0000= ?,
        x000E = ?,
        x0013 = ?,
        x0018= ?,
        x002f = x002F + ?,
        timezone_offset=?,
        updated_at=?
      WHERE logger_id = ?
    `,
      [
        settings.loggerName,
        settings.startDate,
        settings.stopDate,
        settings.loggingInterval,
        1,
        settings.timezone,
        rdsTimestamp,
        settings.loggerId,
      ],
    );

    const [result2] = await connection.execute<ResultSetHeader>(
      `UPDATE loggers SET logger_name=?, notes=?,updated_at=? WHERE id=?`,
      [
        settings.loggerName,
        settings.loggerNotes,
        rdsTimestamp,
        settings.loggerId,
      ],
    );

    // 4. Commit the transaction if successful
    await connection.commit();

    // Return the affected rows or insert ID depending on your needs
    return result1.affectedRows + result2.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateEtag(userId: number): Promise<number> {
  const pool = getPool();
  const connection = await pool.getConnection();
  const timestamp = Math.floor(Date.now() / 1000);

  try {
    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE users SET etag_token = ? WHERE id=?`,
      [timestamp, userId],
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
}

export async function fetchLoggerConfigSettings(
  loggerId: string,
): Promise<LoggerConfigSettingsDBResult[]> {
  const pool = getPool();

  const [rows] = await pool.execute<LoggerConfigSettingsDBResult[]>(
    `SELECT 
      u.x0000 as loggerName,
      u.x000e as startDate,
      u.x0013 as stopDate,
      u.x0018 as loggingInterval,
      u.x002f as loggerSettingsVersion,
      u.timezone_offset as timezone,
      l.notes as loggerNotes,
      g.id as groupId
      FROM user_settings u
      JOIN loggers l ON u.logger_id = l.id
      JOIN groups g ON g.id = l.group_id
      WHERE l.id = ?`,
    [loggerId],
  );

  if (rows.length === 0) {
    return [];
  }

  return rows;
}

type LoggerUidRow = RowDataPacket & {
  logger_uid: string;
};

export async function fetchLoggerUidByLoggerId(
  loggerId: string,
): Promise<string | undefined> {
  const pool = getPool();

  const [rows] = await pool.execute<LoggerUidRow[]>(
    `SELECT logger_uid FROM loggers WHERE id = ?`,
    [loggerId],
  );

  if (rows.length === 0) {
    return undefined;
  }

  return rows[0].logger_uid;
}
