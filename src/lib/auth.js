import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.js";
import * as schema from "@/db/schema"; const authUrl = process.env.BETTER_AUTH_URL; if (!authUrl && process.env.NODE_ENV === 'production') { throw new Error('BETTER_AUTH_URL environment variable is required in production'); } export const auth = betterAuth({ database: drizzleAdapter(db, { provider: "pg", schema: { user: schema.user, session: schema.session, account: schema.account, verification: schema.verification } }), emailAndPassword: { enabled: true }, trustedOrigins: authUrl ? [authUrl] : [], baseURL: authUrl || "http://localhost:3000", session: { expiresIn: 60 * 60 * 24 * 7 },
});
