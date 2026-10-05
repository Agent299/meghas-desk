import type {
  Conversation,
  ConversationState,
  MessageItem,
  TeamMember,
  Visitor,
} from "./types";

export const STATE_LABEL: Record<ConversationState, string> = {
  ai_answering: "AI answering",
  waiting: "Waiting",
  human: "Human",
  closed: "Closed",
};

/** The inbox's list filters. `open` (everything but Closed) is the default. */
export type InboxView = "open" | "waiting" | "ai_answering" | "human" | "mine" | "closed" | "all";

export const INBOX_VIEWS: { value: InboxView; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "waiting", label: "Waiting" },
  { value: "ai_answering", label: "AI answering" },
  { value: "human", label: "Human" },
  { value: "mine", label: "Claimed by you" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
];

export function matchesView(conversation: Conversation, view: InboxView, memberId: string): boolean {
  switch (view) {
    case "open":
      return conversation.state !== "closed";
    case "mine":
      return conversation.claimedBy === memberId && conversation.state !== "closed";
    case "all":
      return true;
    default:
      return conversation.state === view;
  }
}

export function countByView(conversations: Conversation[], memberId: string): Record<InboxView, number> {
  const counts = {} as Record<InboxView, number>;
  for (const { value } of INBOX_VIEWS) {
    counts[value] = conversations.filter((c) => matchesView(c, value, memberId)).length;
  }
  return counts;
}

export function lastActivityAt(conversation: Conversation): string {
  const last = conversation.timeline.at(-1);
  return last ? (last.kind === "message" ? last.sentAt : last.at) : conversation.visitor.firstSeenAt;
}

export function lastMessage(conversation: Conversation): MessageItem | null {
  for (let i = conversation.timeline.length - 1; i >= 0; i--) {
    const item = conversation.timeline[i];
    if (item.kind === "message") return item;
  }
  return null;
}

/**
 * Waiting first, longest-waiting at the top, because those Visitors asked for
 * a person. Everything else by latest activity.
 */
export function sortForInbox(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => {
    const aWaiting = a.state === "waiting";
    const bWaiting = b.state === "waiting";
    if (aWaiting !== bWaiting) return aWaiting ? -1 : 1;
    if (aWaiting && bWaiting) {
      return Date.parse(a.waitingSince ?? lastActivityAt(a)) - Date.parse(b.waitingSince ?? lastActivityAt(b));
    }
    return Date.parse(lastActivityAt(b)) - Date.parse(lastActivityAt(a));
  });
}

export type ConversationAction =
  | { type: "claim" }
  | { type: "reply"; body: string }
  | { type: "close" };

export type ActionContext = {
  memberId: string;
  /** ISO time of the action. */
  at: string;
  /** Prefix for the ids of the timeline items the action adds. */
  idPrefix: string;
};

export function canClaim(conversation: Conversation, memberId: string): boolean {
  if (conversation.state === "closed") return false;
  return !(conversation.state === "human" && conversation.claimedBy === memberId);
}

export function canReply(conversation: Conversation): boolean {
  return conversation.state !== "closed";
}

/** From Human, a Conversation can only be Closed; nothing else closes it. */
export function canClose(conversation: Conversation): boolean {
  return conversation.state === "human";
}

function claim(conversation: Conversation, { memberId, at, idPrefix }: ActionContext): Conversation {
  return {
    ...conversation,
    state: "human",
    claimedBy: memberId,
    waitingSince: null,
    timeline: [...conversation.timeline, { kind: "event", id: `${idPrefix}-claim`, event: "claimed", memberId, at }],
  };
}

/**
 * The Team member actions on a Conversation (PRD §7.5). An action that isn't
 * allowed in the current state returns the Conversation unchanged.
 */
export function applyAction(
  conversation: Conversation,
  action: ConversationAction,
  context: ActionContext,
): Conversation {
  switch (action.type) {
    case "claim":
      return canClaim(conversation, context.memberId) ? claim(conversation, context) : conversation;
    case "reply": {
      const body = action.body.trim();
      if (!body || !canReply(conversation)) return conversation;
      // Sending a reply claims the Conversation.
      const claimed = canClaim(conversation, context.memberId) ? claim(conversation, context) : conversation;
      return {
        ...claimed,
        timeline: [
          ...claimed.timeline,
          {
            kind: "message",
            id: `${context.idPrefix}-reply`,
            sender: { type: "member", memberId: context.memberId },
            body,
            sentAt: context.at,
          },
        ],
      };
    }
    case "close":
      if (!canClose(conversation)) return conversation;
      return {
        ...conversation,
        state: "closed",
        waitingSince: null,
        timeline: [
          ...conversation.timeline,
          { kind: "event", id: `${context.idPrefix}-close`, event: "closed", memberId: context.memberId, at: context.at },
        ],
      };
  }
}

/** Visitors are anonymous: "Visitor 4821", from the end of their id. */
export function visitorLabel(visitor: Pick<Visitor, "id">): string {
  const tail = visitor.id.replace(/[^a-z0-9]/gi, "").slice(-4).toUpperCase();
  return tail ? `Visitor ${tail}` : "Visitor";
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function memberName(members: TeamMember[], memberId: string | null | undefined): string | null {
  if (!memberId) return null;
  return members.find((m) => m.id === memberId)?.name ?? null;
}

/** "now", "5m", "3h", "2d", then a short date. Future times count as now. */
export function formatRelative(iso: string, now: number): string {
  const minutes = Math.floor(Math.max(0, now - Date.parse(iso)) / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en", { month: "short", day: "numeric" });
}
