import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/seo")({
  head: () =>
    buildSeoMeta({
      title: "SEO Services India for Small Business | Lumen & Co",
      description:
        "Rank higher on Google with technical SEO, local SEO and content that brings customers. Monthly reports, no lock-in.",
      canonicalPath: "/services/seo/",
      keywords: [
        "SEO services India for small business",
        "technical SEO agency India",
        "local SEO services India",
        "content SEO agency",
        "search engine optimization Visakhapatnam",
        "ecommerce SEO agency India",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Services", item: "/#services" },
        { name: "SEO", item: "/services/seo/" },
      ],
      serviceSchema: {
        serviceType: "Search Engine Optimization (SEO)",
        name: "SEO Services for Small Business",
        description:
          "Technical fixes, content clusters, and authority building for the terms your buyers actually search.",
      },
      faqs: [
        {
          question: "How long does SEO take to produce measurable leads?",
          answer:
            "Most small businesses see initial organic traffic and keyword movement within 60 to 90 days. Meaningful inbound lead velocity and top-3 Google rankings typically compound strongly between months 4 and 6.",
        },
        {
          question: "How do you choose target keywords?",
          answer:
            "We ignore high-volume vanity keywords that have no buyer intent. Instead, we map high-commercial 'bottom-of-the-funnel' search queries where people are actively looking to hire a service or purchase a product.",
        },
        {
          question: "Do you build backlinks?",
          answer:
            "Yes, through legitimate digital PR, founder quote platforms (Qwoted, Connectively), and high-authority contextual guest placements. We strictly avoid toxic link farms and PBNs that risk Google penalties.",
        },
        {
          question: "What is included in the technical SEO audit?",
          answer:
            "Our audit inspects Core Web Vitals, mobile indexing, crawl budgets, duplicate content, schema markup, XML sitemaps, canonical tags, and internal link architecture.",
        },
      ],
    }),
  component: SeoPage,
});

function SeoPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • Organic Growth Engine"
      h1="SEO That Brings Real Customers"
      heroSubtitle="Lumen & Co provides transparent, high-ROI SEO services in India for small businesses, modern DTC brands, and local service companies looking to generate qualified inbound leads from organic search."
      targetMarket="India"
      metrics={[
        { value: "+164%", label: "Average Organic Traffic Growth", sub: "across 6-month client engagements" },
        { value: "Top 3", label: "Local 3-Pack Target Ranking", sub: "for targeted service queries" },
        { value: "0", label: "Toxic PBN or Spam Links", sub: "100% white-hat algorithmic safety" },
        { value: "100%", label: "Transparent Search Console Data", sub: "monthly non-branded click reports" },
      ]}
      problemTitle="Tired of SEO Reports with Zero Inbound Leads?"
      problemDescription="Many SEO agencies deliver 50-page technical PDFs filled with technical jargon and ranking reports for obscure keywords that no prospective customer ever searches. In 2026, ranking #1 doesn't matter if the traffic doesn't convert into phone calls, bookings, or revenue."
      problemPoints={[
        "Targeting vanity keywords that drive bot traffic but zero commercial revenue",
        "Slow, unoptimized websites that fail Google's mobile Core Web Vitals checks",
        "Keyword stuffing and low-quality AI articles that get penalized by helpful content updates",
        "Agencies that lock clients into 12-month non-cancelable contracts without guarantees",
      ]}
      solutionTitle="Commercial Search Intent Meets Technical Speed"
      solutionDescription="We focus on the exact bottom-of-the-funnel queries your buyers type when they have an active budget."
      solutionPoints={[
        {
          title: "Technical Cleanliness & Core Web Vitals",
          description:
            "Clean schema JSON-LD, crawlable SSR HTML, blazing fast mobile page speeds, and flawless internal linking architecture.",
        },
        {
          title: "Bottom-of-Funnel Topic Clusters",
          description:
            "In-depth comparison guides, service pages, and location pages optimized for Google AI Overviews and traditional organic search.",
        },
        {
          title: "Local Google Maps & Citation Dominance",
          description:
            "Google Business Profile optimization, localized customer review generation, and geographic citations that capture local buyers.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Deep Technical & Intent Audit",
          description: "Audit indexing, crawl barriers, duplicate paths, and competitor keyword gaps.",
          timeline: "Weeks 1–2",
        },
        {
          number: "Step 02",
          title: "Technical Fixes & Schema",
          description: "Repair Core Web Vitals, implement rich JSON-LD markup, and streamline URL hierarchies.",
          timeline: "Weeks 3–4",
        },
        {
          number: "Step 03",
          title: "Commercial Content Hubs",
          description: "Publish 4 to 8 high-intent answer-engine articles and service landing pages.",
          timeline: "Month 2+",
        },
        {
          number: "Step 04",
          title: "Digital PR & Authority Building",
          description: "Earn authoritative contextual backlinks through founder PR and industry mentions.",
          timeline: "Ongoing",
        },
      ]}
      deliverables={[
        "Comprehensive technical website audit & Core Web Vitals optimization",
        "Full structured schema markup (Organization, Service, FAQPage, Breadcrumbs)",
        "Monthly commercial content cluster production and optimization",
        "Google Business Profile & Local 3-Pack optimization",
        "Monthly Google Search Console reporting tied to leads generated",
      ]}
      pricingHint={{
        badge: "Transparent SEO Retainers",
        headline: "Predictable Organic Investment with No Lock-In",
        details:
          "US plans start at $600/month. Indian packages tailored to local vs national competition. Month-to-month flexibility after the first 90 days.",
      }}
      faqs={[
        {
          question: "How long does SEO take to produce measurable leads?",
          answer:
            "Most small businesses see initial organic traffic and keyword movement within 60 to 90 days. Meaningful inbound lead velocity and top-3 Google rankings typically compound strongly between months 4 and 6.",
        },
        {
          question: "How do you choose target keywords?",
          answer:
            "We ignore high-volume vanity keywords that have no buyer intent. Instead, we map high-commercial 'bottom-of-the-funnel' search queries where people are actively looking to hire a service or purchase a product.",
        },
        {
          question: "Do you build backlinks?",
          answer:
            "Yes, through legitimate digital PR, founder quote platforms (Qwoted, Connectively), and high-authority contextual guest placements. We strictly avoid toxic link farms and PBNs that risk Google penalties.",
        },
        {
          question: "What is included in the technical SEO audit?",
          answer:
            "Our audit inspects Core Web Vitals, mobile indexing, crawl budgets, duplicate content, schema markup, XML sitemaps, canonical tags, and internal link architecture.",
        },
      ]}
      relatedLinks={[
        { label: "Digital Marketing Cost Guide", href: "/blog/digital-marketing-agency-cost-in-india-2026/", badge: "Pricing Guide" },
        { label: "Local SEO in Visakhapatnam", href: "/locations/visakhapatnam/", badge: "Location" },
        { label: "US Med Spa SEO Services", href: "/us/med-spa-seo/", badge: "US Niche" },
      ]}
    />
  );
}
