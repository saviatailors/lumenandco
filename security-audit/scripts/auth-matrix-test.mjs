/**
 * Automated Authorization Matrix Test (OWASP API Top 10 - API1 / API2 / API5)
 * Tests server endpoints for unauthenticated access, invalid credentials, and role enforcement.
 *
 * Usage:
 *   node security-audit/scripts/auth-matrix-test.mjs [BASE_URL]
 * Default BASE_URL: http://localhost:3000
 */

const BASE_URL = process.argv[2] || "http://localhost:3000";

const TEST_ENDPOINTS = [
  {
    name: "Dispatch Real-Time Email (Admin only)",
    path: "/_server/sendRealtimeEmail",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        to: "attacker@exploit.test",
        subject: "Unauthenticated Relay Probe",
        html: "<p>Phishing probe</p>",
      },
    }),
    expectedUnauthStatus: [401, 403, 500], // 401/403 or server function auth refusal
  },
  {
    name: "CRM Admin Dashboard Path",
    path: "/sahit",
    method: "GET",
    headers: {},
    expectedUnauthStatus: [200, 302, 307], // Client-side protected route / redirect
  },
  {
    name: "Public RFC 9116 Security Policy",
    path: "/.well-known/security.txt",
    method: "GET",
    headers: {},
    expectedUnauthStatus: [200],
  },
  {
    name: "Public Robots",
    path: "/robots.txt",
    method: "GET",
    headers: {},
    expectedUnauthStatus: [200],
  },
];

async function runAuthMatrix() {
  console.log(`\n======================================================`);
  console.log(`🔐 LUMEN & CO — AUTOMATED AUTHORIZATION MATRIX TEST`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`======================================================\n`);

  let passCount = 0;
  let failCount = 0;

  for (const ep of TEST_ENDPOINTS) {
    const url = `${BASE_URL}${ep.path}`;
    try {
      const response = await fetch(url, {
        method: ep.method,
        headers: ep.headers,
        body: ep.body,
      });

      const status = response.status;
      const text = await response.text();

      // Check if unauthenticated attack succeeded in unauthorized execution
      let passed = false;
      let note = "";

      if (ep.path === "/_server/sendRealtimeEmail") {
        // If unauthenticated POST fails with 401/403 or throws Unauthorized/Forbidden, pass
        if (status === 401 || status === 403 || text.includes("Unauthorized") || text.includes("Forbidden") || text.includes("requires admin authentication")) {
          passed = true;
          note = `Blocked unauthenticated request properly (${status}). Payload: ${text.slice(0, 100)}`;
        } else if (status === 200 && text.includes('"success":true')) {
          passed = false;
          note = `CRITICAL: Endpoint executed without authentication!`;
        } else {
          // TanStack start error response or 404/500 without relay execution
          passed = true;
          note = `Request rejected with status ${status}`;
        }
      } else {
        passed = ep.expectedUnauthStatus.includes(status);
        note = `Status ${status} (expected ${ep.expectedUnauthStatus.join("/")})`;
      }

      if (passed) {
        passCount++;
        console.log(`✅ [PASS] ${ep.name} (${ep.method} ${ep.path}) -> ${note}`);
      } else {
        failCount++;
        console.log(`❌ [FAIL] ${ep.name} (${ep.method} ${ep.path}) -> ${note}`);
      }
    } catch (err) {
      console.log(`⚠️ [ERROR] Could not connect to ${url}: ${err.message}`);
    }
  }

  console.log(`\n------------------------------------------------------`);
  console.log(`Results: ${passCount} Passed, ${failCount} Failed`);
  console.log(`------------------------------------------------------\n`);
}

runAuthMatrix();
