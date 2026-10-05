import type { Conversation } from "./types";

/**
 * Live counts the team acts on, read from the same Conversations as the inbox.
 * Deliberately not analytics (PRD §8): no history, rates or trends.
 */
export type InboxStats = {
  waiting: number;
  /** When the longest-waiting Visitor asked for a person; null when no one is Waiting. */
  longestWaitingSince: string | null;
  /** Conversations in Human, whoever claimed them. */
  human: number;
  /** Human Conversations claimed by the current Team member. */
  claimedByYou: number;
  aiAnswering: number;
  /** Every Closed Conversation: the same list the inbox's Closed view shows. */
  closed: number;
};

export function inboxStats(conversations: Conversation[], memberId: string): InboxStats {
  let longestWaitingSince: string | null = null;
  const stats: InboxStats = {
    waiting: 0,
    longestWaitingSince: null,
    human: 0,
    claimedByYou: 0,
    aiAnswering: 0,
    closed: 0,
  };

  for (const conversation of conversations) {
    switch (conversation.state) {
      case "waiting":
        stats.waiting++;
        if (
          conversation.waitingSince &&
          (!longestWaitingSince || Date.parse(conversation.waitingSince) < Date.parse(longestWaitingSince))
        ) {
          longestWaitingSince = conversation.waitingSince;
        }
        break;
      case "human":
        stats.human++;
        if (conversation.claimedBy === memberId) stats.claimedByYou++;
        break;
      case "ai_answering":
        stats.aiAnswering++;
        break;
      case "closed":
        stats.closed++;
        break;
    }
  }

  return { ...stats, longestWaitingSince };
}

