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
import { authErrorMessage } from "@/lib/auth/errors";
import { type FieldErrors, signupSchema, validate } from "@/lib/auth/schemas";

export function SignupForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validate(signupSchema, Object.fromEntries(new FormData(event.currentTarget)));
    setFormError(null);
    if (!result.data) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setPending(true);
    const { name, email, password } = result.data;
    try {
      // Resolves without a session (verification is required), and also for an
      // already-registered email, so the code step is always next.
      await authClient.signUp.email({ name, email, password });
      router.push(`/verify-email?${new URLSearchParams({ email })}`);
    } catch (error) {
      setFormError(authErrorMessage(error));
      setPending(false);
    }
  }

  return (
    <AuthCard cover>
      <FieldGroup>
        <AuthHeader
          title="Create your account"
          description="Your AI agent answers Visitors; you step in when needed."
        />
        {formError && <FormAlert>{formError}</FormAlert>}
        {mode === "password" ? (
          <form noValidate onSubmit={handleSubmit}>
            <FieldGroup>
              <TextField
                id="name"
                name="name"
                label="Name"
                autoComplete="name"
                placeholder="Ada Lovelace"
                error={errors.name}
                disabled={pending}
              />
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
                autoComplete="new-password"
                description="At least 8 characters."
                error={errors.password}
                disabled={pending}
              />
              <TextField
                id="confirm-password"
                name="confirmPassword"
                type="password"
                label="Confirm password"
                autoComplete="new-password"
                error={errors.confirmPassword}
                disabled={pending}
              />
              <Field>
                <Button type="submit" disabled={pending}>
                  {pending ? "Creating account…" : "Create account"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        ) : (
          <MagicLinkForm
            withName
            onCancel={() => setMode("password")}
            cancelLabel="Sign up with a password instead"
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
          Already have an account? <Link href="/login">Log in</Link>
        </FieldDescription>
      </FieldGroup>
    </AuthCard>
  );
}
