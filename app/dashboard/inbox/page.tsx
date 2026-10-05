import { MessagesSquareIcon } from "lucide-react"

import { paneClassName } from "@/components/inbox/pane"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"

// Shown beside the list from lg: up; on smaller screens the list fills the page instead.
export default function InboxPage() {
  return (
    <Empty className={cn(paneClassName, "flex-1 justify-center")}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessagesSquareIcon />
        </EmptyMedia>
        <EmptyTitle className="font-display text-xl font-normal tracking-[-0.02em]">Pick A Conversation</EmptyTitle>
        <EmptyDescription>Visitors Waiting for a person are at the top of the list.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
