# Two data paths: Data API with RLS for the dashboard, privileged SQL for server code

Team members' browsers read and edit data through the Neon Data API using their Neon Auth JWT, so Postgres row-level security enforces the Workspace boundary. Server-only code (widget routes, the AI answerer, the ingest Function) has no user JWT, so it uses the Neon serverless driver with a privileged role and filters by `workspace_id` explicitly. We accepted two paths so that we don't have to sign and rotate our own service JWTs just to keep one.

## Considered Options

- **Everything through the Data API.** Server code would use JWTs with a custom role that our server signs. Rejected: we'd own token signing, key rotation, and a role that bypasses RLS anyway.
- **Everything through Next.js, forwarding the user's JWT to the Data API.** Rejected: RLS still applies, but the dashboard loses direct reads and every query needs a server route.

## Consequences

- RLS does not protect the server path. Isolation tests must cover both paths, and code review must check every server query for a `workspace_id` filter.
- Anything with side effects (replies, Claims, broadcasts, model calls) goes through a server procedure, even when it's started from the dashboard.
