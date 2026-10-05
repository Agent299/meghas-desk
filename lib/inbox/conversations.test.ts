import { describe, expect, it } from "vitest";

import {
  applyAction,
  countByView,
  formatAgo,
  formatRelative,
  lastMessage,
  matchesView,
  sortForInbox,
  visitorLabel,
} from "./conversations";
import { CURRENT_MEMBER_ID, sampleConversations } from "./sample-data";
import type { Conversation, ConversationState } from "./types";

const NOW = Date.parse("2026-10-05T12:00:00Z");
const ago = (minutes: number) => new Date(NOW - minutes * 60_000).toISOString();
const ME = "me";
const ctx = { memberId: ME, at: ago(0), idPrefix: "t" };

function conversation(state: ConversationState, overrides: Partial<Conversation> = {}): Conversation {
  return {
    id: `c-${state}`,
    visitor: { id: "v_abcd1234", email: null, pageUrl: "https://shop.example/", firstSeenAt: ago(60) },
    state,
    claimedBy: null,
    waitingSince: state === "waiting" ? ago(5) : null,
    timeline: [
      { kind: "message", id: "m1", sender: { type: "visitor" }, body: "Hi", sentAt: ago(10), classification: "on_topic" },
    ],
    ...overrides,
  };
}

describe("matchesView", () => {
  it("open excludes Closed; all includes it", () => {
    expect(matchesView(conversation("closed"), "open", ME)).toBe(false);
    expect(matchesView(conversation("waiting"), "open", ME)).toBe(true);
    expect(matchesView(conversation("closed"), "all", ME)).toBe(true);
  });

  it("state views match only that state", () => {
    expect(matchesView(conversation("human"), "human", ME)).toBe(true);
    expect(matchesView(conversation("human"), "waiting", ME)).toBe(false);
  });

  it("mine is open Conversations claimed by the current Team member", () => {
    expect(matchesView(conversation("human", { claimedBy: ME }), "mine", ME)).toBe(true);
    expect(matchesView(conversation("human", { claimedBy: "other" }), "mine", ME)).toBe(false);
    expect(matchesView(conversation("closed", { claimedBy: ME }), "mine", ME)).toBe(false);
  });

  it("counts every view", () => {
    const counts = countByView([conversation("waiting"), conversation("closed"), conversation("human", { claimedBy: ME })], ME);
    expect(counts).toMatchObject({ open: 2, waiting: 1, human: 1, mine: 1, closed: 1, all: 3, ai_answering: 0 });
  });
});

describe("sortForInbox", () => {
  it("puts Waiting first, longest waiting on top, then the rest by latest activity", () => {
    const sorted = sortForInbox([
      conversation("ai_answering", { id: "old" }),
      conversation("waiting", { id: "w-recent", waitingSince: ago(1) }),
      conversation("human", {
        id: "fresh",
        timeline: [{ kind: "message", id: "m", sender: { type: "visitor" }, body: "x", sentAt: ago(1) }],
      }),
      conversation("waiting", { id: "w-long", waitingSince: ago(30) }),
    ]);
    expect(sorted.map((c) => c.id)).toEqual(["w-long", "w-recent", "fresh", "old"]);
  });
});

describe("applyAction", () => {
  it("claim moves AI answering or Waiting to Human and labels it", () => {
    for (const state of ["ai_answering", "waiting"] as const) {
      const next = applyAction(conversation(state), { type: "claim" }, ctx);
      expect(next).toMatchObject({ state: "human", claimedBy: ME, waitingSince: null });
      expect(next.timeline.at(-1)).toMatchObject({ kind: "event", event: "claimed", memberId: ME });
    }
  });

  it("re-claims a Conversation claimed by someone else", () => {
    const next = applyAction(conversation("human", { claimedBy: "other" }), { type: "claim" }, ctx);
    expect(next.claimedBy).toBe(ME);
  });

  it("does nothing when already yours or Closed", () => {
    const mine = conversation("human", { claimedBy: ME });
    expect(applyAction(mine, { type: "claim" }, ctx)).toBe(mine);
    const closed = conversation("closed");
    expect(applyAction(closed, { type: "claim" }, ctx)).toBe(closed);
  });

  it("a reply claims the Conversation and adds the message", () => {
    const next = applyAction(conversation("waiting"), { type: "reply", body: "  On it!  " }, ctx);
    expect(next).toMatchObject({ state: "human", claimedBy: ME });
    expect(next.timeline.slice(-2).map((i) => (i.kind === "event" ? i.event : i.body))).toEqual(["claimed", "On it!"]);
  });

  it("a reply in your own Conversation doesn't add another Claim", () => {
    const next = applyAction(conversation("human", { claimedBy: ME }), { type: "reply", body: "More" }, ctx);
    expect(next.timeline.filter((i) => i.kind === "event")).toHaveLength(0);
  });

  it("ignores empty replies and replies to Closed Conversations", () => {
    const waiting = conversation("waiting");
    expect(applyAction(waiting, { type: "reply", body: "   " }, ctx)).toBe(waiting);
    const closed = conversation("closed");
    expect(applyAction(closed, { type: "reply", body: "Hi" }, ctx)).toBe(closed);
  });

  it("closes only from Human", () => {
    expect(applyAction(conversation("human", { claimedBy: ME }), { type: "close" }, ctx).state).toBe("closed");
    const waiting = conversation("waiting");
    expect(applyAction(waiting, { type: "close" }, ctx)).toBe(waiting);
  });
});

describe("formatting", () => {
  it("labels anonymous Visitors from their id", () => {
    expect(visitorLabel({ id: "v_8f3a4821" })).toBe("Visitor 4821");
    expect(visitorLabel({ id: "v_ab" })).toBe("Visitor VAB");
    expect(visitorLabel({ id: "" })).toBe("Visitor");
  });

  it("formats relative times", () => {
    expect(formatRelative(ago(0), NOW)).toBe("now");
    expect(formatRelative(new Date(NOW + 60_000).toISOString(), NOW)).toBe("now");
    expect(formatRelative(ago(5), NOW)).toBe("5m");
    expect(formatRelative(ago(180), NOW)).toBe("3h");
    expect(formatRelative(ago(60 * 48), NOW)).toBe("2d");
    expect(formatRelative(ago(60 * 24 * 10), NOW)).toBe("Sep 25");
  });

  it("says just now rather than now ago", () => {
    expect(formatAgo(ago(0), NOW)).toBe("just now");
    expect(formatAgo(ago(5), NOW)).toBe("5m ago");
    expect(formatAgo(ago(60 * 24 * 10), NOW)).toBe("on Sep 25");
  });

  it("formats dates in UTC, whatever the local time zone", () => {
    // 23:30 UTC on Sep 20 is already Sep 21 east of UTC+0:30.
    const late = Date.parse("2026-09-20T23:30:00Z");
    expect(formatRelative(new Date(late).toISOString(), late + 10 * 24 * 60 * 60_000)).toBe("Sep 20");
  });
});

describe("sample data", () => {
  const conversations = sampleConversations(NOW);

  it("follows the state rules", () => {
    for (const c of conversations) {
      expect(c.waitingSince !== null).toBe(c.state === "waiting");
      if (c.state === "human") expect(c.claimedBy).not.toBeNull();
      if (c.state === "waiting" || c.state === "ai_answering") expect(c.claimedBy).toBeNull();
      expect(lastMessage(c)).not.toBeNull();
    }
  });

  it("covers every state and a Conversation claimed by you", () => {
    const states = new Set(conversations.map((c) => c.state));
    expect(states).toEqual(new Set(["ai_answering", "waiting", "human", "closed"]));
    expect(conversations.some((c) => c.claimedBy === CURRENT_MEMBER_ID)).toBe(true);
  });
});
