import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Create a MySQL connection pool
const pool = mysql.createPool(process.env.DATABASE_URL!);

// Initialize Drizzle ORM with the connection pool and schema
export const db = drizzle(pool, { schema, mode: "default" });
