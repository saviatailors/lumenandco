import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/creatives")({
  head: () =>
    buildSeoMeta({
      title: "Social Media Creatives Agency India | Lumen & Co",
      description:
        "On-brand posts, carousels and ad creatives every month. Designed to convert, delivered on schedule. Get a sample pack.",
      canonicalPath: "/services/creatives/",
      keywords: [
        "social media creatives agency India",
        "ad creatives agency",
        "carousel ad design",
        "high converting social media graphics",
        "ecommerce ad creative design",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Services", item: "/#services" },
        { name: "Creatives", item: "/services/creatives/" },
      ],
      serviceSchema: {
        serviceType: "Social Media Creative Design",
        name: "Social Media Creatives",
        description:
          "Statics, carousels, UGC-style hooks and brand assets shipped weekly and plugged into ad sets.",
      },
      faqs: [
        {
          question: "How many creative assets do you ship each month?",
          answer:
            "Depending on your retainer tier, our creative studio produces between 20 to 60+ bespoke assets each month, spanning static ad cards, multi-slide educational carousels, comparison charts, and story banners.",
        },
        {
          question: "Do you write the copy or just create the design?",
          answer:
            "Every creative is built around persuasive direct-response copywriting. We conduct customer sentiment research, identify top objections, and write the headline, hook, body copy, and CTA before designing the visuals.",
        },
        {
          question: "Can you design in our exact brand guidelines?",
          answer:
            "Yes. During onboarding, we ingest your brand fonts, color tokens, photography library, and tone of voice. Every asset is delivered 100% on-brand and ready for immediate deployment.",
        },
        {
          question: "How do carousels perform compared to static images?",
          answer:
            "Carousels frequently achieve 2x to 3x higher dwell time on LinkedIn and Instagram because they invite tactile interaction. For e-commerce and B2B SaaS, breakdown carousels often deliver our lowest cost-per-lead.",
        },
      ],
    }),
  component: CreativesPage,
});

function CreativesPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • Creative Studio"
      h1="Social Creatives Built to Convert"
      heroSubtitle="As a dedicated social media creatives agency in India, Lumen & Co designs high-converting static ads, swipeable educational carousels, and conversion-focused brand graphics delivered on a predictable weekly cadence for ambitious brands."
      targetMarket="India"
      metrics={[
        { value: "3.2x", label: "Higher Click-Through Rates", sub: "vs generic agency templates" },
        { value: "Weekly", label: "Asset Delivery Cycles", sub: "constant pipeline of fresh creative" },
        { value: "+64%", label: "Average Carousel Dwell Time", sub: "driving platform algorithmic reach" },
        { value: "100%", label: "Custom Direct-Response Copy", sub: "researched for your audience" },
      ]}
      problemTitle="Pretty Graphics Don't Pay the Bills"
      problemDescription="Most graphic design agencies deliver artsy banners that win aesthetic praise but completely fail to stop the thumb or generate checkout intent. In direct-response advertising, design exists to clarify value, reduce cognitive friction, and drive action."
      problemPoints={[
        "Overly complex designs where the product and core value proposition are buried",
        "Lack of direct-response copy that speaks directly to customer pain points",
        "Slow feedback loops that prevent ad managers from testing new angles rapidly",
        "Inconsistent visual hierarchy leading to immediate scroll-past behavior",
      ]}
      solutionTitle="Direct-Response Design Built for ROI"
      solutionDescription="We combine conversion psychology, bold typography, and clean visual contrast to turn casual scrollers into paying customers."
      solutionPoints={[
        {
          title: "Thumb-Stopping Static Ad Cards",
          description:
            "Bold headline-led statics, customer review callouts, and 'Us vs Them' comparison tables that immediately communicate value.",
        },
        {
          title: "Multi-Slide Educational Carousels",
          description:
            "Deep-dive swipeable guides engineered for high saves, shares, and algorithmic dwell time on Instagram and LinkedIn.",
        },
        {
          title: "UGC Callout Overlays & Badges",
          description:
            "Credibility badges, trust seals, and real customer quote cards designed to slot into paid social retargeting funnels.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Audience & Angle Research",
          description: "Mine customer reviews, Reddit threads, and competitor ads to uncover core purchase triggers.",
          timeline: "Week 1",
        },
        {
          number: "Step 02",
          title: "Direct-Response Copywriting",
          description: "Draft 5 to 10 distinct copy angles highlighting problems, solutions, and social proof.",
          timeline: "Weekly",
        },
        {
          number: "Step 03",
          title: "Visual Design & Formatting",
          description: "Design high-contrast visual variants in feed, story, and banner aspect ratios.",
          timeline: "Weekly",
        },
        {
          number: "Step 04",
          title: "Plug into Ad Sets & Iterate",
          description: "Sync with media buying teams to retire fatigue and scale top-performing designs.",
          timeline: "Ongoing",
        },
      ]}
      deliverables={[
        "20 to 50 Custom static social ads and carousels per month",
        "Layered Figma or Canva files for your internal marketing team",
        "Multiple hook variations and CTA tests for paid ad groups",
        "Platform-specific sizing for Instagram, LinkedIn, Facebook, and Twitter/X",
        "Full commercial usage rights and high-resolution exports",
      ]}
      pricingHint={{
        badge: "Monthly Creative Retainers",
        headline: "A Full Creative Department for a Fraction of In-House Cost",
        details:
          "US plans start at $600/month. Custom Indian packages structured around your monthly volume. Flexible month-to-month contracts after the first 90 days.",
      }}
      faqs={[
        {
          question: "How many creative assets do you ship each month?",
          answer:
            "Depending on your retainer tier, our creative studio produces between 20 to 60+ bespoke assets each month, spanning static ad cards, multi-slide educational carousels, comparison charts, and story banners.",
        },
        {
          question: "Do you write the copy or just create the design?",
          answer:
            "Every creative is built around persuasive direct-response copywriting. We conduct customer sentiment research, identify top objections, and write the headline, hook, body copy, and CTA before designing the visuals.",
        },
        {
          question: "Can you design in our exact brand guidelines?",
          answer:
            "Yes. During onboarding, we ingest your brand fonts, color tokens, photography library, and tone of voice. Every asset is delivered 100% on-brand and ready for immediate deployment.",
        },
        {
          question: "How do carousels perform compared to static images?",
          answer:
            "Carousels frequently achieve 2x to 3x higher dwell time on LinkedIn and Instagram because they invite tactile interaction. For e-commerce and B2B SaaS, breakdown carousels often deliver our lowest cost-per-lead.",
        },
      ]}
      relatedLinks={[
        { label: "View Our Work & Portfolio", href: "/work/", badge: "Case Studies" },
        { label: "Meta & Google Ads Services", href: "/services/performance-ads/", badge: "Service" },
        { label: "Gen AI Ads Studio", href: "/services/gen-ai-ads/", badge: "AI Studio" },
      ]}
    />
  );
}
