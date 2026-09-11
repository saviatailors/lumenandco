-- ==========================================
-- LUMEN & CO CRM & DELIVERY HUB DATABASE SCHEMA
-- PostgreSQL / Supabase Production Ready Migration
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. AGENCY B2B LEADS (CRM PIPELINE)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    source TEXT NOT NULL DEFAULT 'website',
    stage TEXT NOT NULL DEFAULT 'new',
    estimated_deal_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    probability_to_close NUMERIC(5, 2) NOT NULL DEFAULT 0.20,
    assigned_to_staff_id TEXT,
    assigned_to_name TEXT,
    next_action TEXT,
    next_action_date DATE,
    lead_score INTEGER NOT NULL DEFAULT 50,
    lead_temp TEXT NOT NULL DEFAULT 'warm',
    lost_reason TEXT,
    portal_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for CRM Pipeline performance
CREATE INDEX IF NOT EXISTS idx_leads_stage ON public.leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_contact_email ON public.leads(contact_email);
CREATE INDEX IF NOT EXISTS idx_leads_portal_token ON public.leads(portal_token);

-- 2. SCHOOL & AGENCY CLIENT ACCOUNTS
CREATE TABLE IF NOT EXISTS public.school_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    brand_name TEXT NOT NULL,
    package_tier TEXT NOT NULL DEFAULT 'Growth Retainer',
    monthly_retainer_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'active',
    portal_access_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_clients_status ON public.school_clients(status);

-- 3. CLIENT END-CUSTOMER BUSINESS LEADS (Tele-calling & Sales Execution)
CREATE TABLE IF NOT EXISTS public.client_business_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.school_clients(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    lead_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT,
    campaign_source TEXT NOT NULL DEFAULT 'Meta Ads',
    temperature TEXT NOT NULL DEFAULT 'warm', -- hot, warm, cold, unqualified, converted
    estimated_deal_value_rupees NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT DEFAULT '',
    last_contacted_at TIMESTAMPTZ,
    call_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_business_leads_client_id ON public.client_business_leads(client_id);
CREATE INDEX IF NOT EXISTS idx_client_business_leads_temp ON public.client_business_leads(temperature);

-- 4. CONTRACTS & RETAINERS
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.school_clients(id) ON DELETE CASCADE,
    package_name TEXT NOT NULL,
    services_included TEXT[] NOT NULL DEFAULT '{}',
    monthly_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    billing_cycle TEXT NOT NULL DEFAULT 'monthly',
    start_date DATE NOT NULL,
    renewal_date DATE NOT NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'active',
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON public.contracts(client_id);

-- 5. INVOICES & FINANCIALS
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT NOT NULL UNIQUE,
    client_id UUID REFERENCES public.school_clients(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
    amount_cents BIGINT NOT NULL DEFAULT 0,
    amount_inr NUMERIC(12, 2) GENERATED ALWAYS AS (amount_cents / 100.0) STORED,
    line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, paid, overdue, void
    due_date DATE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);

-- 6. INTERNAL AGENCY TASKS
CREATE TABLE IF NOT EXISTS public.internal_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'med',
    status TEXT NOT NULL DEFAULT 'pending',
    assigned_to TEXT NOT NULL DEFAULT 'Alex Rivers',
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SERVICE PRICING CATALOG
CREATE TABLE IF NOT EXISTS public.service_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    billing_type TEXT NOT NULL DEFAULT 'monthly',
    deliverables_included TEXT[] NOT NULL DEFAULT '{}',
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. DELIVERY HUB DELIVERABLES & PRODUCTION TASKS
CREATE TABLE IF NOT EXISTS public.deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.school_clients(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- reel, static_post, carousel, ad_creative, website_task, blog, email_campaign
    brief_description TEXT,
    assigned_to_staff_id TEXT,
    assigned_to_name TEXT,
    created_by_staff_id TEXT,
    priority TEXT NOT NULL DEFAULT 'med',
    due_date DATE NOT NULL,
    publish_date DATE,
    status TEXT NOT NULL DEFAULT 'backlog', -- backlog, in_progress, internal_review, ready_for_client, client_review, approved, delivered
    client_visible BOOLEAN NOT NULL DEFAULT FALSE,
    estimated_hours NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
    actual_hours_logged NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
    tags TEXT[] NOT NULL DEFAULT '{}',
    subtasks JSONB NOT NULL DEFAULT '[]'::jsonb,
    attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
    internal_comments JSONB NOT NULL DEFAULT '[]'::jsonb,
    client_comments JSONB NOT NULL DEFAULT '[]'::jsonb,
    time_entries JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliverables_status ON public.deliverables(status);
CREATE INDEX IF NOT EXISTS idx_deliverables_client_id ON public.deliverables(client_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_assigned ON public.deliverables(assigned_to_staff_id);

-- 9. STAFF MEMBERS & CAPACITY TRACKING
CREATE TABLE IF NOT EXISTS public.staff_members (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    role_label TEXT NOT NULL,
    avatar_color TEXT NOT NULL DEFAULT '#6366f1',
    capacity_limit INTEGER NOT NULL DEFAULT 40,
    weeks_at_high_capacity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_business_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- Allow admin & authenticated service keys full access
CREATE POLICY "Full Admin Access to Leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Full Admin Access to Clients" ON public.school_clients FOR ALL USING (true);
CREATE POLICY "Full Admin Access to Business Leads" ON public.client_business_leads FOR ALL USING (true);
CREATE POLICY "Full Admin Access to Contracts" ON public.contracts FOR ALL USING (true);
CREATE POLICY "Full Admin Access to Invoices" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Full Admin Access to Deliverables" ON public.deliverables FOR ALL USING (true);
