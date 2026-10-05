import { sampleConversations, sampleMembers, CURRENT_MEMBER_ID } from "./sample-data";
import type { Conversation, TeamMember } from "./types";
import { sampleWidgetSettings } from "../widget/sample-data";
import type { WidgetSettings } from "../widget/types";

// The one place the dashboard gets Workspace data from. Today it returns sample
// data; it becomes Data API reads (and PartyKit for live updates) once the
// schema and the widget exist, and its callers stay the same.

export type InboxData = {
  conversations: Conversation[];
  members: TeamMember[];
  currentMemberId: string;
  /** Server time the data was read at, so relative times render the same on both sides. */
  now: number;
};

export async function getInboxData(yourName: string): Promise<InboxData> {
  const now = Date.now();
  return {
    conversations: sampleConversations(now),
    members: sampleMembers(yourName),
    currentMemberId: CURRENT_MEMBER_ID,
    now,
  };
}

export async function conversationExists(id: string): Promise<boolean> {
  return sampleConversations(Date.now()).some((c) => c.id === id);
}

export async function getWidgetSettings(): Promise<WidgetSettings> {
  return sampleWidgetSettings(Date.now());
}
