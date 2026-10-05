"use client"

import { useSelectedLayoutSegment } from "next/navigation"

import { ConversationList } from "@/components/inbox/conversation-list"
import { cn } from "@/lib/utils"

/**
 * List beside thread from `lg:` up. Below that they are two screens: the list
 * at /dashboard/inbox, the thread at /dashboard/inbox/[conversationId].
 */
export function InboxShell({ children }: { children: React.ReactNode }) {
  const conversationOpen = useSelectedLayoutSegment() !== null

  return (
    <div className="flex min-h-0 flex-1">
      <aside
        aria-label="Conversation list"
        className={cn("w-full shrink-0 flex-col border-r lg:flex lg:w-80 xl:w-88", conversationOpen ? "hidden" : "flex")}
      >
        <ConversationList />
      </aside>
      <div className={cn("min-w-0 flex-1 flex-col lg:flex", conversationOpen ? "flex" : "hidden")}>{children}</div>
    </div>
  )
}
