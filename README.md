# Gamlingay Snooker Tournament Scheduler

Responsive web application for managing and viewing snooker tournament schedules.

## Features

- Public pages:
  - `/` (and `/home`) landing page
  - `/schedule` chronological tournament schedule
- Admin pages:
  - `/admin/login` (6-digit code)
  - `/admin/dashboard`
  - `/admin/matches` create/edit/delete matches and add/edit/delete players
  - `/admin/opening-hours` configure open/closed days and hours
- Scheduling validation:
  - no booking outside opening hours
  - no booking on closed days
  - no overlapping bookings on same table/time
- Persistent Supabase storage for:
  - `players`
  - `tables`
  - `matches`
  - `opening_hours`

## Stack

- React + Vite
- TailwindCSS
- React Router (HashRouter for refresh-safe GitHub Pages routes)
- Supabase
- Google Fonts + Material Symbols

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. In Supabase, open **SQL Editor** and run:
   - `supabase/schema.sql`
4. Run development server:
   ```bash
   npm run dev
   ```
5. Build production bundle:
   ```bash
   npm run build
   ```

## Supabase Notes

- The app reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env`.
- On first run, if the tables are empty, the app seeds example data automatically.
- The provided SQL enables RLS and creates permissive policies suitable for this simple club app. Tighten these policies before production use.

## GitHub Pages

This project is configured with a Vite `base` of `/GamlingaySnooker/` so the root route (`/`) renders correctly when hosted at:

- `https://russelldear1984.github.io/GamlingaySnooker/`

### Routing note for GitHub Pages

For project pages, the valid base URL is:

- `https://russelldear1984.github.io/GamlingaySnooker/`

So the home route is:

- `https://russelldear1984.github.io/GamlingaySnooker/#/`

And the schedule route is:

- `https://russelldear1984.github.io/GamlingaySnooker/#/schedule`

Routes use hash-based navigation, so refreshing pages does not rely on server-side SPA rewrites.

## Admin Code

The configurable admin code is read from:

- `VITE_ADMIN_CODE` in environment variables
- fallback default in `src/pages/AdminLoginPage.jsx`
