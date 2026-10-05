"use client";

import { createAuthClient } from "@neondatabase/auth/next";

// Talks to our same-origin /api/auth proxy. Takes no arguments by design;
// setting NEXT_PUBLIC_AUTH_URL would bypass the proxy.
// Every method throws an AuthApiError on failure; see ./errors.ts.
export const authClient = createAuthClient();
