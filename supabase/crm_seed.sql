-- ============================================================
-- Lumen & Co Agency CRM Seed Data
-- ============================================================

-- Seed Clients across different industries & states
insert into public.clients (id, company_name, contact_name, contact_email, contact_phone, industry, package_name, status, mrr_cents, onboarding_date, renewal_date, health_score, churn_risk)
values
  ('11111111-1111-1111-1111-111111111111', 'Aura Health & Wellness', 'Sarah Jenkins', 'sarah@aurahealth.com', '+1 (555) 234-5678', 'Health & Fitness', 'Full-Scale Performance', 'active', 650000, '2025-01-15', '2026-10-15', 95, false),
  ('22222222-2222-2222-2222-222222222222', 'Apex Global Logistics', 'Michael Chang', 'mchang@apexglobal.io', '+1 (555) 876-5432', 'Logistics & Supply', 'Content & SEO Growth', 'active', 450000, '2025-03-01', '2026-09-30', 88, false),
  ('33333333-3333-3333-3333-333333333333', 'Velox SaaS Technologies', 'David Miller', 'david@velox.ai', '+1 (555) 345-6789', 'Software / B2B SaaS', 'Enterprise PR & Growth', 'active', 1200000, '2024-11-10', '2026-11-10', 92, false),
  ('44444444-4444-4444-4444-444444444444', 'Komorebi Dining Group', 'Elena Rostova', 'elena@komorebidining.com', '+1 (555) 901-2345', 'Hospitality & Luxury', 'Social Media & Brand Retainer', 'paused', 350000, '2025-02-20', '2026-08-20', 45, true),
  ('55555555-5555-5555-5555-555555555555', 'Verde Organics', 'Liam Gallagher', 'liam@verdeorganics.co', '+1 (555) 678-9012', 'E-Commerce & DTC', 'DTC Growth Retainer', 'onboarding', 500000, '2026-09-01', '2027-09-01', 100, false),
  ('66666666-6666-6666-6666-666666666666', 'Starlight Real Estate', 'Rachel Green', 'rachel@starlightrealty.com', '+1 (555) 432-1098', 'Real Estate & Property', 'Lead Gen & Media Production', 'active', 800000, '2025-05-12', '2026-11-12', 78, false)
on conflict (id) do nothing;

-- Seed Leads across sales pipeline stages
insert into public.leads (id, name, email, company, website, phone, budget_cents, goal, message, status, lead_score, last_activity_at)
values
  ('a1111111-1111-1111-1111-111111111111', 'Alex Rivera', 'alex@luminaapp.com', 'Lumina Mobility', 'https://luminaapp.com', '+1 555-111-2222', 1500000, 'Rebrand and launch national campaign', 'Looking for a 6-month digital PR push.', 'negotiating', 95, now() - interval '2 days'),
  ('a2222222-2222-2222-2222-222222222222', 'Jessica Taylor', 'jtaylor@urbanfit.co', 'Urban Fit Wear', 'https://urbanfit.co', '+1 555-333-4444', 800000, 'Scale DTC Meta & TikTok Ads', 'Need agency to handle creative production and media buying.', 'pitched', 82, now() - interval '4 days'),
  ('a3333333-3333-3333-3333-333333333333', 'Carlos Gomez', 'carlos@solarpower.io', 'Solaris Energy', 'https://solarpower.io', '+1 555-555-6666', 2000000, 'B2B Lead Generation for Commercial Solar', 'We want 50 qualified commercial leads per month.', 'contacted', 78, now() - interval '1 day'),
  ('a4444444-4444-4444-4444-444444444444', 'Hannah Smith', 'hannah@bloomcafe.com', 'Bloom Artisan Roasters', 'https://bloomcafe.com', '+1 555-777-8888', 350000, 'Local Instagram & Influencer Push', 'Grand opening of 3rd location.', 'new', 60, now())
on conflict (id) do nothing;

-- Seed Tasks / Deliverables (Approval Workflow)
insert into public.crm_tasks (id, client_id, title, description, due_date, status, content_preview_url, client_feedback)
values
  ('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Q4 Wellness Campaign Video Reel', '60-sec Instagram Reel showcasing new organic protein lineup.', '2026-09-18', 'client_approval', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80', 'Looks great! Can we tweak the end CTA text?'),
  ('b2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'TechCrunch Press Release Copy', 'Drafting press release for Series B funding announcement.', '2026-09-22', 'internal_review', '', ''),
  ('b3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Onboarding Content Strategy Deck', 'Slide deck detailing 90-day growth roadmap.', '2026-09-15', 'draft', '', ''),
  ('b4444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', 'Luxury Villa Video Walkthrough Edit', 'High-end property drone footage edit.', '2026-09-10', 'published', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'Approved by Rachel.')
on conflict (id) do nothing;

-- Seed Invoices
insert into public.invoices (id, client_id, invoice_number, amount_cents, status, due_date, paid_at, is_recurring, description)
values
  ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'INV-2026-091', 650000, 'paid', '2026-09-01', now() - interval '5 days', true, 'Monthly Retainer — Sept 2026'),
  ('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'INV-2026-092', 1200000, 'paid', '2026-09-01', now() - interval '3 days', true, 'Monthly Retainer — Sept 2026'),
  ('c3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'INV-2026-084', 350000, 'overdue', '2026-08-15', null, true, 'Monthly Retainer — Aug 2026'),
  ('c4444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', 'INV-2026-095', 800000, 'pending', '2026-09-20', null, true, 'Monthly Retainer — Sept 2026')
on conflict (id) do nothing;

-- Seed Internal Notes (Agency-only private notes)
insert into public.internal_notes (id, client_id, content)
values
  ('d1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Client is restructuring internal marketing budget. High churn risk if August invoice remains unpaid past Sept 15.'),
  ('d2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Founder requested upsell proposal for Q4 international expansion PR package ($15k/mo).')
on conflict (id) do nothing;
