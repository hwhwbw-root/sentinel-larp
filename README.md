# Sentinel

Industrial gas/air-quality IoT monitoring platform. Sentinel boxes (ESP32
devices) report CO2 or H2 concentration, temperature, and humidity roughly
every 10 seconds; a Next.js dashboard shows live readings, history, and
alerts, and lets admins manage devices, users, and firmware.

This is a ground-up rewrite of the original React/Vite + Supabase app. The
product surface is the same; the stack underneath is new (see
[Architecture](#architecture) and [Known tradeoffs](#known-tradeoffs)).

## Stack

- **App**: Next.js 16 (App Router, TypeScript), Tailwind CSS, Recharts
- **Database**: Neon (serverless Postgres) via Drizzle ORM
- **Auth**: Auth.js (NextAuth v5), Credentials provider, bcrypt, JWT sessions
- **Firmware storage**: Vercel Blob + a `firmware_versions` table
- **Deploy target**: Vercel

## Directory structure

```
src/                Next.js app (dashboard, API routes, server actions)
src/db/schema.ts     Drizzle schema
src/db/seed.ts        Superadmin seed script
drizzle/              Generated SQL migrations
MAIN/                 ESP32 firmware (Arduino/.ino + C++)
mocksense/            Python device simulator
```

`MAIN/` and `mocksense/` are carried over from the original codebase with
their gas-reading, alert-calculation, and sensor-parsing logic
byte-for-byte unchanged. The only edits there are the backend URL and
per-device API key constants (see the comments at each change site) - they
used to point at a shared Supabase project with one anon key baked into
every device's firmware; they now point at this app's own API routes with
a key issued per device.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` - a Neon Postgres connection string
   - `AUTH_SECRET` - `openssl rand -base64 32`
   - `BLOB_READ_WRITE_TOKEN` - from a Vercel Blob store

3. Run migrations:
   ```bash
   npm run db:generate   # only needed after changing src/db/schema.ts
   npm run db:migrate
   ```

4. Seed the first Superadmin account:
   ```bash
   SEED_SUPERADMIN_EMAIL=you@example.com SEED_SUPERADMIN_PASSWORD=changeme123 npm run db:seed
   ```
   There is no self-serve signup - every account after this one is
   created from the User Access page.

5. Start the dev server:
   ```bash
   npm run dev
   ```

## Roles

- **Viewer**: read-only across Dashboard, Data History, Device Management
- **Admin**: Viewer, plus editing device alias/thresholds/calibration/type
- **Superadmin**: Admin, plus adding/deleting devices, User Access, and
  Firmware Update

Enforced server-side in every mutating server action and API route
(`requireRole` in `src/lib/api-auth.ts`), not just hidden in the UI.

## Provisioning a device

Add a device from Device Management (Superadmin). Its API key is shown
**once**, at creation (or on a manual regenerate) - copy it into that
device's `MAIN/SupabaseService.cpp` / `RemoteLogger.cpp` (`SUPABASE_KEY`)
or `mocksense/mocksense.py` (`DEVICE_API_KEYS`) before flashing/running it.

## Known tradeoffs

- **Polling, not realtime**: the original used Supabase's Postgres-changes
  push subscriptions. Neon has no equivalent, so the dashboard polls
  `/api/environment-data` every ~4s instead. A WebSocket/SSE layer is a
  reasonable future upgrade if sub-4s latency ever matters.
- **Firmware version format**: kept as a free-text string for parity with
  the original, but the ESP32's OTA check parses it as a float
  (`AZP_FW_VERSION`) - use plain version numbers like `4.0`, not `v4.0`.
