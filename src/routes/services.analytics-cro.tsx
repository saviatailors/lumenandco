import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/analytics-cro")({
  head: () =>
    buildSeoMeta({
      title: "CRO & Analytics Agency India | Lumen & Co",
      description:
        "Turn more visitors into leads with GA4 setup, heatmaps, A/B tests and landing page fixes. Get a free CRO checklist.",
      canonicalPath: "/services/analytics-cro/",
      keywords: [
        "CRO agency India",
        "conversion rate optimization India",
        "GA4 setup agency India",
        "landing page CRO",
        "server side tracking CAPI",
        "ecommerce conversion optimization",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Services", item: "/#services" },
        { name: "Analytics & CRO", item: "/services/analytics-cro/" },
      ],
      serviceSchema: {
        serviceType: "Conversion Rate Optimization & Analytics",
        name: "Analytics & CRO Services",
        description:
          "Clean attribution, server-side tracking and landing pages tuned until the conversion rate moves.",
      },
      faqs: [
        {
          question: "What is conversion rate optimization (CRO)?",
          answer:
            "Conversion rate optimization is the systematic process of increasing the percentage of website visitors who take a desired action (such as submitting an inquiry, booking a consultation, or purchasing a product) through user testing, heatmaps, and A/B split tests.",
        },
        {
          question: "Why is CRO more profitable than just buying more ad traffic?",
          answer:
            "Doubling your ad spend doubles your traffic cost. But doubling your conversion rate from 1.5% to 3.0% doubles your customer acquisitions and revenue without spending an extra dollar on advertising.",
        },
        {
          question: "What tools do you use for conversion tracking and testing?",
          answer:
            "We configure Google Analytics 4 (GA4), Google Tag Manager (GTM), Microsoft Clarity, Hotjar, and Meta Conversions API (CAPI) via server-side containers to eliminate browser tracking blind spots.",
        },
        {
          question: "How long until we see conversion rate lifts?",
          answer:
            "Initial quick wins (fixing broken mobile checkout flows, form friction, page speed, and button clarity) usually generate measurable lifts within the first 14 to 30 days.",
        },
      ],
    }),
  component: AnalyticsCroPage,
});

function AnalyticsCroPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • Revenue Optimization"
      h1="Get More Leads From the Traffic You Already Have"
      heroSubtitle="As a specialized CRO agency in India, Lumen & Co audits your conversion funnels, resolves tracking loss with GA4 and server-side CAPI, and redesigns high-converting landing pages that convert cold visitors into committed pipeline."
      targetMarket="India"
      metrics={[
        { value: "+48%", label: "Average Conversion Rate Lift", sub: "across redesigned landing pages" },
        { value: "98%", label: "Server-Side Event Match Quality", sub: "on Meta Conversions API" },
        { value: "-51%", label: "Cost Per Qualified Demo", sub: "for B2B SaaS partner brands" },
        { value: "0", label: "Guesswork in Funnel Audits", sub: "every recommendation backed by session recordings" },
      ]}
      problemTitle="Leaky Funnels Burn Paid Media Budgets"
      problemDescription="Most businesses spend 95% of their budget driving traffic to their website and less than 5% optimizing the experience once people arrive. If your landing pages take 4 seconds to load, have confusing forms, or lack clear value propositions, your marketing budget is leaking away."
      problemPoints={[
        "High ad click volume that bounces within 5 seconds of landing",
        "GA4 reporting discrepancies where ad platforms disagree on who purchased",
        "Cluttered mobile navigation and multi-step forms that cause abandonment",
        "Landing pages that look like generic brochures rather than conversion machines",
      ]}
      solutionTitle="Scientific Attribution & Funnel Engineering"
      solutionDescription="We combine heatmaps, user session replays, and clean server-side data to pinpoint friction and remove conversion roadblocks."
      solutionPoints={[
        {
          title: "Clean GA4 & Server-Side CAPI",
          description:
            "Rock-solid first-party attribution tracking that captures accurate revenue, ROAS, and user journey data across devices.",
        },
        {
          title: "Heatmap & Session Replay Audits",
          description:
            "Identify exactly where mobile users drop off, get confused, or experience rage clicks before reaching checkout.",
        },
        {
          title: "High-Converting Landing Page Sprints",
          description:
            "Design and deploy bespoke, fast-loading landing pages tuned for maximum lead generation and purchase intent.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Tracking & Data Health Check",
          description: "Verify GA4 events, Meta CAPI match quality, and eliminate double-counted conversions.",
          timeline: "Week 1",
        },
        {
          number: "Step 02",
          title: "Friction & Drop-Off Mapping",
          description: "Analyze 1,000+ user session replays to diagnose form abandonment and UI bottlenecks.",
          timeline: "Week 2",
        },
        {
          number: "Step 03",
          title: "Landing Page Redesign",
          description: "Ship high-contrast, lightning-fast landing page variants with clear psychological hierarchy.",
          timeline: "Weeks 3–4",
        },
        {
          number: "Step 04",
          title: "Split Testing & Iteration",
          description: "Run statistical A/B tests on headlines, forms, and offers to compound conversion lifts.",
          timeline: "Ongoing",
        },
      ]}
      deliverables={[
        "Full GA4, Google Tag Manager & Meta CAPI server-side installation",
        "Detailed conversion bottleneck audit with screen recording evidence",
        "Custom high-converting landing page designs and responsive code",
        "Micro-conversion tracking setup (form begins, scroll depth, video plays)",
        "Monthly CRO testing roadmap and statistical significance reports",
      ]}
      pricingHint={{
        badge: "CRO & Analytics Sprints",
        headline: "Turn Wasted Ad Spend into Active Revenue",
        details:
          "US plans start from $600/month. Custom Indian sprint packages available. We review your actual conversion numbers before quoting.",
      }}
      faqs={[
        {
          question: "What is conversion rate optimization (CRO)?",
          answer:
            "Conversion rate optimization is the systematic process of increasing the percentage of website visitors who take a desired action (such as submitting an inquiry, booking a consultation, or purchasing a product) through user testing, heatmaps, and A/B split tests.",
        },
        {
          question: "Why is CRO more profitable than just buying more ad traffic?",
          answer:
            "Doubling your ad spend doubles your traffic cost. But doubling your conversion rate from 1.5% to 3.0% doubles your customer acquisitions and revenue without spending an extra dollar on advertising.",
        },
        {
          question: "What tools do you use for conversion tracking and testing?",
          answer:
            "We configure Google Analytics 4 (GA4), Google Tag Manager (GTM), Microsoft Clarity, Hotjar, and Meta Conversions API (CAPI) via server-side containers to eliminate browser tracking blind spots.",
        },
        {
          question: "How long until we see conversion rate lifts?",
          answer:
            "Initial quick wins (fixing broken mobile checkout flows, form friction, page speed, and button clarity) usually generate measurable lifts within the first 14 to 30 days.",
        },
      ]}
      relatedLinks={[
        { label: "Performance Ads Management", href: "/services/performance-ads/", badge: "Service" },
        { label: "Client Results & Work", href: "/work/", badge: "Case Studies" },
        { label: "Book a Free CRO Audit", href: "/contact/", badge: "Contact" },
      ]}
    />
  );
}
