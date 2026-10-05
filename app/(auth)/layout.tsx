import { redirect } from "next/navigation";

import { ModeToggle } from "@/components/mode-toggle";
import { authRedirect } from "@/lib/auth/redirects";
import { getSessionSafe } from "@/lib/auth/server";

// Reads the session cookie on every request; never prerender.
export const dynamic = "force-dynamic";

// Shared frame for /login, /signup, /forgot-password and /verify-email.
// A signed-in Team member has no business here, so send them on.
export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const session = await getSessionSafe();
  const target = authRedirect("auth", Boolean(session?.user));
  if (target) redirect(target);

  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center bg-muted p-6 md:p-10">
      <ModeToggle className="absolute top-4 right-4 md:top-6 md:right-6" />
      {children}
    </main>
  );
}
