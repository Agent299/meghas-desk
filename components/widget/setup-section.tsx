import { CheckIcon, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/** One setup card on Home: icon, title, a Done / To do status, then its fields. */
export function SetupSection({
  icon: Icon,
  title,
  description,
  done,
  className,
  style,
  children,
}: {
  icon: LucideIcon
  title: string
  description: string
  done: boolean
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <Card className={cn("animate-reveal shadow-soft motion-reduce:animate-none", className)} style={style}>
      <CardHeader className="gap-1">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border bg-muted/60">
            <Icon aria-hidden="true" className="size-4" />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        <CardAction>
          {done ? (
            <Badge variant="secondary">
              <CheckIcon aria-hidden="true" />
              Done
            </Badge>
          ) : (
            <Badge variant="outline">To do</Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
