"use client"

import * as React from "react"

import { applyAction, type ConversationAction, type InboxView } from "@/lib/inbox/conversations"
import type { InboxData } from "@/lib/inbox/queries"
import type { Conversation, TeamMember } from "@/lib/inbox/types"

type InboxContextValue = {
  conversations: Conversation[]
  members: TeamMember[]
  currentMemberId: string
  /** Updated every 30 s after hydration; starts at the server's read time. */
  now: number
  view: InboxView
  setView: (view: InboxView) => void
  act: (conversationId: string, action: ConversationAction) => void
}

const InboxContext = React.createContext<InboxContextValue | null>(null)

/**
 * Holds the inbox's Conversations so the list and the thread stay in step.
 * With sample data, Claims and replies live here only and reset on reload.
 */
export function InboxProvider({ initial, children }: { initial: InboxData; children: React.ReactNode }) {
  const [conversations, setConversations] = React.useState(initial.conversations)
  const [view, setView] = React.useState<InboxView>("open")
  const [now, setNow] = React.useState(initial.now)

  React.useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const timer = window.setInterval(tick, 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const act = React.useCallback(
    (conversationId: string, action: ConversationAction) => {
      const at = new Date().toISOString()
      setNow(Date.parse(at))
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? applyAction(conversation, action, {
                memberId: initial.currentMemberId,
                at,
                idPrefix: `${conversationId}-${crypto.randomUUID()}`,
              })
            : conversation
        )
      )
    },
    [initial.currentMemberId]
  )

  const value = React.useMemo(
    () => ({
      conversations,
      members: initial.members,
      currentMemberId: initial.currentMemberId,
      now,
      view,
      setView,
      act,
    }),
    [conversations, initial.members, initial.currentMemberId, now, view, act]
  )

  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>
}

export function useInbox(): InboxContextValue {
  const value = React.useContext(InboxContext)
  if (!value) throw new Error("useInbox must be used inside <InboxProvider>.")
  return value
}

/** "You" for the current Team member, otherwise their name. */
export function useMemberLabel() {
  const { members, currentMemberId } = useInbox()
  return React.useCallback(
    (memberId: string | null | undefined, { first = false } = {}) => {
      if (!memberId) return null
      if (memberId === currentMemberId) return "You"
      const name = members.find((m) => m.id === memberId)?.name
      if (!name) return "A Team member"
      return first ? name.trim().split(/\s+/)[0] : name
    },
    [members, currentMemberId]
  )
}
