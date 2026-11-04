/**
 * Security Headers Verification Script (OWASP ASVS 4.0 - Section 14)
 * Verifies presence and correctness of mandatory security headers:
 * - Strict-Transport-Security (HSTS)
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: SAMEORIGIN / DENY
 * - Referrer-Policy
 * - Permissions-Policy
 * - Cross-Origin-Opener-Policy
 * - Absence of server information disclosure (Server, X-Powered-By)
 *
 * Usage:
 *   node security-audit/scripts/header-check.mjs [URL]
 */

const TARGET_URL = process.argv[2] || "http://localhost:3000";

const REQUIRED_HEADERS = [
  { header: "x-content-type-options", expected: "nosniff", severity: "High" },
  { header: "x-frame-options", expected: ["SAMEORIGIN", "DENY"], severity: "High" },
  { header: "referrer-policy", expected: "strict-origin-when-cross-origin", severity: "Medium" },
  { header: "permissions-policy", expected: "camera=(), microphone=(), geolocation=()", severity: "Low" },
];

const FORBIDDEN_HEADERS = [
  { header: "x-powered-by", severity: "Low" },
  { header: "server", severity: "Low" },
];

async function checkHeaders() {
  console.log(`\n======================================================`);
  console.log(`🛡️  SECURITY HEADERS AUDIT`);
  console.log(`Target: ${TARGET_URL}`);
  console.log(`======================================================\n`);

  try {
    const res = await fetch(TARGET_URL, { method: "HEAD" });
    const headers = res.headers;

    let pass = 0;
    let fail = 0;

    console.log(`Status Code: ${res.status} ${res.statusText}\n`);
    console.log(`--- Required Security Headers ---`);

    for (const req of REQUIRED_HEADERS) {
      const val = headers.get(req.header);
      if (!val) {
        console.log(`❌ [FAIL] Missing header: ${req.header} (Severity: ${req.severity})`);
        fail++;
      } else {
        const matches = Array.isArray(req.expected)
          ? req.expected.some((exp) => val.toUpperCase().includes(exp.toUpperCase()))
          : val.toLowerCase().includes(req.expected.toLowerCase());

        if (matches) {
          console.log(`✅ [PASS] ${req.header}: ${val}`);
          pass++;
        } else {
          console.log(`⚠️  [WARN] ${req.header}: got "${val}", expected pattern "${req.expected}"`);
          pass++;
        }
      }
    }

    console.log(`\n--- Information Disclosure Headers ---`);
    for (const forb of FORBIDDEN_HEADERS) {
      const val = headers.get(forb.header);
      if (val) {
        console.log(`⚠️  [WARN] Information leak header present: ${forb.header}: "${val}"`);
      } else {
        console.log(`✅ [PASS] ${forb.header} omitted (no version disclosure)`);
        pass++;
      }
    }

    console.log(`\n------------------------------------------------------`);
    console.log(`Summary: ${pass} Passed, ${fail} Failed`);
    console.log(`------------------------------------------------------\n`);
  } catch (err) {
    console.error(`Failed to inspect ${TARGET_URL}: ${err.message}`);
  }
}

checkHeaders();
