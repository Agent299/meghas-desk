"use client"

import { usePathname } from "next/navigation"

import { dashboardNav, isNavItemActive } from "@/components/dashboard/nav-main"

/** The current dashboard page's title, derived from the URL (layouts can't read the pathname). */
export function PageTitle() {
  const pathname = usePathname()
  const item = dashboardNav.find((nav) => isNavItemActive(nav, pathname))
  return <h1 className="text-base font-medium">{item?.title ?? "Dashboard"}</h1>
}
