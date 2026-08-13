import { getPool } from "../lib/database";
import { Customer } from "../types/customer";
import { Group } from "../types/groups";
import { User } from "../types/user";
import { Logger } from "../types/logger";

export async function listCustomers(): Promise<Customer[]> {

  const pool = getPool();

  const [rows] = await pool.query<Customer[]>(
    `SELECT id, company_name AS companyName FROM customers ORDER BY company_name`
  );

  return rows;
};

export async function listUsersByCustomer(custId:String): Promise<User[] | null> {

  const pool = getPool();

  const [rows] = await pool.query<User[]>(
    'SELECT id, name, email, customer_id as customerId FROM users WHERE customer_id = ?' ,[custId],
  );

  if (rows.length === 0) {
    return [];
  }

  return rows;
};

export async function listGroupsByCustomerUser(custId: string, userId: string): Promise<Group[] | null>{
    
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
    };

    export async function listLoggersByCustomerUserGroup(custId: string, userId: string, groupId: string): Promise<Logger[] | null>{
    
    const pool = getPool();
    
      const [rows] = await pool.query<Logger[]>(
        `
        SELECT id, product_id AS productId, logger_uid AS loggerUid, logger_name AS loggerName
        FROM loggers WHERE
        customer_id = ? 
        AND user_id = ?
        AND group_id = ?
        `,
        [custId, userId, groupId],
      );
    
      if (rows.length === 0) {
        return null;
      }
    
      return rows;
    };

    export async function listLoggersByCustomerUser(custId: string, userId: string): Promise<Logger[] | null>{
    
    const pool = getPool();
    
      const [rows] = await pool.query<Logger[]>(
        `
        SELECT id, product_id AS productId, logger_uid AS loggerUid, logger_name AS loggerName
        FROM loggers WHERE
        customer_id = ? 
        AND user_id = ?
        `,
        [custId, userId],
      );
    
      if (rows.length === 0) {
        return null;
      }
    
      return rows;
    };