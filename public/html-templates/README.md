# Lumen & Co - Custom HTML Document Templates

Place all your HTML template files (`.html`) in this folder: `html-templates/`

### 💡 How It Works
When you place your HTML files here (e.g. `service-contract.html`, `invoice.html`, `sow.html`, `nda-deed.html`), the system will automatically:
1. Parse and replace all your placeholder tags with real client data dynamically.
2. Render live HTML previews in the Client Dashboard & Document Vault.
3. Generate pixel-perfect downloadable `.pdf` files when clients click **Download**.

---

### 🏷️ Supported Placeholder Tags
You can use any of the following placeholders inside your HTML files:

| Placeholder Tag | Description | Example Replacement |
| :--- | :--- | :--- |
| `{{CLIENT_NAME}}` | Full name of the client representative | `Mark Davis` |
| `{{COMPANY_NAME}}` | Company / Brand name | `Northbeam E-Commerce` |
| `{{CLIENT_EMAIL}}` | Client email address | `mark@northbeam.io` |
| `{{CLIENT_ADDRESS}}` | Client registered business address | `101 Market St, SF, CA` |
| `{{CONTRACT_ID}}` | Unique agreement / contract ID | `DOC-101-MSA` |
| `{{DOCUMENT_DATE}}` | Date of document creation / sign-off | `2026-09-25` |
| `{{EFFECTIVE_DATE}}` | Campaign / Contract start date | `2026-10-01` |
| `{{RETAINER_FEE}}` | Monthly agency retainer fee | `₹2,50,000 / mo` |
| `{{TOTAL_AMOUNT}}` | Total contract value | `₹2,50,000` |
| `{{SCOPE_SUMMARY}}` | Summary of deliverables & ad channels | `Meta Ads, Google Shopping & UGC Reels` |
| `{{PAYMENT_TERMS}}` | Payment schedule & SLA terms | `Net 15 Days from invoice` |
| `{{GOVERNING_LAW}}` | Jurisdiction & legal governance | `DPDP Act 2023 & High Court of Telangana` |
| `{{AGENCY_SIGNATORY}}` | Agency signing authority | `Sahit Sai (Lumen & Co)` |
| `{{CLIENT_SIGNATORY}}` | Client signing authority | `Mark Davis (Northbeam)` |
| `{{INVOICE_NUMBER}}` | Tax invoice serial number | `INV-2026-101` |
| `{{DUE_DATE}}` | Invoice due date | `2026-10-15` |
| `{{STATUS}}` | Document / Payment status | `Signed` / `Paid` |

---

### 📥 Example HTML Files to Drop Here:
- `service_contract.html`
- `tax_invoice.html`
- `sow_retainer.html`
- `dpdp_legal_deed.html`
- `monthly_audit_report.html`

Once you place your HTML files here, tell me and I will instantly connect and wire them up with perfect layout alignment and PDF generation!
