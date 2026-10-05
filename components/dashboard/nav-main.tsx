"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HouseIcon, InboxIcon } from "lucide-react"

import { useInbox } from "@/components/inbox/inbox-provider"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export const dashboardNav = [
  {
    title: "Home",
    href: "/dashboard",
    icon: HouseIcon,
    exact: true,
  },
  {
    title: "Inbox",
    href: "/dashboard/inbox",
    icon: InboxIcon,
    exact: false,
  },
] as const

export type DashboardNavItem = (typeof dashboardNav)[number]

export function isNavItemActive(item: DashboardNavItem, pathname: string) {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export function NavMain() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const { conversations } = useInbox()
  const waiting = conversations.filter((c) => c.state === "waiting").length

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {dashboardNav.map((item) => {
            const active = isNavItemActive(item, pathname)
            const count = item.href === "/dashboard/inbox" ? waiting : 0
            const label = count ? `${item.title}, ${count} Waiting` : item.title
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  tooltip={label}
                  isActive={active}
                  className="h-9 data-active:shadow-soft"
                  render={
                    <Link
                      href={item.href}
                      aria-label={count ? label : undefined}
                      aria-current={active ? "page" : undefined}
                      // On mobile the sidebar is a sheet; close it once a page is picked.
                      onClick={() => isMobile && setOpenMobile(false)}
                    />
                  }
                >
                  <span className="relative grid place-items-center">
                    <item.icon aria-hidden="true" />
                    {/* Collapsed to icons there is no room for the count, so a dot says "someone is Waiting". */}
                    {count > 0 && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-1 -right-1 hidden size-2 rounded-full bg-waiting ring-2 ring-sidebar group-data-[collapsible=icon]:block"
                      />
                    )}
                  </span>
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {count > 0 && (
                  <SidebarMenuBadge
                    aria-hidden="true"
                    className="top-2! rounded-full bg-waiting/20 px-1.5 text-waiting-foreground peer-hover/menu-button:text-waiting-foreground peer-data-active/menu-button:text-waiting-foreground"
                  >
                    {count}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
