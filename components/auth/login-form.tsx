"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthCard, AuthHeader } from "@/components/auth/auth-card";
import { FormAlert } from "@/components/auth/form-alert";
import { GoogleButton } from "@/components/auth/google-button";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { TextField } from "@/components/auth/text-field";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage, isEmailNotVerified, redirectErrorMessage } from "@/lib/auth/errors";
import { type FieldErrors, loginSchema, validate } from "@/lib/auth/schemas";

export function LoginForm({
  errorCode,
  passwordReset,
}: {
  /** `?error=` from a failed Google or magic-link redirect. */
  errorCode: string | null;
  /** `?reset=1` after a password reset. */
  passwordReset: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(redirectErrorMessage(errorCode));
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validate(loginSchema, Object.fromEntries(new FormData(event.currentTarget)));
    setFormError(null);
    if (!result.data) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      await authClient.signIn.email(result.data);
      // A full load, so the proxy and server components see the new session cookie.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/dashboard");
      return; // stay disabled while the dashboard loads
    } catch (error) {
      if (isEmailNotVerified(error)) {
        await routeToCodeStep(result.data.email);
        return;
      }
      setFormError(authErrorMessage(error));
    }
    setPending(false);
  }

  async function routeToCodeStep(email: string) {
    const params = new URLSearchParams({ email, from: "login" });
    try {
      await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
    } catch {
      // The code step explains the failure and offers "Resend code".
      params.set("sent", "0");
    }
    router.push(`/verify-email?${params}`);
  }

  return (
    <AuthCard cover priority>
      <FieldGroup>
        <AuthHeader title="Welcome back" description="Log in to your MeghasDesk account" />
        {passwordReset && !formError && (
          <FormAlert variant="success">Password updated. Log in with your new password.</FormAlert>
        )}
        {formError && <FormAlert>{formError}</FormAlert>}
        {mode === "password" ? (
          <form noValidate onSubmit={handleSubmit}>
            <FieldGroup>
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                placeholder="you@company.com"
                error={errors.email}
                disabled={pending}
              />
              <TextField
                id="password"
                name="password"
                type="password"
                label="Password"
                autoComplete="current-password"
                error={errors.password}
                disabled={pending}
                labelAction={
                  <Link
                    href="/forgot-password"
                    className="text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                }
              />
              <Field>
                <Button type="submit" disabled={pending}>
                  {pending ? "Logging in…" : "Log in"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        ) : (
          <MagicLinkForm
            onCancel={() => setMode("password")}
            cancelLabel="Log in with a password instead"
          />
        )}
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or
        </FieldSeparator>
        <Field>
          <GoogleButton disabled={pending} onError={setFormError} />
          {mode === "password" && (
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => {
                setFormError(null);
                setMode("magic-link");
              }}
            >
              Email me a sign-in link
            </Button>
          )}
        </Field>
        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </FieldDescription>
      </FieldGroup>
    </AuthCard>
  );
}
