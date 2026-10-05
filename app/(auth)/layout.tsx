import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthPanel } from "@/components/auth/auth-panel";
import { LogoMark } from "@/components/landing/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { authRedirect } from "@/lib/auth/redirects";
import { getSessionSafe } from "@/lib/auth/server";

// Reads the session cookie on every request; never prerender.
export const dynamic = "force-dynamic";

// Shared frame for /login, /signup, /forgot-password and /verify-email: the form
// column follows the theme, the brand panel (lg and up) stays black like the
// landing page. A signed-in Team member has no business here, so send them on.
export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const session = await getSessionSafe();
  const target = authRedirect("auth", Boolean(session?.user));
  if (target) redirect(target);

  return (
    <main className="grid min-h-svh flex-1 content-start gap-3 bg-muted p-3 lg:grid-cols-2 lg:content-stretch">
      {/* Below lg this wrapper dissolves (display: contents) so the order is
          header → brand banner → card; from lg it is the left column. */}
      <div className="contents lg:flex lg:flex-col lg:px-[clamp(8px,2vw,28px)] lg:py-[clamp(8px,1.6vh,20px)]">
        <header className="order-1 flex animate-slide-down items-center justify-between px-1 motion-reduce:animate-none lg:order-none lg:px-0">
          <Link href="/" className="flex items-center gap-2.5 font-medium tracking-[-0.01em]">
            <span className="grid size-9 place-items-center rounded-full bg-foreground text-background shadow-soft">
              <LogoMark className="size-[72%]" />
            </span>
            MeghasDesk
          </Link>
          <ModeToggle />
        </header>
        <div className="order-3 flex flex-1 items-center justify-center pt-2 pb-6 lg:order-none lg:py-[clamp(24px,5vh,56px)]">
          {children}
        </div>
      </div>
      <AuthPanel />
    </main>
  );
}
