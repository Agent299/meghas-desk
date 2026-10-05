import { BotIcon, CheckIcon, UserIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { STATE_LABEL } from "@/lib/inbox/conversations"
import type { ConversationState } from "@/lib/inbox/types"
import { cn } from "@/lib/utils"

/**
 * A Conversation's state in its state colour (DESIGN.md): Waiting amber with a
 * pinging dot, Human blue, AI answering violet, Closed grey. Colour always
 * comes with a label and an icon, never alone.
 */
export function StateBadge({ state, className }: { state: ConversationState; className?: string }) {
  switch (state) {
    case "waiting":
      return (
        <Badge className={cn("bg-waiting/18 text-waiting-foreground", className)}>
          <span aria-hidden="true" className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-waiting opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-1.5 rounded-full bg-waiting" />
          </span>
          {STATE_LABEL.waiting}
        </Badge>
      )
    case "human":
      return (
        <Badge className={cn("bg-human/14 text-human-foreground", className)}>
          <UserIcon aria-hidden="true" />
          {STATE_LABEL.human}
        </Badge>
      )
    case "ai_answering":
      return (
        <Badge className={cn("bg-ai/14 text-ai-foreground", className)}>
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
