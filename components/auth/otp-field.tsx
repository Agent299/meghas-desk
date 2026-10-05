"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

/**
 * The 6-digit email code, as shadcn's InputOTP. Uncontrolled: the value is
 * submitted with the form under `name`, so the forms read it from FormData.
 */
// Big slots with the digit in the display face: a single glyph, as DESIGN.md allows.
const slot = "size-12 font-display text-2xl";

export function OtpField({
  id,
  name,
  label = "Code",
  error,
  disabled,
  autoFocus,
}: {
  id: string;
  name: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const errorId = `${id}-error`;

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputOTP
        id={id}
        name={name}
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        // Pasting "123 456" or "123-456" keeps the digits.
        pasteTransformer={(pasted) => pasted.replace(/\D/g, "")}
        autoComplete="one-time-code"
        autoFocus={autoFocus}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        containerClassName="justify-center"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className={slot} />
          <InputOTPSlot index={1} className={slot} />
          <InputOTPSlot index={2} className={slot} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} className={slot} />
          <InputOTPSlot index={4} className={slot} />
          <InputOTPSlot index={5} className={slot} />
        </InputOTPGroup>
      </InputOTP>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
