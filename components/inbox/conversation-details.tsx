"use client"

import { useInbox, useMemberLabel } from "@/components/inbox/inbox-provider"
import { StateBadge } from "@/components/inbox/state-badge"
import { VisitorAvatar } from "@/components/inbox/visitor-avatar"
import { formatAgo, visitorLabel } from "@/lib/inbox/conversations"
import type { Conversation } from "@/lib/inbox/types"

/** Who the Visitor is and where the Conversation stands. */
export function ConversationDetails({ conversation }: { conversation: Conversation }) {
  const { now } = useInbox()
  const memberLabel = useMemberLabel()
  const { visitor } = conversation
  const started = conversation.timeline[0]
  const startedAt = started ? (started.kind === "message" ? started.sentAt : started.at) : visitor.firstSeenAt

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-3 border-b px-5 py-6 text-center">
        <VisitorAvatar className="size-14" />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-display text-lg leading-tight tracking-[-0.02em]">{visitorLabel(visitor)}</p>
          <p className="text-sm [overflow-wrap:anywhere] text-muted-foreground">
            {visitor.email ?? "No email left"}
          </p>
        </div>
      </div>
      <Section title="Visitor">
        <Row label="Page">
          <span className="block truncate" title={visitor.pageUrl}>
            {visitor.pageUrl.replace(/^https?:\/\//, "")}
          </span>
        </Row>
        <Row label="First seen">{formatAgo(visitor.firstSeenAt, now)}</Row>
      </Section>
      <Section title="Conversation">
        <Row label="State">
          <StateBadge state={conversation.state} />
        </Row>
        <Row label="Claimed by">{memberLabel(conversation.claimedBy) ?? <span className="text-muted-foreground">No one</span>}</Row>
        <Row label="Started">{formatAgo(startedAt, now)}</Row>
        <Row label="ID">
          <span className="font-mono text-xs">{conversation.id}</span>
        </Row>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b px-5 py-4 last:border-b-0">
      <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      <dl className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5 text-sm">{children}</dl>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </>
  )
}
