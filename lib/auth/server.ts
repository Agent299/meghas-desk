import { createNeonAuth } from "@neondatabase/auth/next/server";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}. See .env.example.`);
  return value;
}

// Neon's managed Better Auth. Users, sessions and accounts live in the
// `neon_auth` schema of our own database.
export const auth = createNeonAuth({
  baseUrl: required("NEON_AUTH_BASE_URL"),
  cookies: { secret: required("NEON_AUTH_COOKIE_SECRET") },
});

/**
 * `auth.getSession()` for Server Components. When upstream refreshes or
 * clears the session it writes cookies, which Next.js forbids during a render,
 * so the SDK throws. Treat that as signed out instead of a 500 on every page.
 */
export async function getSessionSafe() {
  try {
    return (await auth.getSession()).data;
  } catch {
    return null;
  }
}
