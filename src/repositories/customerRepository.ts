import { getPool } from "../lib/database";
import { Customer } from "../types/customer";
import { Group } from "../types/groups";
import { User } from "../types/user";

export async function listCustomers(): Promise<Customer[]> {

  const pool = getPool();

  const [rows] = await pool.query<Customer[]>(
    `SELECT id, company_name AS companyName FROM customers ORDER BY company_name`
  );

  return rows;
};


export async function listCustomersForAdmin(custId:Number): Promise<Customer[] | null> {

  const pool = getPool();

  const [rows] = await pool.query<Customer[]>(
    `SELECT c.id, c.company_name
       FROM users AS u 
       JOIN customers_resellers AS r ON r.parent_customer_id = u.customer_id 
       JOIN customers AS c ON c.id = r.child_customer_id 
       WHERE u.id = ?`,
      [custId]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows;
};

export async function listUsersByCustomer(custId:String): Promise<User[] | null> {
  const pool = getPool();

  const [rows] = await pool.query<User[]>(
    'SELECT id, name, email, customer_id as customerId FROM users WHERE customer_id = ?' ,[custId],
  );

  if (rows.length === 0) {
    return null;
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
        return null;
      }
    
      return rows;
    };