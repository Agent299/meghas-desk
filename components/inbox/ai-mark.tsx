import { LogoMark } from "@/components/landing/logo"
import { cn } from "@/lib/utils"

/** The AI agent's avatar: the MeghasDesk mark in a small foreground circle, as on the auth panel. */
export function AiMark({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("grid size-5 shrink-0 place-items-center rounded-full bg-foreground text-background", className)}>
      <LogoMark className="size-[72%]" />
    </span>
  )
}
