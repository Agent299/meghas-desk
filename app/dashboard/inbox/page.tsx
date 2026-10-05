import { MessagesSquareIcon } from "lucide-react"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

// Shown beside the list from lg: up; on smaller screens the list fills the page instead.
export default function InboxPage() {
  return (
    <Empty className="flex-1 border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessagesSquareIcon />
        </EmptyMedia>
        <EmptyTitle>Pick a Conversation</EmptyTitle>
        <EmptyDescription>Visitors who are Waiting for a person are at the top of the list.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
