"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { InboxIcon, LayoutDashboardIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export const dashboardNav = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
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

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {dashboardNav.map((item) => {
            const active = isNavItemActive(item, pathname)
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={active}
                  render={
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      // On mobile the sidebar is a sheet; close it once a page is picked.
                      onClick={() => isMobile && setOpenMobile(false)}
                    />
                  }
                >
                  <item.icon aria-hidden="true" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
