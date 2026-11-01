import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/performance-ads")({
  head: () =>
    buildSeoMeta({
      title: "Meta & Google Ads Agency India | Lumen & Co",
      description:
        "ROI-focused Meta and Google ad campaigns with creative testing and clear reporting. Lower your cost per lead. Free ad audit.",
      canonicalPath: "/services/performance-ads/",
      keywords: [
        "Meta ads agency India",
        "performance marketing agency India",
        "Google ads agency India",
        "paid social agency India",
        "PPC agency India",
        "ROAS optimization agency",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Services", item: "/#services" },
        { name: "Performance Ads", item: "/services/performance-ads/" },
      ],
      serviceSchema: {
        serviceType: "Performance Marketing & Paid Advertising",
        name: "Performance Ads (Meta & Google)",
        description:
          "Paid search and social campaigns rebuilt around profit, with weekly testing and budget guardrails.",
      },
      faqs: [
        {
          question: "How do you approach Meta and Google advertising differently?",
          answer:
            "Most agencies set up campaigns and walk away, billing you a percentage of spend. We build closed-loop tracking wired to CRM revenue, run weekly creative hook tests, and enforce strict contribution margin guardrails so your spend scales profitably.",
        },
        {
          question: "What minimum ad spend do you recommend?",
          answer:
            "For Indian brands, we typically recommend a minimum ad budget of ₹50,000 to ₹1,00,000/month to generate sufficient statistical data. For US clients, we recommend at least $2,000 to $5,000/month.",
        },
        {
          question: "How do you handle iOS tracking loss and privacy changes?",
          answer:
            "We install server-side tracking (Meta Conversions API via Stape.io or Cloudflare) combined with first-party UTM attribution in GA4 to ensure 95%+ event match quality, bypassing browser cookie restrictions.",
        },
        {
          question: "Do you lock clients into long-term contracts?",
          answer:
            "No. We believe in earning our seat every month. After an initial 90-day foundational sprint, our agreements are month-to-month.",
        },
      ],
    }),
  component: PerformanceAdsPage,
});

function PerformanceAdsPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • Performance Media"
      h1="Ads That Bring Leads, Not Just Likes"
      heroSubtitle="As a data-driven Meta & Google ads agency in India, Lumen & Co manages paid search and social campaigns built around cash flow, profit margins, and verifiable revenue rather than vanity impressions."
      targetMarket="India"
      metrics={[
        { value: "$48M", label: "Ad Spend Managed", sub: "across Meta, Google and TikTok" },
        { value: "-38%", label: "Average Cost Per Acquisition", sub: "achieved in first 90 days" },
        { value: "4.4x", label: "Peak Blended ROAS", sub: "for scaled D2C partners" },
        { value: "100%", label: "Server-Side CAPI Tracking", sub: "ensuring accurate attribution" },
      ]}
      problemTitle="Wasting Budget on Clicks that Never Buy"
      problemDescription="Many brands pour thousands of dollars into Meta and Google ads only to see rising costs per acquisition and unqualified leads. The problem is almost never the ad platform algorithm; it's outdated account structures, broken server-side attribution, and weak creative testing loops."
      problemPoints={[
        "Ad accounts fragmented into 50 micro-audiences that starve algorithms of conversion data",
        "Pixel tracking loss from iOS updates causing under-reported sales and erratic bidding",
        "Testing ad copy without testing visual hooks, resulting in rapid audience fatigue",
        "Agencies that send monthly PDF decks full of impressions instead of revenue generated",
      ]}
      solutionTitle="Full-Funnel Campaign Architecture Built for Profit"
      solutionDescription="We combine scientific media buying with rapid creative velocity and clean server-side attribution."
      solutionPoints={[
        {
          title: "Simplified Account Structure & CAPI",
          description:
            "Broad targeting structures paired with Meta Conversions API (CAPI) to feed algorithmic machine learning clean, high-intent purchase signals.",
        },
        {
          title: "High-Intent Google Search & PMax",
          description:
            "Laser-focused exact-match search campaigns and optimized Performance Max assets capturing prospects actively searching to buy today.",
        },
        {
          title: "Contribution Margin Guardrails",
          description:
            "Every campaign has hard target CAC and ROAS limits. We scale budgets when margin targets are hit and trim waste instantly when they aren't.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Technical Tracking & Pixel Audit",
          description: "Audit GA4, Conversions API (CAPI), UTM parameters, and historical cost-per-acquisition.",
          timeline: "Days 1–5",
        },
        {
          number: "Step 02",
          title: "Full Campaign Restructure",
          description: "Consolidate fragmented campaigns, build high-intent search clusters, and install guardrails.",
          timeline: "Days 6–10",
        },
        {
          number: "Step 03",
          title: "Creative Hook Injection",
          description: "Deploy 8 to 12 new video reels and static ads built around your core audience objections.",
          timeline: "Days 11–15",
        },
        {
          number: "Step 04",
          title: "Weekly Scaling Loops",
          description: "Reallocate budget into winning ad sets, trim fatigued creative, and scale top performers.",
          timeline: "Weekly",
        },
      ]}
      deliverables={[
        "Complete setup and management of Meta (Facebook/Instagram) & Google Ads",
        "Server-side Meta Conversions API (CAPI) installation & event verification",
        "Weekly creative testing pipeline integrated with our in-house design studio",
        "24/7 Live performance dashboard reporting on real revenue and CAC",
        "Direct weekly Zoom strategy calls with your dedicated senior media buyer",
      ]}
      pricingHint={{
        badge: "Performance Media Retainers",
        headline: "Predictable Management with Aligned Incentives",
        details:
          "US plans start from $600/month. Custom Indian packages structured around ad spend tiers. Month-to-month contracts after the initial 90-day sprint.",
      }}
      faqs={[
        {
          question: "How do you approach Meta and Google advertising differently?",
          answer:
            "Most agencies set up campaigns and walk away, billing you a percentage of spend. We build closed-loop tracking wired to CRM revenue, run weekly creative hook tests, and enforce strict contribution margin guardrails so your spend scales profitably.",
        },
        {
          question: "What minimum ad spend do you recommend?",
          answer:
            "For Indian brands, we typically recommend a minimum ad budget of ₹50,000 to ₹1,00,000/month to generate sufficient statistical data. For US clients, we recommend at least $2,000 to $5,000/month.",
        },
        {
          question: "How do you handle iOS tracking loss and privacy changes?",
          answer:
            "We install server-side tracking (Meta Conversions API via Stape.io or Cloudflare) combined with first-party UTM attribution in GA4 to ensure 95%+ event match quality, bypassing browser cookie restrictions.",
        },
        {
          question: "Do you lock clients into long-term contracts?",
          answer:
            "No. We believe in earning our seat every month. After an initial 90-day foundational sprint, our agreements are month-to-month.",
        },
      ]}
      relatedLinks={[
        { label: "Check Full Case Studies & ROAS", href: "/work/", badge: "Case Studies" },
        { label: "Analytics & CRO Services", href: "/services/analytics-cro/", badge: "Service" },
        { label: "Digital Marketing Cost Guide", href: "/blog/digital-marketing-agency-cost-in-india-2026/", badge: "Blog" },
      ]}
    />
  );
}
