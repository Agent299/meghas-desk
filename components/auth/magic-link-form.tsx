"use client";

import { MailIcon } from "lucide-react";
import { useState } from "react";

import { FormAlert } from "@/components/auth/form-alert";
import { TextField } from "@/components/auth/text-field";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";
import {
  type FieldErrors,
  loginMagicLinkSchema,
  signupMagicLinkSchema,
  validate,
} from "@/lib/auth/schemas";

/**
 * "Email me a sign-in link". On /signup it also asks for a name, which is
 * used if the link creates the account.
 */
export function MagicLinkForm({
  withName = false,
  onCancel,
  cancelLabel,
}: {
  withName?: boolean;
  onCancel: () => void;
  cancelLabel: string;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const result = validate<{ email: string; name?: string }>(
      withName ? signupMagicLinkSchema : loginMagicLinkSchema,
      values,
    );
    setFormError(null);
    if (!result.data) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const origin = window.location.origin;
      await authClient.signIn.magicLink({
        email: result.data.email,
        name: result.data.name,
        callbackURL: `${origin}/dashboard`,
        newUserCallbackURL: `${origin}/dashboard`,
        errorCallbackURL: `${origin}/login`,
      });
      setSentTo(result.data.email);
    } catch (error) {
      setFormError(authErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  if (sentTo) {
    return (
      <FieldGroup>
        <div className="flex flex-col items-center gap-3 text-center" role="status">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <MailIcon aria-hidden="true" className="size-5" />
          </div>
          {/* Focus moves here so the confirmation is read out after the form disappears. */}
          <h2 tabIndex={-1} autoFocus className="text-lg font-semibold outline-none">
            Check your email
          </h2>
          <p className="text-sm text-balance text-muted-foreground">
            We sent a sign-in link to <span className="font-medium text-foreground">{sentTo}</span>.
            It expires soon, so open it on this device.
          </p>
        </div>
        <Field>
          <Button size="xl" type="button" variant="outline" onClick={() => setSentTo(null)}>
            Use a different email
          </Button>
          <Button size="xl" type="button" variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
        </Field>
      </FieldGroup>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <FieldGroup>
        {formError && <FormAlert>{formError}</FormAlert>}
        {withName && (
          <TextField
            id="magic-name"
            name="name"
            label="Name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            // The form replaces the button that opened it; start typing here.
            autoFocus
            error={errors.name}
            disabled={pending}
          />
        )}
        <TextField
          id="magic-email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@company.com"
          autoFocus={!withName}
          error={errors.email}
          disabled={pending}
        />
        <Field>
          <Button size="xl" type="submit" disabled={pending}>
            {pending ? "Sending link…" : "Email me a sign-in link"}
          </Button>
          <Button size="xl" type="button" variant="ghost" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
