import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in · MeghasDesk" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error, reset, neon_auth_session_verifier: verifier } = await searchParams;
  // The proxy forwards a magic link or Google sign-in whose verifier it couldn't
  // exchange (other browser, or the 10-minute challenge expired) without an error.
  const errorCode = typeof error === "string" ? error : verifier ? "link_incomplete" : null;
  return (
    <LoginForm
      errorCode={errorCode}
      passwordReset={reset === "1"}
    />
  );
}
