-- Run this in Supabase SQL Editor.
-- This schema creates persistent storage for the snooker scheduler app.

create extension if not exists "pgcrypto";

create table if not exists public.players (
  id text primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tables (
  id text primary key,
  table_number integer not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.opening_hours (
  day_of_week integer primary key check (day_of_week between 0 and 6),
  is_open boolean not null default true,
  open_time time not null,
  close_time time not null,
  created_at timestamptz not null default now()
);

create table if not exists public.matches (
  id text primary key,
  player1 text not null references public.players(id) on update cascade,
  player2 text not null references public.players(id) on update cascade,
  table_number integer not null references public.tables(table_number) on update cascade,
  round text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'Scheduled',
  player1_score integer null check (player1_score >= 0),
  player2_score integer null check (player2_score >= 0),
  created_at timestamptz not null default now(),
  constraint matches_distinct_players check (player1 <> player2)
);

-- Optional but recommended for read/write from the browser app:
-- Enable RLS then allow anonymous access for this simple club app.
alter table public.players enable row level security;
alter table public.tables enable row level security;
alter table public.opening_hours enable row level security;
alter table public.matches enable row level security;

drop policy if exists "public read players" on public.players;
create policy "public read players" on public.players for select using (true);
drop policy if exists "public write players" on public.players;
create policy "public write players" on public.players for all using (true) with check (true);

drop policy if exists "public read tables" on public.tables;
create policy "public read tables" on public.tables for select using (true);
drop policy if exists "public write tables" on public.tables;
create policy "public write tables" on public.tables for all using (true) with check (true);

drop policy if exists "public read opening_hours" on public.opening_hours;
create policy "public read opening_hours" on public.opening_hours for select using (true);
drop policy if exists "public write opening_hours" on public.opening_hours;
create policy "public write opening_hours" on public.opening_hours for all using (true) with check (true);

drop policy if exists "public read matches" on public.matches;
create policy "public read matches" on public.matches for select using (true);
drop policy if exists "public write matches" on public.matches;
create policy "public write matches" on public.matches for all using (true) with check (true);


-- For existing databases created before score fields were added:
alter table if exists public.matches add column if not exists player1_score integer null check (player1_score >= 0);
alter table if exists public.matches add column if not exists player2_score integer null check (player2_score >= 0);
