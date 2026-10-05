"use client"

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** shadcn's dark-mode toggle (ui.shadcn.com/docs/dark-mode/next), on Base UI. */
export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="icon" className={className} />}
      >
        <SunIcon
          aria-hidden="true"
          className="scale-100 rotate-0 transition-all motion-reduce:transition-none dark:scale-0 dark:-rotate-90"
        />
        <MoonIcon
          aria-hidden="true"
          className="absolute scale-0 rotate-90 transition-all motion-reduce:transition-none dark:scale-100 dark:rotate-0"
        />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={(value) => setTheme(value)}
        >
          <DropdownMenuRadioItem value="light">
            <SunIcon aria-hidden="true" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonIcon aria-hidden="true" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <MonitorIcon aria-hidden="true" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
