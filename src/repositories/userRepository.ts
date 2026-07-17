import { getPool } from "../lib/database";
import { User } from "../types/user";

export async function findUserByEmail(email: string): Promise<User | null> {
  const pool = getPool();

  const [rows] = await pool.query<User[]>(
    `
    SELECT id, name, email, customer_id
    FROM users
    WHERE email = ?
    `,
    [email],
  );

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




