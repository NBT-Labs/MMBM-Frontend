# MMBM Frontend

Plain HTML/CSS/vanilla JS site for the Montreal Mauritian Bajrang Mandal Association. No
build step, no framework — just static files that call the Odoo backend's public API.

## Structure

- `index.html` — Home page markup
- `css/styles.css` — Styling
- `js/config.js` — Set `API_BASE_URL` to point at your Odoo backend
- `js/app.js` — Fetches `/api/mmbm/config` and fills in the page

## Run locally

The backend (see `MMBM-Backend`) must be running with the `mmbm_admin_config` module
installed, since that's what serves `GET /api/mmbm/config`.

Because the page uses `fetch()`, open it through a local server rather than
double-clicking the file (some browsers block `fetch` from `file://` origins):

```bash
# from this folder
python3 -m http.server 3000
# or: npx serve .
```

Then visit http://localhost:3000. By default `js/config.js` points at
`http://localhost:8069` (the backend's default docker-compose port).

## Content

All page content (org name, tagline, welcome text, mission, history, president's message,
vision/objectives, contact details, donation/calendar/chanting links) comes from the single
**Admin Config** record in the Odoo backend. Edit it there — no code changes needed here to
update copy.

## Next steps

- Add Events / Blog / Announcements pages once their public API endpoints exist on the
  backend (currently only `mmbm_admin_config` exposes one, at `/api/mmbm/config`).
- Swap the static `API_BASE_URL` for an environment-specific value when deploying.
