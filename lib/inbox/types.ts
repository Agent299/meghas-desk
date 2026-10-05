// Shapes the dashboard reads, following PRD Appendix B. Components depend on
// these types only, so swapping the sample data for the Data API and PartyKit
// leaves them untouched.

export type ConversationState = "ai_answering" | "waiting" | "human" | "closed";

export type Classification = "on_topic" | "off_topic" | "wants_human";

export type TeamMember = {
  id: string;
  name: string;
};

export type Visitor = {
  id: string;
  /** Left by the Visitor while Waiting, so the team can follow up outside MeghasDesk. */
  email: string | null;
  /** The page on an Allowed domain where the Conversation started. */
  pageUrl: string;
  firstSeenAt: string;
};

export type MessageSender =
  | { type: "visitor" }
  | { type: "ai" }
  | { type: "member"; memberId: string };

/** What an AI message is: a normal answer, a Handoff offer, or the fixed Decline. */
export type AiReplyKind = "answer" | "handoff_offer" | "decline";

export type MessageItem = {
  kind: "message";
  id: string;
  sender: MessageSender;
  body: string;
  sentAt: string;
  /** Set on Visitor messages: the classifier's verdict. */
  classification?: Classification;
  /** Set on AI messages. */
  aiReply?: AiReplyKind;
};

export type ConversationEvent =
  | "wants_human"
  | "allowance_used_up"
  | "claimed"
  | "closed"
  | "reopened";

export type EventItem = {
  kind: "event";
  id: string;
  event: ConversationEvent;
  /** The Team member who claimed or closed. */
  memberId?: string;
  at: string;
};

export type TimelineItem = MessageItem | EventItem;

export type Conversation = {
  id: string;
  visitor: Visitor;
  state: ConversationState;
  claimedBy: string | null;
  /** When the Conversation entered Waiting; null outside Waiting. */
  waitingSince: string | null;
  timeline: TimelineItem[];
};
