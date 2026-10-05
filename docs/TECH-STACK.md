# MeghasDesk — Tech stack (v1)

**Status:** Agreed · **Last updated:** 2026-10-05

The product is defined in [PRD.md](PRD.md). Terms follow [GLOSSARY.md](../GLOSSARY.md). This document says what each part of the system runs on and the rules that come with each choice.

---

## At a glance

| Layer | Choice |
|---|---|
| Language | TypeScript everywhere |
| App | Next.js (App Router) on Vercel: dashboard, widget iframe, widget loader script, and API in one app |
| UI | Tailwind CSS + shadcn/ui |
| API layer | oRPC procedures with Zod input/output schemas, served from a Next.js route handler |
| Validation | Zod |
| Auth | Neon Auth (managed Better Auth): Google, magic link, email + password (6-digit code verification and reset) |
| Database | Neon Postgres + pgvector |
| Data access | Neon Data API (with RLS) from the dashboard; Neon serverless driver from server code (see below) |
| Migrations | dbmate: plain `.sql` files |
| Files | Neon Object Storage, presigned uploads straight from the browser |
| Ingest | Neon Function (Node 24) fired by a `storage_object_created` trigger |
| Classify + answer | Claude Sonnet 5.5 (`claude-sonnet-5-5`) via `@anthropic-ai/sdk` |
| Embeddings | OpenAI via the `openai` package |
| Realtime | PartyKit on PartyKit's managed hosting, relay only |
| Rate limits + Monthly allowance counters | Postgres |
| Environments | Neon branches `production` + `development`; every Vercel preview uses `development` |
| Tests | Vitest; isolation tests on a throwaway Neon branch per run |
| Monitoring | Platform logs (Vercel, Neon, PartyKit). No error tracker in v1 |

## Data access: two paths

See [ADR 0002](adr/0002-two-data-paths.md).

1. **Dashboard → Data API.** The Team member's browser calls the Neon Data API with their Neon Auth JWT. The request runs as the `authenticated` role, and RLS policies limit every row to the caller's Workspace. Use this for reads and plain edits (Business description, Allowed domains, deleting a Knowledge file).
2. **Server code → serverless driver.** Next.js route handlers and oRPC procedures that serve the widget or have side effects, the AI answerer, and the ingest Function use `@neondatabase/serverless` with a privileged role. RLS does not protect this path, so **every query must filter by `workspace_id` explicitly**, and the isolation tests cover this path too.

Rule of thumb: if an action does more than write one row (send a reply, Claim, broadcast to PartyKit, call a model), it goes through an oRPC procedure on the server, not the Data API.

## Identity

- **Team members** sign in through Neon Auth with Google, a magic link, or email and password. Email sign-ups confirm with a 6-digit code; resets use a code too. Neon sends these emails; our code sends none.
- Auth code lives in `lib/auth/`: `server.ts` (`createNeonAuth`, server only), `client.ts` (`createAuthClient()`, no arguments, browser only), `errors.ts` (maps the client's thrown errors to UI copy). `app/api/auth/[...path]` proxies to Neon.
- `proxy.ts` (project root) matches only `/dashboard/*`. Neon's middleware treats every matched path outside its own `/auth/*` list as protected, so public pages stay out of the matcher. The dashboard layout re-checks the session on the server; the `(auth)` route group's layout sends signed-in users to `/dashboard`.
- Auth settings (sign-in methods, verification, magic link, trusted domains) are configured per Neon branch with `neon neon-auth` / `neon api`, not in code. `neon.ts` only switches services on.
- **Visitors** are not Neon Auth users. Next.js issues a signed visitor token (a JWT signed with a server secret). Widget API calls send it, and PartyKit verifies the same token in `onBeforeConnect`.
- Team members connecting to PartyKit present their Neon Auth JWT, verified against Neon Auth's JWKS.

## AI

- `classify(message, businessDescription)` → `on-topic | off-topic | wants-human`, using structured output.
- `answer(question, chunks)` → streamed text plus a `cannot_answer` flag.
- `embed(texts)` → vectors from one fixed OpenAI embedding model, used for both ingest and questions.
- All three sit behind our own module (`lib/ai/`). Swapping to the Neon AI Gateway later means rewriting that module only.
- Sonnet 5.5's thinking can't be turned off with `disabled`; use `between_tools` or low effort. Measure classify + answer against the p95 < 3 s first-token target early.
- Log token use per Workspace for the Monthly allowance.

## Realtime

- One PartyKit room per Conversation and one inbox room per Workspace.
- PartyKit never touches the database. Next.js saves every message, then POSTs it to the room, and the room broadcasts it. AI tokens stream from Next.js into the room.

## Migrations

- dbmate runs `db/migrations/*.sql`, on `development` first, then `production`.
- Tables, RLS policies, grants, and SQL functions (including vector search, which the Data API can only reach as a function) all live in migrations.
- `neon.ts` must turn on `dataApi` alongside `auth`.

## Not using (and why)

| Not using | Reason |
|---|---|
| An ORM | Data API + plain SQL instead; schema lives in SQL migrations |
| Neon AI Gateway | Needs a paid Neon plan; revisit later (PRD §10) |
| Vercel AI SDK | Official SDKs get new model features first; our own `lib/ai/` module keeps the Gateway swap cheap |
| Redis / Upstash | Counter volume fits in Postgres |
| Our own email provider | Neon Auth sends auth emails: its shared sender in development, our own SMTP configured in Neon before launch. The app sends no email (PRD §8) |
| Sentry | Deferred; platform logs only for v1 |
