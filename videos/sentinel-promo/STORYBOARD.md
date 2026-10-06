---
format: 1920x1080
duration: 60s
message: "Sentinel catches a dangerous gas reading the instant it happens, so nothing gets missed."
arc: "Narrative — quiet cold open -> the incident -> the old way (nobody would know) -> the turn (Sentinel) -> the catch -> the response -> the wider promise (scale) -> the record -> recap -> CTA"
audience: Facility and EHS/safety managers, industrial ops teams responsible for gas/air-quality monitoring
mode: collaborative
music: none
---

## Locked

v2 revision, approved after user review of v1. Changes from v1:

- **Story, not a feature list.** v1's four UI frames (real-time monitor,
  alerts, fleet, history) read as a flat demo. v2 threads them into one
  causal story: a reading climbs (Hook) -> without Sentinel nobody would
  know (Old way) -> Sentinel is already watching (Turn) -> it catches THAT
  SAME reading the instant it crosses the line (Catch) -> here's what the
  team sees, live (Response) -> it's not just one device, it's every device
  (Wider promise) -> and it's not just caught, it's on permanent record
  (Record). The Catch beat (built from `05-alerts.html`) now plays BEFORE
  the Response beat (built from `04-realtime.html`) — filenames are
  unchanged, only the playback order in this file changed.
- **Universal, not anecdotal.** An earlier draft of this revision opened
  with an invented time/location ("11:47 PM in Bay 3"). Dropped — too
  niche/small, reads as one fictional incident instead of an ongoing
  product promise. Nothing in the final copy below names a specific place
  or time.
- **Text-first hook, Apple-cadence.** The old hook cut straight to an
  escalating number — felt sudden. New Frame 1 opens on one calm, minimal
  line ("Some things happen in silence."), holds, THEN dissolves into the
  number climbing. The reveal is now earned, not immediate.
- **Durations cut ~23%** (78s -> 60s) across the board — faster pace
  overall, not just in the UI section.

## Video direction

- **Palette system** (from `frame.md`, blue-professional remix): warm cream
  `bg` (`#FAFAFA`) is the ground on every frame except Frame 1's Scene 2 and
  onward, which escalates from cream toward near-black/red (the danger
  register) — Frame 1 Scene 1 (the calm text-first open) stays on cream/
  neutral, NOT dark; the darkening is now part of the reveal, not the
  opening state. `primary` cobalt-blue (`#2F6FED`) carries every other
  accent: eyebrows, numerals, the live dot, chart lines, the progress bar,
  pill chrome. Headlines stay near-black `text` (`#18181B`), body copy
  muted (use `#767676` for light/secondary text — NOT `#9A9A9A`, which
  fails contrast at 2.8:1; this was a v1 bug, fixed, keep it fixed).
  `positive`/`negative` (`#059669`/`#dc2626`) appear inline only — the alert
  badge in Frames 1 and 4 is the one place `negative` red fills a surface,
  and it is earned (a real danger state), never decorative.
- **Motion grammar + reveal model**: smooth long-tail settles (`power3`)
  everywhere; no bounce/overshoot. Silent video (no VO, no music) — each
  frame's `voiceover` field holds the on-screen kinetic-type copy. Reveal
  pacing follows the same anti-PowerPoint discipline as if timed to a voice:
  at t=0 only the first on-screen cue is present; each further piece
  reveals on its own beat across the back ~50% of the shot — never dumped
  at once. During a hold, only subtle jitter or a live SVG internal may
  move; no breathing, no back-half pan/push.
- **Rhythm / held-frame allocation**: Frame 1 Scene 1 (the calm text-first
  open) and Frame 9 (CTA/outro) are the deliberate held/breather beats —
  content resolves early and reads still, the calm as the confidence.
  Frame 1 Scene 2/3 and Frame 3 (turn) are the highest-motion moments —
  escalation and assembly. Frames 4-7 (catch -> response -> wider promise
  -> record) are the **dashboard dense exception** per `frame.md`'s
  Dashboard treatment — denser than the rest of the system, but still
  revealing piece-by-piece.
- **Negative list**: no drop shadows on content; no second accent color; no
  square corners except the progress bar; no fabricated device rows, user
  rows, customer logos, or URLs/handles — only the two real devices and the
  real alert copy ever appear; no invented place names or timestamps
  anywhere in the video (this was the v1->v2 fix — keep it universal); no
  slideshow (front-load-then-freeze) — this was also a real v1 bug (Frame 2
  had a ~0.6s blank gap between its two lines; fixed by removing the
  redundant per-word sub-reveal on the second line — do not reintroduce a
  multi-stage fade that leaves a gap); no screensaver; no bouncy easing; no
  infinite/looping motion; no real browser chrome (the app's own left-nav
  sidebar in Frames 5-6 is real product chrome and is expected).

## Frame 1 — Hook: silence, then the reveal

- scene: A single calm line of text fades in and holds, then dissolves as a gas reading climbs to a real danger alert.
- voiceover: "Some things happen in silence." / "627 ppm. 900. 1,686 — dangerous."
- duration: 9s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Pain validation
- beat: calm -> anxiety + tension
- blueprint: compose
- asset_candidates:

Two-part beat, deliberately NOT starting on urgency. Part 1 is the
Apple-cadence quiet open: one line, centered, restrained, held. Part 2 is
the reveal: the SAME number that Frame 4 later catches climbs here for the
first time — this is the causal thread the whole video pays off. No danger
tint, no red, no alert chrome in Scene 1 — that all belongs to Scene 2/3's
escalation only.

- blueprint: compose — splices two shapes deliberately: `titlecard-reveal`'s
  restrained "one line, one move, hold" for Scene 1, then `dataviz-countup`'s
  escalating count-up signature for Scenes 2-3. Neither alone fits a
  two-part calm-then-reveal beat, so this frame composes them in sequence
  rather than forcing one blueprint across the whole shot.
- focal: (none — pure typography)
- roles: n/a
- sfx: none in Scene 1 (silence is the point); riser building into Scene 3's
  DANGEROUS pill; impact-soft on the pill's spring-pop

Scene 1 (0.0-3.5s): cream ground, calm and neutral — no tint shift yet.
Centered, minimal line "Some things happen in silence." enters via ONE
restrained move (slide-up crossfade, `titlecard-reveal`'s signature), then
holds completely still — Centered template, ~20% of frame, generous
negative space on all sides. This is the video's first deliberate
held/breather beat.
Scene 2 (3.5-6.0s): the line clears via a soft blur-crossfade (not a hard
cut) as the ground begins a slow tint shift from cream toward near-black/
red; a **value-scaled counter** (`counting-dynamic-scale`) seats
dead-center, small, reading "627 ppm" in cobalt — Centered, ~30% of frame.
Scene 3 (6.0-9.0s): the counter climbs — 627 -> 900 -> 1,686 — font size
growing with the value, color interpolating cobalt->red as it crosses the
danger line, ground finishing its darken/redden in step; locks at "1,686 /
ppm CO2"; a "DANGEROUS" pill **spring-pop entrance** lands beneath it and
holds — held read, at most subtle jitter.

## Frame 2 — The old way: nobody would know

- scene: Two short statements land alone on a bare canvas, one at a time.
- voiceover: "If nobody's watching— / nobody knows."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-pain.html
- type: pain_point
- persuasion: Pain agitation
- beat: frustration + overwhelm
- blueprint: kinetic-type-beats
- asset_candidates:

Two-line pain beat, tightened from v1. The gap between "something is wrong"
and "someone knows" is the whole pain. Keep it plain, no product mentioned
yet. **Known v1 bug, must not recur**: do not give the second line its own
delayed per-word sub-reveal on top of the container-level entrance — that
double-delay is what caused a ~0.6s blank gap in v1. The container-level
scale-swap entrance (scale+opacity) is the whole entrance for line 2; its
words are static/visible children, not separately animated.

- blueprint: kinetic-type-beats (Reproduce) — two pain statements landing
  alone in sequence.
- focal: (none — pure typography)
- roles: n/a
- sfx: none (deliberately quiet ahead of Frame 3's assemble)

Scene 1 (0.0-2.5s): cream ground, centered. Line A — "If nobody's
watching—" — enters via per-word staggered reveal — Centered, ~40% of
frame, generous negative space.
Scene 2 (2.5-4.0s): Line A clears via a quick scale-swap handoff as Line B
— "nobody knows." — enters in its place as a single already-composed
block (no separate per-word delay on Line B), smaller and dimmer
(`#767676`).
Scene 3 (4.0-6.0s): Line B settles and holds — still, at most subtle
jitter, no further motion.

## Frame 3 — The turn: Sentinel

- scene: The Sentinel shield mark assembles from scattered connecting lines and resolves into a centered lockup.
- voiceover: "Sentinel is always watching."
- duration: 6s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/03-product-intro.html
- type: product_intro
- persuasion: Authority by association
- beat: relief + clarity
- blueprint: logo-assemble-lockup
- asset_candidates: assets/sentinel-logo.svg — the real Sentinel brand mark (blue shield outline, dot-and-stem sensor glyph); assets/svgs/svg-d9b653fc.svg — decorative sensor-network node graph (brand blue), usable as the scattering elements that assemble into the mark

`zoom-through` here because this is the state change from problem to
solution. The real logo is the actual product mark — use it exactly. Copy
is present tense ("is always watching") — this is an ongoing promise, not a
one-time past-tense anecdote; keep it that way.

- blueprint: logo-assemble-lockup (Reproduce) — real network nodes assemble
  into the real shield outline.
- focal: assets/sentinel-logo.svg
- roles: assets/sentinel-logo.svg = cutout (the assembling target) ·
  assets/svgs/svg-d9b653fc.svg = supporting (recolored/repositioned as the
  loose scattering nodes/lines)
- sfx: whoosh (nodes converging), impact-soft (mark lock)

Scene 1 (0.0-1.8s): cream ground. Scattered node-dots + faint connecting
lines fade in across the frame — sparse, ~15% coverage, asymmetric.
Scene 2 (1.8-4.5s): the scattered nodes converge and trace the real shield
outline stroke-by-stroke via SVG self-draw at center — Centered, ~35% of
frame, single focal.
Scene 3 (4.5-6.0s): the wordmark "SENTINEL" locks in, then "is always
watching." lands beneath it via per-word staggered reveal on a smooth
long-tail settle; holds.

## Frame 4 — The catch

- scene: A Recent Alerts panel; a red DANGEROUS card slides in the instant a threshold is crossed, timestamped to the second.
- voiceover: "Caught the same second it happened."
- duration: 7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-alerts.html
- type: feature_showcase
- persuasion: Risk reversal
- beat: urgency -> relief
- blueprint: agent-progress-theater
- asset_candidates:

**Playback order note**: this beat now plays FOURTH (right after the Turn),
built from the existing `05-alerts.html` file — filename unchanged, only
its position in the story moved earlier, ahead of the realtime-dashboard
beat. This is the direct payoff of Frame 1's climbing number: the SAME
"1,686.82 ppm exceeds danger threshold" reading, caught the instant it
crossed the line. Real alert copy to reproduce: "DANGEROUS" badge (red),
"DANGEROUS: CO2 level at 1,686.82 ppm exceeds danger threshold", device tag
"mocksense-0", timestamp.

- blueprint: agent-progress-theater (Adapt) — keeps the "receipt cascades
  in, badge flips" signature; drops the trigger/loader phase since this is
  passive real-time monitoring, not a user-initiated scan.
- focal: (none — native rebuild)
- roles: n/a
- sfx: alert-chime (row arrival), soft impact (badge flip)

Scene 1 (0.0-2.0s): cream ground. An empty "Recent Alerts" panel outline
sits quiet, right half of frame — asymmetric 60/40, generous negative space
left (the implied callback to Frame 1's number, off-screen-left).
Scene 2 (2.0-4.5s): the alert row slides into the panel — badge flips from
neutral to "DANGEROUS" (red), the line "CO2 level at 1,686.82 ppm exceeds
danger threshold" arrives via per-word staggered reveal, device tag and
timestamp land last, fastest cue.
Scene 3 (4.5-7.0s): settle — panel holds complete; one ambient glow bloom
pulses once behind the badge, then stills — held read, at most subtle
jitter.

## Frame 5 — The response

- scene: The Overview dashboard, live — CO2 Level, Temperature, Humidity metric cards ticking, CO2 Trend and Temp & Humidity line charts drawing in.
- voiceover: "Live, the moment it matters."
- duration: 6s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-realtime.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: control + confidence
- blueprint: device-surface-showcase
- asset_candidates:

**Playback order note**: this beat now plays FIFTH, built from the existing
`04-realtime.html` file (filename unchanged, position moved to right after
the Catch). This is "here's what the team was already seeing" — the
response mechanism behind the catch. Real layout/copy to reproduce
faithfully: left nav (Overview / Data History / Device Management / User
Access) under the "SENTINEL" wordmark+shield; header "Real-time Monitoring"
/ "Overview of environmental metrics"; device selector ("mocksense-0") and
range toggle; a live indicator; three metric cards — "CO2 Level 656.04 ppm"
(+61.1%), "Temperature 20.21C" (+47.2%), "Humidity 41.43%" (+51.0%); two
line charts — "CO2 Trend" and "Temp & Humidity". Card style: white surface,
~8px radius, no heavy shadows, accent blue for the live dot and chart
lines. Duration is shorter than v1 (6s vs 11s) — pace the reveal
accordingly, don't pad with a longer hold.

- blueprint: device-surface-showcase (Adapt) — a single static-tour screen
  (Overview only), the feature being sold is what one screen shows.
- focal: (none captured — native rebuild)
- roles: n/a
- sfx: soft-tick x3 (metric cards landing), draw-swoosh (chart lines)

Scene 1 (0.0-1.3s): cream ground. Left nav sidebar and header band enter
first — "Real-time Monitoring" / "Overview of environmental metrics" plus
the live dot — asymmetric 70/30, 3 depth layers.
Scene 2 (1.3-3.5s): the three metric cards reveal left-to-right via
cluster-outward expansion, staggered ~0.25s apart, each doing a quick
value-scaled counter tick-up to its real value as it lands.
Scene 3 (3.5-6.0s): the two chart panels reveal via SVG self-draw, CO2
Trend first, Temp & Humidity close behind; settle — held complete, live dot
runs a small live-SVG pulse as the only aliveness.

## Frame 6 — The wider promise

- scene: The Device Management table — every sensor box on site, its status and type, in one list.
- voiceover: "Every device. Every site."
- duration: 7s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/06-fleet.html
- type: feature_showcase
- persuasion: Value stacking
- beat: control + ease
- blueprint: grid-card-assemble
- asset_candidates:

This is the story's scale beat — "not just this one reading, this covers
everything." Real content: "Device Management" header, "2 device(s)
registered", table columns Box ID / Status / Type / Alias / Alert Threshold
/ Dangerous Threshold — rows "mocksense-0" (Active, CO2) and "mocksense-1"
(Active, H2), "+ Add Device" button. Two real rows only, plus one clearly-
not-real ghost row (low opacity, dashed border) implying room to grow — do
not fabricate additional real-looking device rows.

- blueprint: grid-card-assemble (Reproduce)
- focal: (none — native rebuild)
- roles: n/a
- sfx: soft-tick x2 (rows landing)

Scene 1 (0.0-2.0s): cream ground. "Device Management" header + "+ Add
Device" pill enter first, top band.
Scene 2 (2.0-5.0s): the table's two real rows self-assemble in a staggered
cascade (~0.6s apart): "mocksense-0 - Active - CO2", then "mocksense-1 -
Active - H2" — each row's status dot does a quick live-SVG pulse.
Scene 3 (5.0-7.0s): hold on the complete two-row table; a third row fades
in at very low opacity with a dashed border, then everything stills.

## Frame 7 — The record

- scene: The Data History table scrolls past real timestamped readings, then pivots to an Export CSV action.
- voiceover: "On record. Not just memory."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-history.html
- type: benefit_highlight
- persuasion: Statistical proof
- beat: trust + peace of mind
- blueprint: transcript-scroll-artifact-reveal
- asset_candidates:

Real content: "Data History" header / "Export and analyze historical
device data", device + date-range selector, "Data Preview" table with
columns TIMESTAMP / GAS VALUE (PPM) / TEMP (C) / HUMIDITY (%) — real-shaped
rows in the 400-800 ppm band with one spike row near 1,800-1,900 ppm
echoing Frame 1, and an "Export CSV" button. Duration shortened from v1
(6s vs 9s) — trim the traversal, keep the spike-flash and export pivot.

- blueprint: transcript-scroll-artifact-reveal (Reproduce)
- focal: (none — native rebuild)
- roles: n/a
- sfx: soft paper-whoosh (scroll), click (export button land)

Scene 1 (0.0-1.5s): cream ground. "Data History" header and the device/
date-range selector enter, top band only.
Scene 2 (1.5-4.2s): the data table traverses vertically at read pace; the
spike row flashes cobalt->red briefly as it crosses center.
Scene 3 (4.2-6.0s): the table pivots via a scale-swap handoff into the
"Export CSV" button, which spring-pop enters and holds.

## Frame 8 — Recap

- scene: Rapid value phrases flash and clear against a clean field.
- voiceover: "Live monitoring. Instant alerts. Every device, one view."
- duration: 6s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/08-benefits.html
- type: benefit_highlight
- persuasion: Rule of three
- beat: confidence + control
- blueprint: kinetic-type-beats
- asset_candidates:

Section-boundary beat (story -> close), hence `zoom-through`. Three short
phrases in rhythm with the three feature beats just shown (catch ->
response -> wider promise). Keep it typographic, no UI chrome. **Known v1
bug, must not recur**: the two-word phrase ("Live monitoring.") needs an
explicit `gap` on its flex container — v1 shipped `display:flex` on the
line wrapper with a plain whitespace text node between two `inline-block`
spans, which flex silently collapses to zero width, rendering
"Livemonitoring." with no space. Give the flex container an explicit `gap`
(e.g. `gap: 0.28em`) instead of relying on inter-element whitespace.

- blueprint: kinetic-type-beats (Reproduce)
- focal: (none — pure typography)
- roles: n/a
- sfx: soft tick x3, one per phrase

Scene 1 (0.0-2.0s): cream ground, centered. "Live monitoring." lands via
per-word staggered reveal.
Scene 2 (2.0-4.0s): "Live monitoring." dims and rises slightly as "Instant
alerts." (cobalt) lands beneath it.
Scene 3 (4.0-6.0s): both prior lines settle small/dim near the top as
"Every device, one view." lands largest, dead-center, near-black, on a
smooth long-tail settle — holds.

## Frame 9 — CTA / Brand outro

- scene: The Sentinel mark holds center; a closing line settles beneath it.
- voiceover: "Never miss a dangerous reading."
- duration: 7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-cta.html
- type: cta
- persuasion: Future pacing
- beat: peace of mind + inevitability
- blueprint: logo-assemble-lockup
- asset_candidates: assets/sentinel-logo.svg — the real Sentinel brand mark

Calm, held close — no countdown/urgency chrome (that already happened in
Frame 1). The real mark + wordmark settle and hold to the final frame. No
fabricated URL/handle.

- blueprint: logo-assemble-lockup (Reproduce)
- focal: assets/sentinel-logo.svg
- roles: assets/sentinel-logo.svg = cutout
- sfx: none (the silence is the point)

Scene 1 (0.0-2.0s): cream ground. Faint concentric rings fade in centered,
very low opacity.
Scene 2 (2.0-4.5s): the real shield mark spring-pop enters at center; the
wordmark "SENTINEL" locks in beneath it.
Scene 3 (4.5-7.0s): the closing line "Never miss a dangerous reading."
lands via per-word staggered reveal, then everything holds completely
still to the final frame — no jitter even.
