# Auth + dashboard shell — progress

## State
- Branch `auth-and-dashboard` off `project-foundation` (PR #1 untouched). Remote exists (Agent299/meghas-desk); do not push.
- Prior uncommitted auth work (/sign-in, lib/auth.ts, proxy.ts…) discarded at user's request; backup in session scratchpad `discarded-auth-work/`.
- Neon: linked to project MeghasDesk `icy-snow-81073754` (org-wandering-grass-23730006), branch `development`. meghas.txt's `curly-flower-09351247` is not in the account.
- Neon Auth already enabled on development (ep-late-haze-b5f410jv) and production (ep-cold-block-b50rng58).
- Agent defs created: ~/.claude/agents/{implementer,researcher,reviewer}.md (opus medium/low/medium), user approved.

## Neon CLI log
- `neon link --org-id org-wandering-grass-23730006 --project-id icy-snow-81073754 --branch development -y` → wrote .neon, pulled 9 vars into .env.local
- `neon neon-auth status` on both branches → enabled
- Initial state (researcher, read-only): dev email/pw OFF, prod require-verification OFF, magic link dev ON / prod OFF, google shared on both, app name already MeghasDesk, allow_localhost true both, Data API off, bucket `uploads` exists.
- `neon neon-auth config email-password update --project-id icy-snow-81073754 --branch {development,production} --enabled --require-email-verification --email-verification-method otp --send-verification-email-on-sign-up` → both: enabled, otp, required, send on sign-up, auto sign-in after verification
- `neon api /projects/icy-snow-81073754/branches/br-lively-frost-b5vg1hqf/auth/plugins/magic-link -X PATCH -F enabled=true` → prod magic link on (expires 5 min)
- `neon neon-auth domain add http://localhost:3000 --project-id icy-snow-81073754 --branch development`
- `pnpm add -D @neon/config` (1.8.3); wrote neon.ts (auth, dataApi, buckets.uploads; NO functions — applying a function = deploy)
- `neon config plan … --branch {development,production}` → only "+ Data API"
- `neon config apply --project-id icy-snow-81073754 --branch {development,production} --no-env-pull` → Data API enabled on both
- NOT done (deliberate): no `*.vercel.app` wildcard (trusts every Vercel app; no Vercel project yet); prod Google left on shared creds (launch checklist: replace); allow-localhost left on (launch checklist: disable on prod); app name already set.

## Plan
1. Research (parallel): Neon Auth CLI config; @neondatabase/auth API; shadcn sidebar + next-themes.
2. Neon config (both branches) + auth core (lib/auth, api route, proxy).
3. Parallel UI: dashboard shell (components/dashboard, app/dashboard/*) | auth pages (/login /signup /forgot-password, verify step).
4. Integration: session user in sidebar, sign-out, redirects, landing link.
5. Docs, tests, full checks, browser verification.
6. Review (≤2 cycles), handoff.

## Decisions / deviations
- Agent defs only load in a new session → this run uses `general-purpose` agents with `model: opus`; effort follows session (roster effort not applied).
- `neon link` was not done by user; done by Lead (local config only). Project is icy-snow-81073754, not meghas.txt's id.
- Auth image: frame at t=5s of hero video (no text overlay; frames ~identical), 1600x900 JPEG q4 → public/auth-cover.jpg (109 KB).
- shadcn add: declined overwrites → button/badge/avatar (brand variants) and app/dashboard/page.tsx preserved. Blocks added: dashboard-01, login-04, signup-04. Deps added: next-themes 0.4.6, sonner (keep); @dnd-kit/*, @tanstack/react-table, recharts (to remove when trimming).

## Workstreams
- Lead: Neon config ✅; auth core ✅ (lib/auth/{server,client,errors}.ts, app/api/auth/[...path], proxy.ts matcher /dashboard only); docs PRD/TECH-STACK/AGENTS/.env.example ✅; DESIGN.md pending dashboard.
- Implementer A (dashboard shell): ✅ DONE (screens in scratchpad/dash-*.png; fixed hooks/use-mobile.ts lint via useSyncExternalStore; typecheck blocked only by stale .next/dev/types/validator.ts referencing app/sign-in). Owns components/dashboard, app/dashboard, app/layout.tsx, theme-provider, hero ring fix, dep removal. Placeholder user + TODO(auth).
- Implementer B (auth pages): ✅ DONE (scratchpad/auth-*.png; reset request works on Neon (200), bad code 400; dark image filter dropped; searchParams via server page props). Owns app/(auth)/{login,signup,forgot-password,verify-email}, components/auth, lib/auth/schemas.ts + tests, vitest.config.ts, landing signIn.href.
- Integration (Lead): dashboard side ✅ — layout uses auth.getSession + authRedirect (lib/auth/redirects.ts), real user → AppSidebar, Log out = authClient.signOut + location.assign('/login'); tests redirects.test.ts + user-display.test.ts (8 pass); DESIGN.md Theme + Dashboard layout sections ✅. Pending: (auth) layout to use authRedirect, Log out browser test (after Impl B, it revokes shared cookies). Original plan: real session → sidebar, sign-out, dashboard layout server check, tests for redirect logic + user display.

## Key SDK facts (researcher)
- Client throws AuthApiError (snake_case codes: email_not_confirmed 422, invalid_credentials 401, validation_failed+message for OTP, over_request_rate_limit 429).
- Neon middleware protects all matched paths except /auth/* skip list → matcher limited to /dashboard; signed-in redirect done in (auth) layout.
- Sign-up with verification required: no session, no duplicate detection (deviation from prompt's "email already registered").
- Reset: emailOtp.requestPasswordReset (not deprecated forgetPassword.emailOtp) → emailOtp.resetPassword (doesn't sign in).
- Magic link / Google: absolute callbackURL ${origin}/dashboard; session completes via neon_auth_session_verifier on a proxied page.
- Account linking: better-auth default links only if Google email verified AND local user verified; else ?error=account_not_linked. Neon's server setting unverified.

## Verification evidence
- curl: /api/auth/get-session 200 (null); /dashboard signed out → 307 /login; /signup 200.
- Test user lead.test.1@example.com: signed up via API (token null), emailVerified set via targeted SQL UPDATE, sign-in 200, cookies saved (scratchpad/session-cookies.json), /dashboard reachable signed in.
- Browser helper: scratchpad/shot.cjs (Playwright from npx cache); landing baseline scratchpad/landing-before.png.

## Integration + whole-feature verification (Lead)
- (auth) layout uses authRedirect; both layouts `export const dynamic = "force-dynamic"` (build logged DYNAMIC_SERVER_USAGE from Neon getSession during static attempt; now 0).
- Stale .next/dev validator (old app/sign-in from discarded session) blocked typecheck/build → stopped old dev server (pid 20478, started 09:51 by the discarded session), rm -rf .next/dev, restarted `pnpm dev`. Dev server was later SIGTERM'd externally once; restarted.
- pnpm lint ✅, typecheck ✅, test ✅ (43 tests / 4 files), build ✅ (no dynamic-usage errors).
- Browser: signed-out /dashboard/inbox → /login ✅; landing "Sign in" click → /login ✅; signed-in /signup → /dashboard ✅; UI login (lead.test.1) → /dashboard → user menu → Log out → /login → /dashboard → /login ✅ no console errors; dark /login + dark landing (rings white) ✅ e2e-pair.png; 375px dark dashboard ✅.
- PR split decision: ONE PR — dashboard layout now depends on auth (session check, real user, sign-out); reconstructing a shell-only intermediate state would be artificial.

## Review
- Cycle 1: launching 4 reviewers (security/route protection; Neon SDK correctness; spec coverage + docs; UI/a11y/design-system + tests). Spec: scratchpad/review-spec.md.

### Cycle 1 results + user feedback (11:1x)
- Reviewer spec/docs ✅ done; Reviewer UI/a11y/tests ✅ done; Reviewers security + SDK ❌ died on session usage limit (429) → rerun.
- USER feedback (applied): (1) user-menu name/email/initials contrast → email text-foreground/70, initials bg-primary; (2) dark mode per shadcn docs → components/mode-toggle.tsx in dashboard header + auth corner (Theme submenu kept in user menu); (3) login password min 8 ("Passwords are at least 8 characters."); (4) shadcn InputOTP (input-otp 1.5.0, guilhermerodz) via components/auth/otp-field.tsx in verify-email + forgot-password (digits only, paste strips non-digits).
- Accepted + fixed: mobile sheet closes on nav/logo click; FormAlert rebuilt on shadcn Alert (contrast); TextField aria-describedby only references rendered nodes; focus moves to first magic-link field and to "Check your email" heading; OTP paste with space (InputOTP pasteTransformer); empty signup password → "Enter a password."; docs: ADR 0001 GitHub ref, DESIGN cover-image/toggle/OTP/alert/user-menu, Overview copy "Handoff offers", account_not_linked copy; tests +3 (login min 8, empty pw, exactly 8) → 46 pass.
- Dismissed: unused components/ui/* (spec allows them to stay); "Sign in" vs "Log in" (spec: landing label stays "Sign in"); L1 nameless magic-link account from /login (spec mandates email-only on /login; dashboard falls back to email) → handoff known limitation; TECH-STACK neon.ts wording (accurate enough); focus after client validation + live-region-on-mount (partially addressed; rest → handoff).
- Browser after fixes: fix-user-menu-light.png, fix-toggle-dark.png, fix-login-short.png, fix-otp-filled.png (paste "123 456" → 123456), fix-otp-empty-dark.png, fix-otp-wrong.png (Neon 400 → "That code isn't right"), mobile nav closes sheet ✅.

## Review cycle 2 (2026-10-05)
Security + SDK reviewers. Confirmed and fixed:
- getSession throws in Server Components when upstream sets cookies (SDK calls cookieStore.set uncaught) → getSessionSafe() in lib/auth/server.ts, used by both layouts.
- Magic link / Google verifier not exchanged (other browser or >10 min) landed on /login silently → login page maps neon_auth_session_verifier to link_incomplete.
- Silent failed sign-out → toast.error and stay; Toaster in dashboard layout.
- weak_password / user_already_exists / signup_disabled mappings; test fixtures corrected (422, feature_not_supported).
- /verify-email ?email validated with emailSchema.
Dismissed: server-only import (Next already fails the build on next/headers in client code); proxy copies query params to /login (only fixed strings rendered); redundant "/dashboard" matcher entry; 5-min session_data cache (SDK design, launch note).
Checks: lint, typecheck, 48 tests, build pass.
