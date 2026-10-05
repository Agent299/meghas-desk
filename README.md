# MeghasDesk

AI-first customer support: an embeddable chat widget answered by an AI agent from the business's own documents, with handoff to a human team.

- Product: [docs/PRD.md](docs/PRD.md)
- Tech stack: [docs/TECH-STACK.md](docs/TECH-STACK.md)
- Terms: [GLOSSARY.md](GLOSSARY.md)
- Decisions: [docs/adr/](docs/adr/)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in the values
pnpm dev                     # http://localhost:3000
```

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm test` | Vitest |
| `pnpm db:new <name>` | New dbmate migration in `db/migrations/` |
| `pnpm db:migrate` | Apply migrations to `DATABASE_URL` |
| `pnpm db:rollback` | Roll back the last migration |
