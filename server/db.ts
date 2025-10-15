import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// For Supabase, disable prepared statements if using connection pooling
const client = postgres(process.env.DATABASE_URL, { 
  prepare: false,
  ssl: 'require'
});

export const db = drizzle(client, { schema });
