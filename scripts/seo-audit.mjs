import http from "node:http";

const ROUTES = [
  { path: "/", titleMax: 60, descMax: 155, expectedH1: "India's Creative, AI-Powered Digital Marketing Agency" },
  { path: "/services/gen-ai-ads/", titleMax: 60, descMax: 155, expectedH1: "Gen AI Ads That Stop the Scroll" },
  { path: "/services/video-editing/", titleMax: 60, descMax: 155, expectedH1: "Video Editing That Keeps People Watching" },
  { path: "/services/creatives/", titleMax: 60, descMax: 155, expectedH1: "Social Creatives Built to Convert" },
  { path: "/services/performance-ads/", titleMax: 60, descMax: 155, expectedH1: "Ads That Bring Leads, Not Just Likes" },
  { path: "/services/seo/", titleMax: 60, descMax: 155, expectedH1: "SEO That Brings Real Customers" },
  { path: "/services/analytics-cro/", titleMax: 60, descMax: 155, expectedH1: "Get More Leads From the Traffic You Already Have" },
  { path: "/us/", titleMax: 60, descMax: 155, expectedH1: "Your Offshore Creative Marketing Team" },
  { path: "/us/med-spa-marketing/", titleMax: 60, descMax: 155, expectedH1: "Med Spa Marketing That Fills Your Calendar" },
  { path: "/us/med-spa-seo/", titleMax: 60, descMax: 155, expectedH1: "Med Spa SEO That Gets You Found Locally" },
  { path: "/us/med-spa-ads/", titleMax: 60, descMax: 155, expectedH1: "Meta Ads That Book More Consultations" },
  { path: "/locations/visakhapatnam/", titleMax: 60, descMax: 155, expectedH1: "Digital Marketing Agency in Visakhapatnam" },
  { path: "/pricing/", titleMax: 60, descMax: 155, expectedH1: "Simple Plans. Real Results." },
  { path: "/work/", titleMax: 60, descMax: 155 },
  { path: "/blog/", titleMax: 60, descMax: 155 },
  { path: "/blog/digital-marketing-agency-cost-in-india-2026/", titleMax: 60, descMax: 155 },
  { path: "/blog/med-spa-marketing-15-ideas-that-book-more-consultations/", titleMax: 60, descMax: 155 },
  { path: "/about/", titleMax: 60, descMax: 155, expectedH1: "A Growth Team That Lives in Your Numbers" },
  { path: "/contact/", titleMax: 60, descMax: 155, expectedH1: "Let's Talk Growth" }
];

async function fetchRoute(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, html: data }));
      res.on("error", reject);
    });
  });
}

async function runAudit() {
  console.log("=== LUMEN & CO TECHNICAL SEO AUDIT ===");
  let passedCount = 0;
  let totalChecks = 0;

  for (const r of ROUTES) {
    const { status, html } = await fetchRoute(r.path);

    // 1. Status Code
    totalChecks++;
    const is200 = status === 200;
    if (is200) passedCount++;

    // 2. Title
    totalChecks++;
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(/&amp;/g, "&") : "";
    const titleOk = title.length > 0 && title.length <= r.titleMax;
    if (titleOk) passedCount++;

    // 3. Meta Description
    totalChecks++;
    const descMatch = html.match(/<meta name="description" content="(.*?)"/);
    const desc = descMatch ? descMatch[1] : "";
    const descOk = desc.length > 0 && desc.length <= r.descMax;
    if (descOk) passedCount++;

    // 4. Canonical Tag
    totalChecks++;
    const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)"/);
    const canonical = canonicalMatch ? canonicalMatch[1] : "";
    const canonicalOk = canonical === `https://www.lumenandco.com${r.path}`;
    if (canonicalOk) passedCount++;

    // 5. JSON-LD Schema
    totalChecks++;
    const hasJsonLd = html.includes('type="application/ld+json"');
    if (hasJsonLd) passedCount++;

    // 6. Viewport & Lang
    totalChecks++;
    const hasViewport = html.includes('name="viewport"');
    const hasLang = html.includes('<html lang="en">');
    if (hasViewport && hasLang) passedCount++;

    console.log(`\nROUTE: ${r.path}`);
    console.log(`  [${is200 ? "PASS" : "FAIL"}] HTTP Status: ${status}`);
    console.log(`  [${titleOk ? "PASS" : "FAIL"}] Title (${title.length} chars): "${title}"`);
    console.log(`  [${descOk ? "PASS" : "FAIL"}] Meta Desc (${desc.length} chars): "${desc}"`);
    console.log(`  [${canonicalOk ? "PASS" : "FAIL"}] Canonical: "${canonical}"`);
    console.log(`  [${hasJsonLd ? "PASS" : "FAIL"}] JSON-LD Schema Present`);
    console.log(`  [${hasViewport && hasLang ? "PASS" : "FAIL"}] Mobile Viewport & Lang="en"`);
  }

  const score = Math.round((passedCount / totalChecks) * 100);
  console.log(`\n===========================================`);
  console.log(`TOTAL AUDIT CHECKS: ${totalChecks}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`LIGHTHOUSE-EQUIVALENT SEO SCORE: ${score}/100`);
  console.log(`===========================================`);
}

runAudit().catch(console.error);
