import type { Conversation, TeamMember, TimelineItem, WorkspaceOverview } from "./types";

// Stand-in data until Workspaces, Conversations and the widget exist. A made-up
// pottery shop; every time is relative to `now` so the inbox always looks live.

export const CURRENT_MEMBER_ID = "member-you";

export function sampleMembers(yourName: string): TeamMember[] {
  return [
    { id: CURRENT_MEMBER_ID, name: yourName },
    { id: "member-priya", name: "Priya Nair" },
    { id: "member-tom", name: "Tom Becker" },
  ];
}

export function sampleOverview(): WorkspaceOverview {
  return {
    setup: [
      { id: "business_description", done: true },
      { id: "allowed_domain", done: true },
      { id: "knowledge_file", done: false },
      { id: "widget_preview", done: false },
      { id: "install_snippet", done: false },
    ],
    allowanceUsedUp: false,
  };
}

type Line =
  | ["visitor", number, string, ("off_topic" | "wants_human")?]
  | ["ai", number, string, ("handoff_offer" | "decline")?]
  | ["member", number, string, string]
  | ["event", number, "wants_human" | "claimed" | "closed" | "reopened", string?];

export function sampleConversations(now: number): Conversation[] {
  const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

  function timeline(conversationId: string, lines: Line[]): TimelineItem[] {
    return lines.map((line, index): TimelineItem => {
      const id = `${conversationId}-${index}`;
      switch (line[0]) {
        case "visitor":
          return {
            kind: "message",
            id,
            sender: { type: "visitor" },
            body: line[2],
            sentAt: ago(line[1]),
            classification: line[3] ?? "on_topic",
          };
        case "ai":
          return { kind: "message", id, sender: { type: "ai" }, body: line[2], sentAt: ago(line[1]), aiReply: line[3] ?? "answer" };
        case "member":
          return { kind: "message", id, sender: { type: "member", memberId: line[3] }, body: line[2], sentAt: ago(line[1]) };
        case "event":
          return { kind: "event", id, event: line[2], memberId: line[3], at: ago(line[1]) };
      }
    });
  }

  const visitor = (id: string, firstSeen: number, page: string, email: string | null = null) => ({
    id,
    email,
    pageUrl: `https://ridgeway.example${page}`,
    firstSeenAt: ago(firstSeen),
  });

  return [
    {
      id: "c_1001",
      visitor: visitor("v_8f3a4821", 14, "/orders", "hannah@mail.example"),
      state: "waiting",
      claimedBy: null,
      waitingSince: ago(6),
      timeline: timeline("c_1001", [
        ["visitor", 14, "My order arrived today and two of the mugs are cracked. Order #20417."],
        ["ai", 14, "I'm sorry about that. I can't see order details, so I don't know what happens next for damaged items. Would you like to talk to a person?", "handoff_offer"],
        ["visitor", 6, "Yes please", "wants_human"],
        ["event", 6, "wants_human"],
        ["visitor", 5, "I left my email in case you're busy."],
      ]),
    },
    {
      id: "c_1002",
      visitor: visitor("v_2c9e17b3", 3, "/contact"),
      state: "waiting",
      claimedBy: null,
      waitingSince: ago(2),
      timeline: timeline("c_1002", [
        ["visitor", 2, "Can I speak to someone about a wholesale order for my café?", "wants_human"],
        ["event", 2, "wants_human"],
      ]),
    },
    {
      id: "c_1003",
      visitor: visitor("v_51d0aa62", 40, "/returns", "j.okafor@mail.example"),
      state: "human",
      claimedBy: CURRENT_MEMBER_ID,
      waitingSince: null,
      timeline: timeline("c_1003", [
        ["visitor", 40, "How long do I have to return a vase?"],
        ["ai", 40, "You can return any item within 30 days of delivery, as long as it's unused and in its original packaging."],
        ["visitor", 31, "It was a gift, I don't have the receipt. Can a person help?", "wants_human"],
        ["event", 31, "wants_human"],
        ["event", 24, "claimed", CURRENT_MEMBER_ID],
        ["member", 24, "Hi, happy to help. Do you know roughly when it was ordered, or the buyer's name?", CURRENT_MEMBER_ID],
        ["visitor", 9, "My sister ordered it, Ada Okafor, early September."],
      ]),
    },
    {
      id: "c_1004",
      visitor: visitor("v_9b77c104", 95, "/classes"),
      state: "human",
      claimedBy: "member-priya",
      waitingSince: null,
      timeline: timeline("c_1004", [
        ["visitor", 95, "Is the Saturday wheel-throwing class suitable for complete beginners?"],
        ["ai", 95, "Yes. The Saturday class is for beginners: no experience needed, and clay, tools and aprons are included."],
        ["event", 70, "claimed", "member-priya"],
        ["member", 70, "Hi! I teach that class. There are 2 spots left this week if you'd like one.", "member-priya"],
        ["visitor", 52, "Great, I'll book online now. Thanks Priya!"],
      ]),
    },
    {
      id: "c_1005",
      visitor: visitor("v_e4410d9f", 12, "/shop/speckled-bowl"),
      state: "ai_answering",
      claimedBy: null,
      waitingSince: null,
      timeline: timeline("c_1005", [
        ["visitor", 12, "Are the speckled bowls dishwasher safe?"],
        ["ai", 12, "Yes. All our stoneware, including the speckled bowls, is dishwasher and microwave safe. Hand washing keeps the glaze looking new for longer."],
        ["visitor", 11, "Perfect, thank you"],
        ["ai", 11, "You're welcome! Anything else I can help with?"],
      ]),
    },
    {
      id: "c_1006",
      visitor: visitor("v_07af3e58", 26, "/"),
      state: "ai_answering",
      claimedBy: null,
      waitingSince: null,
      timeline: timeline("c_1006", [
        ["visitor", 26, "write me a poem about the ocean", "off_topic"],
        ["ai", 26, "Sorry, I can only help with questions about Ridgeway Ceramics.", "decline"],
        ["visitor", 25, "ok fine. do you ship to Canada?"],
        ["ai", 25, "We do. Shipping to Canada takes 7–10 business days, and duties are calculated at checkout."],
      ]),
    },
    {
      id: "c_1007",
      visitor: visitor("v_c38b6e21", 58, "/shop"),
      state: "ai_answering",
      claimedBy: null,
      waitingSince: null,
      timeline: timeline("c_1007", [
        ["visitor", 58, "Hola, ¿hacen envíos a España?"],
        ["ai", 58, "¡Hola! Sí, enviamos a España. El envío tarda entre 5 y 8 días laborables."],
      ]),
    },
    {
      id: "c_1008",
      visitor: visitor("v_6d25f0b9", 60 * 26, "/orders", "sam.reyes@mail.example"),
      state: "closed",
      claimedBy: "member-tom",
      waitingSince: null,
      timeline: timeline("c_1008", [
        ["visitor", 60 * 26, "I need to change the delivery address on my order.", "wants_human"],
        ["event", 60 * 26, "wants_human"],
        ["event", 60 * 25, "claimed", "member-tom"],
        ["member", 60 * 25, "Done. The new address is on order #20388 and it ships tomorrow.", "member-tom"],
        ["visitor", 60 * 25, "Thank you!"],
        ["event", 60 * 24, "closed", "member-tom"],
      ]),
    },
    {
      id: "c_1009",
      visitor: visitor("v_a1f4c7d2", 60 * 50, "/care"),
      state: "ai_answering",
      // Reopening returns it to the AI, so the old Claim no longer applies.
      claimedBy: null,
      waitingSince: null,
      timeline: timeline("c_1009", [
        ["visitor", 60 * 50, "My planter has a white residue on the outside."],
        ["event", 60 * 49, "claimed", "member-priya"],
        ["member", 60 * 49, "That's mineral build-up from watering. A cloth with a little vinegar removes it.", "member-priya"],
        ["event", 60 * 48, "closed", "member-priya"],
        ["visitor", 33, "Worked great. Do you sell drainage trays too?"],
        ["event", 33, "reopened"],
        ["ai", 33, "We do: matching trays are in the Planters section, in three sizes."],
      ]),
    },
  ];
}
