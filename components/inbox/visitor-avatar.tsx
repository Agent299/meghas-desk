import { UserRoundIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Visitor } from "@/lib/inbox/types"
import { cn } from "@/lib/utils"

/** Visitors are anonymous, so they get a person icon in greys rather than initials. */
export function VisitorAvatar({ className }: { visitor?: Pick<Visitor, "id">; className?: string }) {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarFallback className="bg-muted text-muted-foreground">
        <UserRoundIcon aria-hidden="true" className="size-[55%]" />
      </AvatarFallback>
    </Avatar>
  )
}
