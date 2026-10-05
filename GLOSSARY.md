# MeghasDesk

A customer support tool: a business embeds a chat widget on its website, an AI agent answers visitors from the business's own documents, and the business's team takes over when needed.

## Language

### People and tenancy

**Workspace**:
One business's account in MeghasDesk; every other thing belongs to exactly one Workspace.
_Avoid_: Account, tenant, organization

**Team member**:
A logged-in person who works a Workspace's conversations and knowledge base.
_Avoid_: Agent, operator, user, member

**Owner**:
The Team member who created the Workspace; the only one who can remove Team members, regenerate the Invite link or delete the Workspace.
_Avoid_: Admin, founder

**Invite link**:
A shareable link that lets a new person join a Workspace as a Team member.
_Avoid_: Invitation email

**Visitor**:
An anonymous person chatting through the widget on a business's website.
_Avoid_: Customer, user, end user, lead

### Setup

**Business description**:
The owner-written text saying what the business does and what the AI should help with; it defines what counts as on-topic.
_Avoid_: Prompt, system prompt, bio

**Allowed domain**:
A website domain on which a Workspace's widget is permitted to answer.
_Avoid_: Whitelist, origin

**Knowledge file**:
A document uploaded to a Workspace that the AI may answer from.
_Avoid_: Doc, source, article

**Monthly allowance**:
The fixed amount of AI usage a Workspace gets each month; when it runs out the AI pauses and the widget becomes human-only.
_Avoid_: Quota, credits, plan

### Conversations

**Conversation**:
The single ongoing thread between one Visitor and a Workspace, including every message from the Visitor, the AI and Team members.
_Avoid_: Chat, ticket, session, thread

**AI answering**:
The Conversation state in which the AI replies to the Visitor.

**Waiting**:
The Conversation state after the Visitor has asked for a person and before a Team member claims it; nobody replies automatically.
_Avoid_: Escalated, pending, queued

**Human**:
The Conversation state in which a Team member has claimed the Conversation and the AI is silent.

**Closed**:
The Conversation state after a Team member resolves it; a new Visitor message returns it to AI answering.
_Avoid_: Resolved, archived, done

**Claim**:
A Team member marking a Conversation as theirs, from AI answering or Waiting, which moves it to Human; it is a label, so any Team member can still reply or re-claim. Sending a reply claims the Conversation.
_Avoid_: Take over, assign, pick up

**Handoff offer**:
The AI's reply when the knowledge base can't answer: it says it doesn't know and offers the Visitor a person.
_Avoid_: Escalation, fallback

**Decline**:
The fixed reply to an off-topic message; nothing else happens for that message.
_Avoid_: Refusal, rejection

## Relationships

- A **Team member** belongs to exactly one **Workspace**
- A **Visitor** has exactly one **Conversation** with a **Workspace**
- A **Conversation** moves to **Waiting** when the **Visitor** asks for a person (directly or by accepting a **Handoff offer**), or when the **Workspace**'s **Monthly allowance** has run out
- A **Conversation** moves from **Human** only to **Closed**
