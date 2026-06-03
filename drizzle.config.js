import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.js',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
