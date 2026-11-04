# INCIDENT RESPONSE PLAN (IRP) — LUMEN & CO

**Compliance Baseline:** CERT-In Cyber Incident Reporting (6-Hour Mandate) & India DPDP Act 2023  
**Document Owner:** Sahit Sai (Founder & Security Lead)  
**Emergency Contact:** `sahitsai6@gmail.com` | `security@lumenandco.in`  

---

## 1. Incident Classification

| Severity Level | Definition | Examples | Response Target |
| :--- | :--- | :--- | :--- |
| **P1 - Critical** | Direct breach of client PII, unauthorized admin access, or active database exfiltration. | Super admin account compromise, database leak, ransomware. | Immediate (< 15 mins) |
| **P2 - High** | Service interruption of core CRM, unauthorized email dispatch, or active exploitation attempt. | Brute force on OAuth token, API rate-limit exhaustion, persistent XSS. | < 1 hour |
| **P3 - Medium** | Security misconfiguration with no verified exploitation. | Missing security header, dependency vulnerability with available patch. | < 24 hours |
| **P4 - Low** | Minor cosmetic or informational security finding. | Informational header disclosure, robots.txt tweak. | < 7 days |

---

## 2. Six-Phase Incident Response Lifecycle

### Phase 1: Detection & Identification
- Monitor real-time logs in Google Cloud / Supabase / Vercel.
- Receive alerts on unusual 403 authorization failures, abnormal lead export volume, or unexpected email dispatch surges.
- Triage incident severity within 15 minutes.

### Phase 2: Containment
- **Immediate Session Revocation:** Deauthorize the compromised user account via `AccessToggleModal` or Supabase Auth console.
- **Credential Rotation:** Rotate compromised API keys (Resend, Supabase Service Role, Google OAuth Secret).
- **Network / IP Block:** Block offending IP addresses via Cloudflare / edge firewall.

### Phase 3: Eradication
- Locate the root cause (e.g. exploited input field, vulnerable package, misconfigured RLS policy).
- Apply surgical patch to code or database schema.
- Re-run security test suite and static analysis (`npx tsc --noEmit && npm run build`).

### Phase 4: Recovery
- Validate data integrity in Supabase PostgreSQL backups.
- Restore affected records from point-in-time recovery if needed.
- Monitor traffic closely for re-attack attempts.

### Phase 5: Notification & Statutory Compliance
1. **CERT-In Reporting (Mandatory under Cyber Security Directions 2022):**
   - Report cybersecurity incidents to `incident@cert-in.org.in` within **6 hours** of notice.
   - Include: Nature of incident, time of occurrence, affected systems, remediation taken.
2. **DPDP Act 2023 Notification:**
   - In the event of a personal data breach affecting Indian data principals, notify the **Data Protection Board of India (DPBI)** and affected users without undue delay.

### Phase 6: Post-Mortem & Lessons Learned
- Conduct root-cause analysis (RCA) within 48 hours.
- Update `THREAT_MODEL.md` and add automated regression tests to prevent recurrence.
