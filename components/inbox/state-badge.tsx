import { BotIcon, CheckIcon, UserIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { STATE_LABEL } from "@/lib/inbox/conversations"
import type { ConversationState } from "@/lib/inbox/types"
import { cn } from "@/lib/utils"

/**
 * A Conversation's state. Waiting is the only filled badge, with a pulsing dot:
 * the design system is monochrome, so emphasis comes from weight, not hue.
 */
export function StateBadge({ state, className }: { state: ConversationState; className?: string }) {
  switch (state) {
    case "waiting":
      return (
        <Badge className={className}>
          <span aria-hidden="true" className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary-foreground opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary-foreground" />
          </span>
          {STATE_LABEL.waiting}
        </Badge>
      )
    case "human":
      return (
        <Badge variant="secondary" className={className}>
          <UserIcon aria-hidden="true" />
          {STATE_LABEL.human}
        </Badge>
      )
    case "ai_answering":
      return (
        <Badge variant="outline" className={className}>
          <BotIcon aria-hidden="true" />
          {STATE_LABEL.ai_answering}
        </Badge>
      )
    case "closed":
      return (
        <Badge variant="outline" className={cn("text-muted-foreground", className)}>
          <CheckIcon aria-hidden="true" />
          {STATE_LABEL.closed}
        </Badge>
      )
  }
}
