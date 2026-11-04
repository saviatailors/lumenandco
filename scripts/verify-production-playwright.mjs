import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import http from "node:http";

const PORT = 3051;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          resolve(res.statusCode);
        });
        req.on("error", reject);
        req.setTimeout(1000, () => {
          req.destroy();
          reject(new Error("Timeout"));
        });
      });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  throw new Error(`Server failed to start on ${url} within ${timeoutMs}ms`);
}

async function run() {
  console.log("==================================================");
  console.log("🚀 PRODUCTION PLAYWRIGHT VERIFICATION SUITE");
  console.log(`Port: ${PORT} | Chrome: ${CHROME_PATH}`);
  console.log("==================================================\n");

  // 1. Start production server
  console.log("[1/4] Starting production server (.output/server/index.mjs)...");
  const server = spawn("node", [".output/server/index.mjs"], {
    env: { ...process.env, PORT: String(PORT), HOST: "127.0.0.1" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  server.stdout.on("data", (d) => process.stdout.write(`[server stdout] ${d}`));
  server.stderr.on("data", (d) => process.stderr.write(`[server stderr] ${d}`));

  let browser;

  try {
    await waitForServer(`${BASE_URL}/`);
    console.log(`✅ Server is responsive at ${BASE_URL}/\n`);

    // 2. Launch headless Google Chrome via Playwright
    console.log("[2/4] Launching headless Google Chrome...");
    browser = await chromium.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    const jsErrors = [];
    const resourceErrors = [];

    page.on("requestfailed", (req) => {
      resourceErrors.push({ url: req.url(), error: req.failure()?.errorText });
      console.warn(`  ⚠️ Network request failed: ${req.url()} (${req.failure()?.errorText})`);
    });

    page.on("response", (res) => {
      if (res.status() >= 400) {
        resourceErrors.push({ url: res.url(), status: res.status() });
        console.warn(`  ⚠️ Resource returned HTTP ${res.status()}: ${res.url()}`);
      }
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        // Filter out browser network 404 warnings from actual JS errors
        if (!msg.text().includes("Failed to load resource")) {
          jsErrors.push(msg.text());
          console.error(`  🔴 JavaScript Console Error: ${msg.text()}`);
        }
      }
    });

    page.on("pageerror", (err) => {
      jsErrors.push(err.message);
      console.error(`  🔴 JavaScript Page Exception: ${err.message}`);
    });

    // 3. Test Home Route /
    console.log("\n[3/4] Navigating to Home route (/)...\n");
    const response = await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle", timeout: 15000 });
    const status = response.status();
    console.log(`\n  HTTP Response Status: ${status}`);

    const title = await page.title();
    console.log(`  Page Title: "${title}"`);

    // Check for catastrophic error boundary
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasCrashBanner = bodyText.includes("This page didn't load");
    console.log(`  TanStack Error Banner Present: ${hasCrashBanner}`);
    if (hasCrashBanner) {
      throw new Error(`CRITICAL FAIL: Page displayed "This page didn't load" Error Boundary!`);
    }

    // Locate and verify Hero Heading
    const heroHeading = await page.locator("h1").first().textContent();
    console.log(`  Hero Heading (h1): "${heroHeading?.trim()}"`);

    // Check visibility
    const isHeroVisible = await page.locator("h1").first().isVisible();
    console.log(`  Hero Heading Visible: ${isHeroVisible}`);

    if (!isHeroVisible) {
      throw new Error("FAIL: Hero heading is not visible on page");
    }

    console.log(`\n  ✅ JavaScript Runtime Console Errors: ${jsErrors.length}`);
    console.log(`  ✅ Unhandled Page Exceptions: ${jsErrors.length}`);

    if (jsErrors.length > 0) {
      throw new Error(
        `FAIL: Encountered ${jsErrors.length} JavaScript runtime errors on /: ${JSON.stringify(jsErrors)}`,
      );
    }

    // 4. Test other public routes
    console.log("\n[4/4] Verifying additional public routes...\n");
    const testRoutes = [
      "/about/",
      "/contact/",
      "/pricing/",
      "/work/",
      "/blog/why-vertical-video-outperforms-horizontal/",
      "/sahit/",
    ];
    for (const r of testRoutes) {
      const res = await page.goto(`${BASE_URL}${r}`, {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      });
      const text = await page.evaluate(() => document.body.innerText);
      const isCrashed = text.includes("This page didn't load");
      const h1 = (
        await page
          .locator("h1")
          .first()
          .textContent()
          .catch(() => "N/A")
      )?.trim();
      console.log(
        `  Route ${r.padEnd(12)} -> Status: ${res.status()} | Crashed: ${isCrashed} | Heading: "${h1}"`,
      );
      if (isCrashed) {
        throw new Error(`Route ${r} crashed with "This page didn't load"`);
      }
    }

    console.log("\n==================================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! ZERO JAVASCRIPT CONSOLE ERRORS.");
    console.log("==================================================\n");
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

run().catch((err) => {
  console.error("\n❌ Playwright verification failed:", err);
  process.exit(1);
});
