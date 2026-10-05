import type { CSSProperties } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { InboxProvider } from "@/components/inbox/inbox-provider"
import type { DashboardUser } from "@/components/dashboard/user-display"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { authRedirect } from "@/lib/auth/redirects"
import { getSessionSafe } from "@/lib/auth/server"
import { getInboxData } from "@/lib/inbox/queries"

// Reads the session cookie on every request; never prerender.
export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  // proxy.ts already gates /dashboard; this server check keeps the layout safe
  // on its own (layouts don't re-run on client navigation, so pages that load
  // data must check again).
  const session = await getSessionSafe()
  const target = authRedirect("dashboard", Boolean(session?.user))
  if (target || !session?.user) redirect(target ?? "/login")

  const user: DashboardUser = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  }

  // Shared by the sidebar's Waiting count, Home and the inbox, so a Claim shows everywhere at once.
  const inbox = await getInboxData(user.name || user.email)
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <InboxProvider initial={inbox}>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 60)",
            "--header-height": "calc(var(--spacing) * 14)",
          } as CSSProperties
        }
      >
        <AppSidebar variant="inset" user={user} />
        {/* Pages sit straight on the sidebar's canvas (the auth pages' bg-muted) and place
            their own cards. A fixed height keeps the header put and lets inbox panes scroll. */}
        <SidebarInset className="h-svh overflow-hidden bg-transparent md:h-[calc(100svh-1rem)] md:peer-data-[variant=inset]:shadow-none">
          <SiteHeader />
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </InboxProvider>
  )
}
