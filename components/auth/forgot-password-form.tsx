"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthCard, AuthHeader } from "@/components/auth/auth-card";
import { FormAlert } from "@/components/auth/form-alert";
import { OtpField } from "@/components/auth/otp-field";
import { TextField } from "@/components/auth/text-field";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";
import {
  type FieldErrors,
  forgotPasswordSchema,
  resetPasswordSchema,
  validate,
} from "@/lib/auth/schemas";

/** Reset by emailed code: step 1 asks for the email, step 2 for code + new password. */
export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  async function requestCode(address: string) {
    // Always succeeds for unknown emails too, so it can't reveal accounts.
    await authClient.emailOtp.requestPasswordReset({ email: address });
  }

  async function handleRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validate(forgotPasswordSchema, Object.fromEntries(new FormData(event.currentTarget)));
    setFormError(null);
    if (!result.data) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      await requestCode(result.data.email);
      setEmail(result.data.email);
    } catch (error) {
      setFormError(authErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    const result = validate(resetPasswordSchema, Object.fromEntries(new FormData(event.currentTarget)));
    setFormError(null);
    setResent(false);
    if (!result.data) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      await authClient.emailOtp.resetPassword({
        email,
        otp: result.data.otp,
        password: result.data.password,
      });
      router.push("/login?reset=1");
    } catch (error) {
      setFormError(authErrorMessage(error));
      setPending(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setFormError(null);
    setResent(false);
    setResending(true);
    try {
      await requestCode(email);
      setResent(true);
    } catch (error) {
      setFormError(authErrorMessage(error));
    } finally {
      setResending(false);
    }
  }

  if (!email) {
    return (
      <AuthCard>
        <form noValidate onSubmit={handleRequest}>
          <FieldGroup>
            <AuthHeader
              title="Reset your password"
              description="Enter your email and we'll send you a 6-digit code."
            />
            {formError && <FormAlert>{formError}</FormAlert>}
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
            <Field>
              <Button type="submit" disabled={pending}>
                {pending ? "Sending code…" : "Send code"}
              </Button>
            </Field>
            <FieldDescription className="text-center">
              Remembered it? <Link href="/login">Log in</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form noValidate onSubmit={handleReset}>
        <FieldGroup>
          <AuthHeader
            title="Choose a new password"
            description={
              <>
                If this email has an account, we sent it a 6-digit code:
                <span className="block font-medium [overflow-wrap:anywhere] text-foreground">{email}</span>
              </>
            }
          />
          {formError && <FormAlert>{formError}</FormAlert>}
          {resent && <FormAlert variant="success">Code sent. Check your inbox.</FormAlert>}
          {/* Lets password managers attach the new password to the right account. */}
          <input type="hidden" name="username" autoComplete="username" value={email} readOnly />
          <OtpField id="otp" name="otp" autoFocus error={errors.otp} disabled={pending} />
          <TextField
            id="password"
            name="password"
            type="password"
            label="New password"
            autoComplete="new-password"
            description="At least 8 characters."
            error={errors.password}
            disabled={pending}
          />
          <TextField
            id="confirm-password"
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword}
            disabled={pending}
          />
          <Field>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating password…" : "Update password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={pending || resending}
            >
              {resending ? "Sending…" : "Send a new code"}
            </Button>
          </Field>
          <FieldDescription className="text-center">
            <button
              type="button"
              className="underline underline-offset-4 hover:text-primary"
              onClick={() => {
                setEmail(null);
                setErrors({});
                setFormError(null);
                setResent(false);
              }}
            >
              Use a different email
            </button>{" "}
            or <Link href="/login">go back to log in</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
