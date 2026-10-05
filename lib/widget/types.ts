// A Workspace's widget setup. PRD §8 limits theming to a brand colour and a
// greeting; everything else here is Workspace settings (PRD §7.1–7.3).

/** `queued`: added on this page but not uploaded (sample data only). */
export type KnowledgeFileStatus = "queued" | "uploading" | "processing" | "ready" | "failed";

export type KnowledgeFile = {
  id: string;
  name: string;
  sizeBytes: number;
  status: KnowledgeFileStatus;
  /** Why processing failed, in plain words. */
  failureReason?: string;
  uploadedAt: string;
};

export type WidgetSettings = {
  businessName: string;
  /** Used in the snippet's data-workspace attribute. */
  workspaceSlug: string;
  brandColor: string;
  greeting: string;
  businessDescription: string;
  allowedDomains: string[];
  knowledgeFiles: KnowledgeFile[];
  allowanceUsedUp: boolean;
};
