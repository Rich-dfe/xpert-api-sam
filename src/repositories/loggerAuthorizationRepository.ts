import { LoggerLookup } from "../types/logger";
import { getPool } from "../lib/database";
import { RowDataPacket } from "mysql2";

export async function isLoggerOwnedByUserOld(
  loggerUid: string,
): Promise<LoggerLookup | null> {
  //console.log("getLoggerSerialNumber-1", loggerId);

  const pool = getPool();

  const [rows] = await pool.query<LoggerLookup[]>(
    `
      SELECT logger_uid, user_id, customer_id, logger_name
      FROM loggers
      WHERE logger_uid = ?
    `,
    [loggerUid],
  );

  //console.log("### logger ID", rows);

  return rows[0] ?? null;
}

export async function isLoggerOwnedByUser(
  loggerUid: string,
  userId: number,
): Promise<boolean> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT 1
      FROM loggers
      WHERE logger_uid = ?
        AND user_id = ?
    `,
    [loggerUid, userId],
  );

  return rows.length > 0;
}

export async function isLoggerOwnedByAdmin(
  loggerUid: string,
  parentCustomerId: number,
): Promise<boolean> {
    console.log('IN ADMIN CHECK', loggerUid, parentCustomerId);
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    `
      SELECT EXISTS (
        SELECT 1
        FROM loggers l
        JOIN customers_resellers r
          ON r.child_customer_id = l.customer_id
        WHERE l.logger_uid = ?
          AND r.parent_customer_id = ?
      ) AS authorized
    `,
    [loggerUid, parentCustomerId],
  );

  return Boolean(rows[0].authorized);
}
