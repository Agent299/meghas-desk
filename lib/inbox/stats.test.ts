import { describe, expect, it } from "vitest";

import { CURRENT_MEMBER_ID, sampleConversations } from "./sample-data";
import { inboxStats } from "./stats";
import type { Conversation, ConversationState, TimelineItem } from "./types";

const NOW = Date.parse("2026-10-05T12:00:00Z");
const ago = (minutes: number) => new Date(NOW - minutes * 60_000).toISOString();
const ME = "me";

function conversation(
  id: string,
  state: ConversationState,
  overrides: Partial<Conversation> = {},
  extra: TimelineItem[] = [],
): Conversation {
  return {
    id,
    visitor: { id: `v_${id}`, email: null, pageUrl: "https://shop.example/", firstSeenAt: ago(600) },
    state,
    claimedBy: null,
    waitingSince: null,
    timeline: [
      { kind: "message", id: `${id}-m`, sender: { type: "visitor" }, body: "Hi", sentAt: ago(600), classification: "on_topic" },
      ...extra,
    ],
    ...overrides,
  };
}

const closedAt = (id: string, minutes: number): TimelineItem => ({
  kind: "event",
  id: `${id}-closed`,
  event: "closed",
  memberId: ME,
  at: ago(minutes),
});

describe("inboxStats", () => {
  it("is all zeros for an empty inbox", () => {
    expect(inboxStats([], ME)).toEqual({
      waiting: 0,
      longestWaitingSince: null,
      human: 0,
      claimedByYou: 0,
      aiAnswering: 0,
      closed: 0,
    });
  });

  it("counts each state and finds the longest wait", () => {
    const stats = inboxStats(
      [
        conversation("w1", "waiting", { waitingSince: ago(5) }),
        conversation("w2", "waiting", { waitingSince: ago(40) }),
        conversation("h1", "human", { claimedBy: ME }),
        conversation("h2", "human", { claimedBy: "someone-else" }),
        conversation("a1", "ai_answering"),
      ],
      ME,
    );
    expect(stats).toMatchObject({ waiting: 2, human: 2, claimedByYou: 1, aiAnswering: 1 });
    expect(stats.longestWaitingSince).toBe(ago(40));
  });

  it("counts every Closed Conversation, and not ones reopened since", () => {
    const stats = inboxStats(
      [
        conversation("c1", "closed", {}, [closedAt("c1", 30)]),
        conversation("c2", "closed", {}, [closedAt("c2", 60 * 48)]),
        // Closed recently but reopened since, so it isn't Closed any more.
        conversation("c3", "ai_answering", {}, [closedAt("c3", 10)]),
      ],
      ME,
    );
    expect(stats.closed).toBe(2);
  });
});

describe("sample data", () => {
  const conversations = sampleConversations(NOW);

  it("gives every Conversation, Visitor and timeline item a unique id", () => {
    const unique = (ids: string[]) => new Set(ids).size === ids.length;
    expect(unique(conversations.map((c) => c.id))).toBe(true);
    expect(unique(conversations.map((c) => c.visitor.id))).toBe(true);
    expect(unique(conversations.flatMap((c) => c.timeline.map((item) => item.id)))).toBe(true);
  });

  it("keeps every timeline in time order", () => {
    for (const c of conversations) {
      const times = c.timeline.map((item) => Date.parse(item.kind === "message" ? item.sentAt : item.at));
      expect(times).toEqual([...times].sort((a, b) => a - b));
    }
  });

  it("is busy enough to fill the inbox and Home", () => {
    const stats = inboxStats(conversations, CURRENT_MEMBER_ID);
    expect(conversations.length).toBeGreaterThanOrEqual(30);
    expect(stats.waiting).toBeGreaterThan(5);
    expect(stats.claimedByYou).toBeGreaterThan(1);
    expect(stats.closed).toBeGreaterThan(1);
  });
});
