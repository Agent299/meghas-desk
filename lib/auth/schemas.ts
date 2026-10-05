import * as z from "zod";

// Client-side validation for the auth forms. The server re-validates
// everything; these only give fast, specific inline messages.

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email.")
  .pipe(z.email("Enter a valid email address."));

const name = z.string().trim().min(1, "Enter your name.").max(100, "Keep your name under 100 characters.");

const newPassword = z
  .string()
  .min(1, "Enter a password.")
  .min(8, "Use at least 8 characters.")
  .max(128, "Use at most 128 characters.");

export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter the 6-digit code from the email.");

export const loginSchema = z.object({
  email: emailSchema,
  // Every account's password is at least 8 characters (see newPassword), so a
  // shorter one can't be right; say so before asking the server.
  password: z
    .string()
    .min(1, "Enter your password.")
    .min(8, "Passwords are at least 8 characters."),
});

export const signupSchema = z
  .object({
    name,
    email: emailSchema,
    password: newPassword,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export const loginMagicLinkSchema = z.object({ email: emailSchema });

export const signupMagicLinkSchema = z.object({ name, email: emailSchema });

export const verifyEmailSchema = z.object({ otp: otpSchema });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    otp: otpSchema,
    password: newPassword,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export type FieldErrors = Partial<Record<string, string>>;

/** Validates `input`, returning the parsed data or one message per field. */
export function validate<T>(
  schema: z.ZodType<T>,
  input: unknown,
): { data: T; errors: null } | { data: null; errors: FieldErrors } {
  const result = schema.safeParse(input);
  if (result.success) return { data: result.data, errors: null };
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return { data: null, errors };
}
