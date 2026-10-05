"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthCard, AuthHeader } from "@/components/auth/auth-card";
import { FormAlert } from "@/components/auth/form-alert";
import { OtpField } from "@/components/auth/otp-field";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";
import { type FieldErrors, validate, verifyEmailSchema } from "@/lib/auth/schemas";

export function VerifyEmailForm({
  email,
  fromLogin,
  sendFailed,
}: {
  email: string | null;
  /** Arrived from /login with an unverified email. */
  fromLogin: boolean;
  /** /login couldn't send the code. */
  sendFailed: boolean;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(
    sendFailed ? "We couldn't send a code just now. Wait a minute, then choose Resend code." : null,
  );
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  if (!email) {
    return (
      <AuthCard>
        <FieldGroup>
          <AuthHeader title="Confirm your email" />
          <FormAlert>We don&apos;t know which email to confirm. Sign up again to get a new code.</FormAlert>
          <Button nativeButton={false} render={<Link href="/signup" />}>
            Go to sign up
          </Button>
          <FieldDescription className="text-center">
            Already confirmed? <Link href="/login">Log in</Link>
          </FieldDescription>
        </FieldGroup>
      </AuthCard>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    const result = validate(verifyEmailSchema, Object.fromEntries(new FormData(event.currentTarget)));
    setFormError(null);
    setResent(false);
    if (!result.data) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      // Signs the Team member in on success.
      await authClient.emailOtp.verifyEmail({ email, otp: result.data.otp });
      // A full load, so the proxy and server components see the new session cookie.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/dashboard");
      return;
    } catch (error) {
      setFormError(authErrorMessage(error));
    }
    setPending(false);
  }

  async function handleResend() {
    if (!email) return;
    setFormError(null);
    setResent(false);
    setResending(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
      setResent(true);
    } catch (error) {
      setFormError(authErrorMessage(error));
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthCard>
      <form noValidate onSubmit={handleSubmit}>
        <FieldGroup>
          <AuthHeader
            title="Confirm your email"
            description={
              <>
                {fromLogin && <span className="block">Your email isn&apos;t confirmed yet.</span>}
                We sent a 6-digit code to
                <span className="block font-medium [overflow-wrap:anywhere] text-foreground">{email}</span>
              </>
            }
          />
          {formError && <FormAlert>{formError}</FormAlert>}
          {resent && <FormAlert variant="success">Code sent. Check your inbox.</FormAlert>}
          <OtpField id="otp" name="otp" autoFocus error={errors.otp} disabled={pending} />
          <Field>
            <Button type="submit" disabled={pending}>
              {pending ? "Verifying…" : "Verify"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={pending || resending}
            >
              {resending ? "Sending…" : "Resend code"}
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Wrong email? <Link href="/signup">Sign up again</Link> or{" "}
            <Link href="/login">go back to log in</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
