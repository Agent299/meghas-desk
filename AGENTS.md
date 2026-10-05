<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## MeghasDesk

A business embeds a chat widget; an AI agent answers Visitors from the business's uploaded documents; a Team member takes over from a shared inbox when needed. Multi-tenant SaaS with public sign-up.

## Read before you build

- **Feature or behaviour work**: [docs/PRD.md](docs/PRD.md) is the spec. Its requirements (§7) carry acceptance criteria; its non-goals (§8) are as binding as its goals.
- **Choosing where code runs or which service to use**: [docs/TECH-STACK.md](docs/TECH-STACK.md).
- **Any UI work** (colours, type, motion, which shadcn component and variant to use): [docs/DESIGN.md](docs/DESIGN.md).
- **Naming anything** (tables, types, functions, UI copy): [GLOSSARY.md](GLOSSARY.md). Use its terms exactly, and none of its _Avoid_ words: a `conversation`, never a `chat` or `ticket`; `claim`, never `assign`.
- **Undoing or working around a past decision**: [docs/adr/](docs/adr/) first.

When code and these docs disagree, stop and ask which is right, then fix the loser.

## Invariants

These hold in every change. Each one protects a PRD success criterion.

- **Workspace isolation.** Every table has `workspace_id`. Dashboard reads go through the Neon Data API, where RLS scopes rows. Server code (oRPC procedures, the AI, the ingest Function) uses `@neondatabase/serverless` with a privileged role, which RLS does not cover, so **every server query filters by `workspace_id` explicitly**, and isolation tests cover both paths ([ADR 0002](docs/adr/0002-two-data-paths.md)).
- **Side effects go through oRPC.** Anything beyond a one-row edit (sending a reply, a Claim, a PartyKit broadcast, a model call) is an oRPC procedure in `server/`, even when the dashboard starts it.
- **Classify first.** Every Visitor message is classified before any embedding, retrieval or generation. An off-topic message ends at the Decline.
- **The AI is silent in Waiting and Human.** Only the Visitor moves a Conversation to Waiting (or an exhausted Monthly allowance); the AI's Handoff offer leaves the state unchanged.
- **Visitors are not auth users.** They carry a Next.js-signed visitor token, verified by our routes and by PartyKit's `onBeforeConnect`. Team members use Neon Auth (Google/GitHub OAuth only).
- **PartyKit is a relay.** It never touches the database: Next.js saves a message, then posts it to the room.
- **Model calls live in `lib/ai/`** (`classify`, `answer`, `embed`) so the Neon AI Gateway can replace them later. Log token use per Workspace there.

## Gotchas

- **Schema is SQL.** No ORM. Tables, RLS policies, grants, and SQL functions (vector search must be a SQL function to be reachable from the Data API) are dbmate migrations in `db/migrations/`. Apply to the `development` branch before `production`.
- **oRPC is v1** (`@orpc/*@1.x`). orpc.dev now documents the v2 beta; read v1.orpc.dev.
- **Zod is v4**: `import * as z from "zod"`.
- **Claude model is `claude-sonnet-5-5`** for classify and answer. `thinking: {type: "disabled"}` returns a 400 on it; use `{type: "between_tools"}` or low effort. Keep p95 time-to-first-token under 3 s across classify + answer.
- **Embeddings use one fixed OpenAI model** for both ingest and questions; changing it means re-embedding every chunk.
- **Next.js 16 route types** (`LayoutProps`, `PageProps`) are generated; `pnpm typecheck` runs `next typegen` first.
- **pnpm blocks install scripts.** A new package that needs one is allowed in `pnpm-workspace.yaml` under `allowBuilds`, after checking what the script does.
- **New dependencies**: confirm the install command on the upstream project's own docs before adding it, and use the current stable release.

## Done means

`pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` all pass, and any PRD acceptance criterion the change touches is demonstrated, not assumed.
