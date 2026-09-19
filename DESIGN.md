# Sentinel — Design Direction

Written from a `/brainstorming` session before the UI rework began. This is
the direction document `anti-slop`'s rules point to when they say "beauty
and direction come from your `DESIGN.md`" — antislop filters for
genericness; this file supplies the actual choices.

## Understanding Summary

- Full visual/UX rebuild of Sentinel's entire frontend — Login, Overview/
  Dashboard, Data History, Device Management, User Access, and the shared
  shell (sidebar/nav/header).
- Driven by `taste-skill` (prescriptive design system: fonts, color rules,
  motion/density dials, bento-grid patterns) filtered through `anti-slop`
  (anti-genericness rules — no fake stats, no AI-purple, no Inter, etc).
- Same three roles as today (Viewer/Admin/Superadmin) — this is a
  presentation-layer rework, not a change to RBAC, data, or backend logic.
- Non-goals: no changes to auth, ingest/alert-calculation logic, DB schema,
  or the ESP32/mocksense firmware boundary already established.

## Decision Log

| # | Decision | Alternatives considered | Why |
|---|----------|--------------------------|-----|
| 1 | Full creative reinvention (layout/IA can change) | Modernize polish only; fix specific pain points | User explicitly wants openness to reimagine layout, not just re-skin |
| 2 | Aesthetic: Premium SaaS / Vercel-core bento | Industrial control-room (cockpit-dense); dark ops/security console | Best balance of premium feel with usability for a monitoring tool |
| 3 | Theme: Light (new default) | Dark (rebuilt); light+dark toggle | Clean break from current dark-slate look; toggle deferred as unnecessary scope (YAGNI) unless requested later |
| 4 | Motion: full taste-skill default (6/10) | Toned down (3-4/10); minimal (1-2/10) | User's explicit choice, despite the safety-context risk raised — mitigated by Decision 13 |
| 5 | Scope: everything (all 5 pages + shell) | Dashboard-first, ship, then rest | Full scope requested; sequencing still validates on Dashboard first (see Decision 12) |
| 6 | Open to a new accent color (shield logo/wordmark kept) | Keep emerald + shield logo | User explicitly opened this up |
| 7 | Accent color: Electric Blue | Teal/cyan; warm amber-gold | Stays visually distinct from the semantic alert colors (green/amber/red) — avoids confusion with a real safety signal |
| 8 | Keep lucide-react | Swap to Phosphor per taste-skill's literal icon rule | Avoids churn across every file for a rule with no functional benefit here — explicit, acknowledged deviation from taste-skill |
| 9 | Font: Satoshi, self-hosted via `next/font/local` | Geist; loading from Fontshare's CDN at runtime | User picked Satoshi for more character than Geist; self-hosting avoids an external runtime font dependency |
| 10 | No component library (no shadcn/ui) | Adopt shadcn/ui | Continue hand-built Tailwind components — introducing a library now is churn without clear benefit |
| 11 | Visual density: baseline 4/10 ("Daily App Mode") | Denser (cockpit); airier (gallery) | Not overridden by user — taste-skill baseline applied as-is |
| 12 | Implementation approach: foundation-first, flagship-validated rollout | Big-bang full rework; page-by-page with no shared foundation | Minimizes risk — validate taste on one page (Dashboard) before propagating to four more |
| 13 | **Alert Warning/Danger states are exempt from decorative/perpetual motion** — solid semantic color + a slow steady border-glow only, no bounce/pulse-for-fun | Applying full motion uniformly everywhere | Non-negotiable safety constraint: motion must never compete with or delay recognition of a real alert |
| 14 | Respect `prefers-reduced-motion` (disables perpetual loops) | Ignore the media query | Standard accessibility practice, zero conflict with the chosen motion level |
| 15 | No new automated tests; verify via `tsc --noEmit` + manual browser click-through per page | Add new test coverage | Presentation-only rework, no new business logic to unit-test |

## Foundation

**Fonts**: Satoshi (400/500/700/900), self-hosted, loaded via
`next/font/local`. One font family for everything, including numbers
(`font-variant-numeric: tabular-nums` on live-updating digits so they don't
jitter) — no separate mono font.

**Color tokens** (light theme):
- Background: `#fafafa` (off-white, never pure `#fff`)
- Card surface: `#ffffff`, hairline `border-zinc-200/60`
- Text: `zinc-900` primary / `zinc-500` secondary (never pure `#000`)
- Accent: Electric Blue, desaturated under 80% saturation
- Alert semantics (green/amber/red for Normal/Warning/Danger) are
  untouched — functional, not decorative, and never overridden by the
  rebrand

**Motion primitives**: `src/lib/motion.ts` — shared spring config
(`stiffness: 100, damping: 20`) plus 2-3 reusable Framer Motion variants
(fade-up stagger, card-hover lift, pulse-dot). Small and shared, not a
sprawling library.

**`BentoCard` primitive** — two variants:
- `Tile`: `rounded-[2.5rem] p-8` — charts, grouped panels
- `Stat`: `rounded-2xl p-5` — compact numeric readouts

## Page designs

**AppShell**: current left-sidebar structure kept, rebuilt visually —
white background, accent-colored left bar + icon tint for the active item,
soft hover fade. No dock-style icon magnification (no functional reason on
a utility sidebar). The "Live" status dot gets a real breathing pulse tied
to actual polling state.

**Login**: asymmetric 50/50 split (anti-center-bias) — form on one side,
an abstract SVG sensor-network graphic + the Sentinel shield mark on the
other (no stock photography). Collapses to single-column, form-only, on
mobile.

**Overview/Dashboard (flagship)**: bento grid — row 1: three `Stat` tiles
(gas level, temperature, humidity); row 2: one wide `Tile` (70%, trend
chart) + one narrow `Tile` (30%, device status). Stagger-fade load,
breathing live-status dot, spring "settle" on new readings, card-hover
lift, chart trend-line draw-in on first load. Skeleton loaders shaped like
the actual layout (not generic spinners); a real empty state ("Add your
first device" + illustration) replacing today's plain text.

**Data History**: filter bar restyled as a `Stat`-style horizontal bar;
same chart trend-line treatment; table rows use `divide-y`, not boxed
per-row cards.

**Device Management / User Access**: tables with `divide-y` rows, status/
role shown as pills. Add/Edit modals use a `layoutId` morph-open (button
expands into the modal). Forms: label above input, `gap-2` blocks, inline
error text below the field on validation failure. The one-time API-key
reveal screen keeps its current behavior, just restyled.

## Data flow / error handling

Unchanged — same polling endpoints, same server actions, same RBAC. This
is a presentation-layer rework only.

## Testing strategy

`npx tsc --noEmit` after each page, plus a manual click-through in the
browser before moving to the next page. No new automated tests (no new
business logic introduced).
