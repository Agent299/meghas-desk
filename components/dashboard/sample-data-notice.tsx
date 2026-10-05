import { InfoIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Marks a page that shows sample data until Workspaces and the widget exist. */
export function SampleDataNotice({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-start gap-1.5 text-xs text-muted-foreground", className)}>
      <InfoIcon aria-hidden="true" className="mt-px size-3.5 shrink-0" />
      <span>
        <span className="font-medium text-foreground">Sample data.</span> {children}
      </span>
    </p>
  )
}
