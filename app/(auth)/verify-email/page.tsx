import type { Metadata } from "next";

import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { emailSchema } from "@/lib/auth/schemas";

export const metadata: Metadata = { title: "Confirm your email · MeghasDesk" };

export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const { email, from, sent } = await searchParams;
  return (
    <VerifyEmailForm
      // Only a real address; anything else shows the "which email?" state.
      email={emailSchema.safeParse(email).data ?? null}
      fromLogin={from === "login"}
      sendFailed={sent === "0"}
    />
  );
}
