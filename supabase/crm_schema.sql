-- ============================================================
-- Lumen & Co Agency CRM Database Schema
-- ============================================================

-- 1. Profiles & Roles (Extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null check (role in ('admin', 'staff', 'client')) default 'staff',
  created_at timestamptz not null default now()
);

-- 2. Clients
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  company_name text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text default '',
  industry text default 'General',
  package_name text not null default 'Growth Retainer',
  status text not null check (status in ('active', 'onboarding', 'paused', 'churned')) default 'active',
  mrr_cents integer not null default 0, -- integer cents ($1,000.00 = 100000)
  onboarding_date date not null default current_date,
  renewal_date date,
  assigned_staff_id uuid references public.profiles(id) on delete set null,
  health_score integer not null default 100 check (health_score between 0 and 100),
  churn_risk boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Leads & Pipeline
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text default '',
  website text default '',
  phone text default '',
  budget_cents integer default 0, -- integer cents
  goal text default '',
  message text default '',
  status text not null check (status in ('new', 'contacted', 'pitched', 'negotiating', 'won', 'lost')) default 'new',
  notes text not null default '',
  next_steps text not null default '',
  portal_token text not null default encode(gen_random_bytes(24), 'hex'),
  lead_score integer not null default 0, -- Weighted calculation based on budget, goal & engagement
  assigned_staff_id uuid references public.profiles(id) on delete set null,
  converted_client_id uuid references public.clients(id) on delete set null,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 4. Tasks & Deliverables (Operations & Approval Workflow)
create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  assigned_staff_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text default '',
  due_date date not null,
  status text not null check (status in ('draft', 'internal_review', 'client_approval', 'published', 'done')) default 'draft',
  content_preview_url text default '',
  client_feedback text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Invoices (Retainer & One-off Billing)
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  invoice_number text not null unique,
  amount_cents integer not null default 0, -- integer cents
  status text not null check (status in ('pending', 'paid', 'overdue', 'cancelled')) default 'pending',
  due_date date not null,
  paid_at timestamptz,
  is_recurring boolean not null default false,
  description text default '',
  created_at timestamptz not null default now()
);

-- 6. Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  amount_cents integer not null default 0,
  payment_method text not null default 'bank_transfer',
  transaction_ref text default '',
  paid_at timestamptz not null default now()
);

-- 7. Internal Notes (STRICT SEPARATION: Staff & Admin access only)
create table if not exists public.internal_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now()
);

-- 8. Communication Log (Activity Timeline)
create table if not exists public.communication_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  logged_by_id uuid references public.profiles(id) on delete set null,
  channel text not null check (channel in ('email', 'whatsapp', 'call', 'meeting', 'system')) default 'call',
  summary text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security Setup
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.leads enable row level security;
alter table public.crm_tasks enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.internal_notes enable row level security;
alter table public.communication_logs enable row level security;

-- Grants
grant select, insert, update on public.clients to anon, authenticated;
grant select, insert, update on public.leads to anon, authenticated;
grant select, insert, update on public.crm_tasks to anon, authenticated;
grant select, insert, update on public.invoices to anon, authenticated;
grant all on public.clients to service_role;
grant all on public.leads to service_role;
grant all on public.crm_tasks to service_role;
grant all on public.invoices to service_role;
grant all on public.internal_notes to service_role;
grant all on public.communication_logs to service_role;
