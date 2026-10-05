# MeghasDesk — Design system

**Status:** v1 · **Last updated:** 2026-10-05

How MeghasDesk looks, moves and speaks. Tokens live in [app/globals.css](../app/globals.css). Components are shadcn/ui in [components/ui/](../components/ui/). The reference implementation is the landing page in [components/landing/](../components/landing/).

---

## Principles

1. **Monochrome first.** Black, white and a few greys. Colour comes from imagery (the hero video) and from state (destructive red), never from decoration.
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

The standard shadcn tokens (`background`, `foreground`, `primary`, `muted`, `border`, `ring`, `destructive`, and the rest), in neutral greys with light and dark sets. Use them through Tailwind classes (`bg-background`, `text-muted-foreground`), never as raw hex values. `destructive` is the only hue in the system.

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
| `animate-reveal-pulse` | Reveal, then a 3% overshoot. Primary CTA only | 1.1s |
| `animate-headline` | Fade in from 14px below, one line at a time | 0.85s |
| `animate-slide-down` | Header drops in from 18px above | 0.7s |
| `animate-link-in` | Menu links rise 8px | 0.4s |

- **Stagger** with an inline `animationDelay`. Each element on the landing page is about 0.08–0.18s after the one before it. Header first, then trust row → headline lines → subhead → CTA → stats.
- All of these use `fill-mode: both`, so they control opacity. Fade text with a colour alpha (`text-[#d0d0d0]/80`), not `opacity-*`.
- **Reduced motion:** every animated element also gets `motion-reduce:animate-none`, and JS-driven motion (the stat count-up) checks `prefers-reduced-motion` and shows the final value.
- Hover feedback: lift 1–4px (`-translate-y-*`) and, on the CTA, scale to 1.02. Durations 200–350ms.

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

- **Sidebar** (left, `variant="inset"`, collapses off-canvas; a sheet on mobile): `LogoMark` in a `bg-foreground` circle plus "MeghasDesk" at the top, then the navigation, then the user button at the bottom. Width `calc(var(--spacing) * 72)`.
- **Navigation:** Overview (`/dashboard`, exact match) and Inbox (`/dashboard/inbox` and below). The active link uses the sidebar's `isActive` state and `aria-current="page"`. Add new sections here as links, not as nested menus.
- **Header** (`--header-height: calc(var(--spacing) * 12)`): the sidebar toggle, a separator, the current page title, and the theme toggle on the right.
- **User menu** (sidebar footer): avatar (image, or initials on `bg-primary`), name in `text-foreground` and email in `text-foreground/70`, truncated when long; a name-less user shows the email only. The menu holds **Theme** and **Log out**, nothing else until there is something real to put there.
- **Pages** render inside the inset with `p-4 lg:p-6`. They don't render their own `<main>`; `SidebarInset` already is one.
- **Auth pages** use the `login-04` card. `/login` and `/signup` show the form on the left and the still from the hero video (`public/auth-cover.jpg`) on the right from `md:` up; the single-purpose steps (`/forgot-password`, `/verify-email`) use the narrow card without the image. Email codes use shadcn's `InputOTP` (two groups of three). Form-level messages use shadcn's `Alert`. The theme toggle sits in the top-right corner.

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
