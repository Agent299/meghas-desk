import { sampleConversations, sampleMembers, sampleOverview, CURRENT_MEMBER_ID } from "./sample-data";
import type { Conversation, TeamMember, WorkspaceOverview } from "./types";

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

export async function getWorkspaceOverview(): Promise<WorkspaceOverview> {
  return sampleOverview();
}

export async function conversationExists(id: string): Promise<boolean> {
  return sampleConversations(Date.now()).some((c) => c.id === id);
}
