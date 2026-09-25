import { getPool } from "../lib/database";
import { Customer } from "../types/customer";
import { Group } from "../types/groups";
import { User } from "../types/user";
import { Logger } from "../types/logger";

export async function listCustomers(): Promise<Customer[]> {
  const pool = getPool();

  const [rows] = await pool.query<Customer[]>(
    `SELECT id, company_name AS companyName FROM customers ORDER BY company_name`,
  );

  return rows;
}

export async function listUsersByCustomer(
  custId: String,
): Promise<User[] | null> {
  const pool = getPool();

  const [rows] = await pool.query<User[]>(
    "SELECT id, name, email, customer_id as customerId FROM users WHERE customer_id = ?",
    [custId],
  );

  if (rows.length === 0) {
    return [];
  }

  return rows;
}

export async function listGroupsByCustomerUser(
  custId: string,
  userId: string,
): Promise<Group[] | null> {
  const pool = getPool();

  const [rows] = await pool.query<Group[]>(
    `
        SELECT id, user_id, group_name AS groupName, notes
        FROM groups WHERE
        customer_id = ? AND user_id = ?
        `,
    [custId, userId],
  );

  if (rows.length === 0) {
    return [];
  }

  return rows;
}

export async function listLoggersByCustomerUserGroup(
  custId: string,
  userId: string,
  groupId: string,
): Promise<Logger[] | null> {
  const pool = getPool();

  const [rows] = await pool.query<Logger[]>(
    `
        SELECT l.id, l.product_id AS productId, l.logger_uid AS loggerUid, l.logger_name AS loggerName, p.type_id AS typeId
        FROM loggers l
        JOIN products p ON l.product_id = p.id
        WHERE l.customer_id = ?
        AND l.user_id = ?
        AND l.group_id = ?
        `,
    [custId, userId, groupId],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows;
}

export async function listLoggersByCustomerUser(
  custId: string,
  userId: string,
): Promise<Logger[] | null> {
  const pool = getPool();

  const [rows] = await pool.query<Logger[]>(
    `
        SELECT l.id, l.product_id AS productId, l.logger_uid AS loggerUid, l.logger_name AS loggerName, p.type_id AS typeId
        FROM loggers l
        JOIN products p ON l.product_id = p.id
        WHERE l.customer_id = 16 
        AND l.user_id = 32
        `,
    [custId, userId],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows;
}
