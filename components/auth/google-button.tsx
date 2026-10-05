"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";

/**
 * "Continue with Google". The SDK navigates to Google itself; if starting the
 * redirect fails we hand the message to the form's error alert.
 */
export function GoogleButton({
  disabled,
  onError,
}: {
  disabled?: boolean;
  onError: (message: string | null) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    onError(null);
    setPending(true);
    try {
      const origin = window.location.origin;
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${origin}/dashboard`,
        errorCallbackURL: `${origin}/login`,
      });
      // Navigation is under way; keep the button disabled until the page unloads.
    } catch (error) {
      onError(authErrorMessage(error));
      setPending(false);
    }
  }

  return (
    <Button size="xl"
      type="button"
      variant="outline"
      className="w-full"
      disabled={disabled || pending}
      onClick={handleClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      {pending ? "Redirecting to Google…" : "Continue with Google"}
    </Button>
  );
}
