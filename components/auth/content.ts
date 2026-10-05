// Every word on the auth brand panel lives here, so copy changes never touch layout.
// Terms follow GLOSSARY.md. Headlines are two lines of ≤ 16 characters (DESIGN.md).

export type PanelCopy = { headline: [string, string]; subhead: string };

const signup: PanelCopy = {
  headline: ["Answers Visitors", "While You Work"],
  subhead:
    "Upload your docs, paste one snippet, and let the AI agent take the first reply. Your team only steps in when a person is needed.",
};

/** Panel copy per auth route; unknown routes fall back to the sign-up pitch. */
export const panelCopy: Record<string, PanelCopy> = {
  "/login": {
    headline: ["Your AI Kept", "Answering"],
    subhead:
      "Visitors got answers from your docs while you were away. Every Conversation that needs a person is waiting in your inbox.",
  },
  "/signup": signup,
  "/forgot-password": {
    headline: ["Back In", "In A Minute"],
    subhead:
      "We'll email you a 6-digit code. Your AI agent keeps answering Visitors in the meantime.",
  },
  "/verify-email": {
    headline: ["One Code", "And You're In"],
    subhead: "Confirm your email, then set up your Workspace and upload your first Knowledge file.",
  },
};

export const fallbackPanelCopy = signup;

/**
 * An illustrative Conversation for the panel: the AI answers from a Knowledge
 * file, then the Visitor asks for a person and the Conversation moves to Waiting.
 */
export const sampleConversation = {
  visitorQuestion: "Can I change my plan mid-month?",
  aiAnswer: "Yes. Upgrades apply right away, and we prorate the difference on your next invoice.",
  aiSource: "pricing.pdf",
  visitorFollowUp: "Thanks! Can I talk to a person about a refund?",
  waiting: "Waiting for your team",
};
