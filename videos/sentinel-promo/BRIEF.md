---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Sentinel catches a dangerous gas reading the instant it happens, so nothing gets missed."
destination: website
aspect: 1920x1080
language: en
audience: "Facility and EHS/safety managers and industrial ops teams responsible for gas/air-quality monitoring"
length: 80s
angle: "alert-driven: cold open on a live danger alert, then product (real-time monitoring), proof (historical record + fleet management), close on peace-of-mind CTA"
narration: no
---

## Intent

A promo for Sentinel, an industrial gas/air-quality IoT monitoring dashboard
(this repo). Sell, not just show: make the case that Sentinel catches
dangerous CO2/H2 readings the moment they happen, across every sensor box on
site, and gives the team a searchable record afterward. Tone: confident,
calm-under-pressure, safety-serious but not fear-mongering — closer to
"we've got this covered" than a disaster-movie trailer.

Concept picked from a 5-way pitch round: **"Never miss a dangerous
reading"** — the alert-driven narrative, chosen over fleet-scale,
compliance-record, human/role, and reliability angles.

## Assets

No user-supplied files. Real product content gathered by hand (see Notes)
since the automated capture only reached the login wall.

## Customizations

- Feature real product copy/data patterns pulled directly from the running
  app (device names `mocksense-0`/`mocksense-1`, the "DANGEROUS: CO2 level
  exceeds danger threshold" alert copy, CO2/Temp/Humidity metric cards, the
  Data History export table, Device Management fleet table) rather than
  invented placeholder UI.

## Notes

- **Capture was auth-walled.** `npx hyperframes capture` on `localhost:3000`
  only reached the sign-in screen (no public marketing page exists for this
  internal dashboard) — it supplied brand tokens (accent `#2F6FED`, Satoshi
  font, 8px radius/spacing, zinc neutrals) but not the real dashboard
  screens. Those were gathered manually by browsing the already-authenticated
  local dev session (Overview, Data History, Device Management, User Access)
  and noting real layout/copy/data. Frames should be built natively in HTML
  from these brand tokens + real content, not composited from raster
  screenshots.
- **Privacy:** do not feature the real seeded admin email
  (`admin@sentinel.azmiproductions.com`) anywhere in the video. If a
  user/role beat is used at all, use a generic placeholder name/email.
- Dev server for any live reference during the build: `npm run dev` in the
  repo root (port 3000), already running via the Browser pane preview.
- **Silent by design.** No HeyGen sign-in and no local TTS/BGM engines were
  available; the user chose a fully silent, text/motion-driven video over
  signing in or installing local deps. `STORYBOARD.md` top frontmatter must
  set `music: none` and no `SCRIPT.md` is written — the canonical
  fully-silent marker. The story has to land entirely through on-screen
  type, real UI content, and motion/pacing (kinetic captions carrying the
  narrative beats in place of voiceover).
