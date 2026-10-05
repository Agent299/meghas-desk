import Link from "next/link"
import { ArrowRightIcon, CoffeeIcon } from "lucide-react"

import { VisitorAvatar } from "@/components/inbox/visitor-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { formatRelative, lastMessage, sortForInbox, visitorLabel } from "@/lib/inbox/conversations"
import type { Conversation } from "@/lib/inbox/types"

/** Visitors who asked for a person, longest-waiting first. */
export function NeedsAttention({ conversations, now }: { conversations: Conversation[]; now: number }) {
  const waiting = sortForInbox(conversations.filter((c) => c.state === "waiting"))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Needs attention</CardTitle>
        <CardDescription>Visitors Waiting for a person.</CardDescription>
        <CardAction>
          <Badge variant={waiting.length ? "default" : "outline"} className="tabular-nums">
            {waiting.length} Waiting
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {waiting.length === 0 ? (
          <Empty className="border-0 p-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CoffeeIcon />
              </EmptyMedia>
              <EmptyTitle>No one is waiting</EmptyTitle>
              <EmptyDescription>The AI is handling every Conversation.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="-mx-2 flex flex-col gap-0.5">
            {waiting.map((conversation) => {
              const preview = lastMessage(conversation)?.body
              return (
                <li key={conversation.id}>
                  <Link
                    href={`/dashboard/inbox/${conversation.id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <VisitorAvatar visitor={conversation.visitor} />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">{visitorLabel(conversation.visitor)}</span>
                      {preview && <span className="truncate text-sm text-muted-foreground">{preview}</span>}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {conversation.waitingSince ? formatRelative(conversation.waitingSince, now) : null}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/dashboard/inbox" />}>
          Open the inbox
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
