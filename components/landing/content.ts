// Every word on the landing page lives here, so copy changes never touch layout.
// Terms follow GLOSSARY.md. Stats are PRD §4 targets, not measured results yet.

import { BotIcon, FileTextIcon, HeadsetIcon, type LucideIcon } from "lucide-react";

export type NavLink = { label: string; href: string; active?: boolean };

export type Stat = {
  /** One glyph, set in the display font. */
  icon: string;
  target: number;
  suffix: string;
  decimals: number;
  label: string;
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", active: true },
  { label: "Live chat", href: "#live-chat" },
  { label: "AI agent", href: "#ai-agent" },
  { label: "Handoff", href: "#handoff" },
];

export const signIn = { label: "Sign in", href: "/dashboard" };

// The three steps of every Conversation: your docs, the AI, your team.
export const trust: { label: string; marks: { icon: LucideIcon; label: string }[] } = {
  label: "Your docs. Our AI. Your team.",
  marks: [
    { icon: FileTextIcon, label: "Knowledge files" },
    { icon: BotIcon, label: "AI agent" },
    { icon: HeadsetIcon, label: "Team member" },
  ],
};

export const hero = {
  headline: ["Answers Visitors", "While You Work"],
  subhead:
    "Stop living in your support inbox. Our AI agent answers visitors from your docs around the clock, and only calls your team in when a person is needed.",
  cta: { label: "Get started", href: "/dashboard" },
};

export const stats: Stat[] = [
  { icon: "*", target: 15, suffix: " min", decimals: 0, label: "Sign-up to live widget" },
  { icon: "<", target: 3, suffix: " s", decimals: 0, label: "To the first streamed word" },
  { icon: "%", target: 95, suffix: "%", decimals: 0, label: "Off-topic messages declined" },
  { icon: ">", target: 2, suffix: " s", decimals: 0, label: "Handoff to your inbox" },
];
