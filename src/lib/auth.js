import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.js";
import * as schema from "@/db/schema"; const authUrl = process.env.BETTER_AUTH_URL;
if (!authUrl && process.env.NODE_ENV === 'production') {
  if (process.env.CI || process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn('Warning: BETTER_AUTH_URL is not set during build phase. Using fallback.');
  } else {
    throw new Error('BETTER_AUTH_URL environment variable is required in production');
  }
}
// ponytail: email/password only — no OAuth providers. Add socialProviders (Google, GitHub) via Better-Auth when social login is needed.
// ponytail: session TTL hardcoded 7 days — not configurable per user. Accept rememberMe flag and read TTL from env var when needed.
export const auth = betterAuth({ database: drizzleAdapter(db, { provider: "pg", schema: { user: schema.user, session: schema.session, account: schema.account, verification: schema.verification } }), emailAndPassword: { enabled: true }, trustedOrigins: authUrl ? [authUrl] : [], baseURL: authUrl || "http://localhost:3000", session: { expiresIn: 60 * 60 * 24 * 7 },
});
