# MMBMA Website

Next.js (App Router) site for the Montreal Mauritian Bajrang Mandal Association, built on
the Option B brand system (`MMBMA_Brand_Identity_Option_B.pdf`). All content comes from
the `MMBM-Backend` Odoo instance's public JSON API - no CMS/build step needed there beyond
editing records in Odoo.

> Note: there's a stray `favicon_src.ico` at the repo root - leftover from scaffolding,
> safe to delete (`rm favicon_src.ico`). The real favicon lives at `src/app/favicon.ico`.

## Stack

Scaffolded with the official `create-next-app` (App Router, TypeScript, Tailwind, `src/`
dir, `@/*` import alias) on **Next.js 16 / React 19 / Tailwind v4**. Tailwind v4 moves
theme config into CSS - the brand colors/fonts/radius live in `src/app/globals.css`'s
`@theme` block rather than a `tailwind.config.ts` file.

- Deploys to Vercel's free tier with zero config.
- **react-big-calendar** for the Events page calendar (color-coded by type, click for a
  details modal, legend below).
- ISR (`revalidate: 300`) on all API calls, so pages stay fast without hammering Odoo.

## Pages

- `/` - Home: hero, mission summary, "This Week at the Mandal" preview.
- `/about` - History, org structure, president's message, vision/objectives, contact.
- `/events` - Full events calendar.
- `/festivals` - Festival showcase cards (from the new `mmbm_festivals` Odoo module).

Site-wide: a dismissible announcement banner above the navbar shows whichever
`mmbm.announcement` is marked "Highest Priority" in Odoo (only one can be at a time -
marking a new one automatically unmarks the previous one).

## Run locally (Docker, recommended)

Matches how `MMBM-Backend` already runs. Start the backend first (it creates the shared
`mmbm_network` this compose file joins), then start this repo:

```bash
# 1. In MMBM-Backend/
docker compose up -d

# 2. In MMBM-Frontend-/
docker compose up
```

Visit http://localhost:3001. The container installs its own `node_modules` on first
build (`docker compose build` if you want to do that step separately), so nothing needs
to be installed on the host. Source is bind-mounted for hot reload - edits to `src/`
show up without rebuilding the image.

If you get a "network mmbm_network not found" error, the backend stack isn't up yet -
start it first.

To point at a differently-hosted backend (not the local Docker one), edit the
`NEXT_PUBLIC_API_BASE_URL` / `API_BASE_URL_INTERNAL` values in `docker-compose.yml`.

## Run locally (without Docker)

```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_BASE_URL at your Odoo backend
npm run dev
```

Either way, this requires `MMBM-Backend` running with `mmbm_admin_config`, `mmbm_events`,
`mmbm_announcements` and `mmbm_festivals` installed/upgraded (`-u` after pulling backend
changes), since those modules serve the public API routes this site reads:

- `GET /api/mmbm/config`
- `GET /api/mmbm/announcements/banner`, `GET /api/mmbm/announcements`
- `GET /api/mmbm/events`, `GET /api/mmbm/events/legend`
- `GET /api/mmbm/festivals`
- `POST /api/mmbm/contact`
- `POST /api/mmbm/prayer`

## Deploy (Vercel, free tier)

1. Push this repo to GitHub.
2. Import it in Vercel - it auto-detects Next.js, no build config needed.
3. Set the `NEXT_PUBLIC_API_BASE_URL` environment variable in the Vercel project to your
   publicly reachable Odoo URL (e.g. the Cloudflare Tunnel URL from `MMBM-Backend`'s
   `docker-compose.yml`, or wherever the backend ends up hosted).
4. Deploy. Content updates in Odoo show up within 5 minutes (ISR revalidation) without a
   redeploy.

## Festivals data

`GET /api/mmbm/festivals` serves published `mmbm.festival` rows. If a year has no rows
yet, the backend fetches religious holidays for India from
[Calendarific](https://calendarific.com/) (Hinduism only) and stores them. Set the Odoo
system parameter `mmbm_festivals.calendarific_api_key` to enable that. Records can also
be edited/added manually in Odoo.

## Next steps

- Photo Gallery, Info Room, Weekly Chanting pages (Phase 2, per the
  Requirements table in Miro) once those modules/APIs exist.
- Bilingual EN/FR per the brand system's Navigation guidance.
