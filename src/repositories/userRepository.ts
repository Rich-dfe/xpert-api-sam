import { getPool } from "../lib/database";
import { User } from "../types/user";
import { Customer } from "../types/customer";

export async function findUserByEmail(email: string): Promise<User | null> {
  const pool = getPool();

  const [rows] = await pool.query<User[]>(
    `
    SELECT id, name, email, customer_id as customerId
    FROM users
    WHERE email = ?
    `,
    [email],
  );

  //console.log('### USER',rows);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};



export async function listUsers(): Promise<User[] | null> {
  const pool = getPool();

  const [rows] = await pool.query<User[]>(
    `SELECT id, name, email, customer_id as customerId FROM users`,
  );

  if (rows.length === 0) {
    return null;
  }

  return rows;
};

export async function listAdminCustomers(userId:Number): Promise<Customer[] | null> {

  const pool = getPool();

  const [rows] = await pool.query<Customer[]>(
    `SELECT c.id, c.company_name AS companyName
       FROM users AS u 
       JOIN customers_resellers AS r ON r.parent_customer_id = u.customer_id 
       JOIN customers AS c ON c.id = r.child_customer_id 
       WHERE u.id = ?`,
      [userId]
  );

  if (rows.length === 0) {
    return [];
  }

  return rows;
};




