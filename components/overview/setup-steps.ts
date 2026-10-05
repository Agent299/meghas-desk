import type { SetupStepId } from "@/lib/inbox/types"

/** Sign-up to a working widget in under 15 minutes (PRD §4 #1), one step at a time. */
export const SETUP_STEP_COPY: Record<SetupStepId, { title: string; description: string }> = {
  business_description: {
    title: "Describe your business",
    description: "Tells the AI which questions are on-topic.",
  },
  allowed_domain: {
    title: "Add an Allowed domain",
    description: "The website where your widget may answer.",
  },
  knowledge_file: {
    title: "Upload a Knowledge file",
    description: "A PDF, DOCX, Markdown or TXT file the AI answers from.",
  },
  widget_preview: {
    title: "Try the widget preview",
    description: "Ask a question the way a Visitor would.",
  },
  install_snippet: {
    title: "Install the widget",
    description: "Paste one snippet into your website's HTML.",
  },
}
