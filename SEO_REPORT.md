# Lumen & Co — Full Technical SEO & Performance Report

**Date:** November 1, 2026  
**Agency:** Lumen & Co (Creative, AI-Powered Digital Marketing Agency)  
**Locations:** India (Visakhapatnam, AP) & United States (Offshore / Med Spas)  
**Primary Brand Color:** `#EF4D23`  
**Production Domain:** `https://www.lumenandco.com`  
**Repository:** [https://github.com/saviatailors/lumenandco](https://github.com/saviatailors/lumenandco)  
**Technical SEO Audit Score:** **100/100** (114/114 automated test checks passed)

---

## 1. Executive Summary

This report documents the end-to-end technical SEO architecture, structured data implementation, routing hierarchy, Core Web Vitals optimizations, and starter editorial blog system deployed for Lumen & Co.

All pages adhere to:
- **Title Tag Constraint:** ≤ 60 characters with brand suffix `| Lumen & Co`
- **Meta Description Constraint:** ≤ 155 characters (benefit-driven + CTA)
- **Canonical URLs:** Strict lower-case, hyphenated, trailing slash (`trailingSlash: "always"`)
- **OpenGraph & Twitter Cards:** Full 1200×630 social metadata on every route
- **Structured Data:** Google-compliant JSON-LD (`Organization`, `ProfessionalService`, `Service`, `FAQPage`, `BreadcrumbList`, `BlogPosting`)
- **Indexing & Crawl Control:** Automated `robots.txt`, XML `sitemap.xml`, and AI context discovery via `llms.txt`

---

## 2. Complete Routes & Meta Tags Matrix

| # | Route | Page Title (≤60 chars) | Meta Description (≤155 chars) | Primary H1 |
|---|---|---|---|---|
| 1 | `/` | `Lumen & Co \| Creative Digital Marketing Agency in India` | AI-powered creative agency from India. Gen AI ads, reels, SEO, Meta ads and CRO for brands in India and the US. Book a free strategy call. | India's Creative, AI-Powered Digital Marketing Agency |
| 2 | `/services/gen-ai-ads/` | `Gen AI Ad Agency India \| AI Video Ads – Lumen & Co` | Scroll-stopping AI video and image ads made in days, not weeks. Gen AI ad production for D2C brands, clinics and startups. See samples. | Gen AI Ads That Stop the Scroll |
| 3 | `/services/video-editing/` | `Video & Reels Editing Agency India \| Lumen & Co` | Reels, YouTube and ad edits with hooks, captions and motion graphics. Fast turnaround for creators and brands in India and the US. | Video Editing That Keeps People Watching |
| 4 | `/services/creatives/` | `Social Media Creatives Agency India \| Lumen & Co` | On-brand posts, carousels and ad creatives every month. Designed to convert, delivered on schedule. Get a sample pack. | Social Creatives Built to Convert |
| 5 | `/services/performance-ads/` | `Meta & Google Ads Agency India \| Lumen & Co` | ROI-focused Meta and Google ad campaigns with creative testing and clear reporting. Lower your cost per lead. Free ad audit. | Ads That Bring Leads, Not Just Likes |
| 6 | `/services/seo/` | `SEO Services India for Small Business \| Lumen & Co` | Rank higher on Google with technical SEO, local SEO and content that brings customers. Monthly reports, no lock-in. | SEO That Brings Real Customers |
| 7 | `/services/analytics-cro/` | `CRO & Analytics Agency India \| Lumen & Co` | Turn more visitors into leads with GA4 setup, heatmaps, A/B tests and landing page fixes. Get a free CRO checklist. | Get More Leads From the Traffic You Already Have |
| 8 | `/us/` | `Offshore Digital Marketing Agency from India \| Lumen & Co` | US-quality creative and marketing at a smarter cost. Dedicated team, US-hours calls, plans from $600/month. | Your Offshore Creative Marketing Team |
| 9 | `/us/med-spa-marketing/` | `Med Spa Marketing Agency \| More Bookings – Lumen & Co` | Med spa marketing that fills your calendar: AI ads, reels, SEO and Meta ads built for aesthetic clinics. Book a free growth call. | Med Spa Marketing That Fills Your Calendar |
| 10 | `/us/med-spa-seo/` | `Med Spa SEO Services \| Rank on Google Maps – Lumen & Co` | Local SEO for med spas: Google Business Profile, treatment pages and reviews that bring bookings. Free SEO audit. | Med Spa SEO That Gets You Found Locally |
| 11 | `/us/med-spa-ads/` | `Med Spa Facebook & Instagram Ads \| Lumen & Co` | Meta ads for Botox, fillers and laser treatments with compliant creatives and lead follow-up. Get more consults. | Meta Ads That Book More Consultations |
| 12 | `/locations/visakhapatnam/` | `Digital Marketing Agency in Visakhapatnam \| Lumen & Co` | Vizag's creative digital marketing agency — reels, ads, SEO and websites for local brands. Talk to us today. | Digital Marketing Agency in Visakhapatnam |
| 13 | `/pricing/` | `Digital Marketing Packages & Pricing \| Lumen & Co` | Transparent monthly plans for India and US clients. Creatives, video, ads and SEO — custom packages available. | Growth Packages Built for Speed and ROI |
| 14 | `/work/` | `Case Studies & Client Results \| Lumen & Co` | Real case studies: 4.4x blended ROAS, 51% lower demo costs and 164% organic growth for DTC, SaaS and clinics in India and the US. | Proof in Performance |
| 15 | `/blog/` | `Digital Marketing & AI Growth Blog \| Lumen & Co` | Actionable insights on Gen AI ads, video editing, SEO, and marketing costs for India and US businesses. Practical guides written by practitioners. | The Growth & Creative Playbook |
| 16 | `/blog/digital-marketing-agency-cost-in-india-2026/` | `Digital Marketing Cost in India (2026 Guide) \| Lumen & Co` | How much does a digital marketing agency cost in India? Comprehensive 2026 pricing guide covering retainers, SEO, Meta ads, video editing, and ROI. | Digital Marketing Agency Cost in India (2026 Price Guide) |
| 17 | `/blog/med-spa-marketing-15-ideas-that-book-more-consultations/` | `15 Med Spa Marketing Ideas That Book Consults \| Lumen & Co` | 15 proven med spa marketing ideas to generate high-ticket consultations for Botox, dermal fillers, body contouring, and laser treatments. | Med Spa Marketing: 15 Ideas That Book More Consultations |
| 18 | `/about/` | `About Lumen & Co \| Creative Marketing Agency India` | Meet the team and founder behind Lumen & Co. An AI-first creative and growth marketing agency based in Visakhapatnam, India. | We Build Brands That Stop the Scroll |
| 19 | `/contact/` | `Book a Free Strategy Call \| Lumen & Co` | Tell us about your business and we'll plan your growth on a free call. India and US time zones. | Book a Free Strategy Call |

---

## 3. Structured Data (JSON-LD) Schemas

Every route injects Google-compliant schema graphs:

1. **Organization & ProfessionalService Schema (`#org`):**
   - `@id`: `https://www.lumenandco.com/#org`
   - Name: `Lumen & Co`
   - Founder: `Sahit Sai Pothala`
   - Email: `sahitsai6@gmail.com`
   - Telephone: `+91-7842410691`
   - Address: `Visakhapatnam, Andhra Pradesh, IN`
   - Areas Served: `IN`, `US`
   - Price Range: `$$`
   - KnowAbout: Generative AI advertising, Video editing, Social media marketing, Meta ads, SEO, CRO.

2. **Service Schema:**
   - Provider references `#org`.
   - Injected across all 6 core services and 3 US Med Spa specialization pages.

3. **FAQPage Schema:**
   - Injected on every service page with matching visible accordion FAQs.

4. **BreadcrumbList Schema:**
   - Hierarchical trail on all nested routes (`Home > Services > ...` and `Home > US > ...`).

5. **BlogPosting Schema:**
   - Injected on all `/blog/:slug/` routes with author attribution, datePublished, headline, and word count.

---

## 4. Performance & Core Web Vitals Optimizations

1. **FastStart Live Background Video (`/videos/hero-bg.mp4`):**
   - Transcoded from original 33 MB down to **5.1 MB** (84% reduction).
   - Flagged with `movflags=+faststart` for zero-buffering playback on byte 0.
   - Dual stream: H.264 video + silent AAC audio track to prevent Chromium's aggressive `AbortError: video-only background media was paused to save power` policy.
   - Fallback VP9 WebM stream (`/videos/hero-bg.webm`, 2.9 MB).
   - Zero-CLS first-frame poster (`/videos/hero-bg-poster.jpg`, 410 KB).

2. **Autoplay Resilience & Accessibility:**
   - Explicit DOM property bindings: `video.muted = true`, `video.defaultMuted = true`, `video.playsInline = true`.
   - Interaction kickstart listeners (`pointerdown`, `touchstart`, `scroll`, `mousemove`) for low-power mobile mode.
   - Respects `prefers-reduced-motion: reduce`.

3. **Server-Side Rendered Crawlability:**
   - All page text, headings (H1, H2, H3), lists, and schema tags render in static SSR HTML, guaranteeing complete crawlability by Googlebot and LLM crawlers without requiring JavaScript execution.

---

## 5. Automated Audit Results

The custom regression suite (`scripts/seo-audit.mjs`) verified all 19 routes against the running server:

```text
===========================================
TOTAL AUDIT CHECKS: 114
PASSED: 114
LIGHTHOUSE-EQUIVALENT SEO SCORE: 100/100
===========================================
```

---

## 6. Action Items & Verification Checklist for Launch

- [ ] **Google Search Console Verification:** Insert your verification code in `src/routes/__root.tsx` or via DNS TXT record.
- [ ] **Google Analytics 4 (GA4):** Add your `VITE_GA_MEASUREMENT_ID` (format: `G-XXXXXXXXXX`) to `.env` or deployment variables.
- [ ] **Microsoft Clarity:** Add `VITE_CLARITY_ID` to `.env` for heatmap and user recording session analysis.
- [ ] **Social Media Links:** Replace placeholder social handles in `src/lib/seo.ts` with your official agency profiles:
  - Instagram: `https://instagram.com/lumenandco`
  - LinkedIn: `https://linkedin.com/company/lumenandco`
  - X / Twitter: `https://x.com/lumenandco`
- [ ] **OG Images:** Custom branded 1200×630 share graphics can be uploaded to `public/og-image.jpg` and `public/og-medspa.jpg`.
