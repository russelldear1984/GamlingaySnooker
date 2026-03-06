# Gamlingay Snooker Tournament Scheduler

Responsive web application for managing and viewing snooker tournament schedules.

## Features

- Public pages:
  - `/home` landing page
  - `/schedule` chronological tournament schedule
- Admin pages:
  - `/admin/login` (6-digit code)
  - `/admin/dashboard`
  - `/admin/matches` create/edit/delete and assign players/tables/times
  - `/admin/opening-hours` configure open/closed days and hours
- Scheduling validation:
  - no booking outside opening hours
  - no booking on closed days
  - no overlapping bookings on same table/time
- Seed data for players, tables, matches, and opening hours

## Stack

- React + Vite
- TailwindCSS
- React Router
- Google Fonts + Material Symbols

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure admin access code:
   ```bash
   cp .env.example .env
   ```
   Then edit `VITE_ADMIN_CODE` in `.env`.
3. Run development server:
   ```bash
   npm run dev
   ```
4. Build production bundle:
   ```bash
   npm run build
   ```


## GitHub Pages

This project is configured with a Vite `base` of `/GamlingaySnooker/` so the root route (`/`) renders correctly when hosted at:

- `https://russelldear1984.github.io/GamlingaySnooker/`


### Routing note for GitHub Pages

For project pages, the valid base URL is:

- `https://russelldear1984.github.io/GamlingaySnooker/`

So the home route is:

- `https://russelldear1984.github.io/GamlingaySnooker/home`

`https://russelldear1984.github.io/home` is a different site root and will return 404 unless that root site is separately configured.

A `404.html` SPA fallback redirect is included so deep links under `/GamlingaySnooker/*` load correctly.

## Admin Code

The configurable admin code is read from:

- `VITE_ADMIN_CODE` in environment variables
- fallback default in `src/pages/AdminLoginPage.jsx`
