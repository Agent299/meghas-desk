import type { WidgetSettings } from "./types";

/** The made-up pottery shop's widget setup, matching the inbox's sample Conversations. */
export function sampleWidgetSettings(now: number): WidgetSettings {
  const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString();
  return {
    businessName: "Ridgeway Ceramics",
    workspaceSlug: "ridgeway-ceramics",
    brandColor: "#111111",
    greeting: "Hi! Ask us about orders, shipping, care or our classes.",
    businessDescription:
      "Ridgeway Ceramics is a small pottery studio and online shop. Help Visitors with orders, shipping and returns, caring for stoneware, and booking our wheel-throwing classes.",
    allowedDomains: ["ridgeway.example"],
    knowledgeFiles: [
      { id: "kf_1", name: "shipping-and-returns.pdf", sizeBytes: 482_000, status: "ready", uploadedAt: ago(60 * 24 * 3) },
      { id: "kf_2", name: "care-guide.md", sizeBytes: 9_800, status: "ready", uploadedAt: ago(60 * 24 * 3) },
      { id: "kf_3", name: "classes-autumn.docx", sizeBytes: 1_240_000, status: "processing", uploadedAt: ago(2) },
      {
        id: "kf_4",
        name: "price-list-scan.pdf",
        sizeBytes: 3_600_000,
        status: "failed",
        failureReason: "No text found. Scanned pages need a text layer.",
        uploadedAt: ago(60 * 5),
      },
    ],
    allowanceUsedUp: false,
  };
}
