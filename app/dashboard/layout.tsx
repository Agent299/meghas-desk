import type { CSSProperties } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import type { DashboardUser } from "@/components/dashboard/user-display"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { authRedirect } from "@/lib/auth/redirects"
import { getSessionSafe } from "@/lib/auth/server"

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

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-2 p-4 lg:p-6">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
