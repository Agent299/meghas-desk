"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * A labelled input with its inline error, wired up for screen readers.
 * Password inputs get a show/hide toggle at the end of the field.
 */
export function TextField({
  id,
  label,
  error,
  description,
  labelAction,
  type,
  ...inputProps
}: Omit<React.ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  error?: string;
  description?: React.ReactNode;
  /** Shown at the end of the label row, e.g. a "Forgot your password?" link. */
  labelAction?: React.ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  // The description is hidden while an error shows, so only reference what renders.
  const describedBy = [error && errorId, description && !error && descriptionId].filter(Boolean).join(" ");

  const input = (
    <Input
      id={id}
      type={isPassword && revealed ? "text" : type}
      // The same height as the auth buttons (Button size="xl"); room for the toggle.
      className={cn("h-11 px-3.5", isPassword && "pr-11")}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy || undefined}
      {...inputProps}
    />
  );

  return (
    <Field data-invalid={error ? true : undefined}>
      {labelAction ? (
        <div className="flex items-center">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <div className="ml-auto text-foreground">{labelAction}</div>
        </div>
      ) : (
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      )}
      {isPassword ? (
        <div className="relative">
          {input}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-controls={id}
            aria-pressed={revealed}
            disabled={inputProps.disabled}
            onClick={() => setRevealed((value) => !value)}
          >
            {revealed ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
          </Button>
        </div>
      ) : (
        input
      )}
      {description && !error && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
