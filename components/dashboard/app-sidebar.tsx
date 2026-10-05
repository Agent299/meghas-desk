"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import type { DashboardUser } from "@/components/dashboard/user-display"
import { LogoMark } from "@/components/landing/logo"
import { authClient } from "@/lib/auth/client"
import { LOGIN_PATH } from "@/lib/auth/redirects"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  /** The signed-in Team member. Plain data, so a server layout can pass it. */
  user: DashboardUser
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar()
  const handleLogOut = React.useCallback(async () => {
    try {
      await authClient.signOut()
    } catch {
      // The session is still valid, so /login would bounce straight back here.
      toast.error("Couldn't log you out. Check your connection and try again.")
      return
    }
    // Full load so the proxy and server layouts see the cleared cookies.
    window.location.assign(LOGIN_PATH)
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={
                <Link
                  href="/dashboard"
                  onClick={() => isMobile && setOpenMobile(false)}
                />
              }
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <LogoMark className="size-[72%]" />
              </span>
              <span className="text-base font-semibold">MeghasDesk</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onLogOut={handleLogOut} />
      </SidebarFooter>
    </Sidebar>
  )
}
