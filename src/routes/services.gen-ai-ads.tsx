import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/gen-ai-ads")({
  head: () =>
    buildSeoMeta({
      title: "Gen AI Ad Agency India | AI Video Ads – Lumen & Co",
      description:
        "Scroll-stopping AI video and image ads made in days, not weeks. Gen AI ad production for D2C brands, clinics and startups. See samples.",
      canonicalPath: "/services/gen-ai-ads/",
      keywords: [
        "Gen AI ad agency India",
        "AI video ads for brands India",
        "AI UGC ads agency",
        "generative AI video production",
        "AI advertising agency India",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Services", item: "/#services" },
        { name: "Gen AI Ads", item: "/services/gen-ai-ads/" },
      ],
      serviceSchema: {
        serviceType: "Generative AI Advertising",
        name: "Gen AI Ads",
        description:
          "AI-produced video and image ads for D2C brands, clinics and startups.",
      },
      faqs: [
        {
          question: "What is a Gen AI ad agency?",
          answer:
            "A Gen AI ad agency combines generative artificial intelligence tools (like Midjourney, Runway, Kling, and ElevenLabs) with human creative directors and media buyers. We produce high-converting image variants, hyper-realistic product videos, and dynamic UGC hooks in days rather than waiting weeks for studio shoots.",
        },
        {
          question: "Do AI ads actually convert as well as real footage?",
          answer:
            "Yes. In our testing across 180+ brands, Gen AI ad variants match or exceed standard camera shoots on Meta and TikTok when built around proven direct-response frameworks. The real advantage is testing velocity: we can test 10 visual hooks for the cost and turnaround time of a single live production.",
        },
        {
          question: "Who owns the intellectual property (IP) of the AI creatives?",
          answer:
            "You own 100% of all generated creatives, video cuts, copy decks, and layered project files once delivered. There are no licensing renewals or hidden talent usage fees.",
        },
        {
          question: "How fast can you deliver AI video ads?",
          answer:
            "First campaign assets and hook iterations are shipped within 5 to 7 business days from project kickoff and script sign-off.",
        },
      ],
    }),
  component: GenAiAdsPage,
});

function GenAiAdsPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • Gen AI Creative Studio"
      h1="Gen AI Ads That Stop the Scroll"
      heroSubtitle="As a leading Gen AI ad agency in India, Lumen & Co engineers scroll-stopping AI video ads, hyper-realistic UGC hooks, and multi-variant creative assets that lower customer acquisition cost for brands in India and the US."
      targetMarket="India"
      metrics={[
        { value: "4.1x", label: "Median Blended ROAS", sub: "across active DTC accounts" },
        { value: "5 Days", label: "Turnaround to First Variant", sub: "from concept to live ads" },
        { value: "-42%", label: "Creative Production Cost", sub: "vs physical studio shoots" },
        { value: "10x", label: "Weekly Hook Testing Capacity", sub: "for rapid algorithmic learning" },
      ]}
      problemTitle="Why Traditional Ad Production Fails in 2026"
      problemDescription="Ad fatigue hits ad sets in less than 14 days. Physical studio shoots take 4 to 6 weeks, cost thousands of dollars, and deliver only 3 or 4 static angles. When Meta's algorithm penalizes creative repetition, brands experience sudden CAC spikes and stalled revenue."
      problemPoints={[
        "Expensive studio shoots with high model fees and studio rental costs",
        "Slow 4-to-6 week delivery cycles causing creative fatigue and ad burnout",
        "Limited asset variations making multi-angle testing virtually impossible",
        "Disconnection between production crews and media buyers measuring ROAS",
      ]}
      solutionTitle="Human Strategy Powered by Generative Velocity"
      solutionDescription="We combine state-of-the-art generative video models with experienced copywriters and media buyers who know exactly what hooks drive retention."
      solutionPoints={[
        {
          title: "Hyper-Realistic AI Avatars & UGC",
          description:
            "Custom synthesized personas and product demonstrations designed specifically for TikTok and Meta Reels formats.",
        },
        {
          title: "Multi-Angle Visual Hook Testing",
          description:
            "Generate 10+ distinct 3-second opening hooks for every core offer, identifying winning angles before scaling ad spend.",
        },
        {
          title: "Instant Localization & Aspect Ratios",
          description:
            "Seamlessly adapt campaigns into 9:16 vertical reels, 1:1 feeds, and 16:9 widescreen with multilingual lip-sync for US and Indian markets.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Account & Creative Audit",
          description: "Analyze historical top performers, audience hesitations, and competitor hook fatigue.",
          timeline: "Days 1–3",
        },
        {
          number: "Step 02",
          title: "AI Concepting & Scripts",
          description: "Develop 5 distinct creative angles, script treatments, and visual prompt bibles.",
          timeline: "Days 4–7",
        },
        {
          number: "Step 03",
          title: "Synthesis & Motion Polish",
          description: "Generate video assets, add professional sound design, motion graphics, and typography.",
          timeline: "Days 8–12",
        },
        {
          number: "Step 04",
          title: "Launch & Weekly Iteration",
          description: "Deploy inside Meta Ads Manager, review retention graphs, and double down on winners.",
          timeline: "Ongoing",
        },
      ]}
      deliverables={[
        "10 to 20 High-converting AI video ad variations per month",
        "30+ Dynamic product stills and carousel cards",
        "Platform-ready 9:16 reels, 4:5 feeds, and 1:1 aspect ratios",
        "Script decks with direct-response psychological hooks",
        "Weekly creative analytics breakdown with your dedicated media buyer",
      ]}
      pricingHint={{
        badge: "Transparent Creative Retainers",
        headline: "High-Volume Production Without Studio Overhead",
        details:
          "US plans start at $600/month. Indian D2C packages are customized around monthly creative volume and testing requirements. Month-to-month after 90 days.",
      }}
      faqs={[
        {
          question: "What is a Gen AI ad agency?",
          answer:
            "A Gen AI ad agency combines generative artificial intelligence tools (like Midjourney, Runway, Kling, and ElevenLabs) with human creative directors and media buyers. We produce high-converting image variants, hyper-realistic product videos, and dynamic UGC hooks in days rather than waiting weeks for studio shoots.",
        },
        {
          question: "Do AI ads actually convert as well as real footage?",
          answer:
            "Yes. In our testing across 180+ brands, Gen AI ad variants match or exceed standard camera shoots on Meta and TikTok when built around proven direct-response frameworks. The real advantage is testing velocity: we can test 10 visual hooks for the cost and turnaround time of a single live production.",
        },
        {
          question: "Who owns the intellectual property (IP) of the AI creatives?",
          answer:
            "You own 100% of all generated creatives, video cuts, copy decks, and layered project files once delivered. There are no licensing renewals or hidden talent usage fees.",
        },
        {
          question: "How fast can you deliver AI video ads?",
          answer:
            "First campaign assets and hook iterations are shipped within 5 to 7 business days from project kickoff and script sign-off.",
        },
      ]}
      relatedLinks={[
        { label: "See Video Reels & Case Studies", href: "/work/", badge: "Portfolio" },
        { label: "Social Media Creatives Agency", href: "/services/creatives/", badge: "Service" },
        { label: "AI Ads for US Med Spas", href: "/us/med-spa-marketing/", badge: "US Niche" },
      ]}
    />
  );
}
