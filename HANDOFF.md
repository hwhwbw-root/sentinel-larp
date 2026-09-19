# Handoff: Sentinel rewrite — continue here

Written for a fresh Claude Code session (local, not a sandboxed cloud
environment) picking this up. Read this whole file before doing anything.

## What this project is

Ground-up rewrite of "Sentinel" (an industrial gas/air-quality IoT
monitoring platform, working name "Trosense"/"petro" in the prior repo).
ESP32 sensor boxes report CO2 or H2 concentration + temperature/humidity
every ~10s; a web dashboard shows live readings, history, alerts, and lets
admins manage devices/users/firmware.

The original implementation (a separate repo, `kopiscript/petro`, not
generally reachable from this repo's sessions) was React/Vite + Supabase.
This repo is a full rewrite to a different stack, decided with the user
mid-project (see "Key decisions" below) — not assumed, actually asked and
answered.

## Current state (as of commit `64ecdb3`)

Fully scaffolded, built, and **verified end-to-end against a real local
Postgres** (not just type-checked) in an earlier session: migrations,
seed, login, RBAC gating, device ingest with server-side alert
calculation, and all five pages rendering real data. Two real bugs were
found and fixed during that verification:

1. `server-only` npm package was missing entirely — fixed by installing
   it, and by removing the `server-only` guard specifically from
   `src/lib/password.ts` (it's shared with the standalone seed script,
   which runs via `tsx` outside Next's bundler, where `server-only`
   always throws regardless of whether the package is installed).
2. `proxy.ts` (Next 16's renamed `middleware.ts`) was at the repo root
   instead of `src/proxy.ts`. Since this project uses `--src-dir`,
   Next silently ignored it at the wrong location — meaning **all
   RBAC/auth gating was a no-op** until this was caught and fixed. It's
   now correctly at `src/proxy.ts` and verified working (Viewer → /users
   redirects, Superadmin → /users allowed, unauthenticated → anywhere
   redirects to /login).

**What's NOT done yet**: the schema has never been applied to the user's
real Neon database, and no Superadmin account exists there. This is the
one remaining step — see "Immediate next step" below.

## Why the DB isn't set up yet

The cloud sandbox this was built in has a network egress allowlist that
blocks arbitrary external hosts (confirmed not Neon-specific — even
`example.com` got a 403 policy denial from the sandbox's proxy). So
`psql`/`drizzle-kit migrate`/the Neon HTTP driver could not reach the
user's Neon database from that session at all. A `.github/workflows/db-ops.yml`
workflow was added as a workaround (runs migrate/seed on GitHub's own
runners, which have normal internet access) but the user ultimately
decided to just run it locally instead, which is why you're here.

**A local Claude Code session has no such restriction** — just run the
commands directly.

## Immediate next step

1. `npm install`
2. Create `.env` (see `.env.example` for the shape) with:
   - `DATABASE_URL` — the user has a Neon project already; ask them for
     the pooled connection string if you don't have it (it was shared in
     the prior session as a Singapore-region Neon project,
     `ep-soft-art-b3zb3oit-pooler.c-4.ap-southeast-1.aws.neon.tech`, but
     treat that as unconfirmed/possibly rotated — ask rather than assume).
   - `AUTH_SECRET` — generate fresh: `openssl rand -base64 32`
   - `BLOB_READ_WRITE_TOKEN` — only needed for the firmware-upload feature;
     can be left blank for now if the user doesn't have a Vercel Blob
     store yet.
3. `npm run db:migrate`
4. Seed the Superadmin account. The user previously specified:
   - Email: `admin@sentinel.azmiproductions.com`
   - Password: `SecretSenti123.`
   Confirm with the user this is still what they want before seeding
   (don't just silently reuse it) — it's easy to change via
   `SEED_SUPERADMIN_EMAIL=... SEED_SUPERADMIN_PASSWORD=... npm run db:seed`.
5. `npm run dev`, log in, click through the app for a final sanity check.
6. Ask the user whether to delete `.github/workflows/db-ops.yml` (it was
   a workaround for the cloud sandbox's network restriction and is no
   longer needed once migrations run locally) — don't delete unilaterally,
   they may want to keep it as a standing option for future schema changes.

## Key decisions (asked and confirmed with the user, not assumed)

- **Stack**: Next.js (App Router, TypeScript, currently on v16), Tailwind,
  Recharts. Single full-stack app, not separate frontend/backend.
- **Database**: Neon Postgres + Drizzle ORM (`drizzle-orm/neon-http`).
- **Auth**: Auth.js (NextAuth v5), Credentials provider, bcrypt, **JWT**
  sessions (not DB sessions — Credentials provider doesn't support DB
  sessions in NextAuth's default setup; this correction was made during
  build, verify before "fixing" it back).
- **Device connectivity**: ESP32 firmware and `mocksense.py` now hit this
  app's own API routes with a per-device hashed API key, replacing the
  original's single shared Supabase anon key hardcoded in firmware
  source (a real security problem in the original). Chosen over trying
  to make the new backend "look like Supabase" to firmware, since Neon
  isn't Supabase/PostgREST-compatible anyway.
- **Column naming**: original `treshold_alert`/`treshold_dangerous` typo
  is fixed in the new DB (`alert_threshold`/`dangerous_threshold`), but
  the device-facing threshold endpoint (`/api/devices/thresholds`)
  translates back to the old misspelled keys in its JSON response,
  because the ESP32 firmware does a literal string search for
  `"treshold_alert"` when parsing the response — fixing the DB column
  name would otherwise silently break firmware compatibility.
- **Firmware hosting**: brought in-house (Vercel Blob + a
  `firmware_versions` table), replacing the original's separate external
  PHP host (`azmiproductions.com/sentinel/*.php`). The ESP32's
  `AZP_OTA.h` URL constants were updated to point at this app's
  `/api/firmware/version` and `/api/firmware/download` routes.
- **Realtime**: polling (`/api/environment-data`, ~4s interval) instead
  of Supabase Realtime subscriptions — Neon has no equivalent push
  mechanism. Documented as a known/accepted tradeoff, not treated as a bug.

## Constraints the user gave that still apply

- **Do not change ESP32 firmware (`MAIN/`) or `mocksense/` calculation
  logic.** Only backend URL/API-key constants were changed there, with
  comments at each change site explaining why. If asked to touch
  anything else in those two directories, treat it as a scope change and
  confirm with the user first, explaining the tradeoff — same as the
  original instruction from the user at project start.
- Strip Petronas/AZP-company branding where found — already done; the
  zip the user supplied was already fully "Sentinel"-branded with no
  Trosense/Petronas strings anywhere. `azmiproductions.com` (a personal
  domain, not a company one) is the one external reference and it's
  being replaced, not just renamed.

## Known issues found but intentionally NOT fixed (flagged to user, not asked to change)

- `MAIN/RemoteLogger.cpp` hardcodes `box_id: "unknown"` in its log
  payload body — a pre-existing bug in the original firmware. Currently
  harmless in the new backend since `/api/devices/logs` identifies the
  device from its API key, not the payload's box_id. Out of scope
  (firmware logic), left untouched.
- `cal_a`/`cal_b` calibration coefficients exist in the schema and
  Device Management UI (carried over from the original) but are not
  applied anywhere — the firmware doesn't read them, nothing multiplies/
  offsets the raw PPM by them. Dead feature, same as in the original.
- Firmware version is a free-text string in the DB/UI but the ESP32's
  `AZP_OTA.h` parses it as a float (`AZP_FW_VERSION`) for comparison — use
  plain numbers like `4.0`, not `v4.0`, when uploading firmware.

## Repo map

```
src/app/(app)/...        Dashboard, Analytics, Devices, Users, Firmware pages
src/app/api/...           Device ingest/thresholds/logs, environment-data,
                           alerts, firmware version/download routes
src/app/login/            Login page + server action
src/components/           Page-level client components (one dir per page)
src/lib/actions/          Server actions (devices, users, firmware, auth)
src/lib/                  alerts.ts (single source of truth for 0/1/2 calc),
                           rbac.ts, api-auth.ts, device-auth.ts, password.ts,
                           devices-query.ts, users-query.ts, firmware.ts
src/db/schema.ts          Drizzle schema (5 tables, see README for the full
                           column list)
src/db/seed.ts            Superadmin seed script
src/auth.ts               NextAuth config
src/proxy.ts              Route-level RBAC gating (NOT proxy.ts at repo root!)
MAIN/                      ESP32 firmware (Arduino/.ino + C++), logic untouched
mocksense/                 Python device simulator, logic untouched
.github/workflows/db-ops.yml   Cloud-sandbox workaround, see above
README.md                  Full setup instructions, roles, provisioning docs
```

Full DB schema and role/RBAC breakdown are already documented in
`README.md` — read that too, don't re-derive it from scratch.
