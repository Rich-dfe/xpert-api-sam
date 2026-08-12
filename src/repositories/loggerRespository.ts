import { getPool } from "../lib/database";
import { LoggerConfigSettings } from "../types/logger";
import { ResultSetHeader } from "mysql2";
import { createRdsCurrentTimeStamp } from "../lib/helpers";
import { LoggerLookup } from "../types/logger";

export async function updateLoggerConfig(
  settings: LoggerConfigSettings,
): Promise<number> {
  const pool = getPool();
  const rdsTimestamp = createRdsCurrentTimeStamp();

  // 1. Get a dedicated connection from the pool
  const connection = await pool.getConnection();

  try{
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
      settings.loggerId
    ],
  );

  const [result2] = await connection.execute<ResultSetHeader>(
    `UPDATE loggers SET logger_name=?, notes=?,updated_at=? WHERE id=?`,
    [
      settings.loggerName,
      settings.loggerNotes,
      rdsTimestamp,
      settings.loggerId
    ],
  );

    // 4. Commit the transaction if successful
    await connection.commit();

    // Return the affected rows or insert ID depending on your needs
    return result1.affectedRows + result2.affectedRows;

  } catch(error){
    await connection.rollback();
    throw error;
  } finally{
    connection.release();
  }
}

export async function getLogger(
  loggerId: string
): Promise<LoggerLookup | null> {

  //console.log("getLoggerSerialNumber-1", loggerId);

  const pool = getPool();

  const [rows] = await pool.query<LoggerLookup[]>(
    `
      SELECT logger_uid, user_id, customer_id, logger_name
      FROM loggers
      WHERE id = ?
    `,
    [loggerId]
  );

  //console.log("### logger ID", rows);

  return rows[0] ?? null;
}