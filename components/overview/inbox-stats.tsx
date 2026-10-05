"use client"

import Link from "next/link"
import { BotIcon, CheckIcon, HourglassIcon, UserIcon, type LucideIcon } from "lucide-react"

import { useInbox } from "@/components/inbox/inbox-provider"
import type { InboxView } from "@/lib/inbox/conversations"
import { formatRelative } from "@/lib/inbox/conversations"
import { inboxStats } from "@/lib/inbox/stats"
import { cn } from "@/lib/utils"

type Tile = { label: string; value: number; detail: string; icon: LucideIcon; tone: string; view: InboxView }

/**
 * Where the inbox stands right now, as four counts in the state colours. Each
 * opens the inbox on that view. Live state only, not analytics (PRD §8).
 */
export function InboxStatsRow({ style }: { style?: React.CSSProperties }) {
  const { conversations, currentMemberId, now, setView } = useInbox()
  const stats = inboxStats(conversations, currentMemberId)

  const tiles: Tile[] = [
    {
      label: "Waiting",
      value: stats.waiting,
      detail: stats.longestWaitingSince
        ? formatRelative(stats.longestWaitingSince, now) === "now"
          ? "Someone just asked"
          : `Longest wait ${formatRelative(stats.longestWaitingSince, now)}`
        : "No one is waiting",
      icon: HourglassIcon,
      tone: "bg-waiting/18 text-waiting-foreground",
      view: "waiting",
    },
    {
      label: "Claimed by you",
      value: stats.claimedByYou,
      detail: `Of ${stats.human} with your team`,
      icon: UserIcon,
      tone: "bg-human/14 text-human-foreground",
      view: "mine",
    },
    {
      label: "AI answering",
      value: stats.aiAnswering,
      detail: "No person needed so far",
      icon: BotIcon,
      tone: "bg-ai/14 text-ai-foreground",
      view: "ai_answering",
    },
    {
      label: "Closed",
      value: stats.closed,
      detail: "Resolved by your team",
      icon: CheckIcon,
      tone: "bg-muted text-muted-foreground",
      view: "closed",
    },
  ]

  return (
    <section
      aria-label="Your inbox right now"
      className="grid animate-reveal grid-cols-2 gap-3 motion-reduce:animate-none lg:grid-cols-4"
      style={style}
    >
      {tiles.map(({ label, value, detail, icon: Icon, tone, view }) => (
        <Link
          key={label}
          href="/dashboard/inbox"
          onClick={() => setView(view)}
          className="group flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-soft outline-none transition-[border-color,translate] duration-200 hover:-translate-y-px hover:border-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className={cn("grid size-7 place-items-center rounded-lg", tone)}>
              <Icon aria-hidden="true" className="size-3.5" />
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-[32px] leading-none tracking-[-0.02em] tabular-nums">{value}</span>
            <span className="text-xs text-muted-foreground">{detail}</span>
          </div>
        </Link>
      ))}
    </section>
  )
}
