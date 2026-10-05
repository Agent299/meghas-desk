"use client"

import { useSelectedLayoutSegment } from "next/navigation"

import { ConversationList } from "@/components/inbox/conversation-list"
import { paneClassName } from "@/components/inbox/pane"
import { cn } from "@/lib/utils"

/**
 * List card beside the thread card from `lg:` up. Below that they are two
 * screens: the list at /dashboard/inbox, the thread at /dashboard/inbox/[conversationId].
 */
export function InboxShell({ children }: { children: React.ReactNode }) {
  const conversationOpen = useSelectedLayoutSegment() !== null

  return (
    <div className="flex min-h-0 flex-1 gap-3 px-2 pb-2 md:px-3 md:pb-3">
      <aside
        aria-label="Conversation list"
        className={cn(paneClassName, "w-full shrink-0 lg:flex lg:w-80 xl:w-[22rem]", conversationOpen ? "hidden" : "flex")}
      >
        <ConversationList />
      </aside>
      <div className={cn("min-w-0 flex-1 gap-3 lg:flex", conversationOpen ? "flex" : "hidden")}>{children}</div>
    </div>
  )
}
