import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js'; const connectionString = process.env.DATABASE_URL; // prepare: false is required for pgbouncer (transaction mode) in Supabase
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
