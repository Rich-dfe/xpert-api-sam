import { getPool } from "../lib/database";
import type {LoggerLicensePeriod,LoggerLicenseRow } from "../types/license";

export async function getLoggerLicensePeriods(
  loggerUid: string,
): Promise<LoggerLicensePeriod[]> {
  const pool = getPool();

  const [rows] = await pool.execute<LoggerLicenseRow[]>(
    `
      SELECT
        startsunix,
        endsunix
      FROM subscriptions
      WHERE logger_uid = ?
      ORDER BY startsunix ASC
    `,
    [loggerUid],
  );

  return rows.map((row) => ({
    startUnix: Number(row.startsunix),
    endUnix: Number(row.endsunix),
  }));
}