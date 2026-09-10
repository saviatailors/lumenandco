-- ============================================================
-- One-time setup for YOUR Supabase project.
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.
-- It creates the tables, security rules, and video storage bucket
-- the website needs. Safe to run once on a fresh project.
-- ============================================================

-- 1. Enquiries submitted from the website contact form
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  website text,
  budget text,
  goal text,
  message text,
  status text not null default 'new',
  notes text not null default '',
  next_steps text not null default '',
  portal_token text not null default encode(gen_random_bytes(24), 'hex')
);

-- 2. Activity history per enquiry
create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  kind text not null,
  detail text not null default '',
  actor text not null default 'team'
);

-- 3. Tasks per enquiry
create table if not exists public.lead_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  label text not null,
  done boolean not null default false,
  sort_order integer not null default 0
);

-- 4. Documents per enquiry
create table if not exists public.lead_documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  title text not null,
  path text not null,
  size integer not null default 0,
  client_visible boolean not null default false
);

-- 5. Reels & creatives shown on the public site
create table if not exists public.site_media (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('reel', 'creative')),
  src text not null,
  title text not null default '',
  subtitle text not null default '',
  poster text not null default '',
  sort_order integer not null default 0
);

-- Grants (Supabase does not grant these automatically)
grant insert on public.leads to anon;
grant select, insert on public.leads to authenticated;
grant select on public.site_media to anon;
grant select on public.site_media to authenticated;
grant all on public.leads to service_role;
grant all on public.lead_events to service_role;
grant all on public.lead_tasks to service_role;
grant all on public.lead_documents to service_role;
grant all on public.site_media to service_role;

-- Row level security
alter table public.leads enable row level security;
alter table public.lead_events enable row level security;
alter table public.lead_tasks enable row level security;
alter table public.lead_documents enable row level security;
alter table public.site_media enable row level security;

-- Anyone can send an enquiry through the contact form
create policy "Anyone can send an enquiry"
  on public.leads for insert to anon, authenticated
  with check (true);

-- Everyone can read the public reels/creatives list
create policy "Media list is public"
  on public.site_media for select to anon, authenticated
  using (true);

-- Everything else is reached only by the app's server (service key bypasses RLS).

-- 6. Storage bucket for uploaded videos (private, served via signed links)
insert into storage.buckets (id, name, public)
values ('site-videos', 'site-videos', false)
on conflict (id) do nothing;
