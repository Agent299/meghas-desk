"use client"

import { useInbox, useMemberLabel } from "@/components/inbox/inbox-provider"
import { StateBadge } from "@/components/inbox/state-badge"
import { Separator } from "@/components/ui/separator"
import { formatRelative, visitorLabel } from "@/lib/inbox/conversations"
import type { Conversation } from "@/lib/inbox/types"

/** Who the Visitor is and where the Conversation stands. */
export function ConversationDetails({ conversation }: { conversation: Conversation }) {
  const { now } = useInbox()
  const memberLabel = useMemberLabel()
  const { visitor } = conversation
  const started = conversation.timeline[0]
  const startedAt = started ? (started.kind === "message" ? started.sentAt : started.at) : visitor.firstSeenAt

  return (
    <div className="flex flex-col gap-5 p-4">
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-medium text-muted-foreground">Visitor</h3>
        <dl className="grid grid-cols-[6rem_minmax(0,1fr)] gap-x-3 gap-y-2.5 text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd>{visitorLabel(visitor)}</dd>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="[overflow-wrap:anywhere]">
            {visitor.email ?? <span className="text-muted-foreground">Not left</span>}
          </dd>
          <dt className="text-muted-foreground">Page</dt>
          <dd className="truncate" title={visitor.pageUrl}>
            {visitor.pageUrl.replace(/^https?:\/\//, "")}
          </dd>
          <dt className="text-muted-foreground">First seen</dt>
          <dd>{formatRelative(visitor.firstSeenAt, now)} ago</dd>
        </dl>
      </section>
      <Separator />
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-medium text-muted-foreground">Conversation</h3>
        <dl className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5 text-sm">
          <dt className="text-muted-foreground">State</dt>
          <dd>
            <StateBadge state={conversation.state} />
          </dd>
          <dt className="text-muted-foreground">Claimed by</dt>
          <dd>{memberLabel(conversation.claimedBy) ?? <span className="text-muted-foreground">No one</span>}</dd>
          <dt className="text-muted-foreground">Started</dt>
          <dd>{formatRelative(startedAt, now)} ago</dd>
          <dt className="text-muted-foreground">ID</dt>
          <dd className="font-mono text-xs">{conversation.id}</dd>
        </dl>
      </section>
    </div>
  )
}
