# Lumen & Co — Shaping Agencies of Tomorrow

> **India's Creative, AI-Powered Digital Marketing Agency**  
> Serving fast-growing brands in India and the United States (Specialized US Med Spa & Aesthetics growth).  
> **Brand Color:** `#EF4D23` • **Website:** [https://www.lumenandco.com](https://www.lumenandco.com)

---

## ⚡ Overview

**Lumen & Co** is an AI-first performance and creative marketing agency headquartered in Visakhapatnam, India. We combine cutting-edge generative AI ad production, high-retention video editing, Meta & Google performance advertising, technical SEO, and conversion rate optimization (CRO) into a unified growth engine.

This repository powers the full production website, 19 SEO-optimized landing pages, technical schema architecture, client portal, and automated CRM tracking pipeline.

---

## 🚀 Key Capabilities & Services

### Core Growth Services
1. **Gen AI Ads (`/services/gen-ai-ads/`):** Scroll-stopping AI-generated video and image ads produced in days, not weeks.
2. **Video & Reels Editing (`/services/video-editing/`):** High-retention short-form video, motion graphics, and platform-native cuts built for watch time and conversions.
3. **Social Creatives (`/services/creatives/`):** High-velocity on-brand design systems, carousels, and social assets.
4. **Performance Ads (`/services/performance-ads/`):** Full-funnel Meta & Google Ads management with rapid creative testing.
5. **Technical & Local SEO (`/services/seo/`):** Revenue-driven SEO, topical authority clusters, and local search visibility.
6. **Analytics & CRO (`/services/analytics-cro/`):** GA4 telemetry, heatmaps, and funnel conversion optimization.

### Specialized US Growth Hub
- **US Offshore Hub (`/us/`):** US-quality creative and growth team operating from India with overlapping US business hours.
- **Med Spa Marketing (`/us/med-spa-marketing/`):** Full-funnel customer acquisition for aesthetic clinics and med spas.
- **Med Spa SEO (`/us/med-spa-seo/`):** Google Maps 3-pack ranking and local treatment search dominance.
- **Med Spa Ads (`/us/med-spa-ads/`):** Compliant, high-converting Meta ads for Botox, dermal fillers, and laser treatments.

### Regional Hub
- **Visakhapatnam Hub (`/locations/visakhapatnam/`):** Premier digital marketing agency in Vizag, Andhra Pradesh.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev/) + [Nitro](https://nitro.unjs.io/) (High-performance SSR)
- **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism Stage UI
- **Routing:** TanStack Router with strict trailing-slash canonical URLs (`trailingSlash: "always"`)
- **Backend & Database:** Supabase (Auth, Lead Ingestion, Pipeline Tracking)
- **Live Background Video Engine:** Custom [`LiveBackgroundVideo`](src/app/components/LiveBackgroundVideo.tsx) with FastStart 5.1 MB H.264/WebM dual streams, zero-CLS posters, and Chromium battery-saver resilience.
- **SEO & Schema Suite:** Comprehensive JSON-LD (`Organization`, `ProfessionalService`, `Service`, `FAQPage`, `BreadcrumbList`, `BlogPosting`) with 100/100 audit scores. See [SEO_REPORT.md](./SEO_REPORT.md).

---

## 🏃 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Technical SEO Audit
```bash
node scripts/seo-audit.mjs
```

---

## 📄 License & Ownership
Copyright © 2026 **Lumen & Co**. All rights reserved.  
Founder: **Sahit Sai Pothala** (`sahitsai6@gmail.com`)
