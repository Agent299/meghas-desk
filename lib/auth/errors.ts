// Neon Auth's client throws an AuthApiError with a remapped snake_case `code`,
// an HTTP `status` and a `message`. Several better-auth errors share a code
// (all OTP failures are `validation_failed`), so the message tells them apart.

type AuthErrorLike = { code?: string; status?: number; message?: string };

function asAuthError(error: unknown): AuthErrorLike {
  if (error && typeof error === "object") return error as AuthErrorLike;
  return {};
}

export function isEmailNotVerified(error: unknown): boolean {
  return asAuthError(error).code === "email_not_confirmed";
}

/** A plain-language message for an error thrown by the auth client. */
export function authErrorMessage(error: unknown): string {
  const { code, status, message = "" } = asAuthError(error);
  const text = message.toLowerCase();

  if (status === 429 || code?.startsWith("over_")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  if (code === "invalid_credentials") return "That email and password don't match.";
  if (code === "email_not_confirmed") return "Confirm your email to continue.";
  if (text.includes("otp expired")) return "That code has expired. Send a new one.";
  if (text.includes("too many attempts")) return "Too many wrong codes. Send a new one.";
  if (text.includes("invalid otp")) return "That code isn't right. Check it and try again.";
  if (code === "user_already_exists") return "An account with this email already exists. Log in instead.";
  // PASSWORD_TOO_SHORT and PASSWORD_TOO_LONG both arrive as weak_password with a generic message.
  if (code === "weak_password") return "Use a password of 8 to 128 characters.";
  if (typeof status === "number" && status >= 500) {
    return "Something went wrong on our side. Try again in a moment.";
  }
  return "Something went wrong. Try again.";
}

/** Messages for the `?error=` codes Neon Auth appends when a redirect fails. */
export function redirectErrorMessage(code: string | null | undefined): string | null {
  if (!code) return null;
  switch (code) {
    case "INVALID_TOKEN":
    case "invalid_token":
      return "That sign-in link has expired or was already used. Request a new one.";
    case "account_not_linked":
      return "This email already has an account. Log in with your password instead.";
    case "access_denied":
      return "Google sign-in was cancelled.";
    case "new_user_signup_disabled":
    case "signup_disabled":
      return "Sign-up is currently closed.";
    case "link_incomplete":
      return "That sign-in link didn't finish. Open it in the browser you requested it from, within 10 minutes, or request a new one.";
    default:
      return "Sign-in didn't complete. Try again.";
  }
}
