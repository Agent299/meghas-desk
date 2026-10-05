# MeghasDesk — Design system

**Status:** v1 · **Last updated:** 2026-10-05

How MeghasDesk looks, moves and speaks. Tokens live in [app/globals.css](../app/globals.css). Components are shadcn/ui in [components/ui/](../components/ui/). The reference implementation is the landing page in [components/landing/](../components/landing/).

---

## Principles

1. **Monochrome first.** Black, white and a few greys. Colour comes from imagery (the hero video) and from meaning (Conversation states and destructive red), never from decoration. Buttons, links and chrome stay black and white; there is no accent colour.
2. **One voice for the display type.** The dot-matrix face is MeghasDesk's signature. Use it for headlines and single glyphs only, never for body text, buttons or forms.
3. **Pills, not boxes.** Interactive things on brand surfaces are fully rounded. No cards in the hero.
4. **Build on shadcn.** Never hand-roll a button, badge, avatar or dialog. Add a variant to the shadcn component instead (see [Components](#components)).
5. **Motion settles, it doesn't bounce.** Elements rise into place on one easing curve, staggered. Every animation has a reduced-motion fallback.

## Colour

### Brand surfaces

Defined on `:root` and the same in light and dark mode, because brand surfaces always sit on black or on video.

| Token | Tailwind class | Value | Use |
|---|---|---|---|
| `--surface` | `bg-surface` | `#28282a` | Dark pills: Sign in, burger, trust badge, avatar rings |
| `--surface-hover` | `bg-surface-hover` | `#323234` | Hover state of `--surface` |
| `--surface-foreground` | `text-surface-foreground` | `#c8c8c8` | Text on `--surface` |
| `--surface-border` | `border-surface-border` | `rgb(255 255 255 / 0.4)` | 1px hairline around dark pills |
| `--surface-muted` | `text-surface-muted` | `#8e8e8e` | Secondary labels on black (stat labels) |
| `--pill` | `bg-pill` | `#ffffff` | Light pills: the nav bar, the mobile menu sheet |
| `--pill-foreground` | `text-pill-foreground` | `#2e2e2e` | Text on `--pill` |

Other fixed values on brand surfaces: page background `#000`, headline `#fff`, subhead `#d0d0d0` at 80%, trust text `#c4c2c3`.

### App tokens (dashboard, widget)

The standard shadcn tokens (`background`, `foreground`, `primary`, `muted`, `border`, `ring`, `destructive`, and the rest), in neutral greys with light and dark sets. Use them through Tailwind classes (`bg-background`, `text-muted-foreground`), never as raw hex values. Apart from `destructive`, the only hues are the **state colours** below.

### State colours

One colour per Conversation state, so a state reads the same on Home, in the sidebar and in the inbox. Each has a base token (for dots, bars and low-alpha fills) and a `-foreground` token for text on those fills, with light and dark values in `app/globals.css`.

| State | Tokens | Use |
|---|---|---|
| Waiting | `waiting` / `waiting-foreground` (amber) | Badge `bg-waiting/18 text-waiting-foreground` with a pinging dot; a 3px bar on Waiting rows in the inbox list; the sidebar's Waiting count and collapsed dot |
| Human | `human` / `human-foreground` (blue) | Badge `bg-human/14`, the "claimed" event glyph |
| AI answering | `ai` / `ai-foreground` (violet, from the hero video's dusk tones) | Badge `bg-ai/14`, a faint `border-ai/25` on AI messages, file processing status |
| Closed | none: `muted` | Grey outline badge. Done things fade |

Colour never carries meaning alone: every state badge also has its label and an icon.

## Typography

| Role | Family | Token / class | Notes |
|---|---|---|---|
| UI and body | Geist Sans 400 / 500 / 600 | `font-sans` (default) | From the `geist` package (`geist/font/sans`), set on `<html>` in the root layout |
| Display | Geist Pixel Circle | `font-display` | Dot-matrix. `geist/font/pixel`. Falls back to Geist Mono |
| Code | Geist Mono | `font-mono` | `geist/font/mono`. Widget snippet, IDs |

The whole product uses the Geist family and nothing else. Don't add other typefaces.

**Type scale on brand surfaces** (all fluid with `clamp()`):

| Element | Size | Tracking | Weight |
|---|---|---|---|
| Hero headline | `clamp(32px, 6.2vw, 80px)` | `-0.02em` (`-0.03em` at ≤420px) | 400, display |
| Subhead | `clamp(13.5px, 1.55vw, 16.5px)` + 2pt | normal, line-height 1.55 | 400 |
| Nav link | `clamp(13px, 1.4vw, 15px)` | `-0.01em` | 500 |
| CTA | `clamp(13.5px, 1.5vw, 14.5px)` | normal | 600 |
| Stat value | `clamp(18px, 2.2vw, 26px)`, `tabular-nums` | `-0.025em` | 500 |
| Stat label | `clamp(11px, 1.2vw, 12.5px)` | normal | 400 |

Headlines are two short lines (≤ 16 characters each, so they fit a 375px phone), Title Case, `whitespace-nowrap`. UI copy (buttons, labels) is sentence case.

## Shape and elevation

- **Radius:** pills use `rounded-full`. Sheets and popovers on brand surfaces use `28px`. App UI keeps the shadcn `--radius` scale (`rounded-lg` and so on).
- **Shadows** (Tailwind classes from `@theme`):

| Class | Use |
|---|---|
| `shadow-soft` | Logo, nav pill, Sign in. Light lift only, never heavier |
| `shadow-glow` / `shadow-glow-strong` | The one primary CTA on black, at rest and on hover |
| `shadow-sheet` | Mobile menu sheet |

## Motion

All motion uses `--ease-out-expo` (`cubic-bezier(0.22, 1, 0.36, 1)`).

| Class | What it does | Duration |
|---|---|---|
| `animate-reveal` | Fade in from 22px below, scale 0.98 and 6px blur | 0.85s |
| `animate-headline` | Fade in from 14px below, one line at a time | 0.85s |
| `animate-slide-down` | Header drops in from 18px above | 0.7s |
| `animate-link-in` | Menu links rise 8px | 0.4s |

- **Stagger** with an inline `animationDelay`. Each element on the landing page is about 0.08–0.18s after the one before it. Header first, then trust row → headline lines → subhead → CTA → stats. The CTA uses the same `animate-reveal` as everything else.
- All of these use `fill-mode: both`, so they control opacity. Fade text with a colour alpha (`text-[#d0d0d0]/80`), not `opacity-*`.
- **Reduced motion:** every animated element also gets `motion-reduce:animate-none`, and JS-driven motion (the stat count-up) checks `prefers-reduced-motion` and shows the final value.
- **Nothing grows.** No hover scale-ups and no overshoot on entrance; they read as bouncy, not professional. The glow CTA answers hover with a stronger glow only (`shadow-glow-strong`); dark pills may lift 1px.
- **Press feedback:** every `Button` scales to 0.97 on `:active` (not on menu triggers), with a 150ms `ease-out` transition on explicit properties (colour, background, border, shadow, opacity, translate, scale), never `transition-all`.
- Tailwind v4's `hover:` only applies on devices that can hover, so touch screens don't get stuck hover states.

## Layout

- **Breakpoints:** `nav:` (≥721px) switches between the desktop nav pill and the mobile burger. Use `max-nav:` for ≤720px. `max-[420px]:` handles small phones, and `[@media(max-height:700px)]:` tightens vertical spacing on short screens.
- **Landing page:** one viewport (`h-dvh`, `overflow-hidden`) with three stacked regions: header (`max-w-[720px]`), hero (`flex-1`, `max-w-[900px]`), stats (`max-w-[920px]`, 4 columns, 2 on mobile).
- **Page gutter:** `px-[clamp(14px,3vw,32px)] py-[clamp(16px,2.4vh,28px)]`.
- **Layering:** the background video sits at the bottom, content uses `z-10`, and the open mobile menu raises the header to `z-[60]`, above the dialog overlay (`z-50`).

### Theme

- `next-themes` with one `ThemeProvider` in the root layout (`components/theme-provider.tsx`), set up as in shadcn's dark-mode guide: class-based, defaults to **System**, no transition flash on change. Switch Light / Dark / System with `ModeToggle` (`components/mode-toggle.tsx`: dashboard header and auth pages) or the user menu's Theme submenu.
- **Dashboard and auth pages follow the theme** through the shadcn tokens (`bg-background`, `text-muted-foreground`, `bg-sidebar`…). The **landing page stays black in every theme**: it uses fixed colours and brand surface tokens, which don't change under `.dark`. Anything added to the landing page must keep that true (for example the hero avatar rings are pinned to `ring-white`).

### Dashboard layout

The shell for everything a Team member does, built from shadcn's `dashboard-01` block and trimmed to the frame (`components/dashboard/`, `app/dashboard/layout.tsx`).

- **Canvas:** the whole dashboard sits on the auth pages' canvas. `--sidebar` is the `--muted` value, the inset is transparent, and each page places white cards on it (`rounded-xl border bg-card shadow-soft`, like `AuthCard`).
- **Sidebar** (left, `variant="inset"`, `collapsible="icon"`; a sheet on mobile; width `calc(var(--spacing) * 60)`): the auth header's mark (`LogoMark` in a `size-8` `bg-foreground` circle) plus "MeghasDesk", then the navigation, then the account button, and a `SidebarRail` to toggle from the edge (also ⌘/Ctrl+B). **Collapsed to icons** it keeps the mark, one icon per section and the avatar, each with a tooltip (the account button's names the signed-in Team member).
- **Navigation:** Home (`/dashboard`, exact match, `HouseIcon`) and Inbox (`/dashboard/inbox` and below). The active link is a white card on the canvas (`--sidebar-accent` is white, plus `shadow-soft`) with `aria-current="page"`. Inbox shows the live Waiting count in the Waiting colour; collapsed, a Waiting dot on the icon. Add new sections here as links, not as nested menus.
- **Header** (`--header-height: calc(var(--spacing) * 14)`, no border, on the canvas): the sidebar toggle, a separator, the current page title, and the theme toggle on the right.
- **Account button** (sidebar footer): a round avatar (image, or initials on `bg-primary`), name in `text-foreground` and email in `text-foreground/70`, truncated when long; a name-less user shows the email only. The menu holds **Theme** and **Log out**, nothing else until there is something real to put there.
- **Pages** render inside a fixed-height inset (the header stays put) and set their own padding (`px-2 pb-2 md:px-3 md:pb-3`, matching the inset's margin). Pages don't render their own `<main>`; `SidebarInset` already is one.
- **Live data:** `InboxProvider` sits in the dashboard layout, so a Claim in the inbox updates the sidebar count and Home at once.
- **Sample data:** until Workspaces and the widget exist, Home and the inbox read sample data from `lib/inbox/queries.ts` (the one module the real data replaces) and say so with `SampleDataNotice`.

### Home

Set up the widget (PRD §4 #1) with the inbox's live counts on top. Not an analytics page (PRD §8).

- **Banner:** a black `rounded-xl` brand panel with the hero still (`public/auth-cover.jpg`) behind a left-to-right scrim, a greeting, the display headline "Your Widget" and one line of copy. Black in every theme.
- **Live counts:** four tiles (Waiting, Claimed by you, AI answering, Closed in 24 h) with the number in the display face and a tinted icon chip in the state colour. Each opens the inbox on that view.
- **Setup and preview:** a settings column beside a **fixed-width preview** (`lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_400px]`, sticky). The preview never grows; the settings column takes whatever width is left. Below `lg:` the preview follows the settings.
- **Brand colour swatches** are a radio group: one Tab stop, arrow keys move the selection, each named like "Blue (#2563eb)".
- **Setup cards** (`SetupSection`: icon chip, title, description, a Done / To do badge): Appearance (brand colour as preset swatches, any colour or a hex, plus the greeting, the only theming PRD §8 allows), What the AI helps with (Business description), Knowledge files (dashed drop zone plus "Browse files"; PDF, DOCX, MD, TXT up to 10 MB; each file's status: Ready, Processing in the AI colour, Failed with its reason in destructive, Queued while uploads aren't connected), Install the widget (Allowed domains as removable chips, normalised and validated, then the snippet).
- **Snippet:** a black code panel (a brand surface, black in every theme) with an `index.html` tab, line numbers, quiet highlighting (tags white, attribute names light violet, values light amber) and a Copy button that confirms with "Copied".
- **Widget preview:** a stand-in website (dotted canvas, browser dots, the Allowed domain) (its address bar shows the first Allowed domain) with the widget at most 360px wide in fixed light colours, because it lives on the business's site, not in the dashboard theme. Header, Visitor bubbles, send button and launcher take the brand colour, with black or white text picked for contrast (`readableTextColor`, every preset ≥ 4.5:1). AI messages are labelled "AI" (PRD §7.3). Secondary text in the widget is `#6b6b6b` or darker and never faded with opacity, so it passes 4.5:1; the real widget must keep these values.

### Inbox

- **Panes:** separate cards on the canvas, `gap-3`: Conversation list (`lg:w-80`, `xl:w-[22rem]`) · thread · details (`w-72`, inline from 1400px up so the thread keeps room to read, toggled from the thread header; a `Sheet` below that). Below `lg:` the list (`/dashboard/inbox`) and the thread (`/dashboard/inbox/[conversationId]`) are separate screens with a back button.
- **List:** a quiet `Select` of views with counts in the card header (Open by default, Waiting, AI answering, Human, Claimed by you, Closed, All) and the number shown. Waiting sorts to the top, longest-waiting first; everything else by latest activity. Waiting rows carry the amber bar, a semibold name and full-strength preview text.
- **Thread header:** the Visitor's name in the display face, the state badge and who claimed it. The details card repeats the name in the display face above the Visitor's email.
- **Messages** (the auth panel's `ConversationPreview`, in theme tokens): Visitors on the left in `bg-muted`, labelled with their name; the AI on the right in an outlined `bg-background` bubble with `shadow-soft` and a faint violet edge, labelled "AI agent" next to the `AiMark` (the LogoMark circle), plus a "Handoff offer" or "Decline" badge when it is one; Team members on the right in `bg-foreground text-background`, labelled with their first name ("You" for yourself). Bubbles are `rounded-xl` with the corner nearest the label squared (`rounded-tl-sm` / `rounded-tr-sm`). Classifier verdicts show as a caption under the Visitor's message ("Off-topic", "Asked for a person"). State changes are small centred pills with the display-face `>` glyph in the colour of the state they lead to.
- **Actions:** Claim (Re-claim when someone else holds it) and Close (only in Human) in the thread header. The composer is an input card (`rounded-xl border shadow-soft`) that grows with its text, sends on Enter (Shift+Enter for a new line), says when sending will claim, and is disabled in Closed.
- **Auth pages** (`/login`, `/signup`, `/forgot-password`, `/verify-email`) share one frame in `app/(auth)/layout.tsx`, so the video keeps playing between steps:
  - **Form column** (follows the theme, `bg-muted`): logo in a `bg-foreground` circle plus "MeghasDesk" top-left (links home), `ModeToggle` top-right, and the step's form in `AuthCard`: a shadcn `Card` on its default radius, with `shadow-soft` and `animate-reveal`. `AuthHeader` sets the step title in the display face, Title Case. Inputs and buttons keep the normal app radius (`rounded-lg`), not pills, so auth matches the dashboard; both are 44px tall (`Button size="xl"`, `TextField` inputs `h-11`). Email codes use shadcn's `InputOTP` (two groups of three) with each digit in the display face. Every field has a placeholder; password fields (`TextField type="password"`) add a show/hide toggle at the end, a ghost icon `Button` with `aria-pressed` and a "Show password"/"Hide password" label. Form-level messages use shadcn's `Alert`.
  - **Brand panel** (`AuthPanel`, from `lg:`): a `rounded-xl` black panel, sticky at viewport height, with the hero video (`BackgroundVideo`, `public/auth-cover.jpg` as poster), a radial scrim behind the headline and a bottom gradient. It holds the trust badge, a two-line display headline and subhead for the current step, and `ConversationPreview`: a sample Conversation in `rounded-xl` brand-surface bubbles (Visitor → AI agent with its Knowledge file → Visitor asks for a person → "Waiting for your team"). It stays black in every theme and is decorative (`aria-hidden`) apart from the headline and subhead. Panel copy lives in `components/auth/content.ts`.
  - **Below `lg:`** the panel becomes a short banner (headline only) between the header and the card.

## Components

Every component is a shadcn/ui component (Base UI primitives, `base-nova` style). Brand needs are met by **adding variants**, not by writing new components.

| Need | Use | Brand additions |
|---|---|---|
| Primary CTA on black | `Button variant="glow" size="cta"` | White pill, black text, glow, lift on hover |
| Dark pill button | `Button variant="surface" size="pill"` | `--surface` fill, soft shadow |
| Round icon button | `Button variant="surface" size="icon-pill"` | 48px circle (mobile burger) |
| Link styled as a button | `Button nativeButton={false} render={<Link href=… />}` | Keeps Next.js client navigation |
| Label pill | `Badge variant="surface"` | Dark pill with hairline border (trust row) |
| Overlapping icon circles | `AvatarGroup` + `Avatar` + `AvatarFallback` | Dark padded ring around a white inner circle |
| Mobile menu | `Dialog` + `DialogContent` | `overlayClassName` prop for a darker, blurred overlay; white 28px sheet |
| Icons | `lucide-react` | Use the `*Icon` names (`BotIcon`). No icon fonts |

Landing-only pieces live in `components/landing/`: `SiteHeader`, `Hero`, `Stats`, `BackgroundVideo`, `LogoMark`. All copy is in `components/landing/content.ts`.

### Logo

`LogoMark` is a speech bubble drawn as a dot grid, echoing the display face. On brand surfaces it sits black on a white circle at 72% of the circle's size. It's never shown as text only.

## Voice and copy

- Use [GLOSSARY.md](../GLOSSARY.md) terms in UI copy: Visitor, Team member, Conversation, Claim, Handoff offer. Marketing copy may use lower-case "visitors" and "your team" in sentences, but never the glossary's _Avoid_ words (chat for Conversation, ticket, agent for Team member, assign).
- Claims must be true to the product. Numbers on the landing page are PRD §4 targets. Replace them with measured values once they exist, and never invent customers, logos or uptime figures.
- **The core message is time saved for the business owner:** the AI answers visitors so the owner doesn't have to sit in the inbox all day, and the team is only pulled in when a person is needed. Lead with that outcome. Guardrails (declining off-topic, handoff) are supporting proof, not the headline.

## Accessibility

- Text on video gets a radial scrim behind the hero (`BackgroundVideo`) plus a soft text shadow on the headline.
- Icon-only buttons need an `aria-label`. The burger switches between "Open menu" and "Close menu".
- The active nav link sets `aria-current="page"`. The three-dot indicator is decoration only.
- Decorative glyphs and icons are `aria-hidden`. Stats use a `<dl>` so each value is tied to its label.
