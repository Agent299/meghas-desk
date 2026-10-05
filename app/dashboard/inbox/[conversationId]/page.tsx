import { notFound } from "next/navigation"

import { ConversationView } from "@/components/inbox/conversation-view"
import { conversationExists } from "@/lib/inbox/queries"

export default async function ConversationPage({ params }: PageProps<"/dashboard/inbox/[conversationId]">) {
  const { conversationId } = await params
  if (!(await conversationExists(conversationId))) notFound()
  return <ConversationView conversationId={conversationId} />
}
