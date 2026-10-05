# MeghasDesk — PRD (v1)

**Status:** Draft · **Owner:** Megha · **Last updated:** 2026-10-05

Terms in this document follow [GLOSSARY.md](../GLOSSARY.md).

---

## 1. What is it?

MeghasDesk is an Intercom-style customer support tool. A business signs up, pastes one snippet onto its website, and Visitors get a chat widget. An AI agent answers from the business's own uploaded documents. When the agent can't answer, or the Visitor asks for a person, a Team member takes over from a shared inbox.

## 2. Problem

**Small support teams can't answer every Visitor question in real time, and generic AI chatbots answer things they shouldn't: they make things up, wander off-topic, and burn money on questions that have nothing to do with the business.**

What we are *not* solving in v1: async support (email, tickets), self-serve content (help centers, product tours), or monetization (billing, plans).

## 3. Why this is worth solving

These are hypotheses to check once the product is in front of real users. We have no data for them yet.

- Most Visitor questions repeat, and the business has already written the answers down in docs, FAQs, and PDFs.
- Visitors leave if nobody replies within minutes, and a small team can't staff chat all day.
- An unscoped LLM is a liability. Every off-topic answer ("what's 5 × 5?", "write me a poem") costs tokens, and an agent that will answer anything is easier to jailbreak or embarrass.
- Businesses only trust an AI agent if it knows its limits and hands over cleanly to a human.

## 4. Success criteria

v1 is a success when a real business has the widget live on a real site and these hold:

| # | Metric | Target |
|---|--------|--------|
| 1 | Time from sign-up to a working widget (in the dashboard preview) answering from an uploaded doc | **< 15 min** |
| 2 | On-topic questions answered by the AI without a Handoff offer (eval set built from the business's docs) | **≥ 70%** |
| 3 | AI answers grounded in retrieved chunks (no claims outside the knowledge base) | **≥ 95%** on the eval set |
| 4 | Off-topic and prompt-injection messages declined at the classifier, without reaching retrieval or answer generation | **≥ 95%** declined; **≤ 5%** of real support questions (in any language) wrongly declined |
| 5 | Time to first streamed token in the widget (p95) | **< 3 s** |
| 6 | Data leaks between Workspaces | **Zero.** Every query is scoped by Workspace, and tests prove it |

Use this table to filter new feature requests: a request that doesn't move one of these numbers waits until after v1.

## 5. Who we're building for

**Primary:** small online businesses and SaaS startups with 1–10 people doing support, who already have written docs but no dedicated support tooling. **Sign-up is public:** any business can create a Workspace without talking to us.

**User types inside the product:**

- **Owner** (logged in): the person who signed up. Everything a Team member can do, plus removing Team members, regenerating the Invite link, and deleting the Workspace.
- **Team member** (logged in): uploads knowledge, edits the Business description and Allowed domains, watches Conversations, replies to Visitors.
- **Visitor** (anonymous): a person on the business's website asking a question in the widget.

## 6. The solution: what it looks like

### Moving pieces (9)

1. **Workspace:** one per business. The Owner signs up and shares an Invite link with teammates. Each person belongs to exactly one Workspace. All data is scoped to a Workspace.
2. **Workspace settings:** a required **Business description** (what the business does and what the AI should help with) and a required list of **Allowed domains**.
3. **Knowledge base:** files uploaded in the dashboard (PDF, DOCX, Markdown/TXT), parsed, chunked, and embedded.
4. **Embeddable widget:** a script tag that loads an iframe. Each Visitor gets an anonymous visitor token. The dashboard has a live preview of the same widget.
5. **Classifier:** runs on every Visitor message, judged against the Business description, and returns *on-topic*, *off-topic*, or *wants-human*.
6. **Answerer:** a RAG answer generated from retrieved chunks only, in the Visitor's language. It reports whether it can answer.
7. **Conversation state machine:** `AI answering → Waiting → Human → Closed` (see Appendix A).
8. **Inbox:** a real-time list of Conversations plus a thread view where Team members read and reply, with browser notifications for new Waiting Conversations.
9. **Realtime layer:** live delivery of messages and streamed AI tokens to the widget and the dashboard.

### Core flows (breadboards)

**Flow A: Team member uploads knowledge**
`Dashboard: "Upload"` → server checks the Workspace's knowledge base limit and returns a presigned URL → file goes straight to Object Storage → a Function runs on the new file and parses and chunks it → OpenAI embeds the chunks → chunks and vectors are saved in Postgres (pgvector) → dashboard shows the file as **Ready** (or **Failed**, with the reason).

**Flow B: Visitor asks a question**
`Widget: send message` → server checks the visitor token, the request origin against Allowed domains, and rate limits → if the Conversation is in **Waiting** or **Human**, the message is stored and delivered to the inbox, and **the flow stops here** → if the Workspace's **Monthly allowance** is used up, the Conversation moves to **Waiting** (go to Flow C) → otherwise **classify**:

- *off-topic* → the fixed **Decline**. **The flow stops here.** No embedding, no retrieval, no generation.
- *wants-human* → go to Flow C.
- *on-topic* → embed the question → find the top-k chunks in Postgres (this Workspace only) → **answer from those chunks** in the Visitor's language → stream tokens through PartyKit to the widget.
  - If nothing relevant was retrieved, or the model flags that it can't answer → the AI sends a **Handoff offer**: it says it doesn't know and shows a **"Talk to a person"** button. The Conversation stays in **AI answering**. Clicking the button (or asking for a person in text) goes to Flow C.

**Flow C: Handoff to a human**
`AI answering` → **Waiting**: triggered when the Visitor asks for a person (typed or via the Handoff offer button), or when the Monthly allowance is used up. The Visitor sees "Connecting you with the team…" and an optional email field. The Conversation stands out in the inbox, and Team members with a dashboard tab open get a browser notification and a sound. The AI sends nothing while Waiting → **Human**: a Team member presses **Claim** or simply sends a reply. From then on **the AI sends nothing** in this Conversation → **Closed**: a Team member resolves it. If the Visitor writes again, the Conversation reopens in **AI answering**.

## 7. Requirements

Each requirement has acceptance criteria so the builder knows when it's done. Layout, copy, and visual design are left to the implementer.

### 7.1 Workspaces & auth

- Owners and Team members sign in with **Google**, a **magic link**, or **email and password**, via Neon Auth (managed Better Auth). Sign-up asks for a name, because Visitors see the Team member's first name.
- Email and password sign-ups confirm their address with a **6-digit code** before they can use MeghasDesk. Google and magic-link sign-ups count as verified.
- A forgotten password is reset with a **6-digit code** sent by email.
- A Google sign-in with the same email as an existing, verified email/password account opens that same account, not a second one.
- Neon Auth sends every auth email (codes and magic links). MeghasDesk itself sends no email.
- A new sign-in without an Invite link creates a Workspace, and that person becomes its **Owner**.
- The Owner shares a copyable **Invite link**. Opening it and signing in joins that Workspace as a Team member. The Owner can regenerate the link, which invalidates the old one.
- Each person belongs to **exactly one** Workspace. Opening an Invite link with an account that already belongs to a Workspace shows an error explaining that a different account is needed.
- Only the Owner can remove Team members, regenerate the Invite link, or delete the Workspace. Every other action is open to every Team member.
- Workspace creation asks for the **Business description** (required) and at least one **Allowed domain**. Both can be edited later.
- ✅ *Done when:* a user in Workspace A can never read or write Workspace B's Conversations, files, chunks, or settings, through the UI or by calling the API directly.

### 7.2 Knowledge base

- Upload PDF, DOCX, MD, and TXT files up to a size limit (proposed: 10 MB per file), within a total knowledge base limit per Workspace.
- Each file shows a status: `Uploading → Processing → Ready | Failed`.
- Team members can delete a file, which also deletes its chunks and vectors.
- ✅ *Done when:* after uploading a 20-page PDF, a question about page 17 gets a correct, grounded answer.

### 7.3 Widget

- Installed with one `<script>` snippet copied from the dashboard. It renders inside an iframe, so the host site's CSS can't break it and the widget can't break the host site.
- The widget only works on the Workspace's **Allowed domains**. `localhost` always works, for testing.
- The dashboard has a **live preview** page that loads the real widget for the Workspace, so an Owner can try it before installing.
- An anonymous visitor token persists across page loads on the same site. Each Visitor has one Conversation, and returning Visitors see its full history.
- AI messages are clearly labeled as AI. Team member messages show the Team member's first name.
- AI replies stream in token by token. Human replies appear live.
- In **Waiting**, the widget offers an optional email field so the team can follow up outside MeghasDesk. MeghasDesk never sends email to Visitors.
- AI answers show no source citations.
- ✅ *Done when:* the widget works on a plain HTML page and on a React site served from a different domain than MeghasDesk, and refuses to work on a domain that isn't allowed.

### 7.4 AI agent

- **Classify before anything else.** Off-topic messages never reach retrieval or answer generation. "On-topic" means relevant to the Workspace's Business description.
- Answers use only retrieved chunks. If those chunks don't contain the answer, the agent sends a **Handoff offer** (says it doesn't know and offers a person). It does not guess, and it does not move the Conversation to Waiting by itself.
- The AI replies in the language the Visitor wrote in.
- The AI sends nothing while a Conversation is in **Waiting** or **Human**.
- Treat uploaded documents and Visitor text as untrusted. Instructions inside them never override the system prompt.
- Per-visitor and per-Workspace rate limits on messages (proposed: 20 messages/min per Visitor).
- Each Workspace has a hard **Monthly allowance** of AI usage. When it runs out, the AI pauses for that Workspace until the month resets: new Visitor messages move the Conversation to **Waiting**, and the dashboard shows that the allowance is used up.
- Models are called directly from the provider, behind a small internal interface that the Neon AI Gateway can replace later. Token use is logged per Workspace.
- ✅ *Done when:* the eval set (see §9) meets targets #2–#4 in §4.

### 7.5 Inbox & handoff

- A live Conversation list, filterable by state (`AI answering`, `Waiting`, `Human`, `Closed`). New `Waiting` Conversations stand out visually.
- When a Conversation enters **Waiting**, every Team member with a dashboard tab open (even in the background) gets a browser notification and a sound.
- A Team member can **Claim** any Conversation at any time, even before the Visitor asks for a person. **Sending a reply claims the Conversation.**
- A Claim is a label showing who's on it. Any Team member can still reply in a claimed Conversation or re-claim it.
- A Visitor email left in Waiting is shown in the thread.
- From `Human`, a Conversation can only be Closed. There is no hand-back to the AI.
- ✅ *Done when:* a Visitor's "talk to a person" request appears in the inbox in under 2 s, and the Team member's reply reaches the widget in under 1 s.

## 8. Non-goals (v1)

- Email, ticketing, or any async channel. MeghasDesk sends no email to Visitors or Team members. The only emails are Neon Auth's verification and reset codes and magic links
- Help center, knowledge-base articles shown to Visitors, product tours
- Native mobile apps (the widget and dashboard should still work on a mobile browser)
- Billing, pricing plans, usage metering shown to customers (beyond the "allowance used up" notice)
- Roles and permissions beyond Owner and Team member
- Belonging to more than one Workspace with the same account (see [ADR 0001](adr/0001-one-workspace-per-person.md))
- Widget theming beyond a brand color and a greeting message
- Analytics dashboards (track metrics internally, but don't build a UI for them)
- Ingesting websites or URLs, or syncing from Notion, Google Drive, etc. (file upload only)
- Web push notifications that work with every dashboard tab closed
- Source citations in AI answers
- Self-serve data deletion or retention settings. Delete data by hand on request

## 9. Technical direction & constraints

The engineering stack is already decided. The full detail is in [TECH-STACK.md](TECH-STACK.md). Its constraints that shape the product:

| Concern | Choice | Product implication |
|---|---|---|
| App + API + AI orchestration | Next.js on Vercel | One server handles the dashboard, the widget API, and the agent loop |
| Auth | Neon Auth (managed Better Auth): Google, magic link, email + password with code verification | Owner and Team member login. Neon sends the auth emails. Visitors are anonymous and token-based, not Better-auth users |
| Classify + answer | Claude Sonnet 5.5 via direct API calls behind an internal interface | Neon AI Gateway needs a paid plan. The interface keeps model choice in one place so the Gateway can replace it later. Token spend is logged by us |
| Embeddings | OpenAI | Uploads and questions must use the same embedding model, or retrieval breaks |
| Data + vector search | Neon Postgres + pgvector | Every table and query is keyed by `workspace_id` |
| File ingest | Neon Functions, triggered by new objects in Object Storage | Ingest runs async, so the dashboard needs a processing status |
| Files | Neon Object Storage, presigned uploads | Files never pass through the Next.js server |
| Realtime | PartyKit (WebSockets) | One room per Conversation, plus one inbox room per Workspace |
| Environments | Neon branches `production` + `development` | Migrations run on `development` first |

**Eval set:** before launch, write ~50 test messages for a sample Workspace: on-topic questions answerable from the docs, on-topic questions *not* answerable from the docs, off-topic messages, prompt-injection attempts, and a few on-topic questions in languages other than the docs'. Run it on every prompt or model change.

## 10. Risks & open questions

| Risk / question | Answer |
|---|---|
| AI Gateway requires a paid Neon plan | **Decided:** call models directly behind a thin interface; revisit the Gateway later |
| How is "can't answer" measured? | Start simple: the top chunk's similarity is below a threshold **or** the model returns an explicit `cannot_answer` flag → Handoff offer. Tune the threshold with the eval set |
| Visitor asks for a person and nobody is online | **Decided:** the Conversation stays in Waiting, the Visitor can leave an optional email, and the team follows up by hand outside MeghasDesk |
| Classifier wrongly declines real questions | Track false declines (metric #4), including non-English questions. Lean permissive for anything related to the Business description |
| Public sign-up means strangers spend our model budget | **Decided:** hard Monthly allowance and knowledge base limit per Workspace; the AI pauses when the allowance runs out. Email sign-ups must confirm their address with a code before they get in |
| Someone copies a widget snippet onto another site | **Decided:** Allowed domains are required and checked against the request origin. Rate limits apply on top |
| Scanned PDFs and images with no text layer | Out of scope for v1. Mark the file **Failed** with a clear reason |
| Can a Closed Conversation be reopened when the Visitor writes again? | **Decided:** yes, it reopens in AI answering |
| Team members reading Conversations in other languages | Open: the AI replies in the Visitor's language, but nothing helps a Team member read or answer it. Auto-translation is out of scope for v1; revisit after launch |
| Allowance and limit values | Open: pick numbers for the Monthly allowance, knowledge base size, and rate limits before M5 |
| Auth emails come from Neon's shared sender | It's rate-limited and meant for development. **Before launch:** configure our own SMTP provider in Neon (`neon neon-auth config email-provider`). No app code changes |
| Auth launch checklist | Before launch, on `production`: our own Google OAuth app (redirect `{NEON_AUTH_BASE_URL}/callback/google`) instead of Neon's shared credentials; our own SMTP; the production domain in trusted domains; turn off "Allow localhost" |

## 11. Proposed timeline

| Milestone | Scope | Exit check |
|---|---|---|
| **M1: Skeleton** | Sign-in (Google, magic link, email + password), Workspaces with Owner and Invite link, Business description and Allowed domains settings, DB schema, deploy pipeline to both Neon branches | Owner can sign up on production and invite a teammate |
| **M2: Live chat** | Widget + dashboard preview + PartyKit + inbox, human-only replies, Claim, browser notifications | Visitor ↔ team chat works across domains |
| **M3: Knowledge** | Flow A end to end | 20-page PDF reaches **Ready** |
| **M4: Agent** | Flow B + classifier + Handoff offer + eval set | §4 targets #2–#5 met |
| **M5: Handoff + hardening** | Flow C, Visitor email in Waiting, Monthly allowance, rate limits, Allowed-domain enforcement, isolation tests | Full demo on a real site; target #6 proven |

---

## Appendix A: Conversation state machine

```
                  Visitor asks for a person
                  (typed, or "Talk to a person" button)
                  or Monthly allowance used up
 [AI answering] ─────────────────────────────────▶ [Waiting]
       ▲   │                                       (AI silent)
       │   │  Team member claims or replies             │
       │   └──────────────────────┐                     │ Team member claims or replies
       │                          ▼                     │
       │                       [Human] ◀────────────────┘
       │                          │   (AI silent; any Team member can reply)
       │                          │ resolve
       │                          ▼
       └── new Visitor message ── [Closed]
```

A Handoff offer does **not** change the state. The Conversation stays in AI answering until the Visitor accepts.

## Appendix B: Sketch of core entities

`workspace` (business_description, allowed_domains, invite_token, monthly usage) · `member` (user ↔ workspace, unique per user, is_owner) · `visitor` (anonymous token, optional email) · `conversation` (visitor, state, claimed_by_member) · `message` (conversation, sender_type: visitor | ai | member, body, classification) · `knowledge_file` (status, storage_key) · `chunk` (file, text, embedding vector)

All of these entities carry `workspace_id`.
