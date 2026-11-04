# THREAT MODEL — LUMEN & CO AGENCY PLATFORM

**Target Application:** Lumen & Co Public Web Presence & Internal CRM Command Center  
**Repository:** `lumenandco`  
**Date:** November 2026  
**Auditor:** Senior Application Security Engineer & Cloud Security Auditor  
**Standard:** OWASP Top 10 (2021/2025), OWASP API Security Top 10 (2023), ASVS 4.0 L2, India DPDP Act 2023  

---

## 1. System Overview & Architecture

Lumen & Co is a full-stack digital marketing agency platform featuring:
1. **Public Web Experience:** Fast static & server-rendered landing pages, performance case studies, service tier breakdowns, localized hubs, and inbound growth audit capture forms.
2. **Internal CRM Command Center (`/sahit`):** Full-cycle lead pipeline, client retainers, financial billing & invoices, team capacity allocation, document vault, multi-channel communication logs, and real-time email dispatch engine.
3. **Delivery Hub (`/delivery`):** Operational kanban, deliverable stage transitions, and asset approval workflows.
4. **Client Portal (`/client` & `/portal/$token`):** Self-service review of campaign analytics, invoices, and tokenized audit proposals.

```
[ Public Web Visitors ] ------> [ TanStack Start / Nitro SSR (Vite) ]
                                            |
        +-----------------------------------+-----------------------------------+
        |                                   |                                   |
[ Supabase PostgreSQL ]          [ Resend REST API ]                  [ Gmail SMTP SSL ]
  - RLS Policies                   - Verified Domain:                  - Sender:
  - Auth & Storage                   hello@lumenandco.in                 sahitsai6@gmail.com
```

---

## 2. Data Classification

| Classification | Assets | Security Controls Required |
| :--- | :--- | :--- |
| **Public** | Marketing copy, public blog posts, pricing catalog, brand creatives | Integrity, CDN caching, DDoS protection |
| **Internal** | Task schedules, team velocity, delivery checklists, communication logs | Role-Based Access Control, session validation |
| **Confidential (PII)** | Prospect names, emails, phone numbers, ad budgets, client revenue, invoices | Encryption at rest, RLS, TLS in transit, masked logs |
| **Restricted (Secrets)** | Resend API keys, Gmail App Passwords, Supabase Service Role keys, OAuth secrets | Stored in `.env.local` / Secret Manager, zero git exposure |

---

## 3. STRIDE Threat Matrix

| Threat Category | Target Component | Threat Scenario | Mitigation |
| :--- | :--- | :--- | :--- |
| **Spoofing** | CRM Auth Gate (`/sahit`) | Attacker spoofs Google OAuth JWT token to gain admin access. | Server-side validation via Google TokenInfo API & email allow-list. |
| **Tampering** | Invoices & Lead Budgets | Attacker tampers with deal values or invoice status via API. | Server-side authorization check & database constraints. |
| **Repudiation** | Client/Lead Deletion | Disgruntled user deletes leads without audit trail. | Immutable audit log in `AccessAuditEntry` and `communication_logs`. |
| **Information Disclosure** | Tokenized Portals | Attacker brute-forces proposal tokens (`portal_token`) to view lead data. | 24-byte cryptographically secure random tokens (192 bits entropy). |
| **Denial of Service** | Email Dispatcher | Malicious actor repeatedly calls `sendRealtimeEmail` to exhaust API quotas. | Server-side rate limiting, honeypot fields, and session checks. |
| **Elevation of Privilege** | Server Functions | Non-admin calls `deleteLead` or `saveMedia` directly via HTTP POST. | Middleware guards with strict role verification. |

---

## 4. Top 15 Ranked Risks

1. **[CRITICAL] Server Function Authorization:** All mutating endpoints (`updateLead`, `deleteLead`, `saveMedia`, `sendRealtimeEmail`) must enforce server-side identity verification.
2. **[HIGH] Inbound Form Spam & Flooding:** Lead form could be targeted by automated spam bots, flooding CRM and exhausting email limits.
3. **[HIGH] Stored XSS in CRM Text Inputs:** User-submitted lead messages, notes, and company names must be properly sanitized before rendering.
4. **[HIGH] Secret Leakage:** Accidental commit of Google App Passwords or Resend API keys in version control.
5. **[HIGH] CSV/Excel Formula Injection:** Exporting leads with names beginning with `=CMD` or `+` could trigger remote command execution in Microsoft Excel.
6. **[MEDIUM] Supabase Row-Level Security:** Anonymous users must not be able to read or query internal notes or communication logs.
7. **[MEDIUM] Missing Security Headers:** Lack of strict Content-Security-Policy, HSTS preload, and X-Frame-Options.
8. **[MEDIUM] Rate Limiting on Authentication & Email:** Inbound dispatch needs throttling to prevent email quota burnout.
9. **[MEDIUM] Clickjacking on CRM:** CRM pages must block framing by external domains (`frame-ancestors 'none'`).
10. **[MEDIUM] Open Redirect Vulnerabilities:** Return URL / OAuth redirect parameters must be strictly allow-listed.
11. **[LOW] Insecure Target Blank Links:** Outbound links lacking `rel="noopener noreferrer"`.
12. **[LOW] Version Disclosure:** Server response headers revealing runtime frameworks.
13. **[LOW] Missing Security Contact:** Lack of `/.well-known/security.txt` for responsible disclosure.
14. **[LOW] India DPDP Act 2023 Consent:** Explicit consent recording on inbound lead forms.
15. **[LOW] Subresource Integrity (SRI):** CDN resources should include cryptographic integrity hashes.
