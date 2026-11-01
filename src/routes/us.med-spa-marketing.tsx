import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/us/med-spa-marketing")({
  head: () =>
    buildSeoMeta({
      title: "Med Spa Marketing Agency | More Bookings – Lumen & Co",
      description:
        "Med spa marketing that fills your calendar: AI ads, reels, SEO and Meta ads built for aesthetic clinics. Book a free growth call.",
      canonicalPath: "/us/med-spa-marketing/",
      keywords: [
        "med spa marketing agency",
        "med spa digital marketing",
        "aesthetic clinic marketing agency",
        "med spa social media marketing",
        "medical spa marketing agency US",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "US Hub", item: "/us/" },
        { name: "Med Spa Marketing", item: "/us/med-spa-marketing/" },
      ],
      serviceSchema: {
        serviceType: "Medical Spa Marketing & Patient Acquisition",
        name: "Med Spa Marketing Agency",
        description:
          "Full-funnel patient acquisition: compliant Meta ads, Google Maps SEO, short-form reels, and automated SMS follow-up for aesthetic clinics.",
      },
      faqs: [
        {
          question: "How do you generate consultations without violating Meta's healthcare policies?",
          answer:
            "Meta has strict restrictions against needle close-ups, unrealistic body promises, and before-and-after skin photos. We design compliant educational video reels showcasing injector expertise, clinic ambiance, patient lifestyle narratives, and consultative value that get approved reliably without account bans.",
        },
        {
          question: "How quickly do we see new patient bookings?",
          answer:
            "Our paid Meta and Google ad funnels launch within 14 business days. Most clinics begin receiving booked consultation requests within the first 72 hours of ad campaigns going live.",
        },
        {
          question: "How do you help reduce consultation no-show rates?",
          answer:
            "We install an automated SMS and email confirmation sequence with two-way confirmation triggers, calendar invites, pre-treatment care instructions, and optional deposit collection that drops no-shows below 12%.",
        },
        {
          question: "What aesthetic treatments do you market?",
          answer:
            "We specialize in high-margin aesthetic procedures including Botox & Dysport, dermal fillers, Morpheus8 & microneedling, laser hair removal, CoolSculpting & body contouring, and medical-grade facials.",
        },
      ],
    }),
  component: MedSpaMarketingPage,
});

function MedSpaMarketingPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • Aesthetic Medicine Growth"
      h1="Med Spa Marketing That Fills Your Calendar"
      heroSubtitle="As a specialized med spa marketing agency, Lumen & Co helps medical spas and aesthetic clinics across the US attract qualified patients, book high-ticket consultations, and fill treatment chairs with compliant Meta ads, local Google SEO, and high-retention video reels."
      targetMarket="US"
      metrics={[
        { value: "3.8x", label: "Average Patient Lifetime Value Lift", sub: "via automated recall & memberships" },
        { value: "<12%", label: "Consultation No-Show Rate", sub: "with automated 2-minute SMS workflows" },
        { value: "$32", label: "Average Cost Per Consultation", sub: "for Botox and filler inquiries" },
        { value: "100%", label: "Meta Healthcare Compliant", sub: "zero ad account restrictions" },
      ]}
      problemTitle="Why Most Med Spa Ad Agencies Fail"
      problemDescription="Traditional marketing agencies don't understand the aesthetic space. They run generic $50-off discount ads that attract bargain hunters who never return, or use aggressive before-and-after imagery that gets your Meta ad account permanently shut down for policy violations."
      problemPoints={[
        "Attracting low-intent price shoppers who cancel last minute or never rebook",
        "Meta ad account flags and disabling due to healthcare and injectable compliance traps",
        "Slow lead response times where prospective patients book with your competitor instead",
        "Zero backend retention systems to turn one-time Botox patients into $3,000/year regulars",
      ]}
      solutionTitle="The Booked-Out Aesthetic Clinic Framework"
      solutionDescription="We combine compliant direct-response video advertising, local Google Maps ranking dominance, and rapid SMS automations."
      solutionPoints={[
        {
          title: "Compliant Injector-Led Video Ads",
          description:
            "Highlight your medical credentials, artistic eye, and patient comfort through short, elegant video reels that build deep trust before patients even step foot in your clinic.",
        },
        {
          title: "Google Maps Local 3-Pack Dominance",
          description:
            "Rank in the top 3 spots when high-intent local patients search 'best Botox near me' or 'lip filler clinic' in your city and zip code.",
        },
        {
          title: "2-Minute Automated Lead Follow-Up",
          description:
            "Instant two-way SMS messaging connects with prospective patients within 120 seconds of submitting an inquiry, booking them directly into your calendar.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Clinic & Treatment Audit",
          description: "Analyze your highest-margin treatments, current booking software (Jane, Boulevard, Vagaro), and local competitors.",
          timeline: "Days 1–3",
        },
        {
          number: "Step 02",
          title: "Creative & Compliance Pipeline",
          description: "Script educational reels, shoot guides for your injectors, and build compliant landing pages.",
          timeline: "Days 4–8",
        },
        {
          number: "Step 03",
          title: "Launch Meta & Google Ads",
          description: "Deploy hyper-targeted local campaigns within a 15-mile radius of your physical clinic location.",
          timeline: "Days 9–14",
        },
        {
          number: "Step 04",
          title: "Retention & Recall Scaling",
          description: "Implement automated 90-day neurotoxin recall reminders and membership funnels to compound LTV.",
          timeline: "Ongoing",
        },
      ]}
      deliverables={[
        "Custom Meta (Facebook & Instagram) ad campaigns tailored to high-ticket aesthetic procedures",
        "Video editing and motion graphics for injector talking-head reels and clinic walkthroughs",
        "Local Google Business Profile SEO and citation management for city-wide visibility",
        "Automated 2-minute SMS and email lead response workflows with calendar booking integration",
        "Monthly reporting tracking verified consultations, attendance rates, and patient acquisition costs",
      ]}
      pricingHint={{
        badge: "Specialized Aesthetic Retainer",
        headline: "Predictable Patient Acquisition for Aesthetic Practices",
        details:
          "Retainers starting from $600/month for dedicated creative, SEO, and paid ad management. Tailored packages for single-location med spas and multi-city aesthetic groups.",
      }}
      faqs={[
        {
          question: "How do you generate consultations without violating Meta's healthcare policies?",
          answer:
            "Meta has strict restrictions against needle close-ups, unrealistic body promises, and before-and-after skin photos. We design compliant educational video reels showcasing injector expertise, clinic ambiance, patient lifestyle narratives, and consultative value that get approved reliably without account bans.",
        },
        {
          question: "How quickly do we see new patient bookings?",
          answer:
            "Our paid Meta and Google ad funnels launch within 14 business days. Most clinics begin receiving booked consultation requests within the first 72 hours of ad campaigns going live.",
        },
        {
          question: "How do you help reduce consultation no-show rates?",
          answer:
            "We install an automated SMS and email confirmation sequence with two-way confirmation triggers, calendar invites, pre-treatment care instructions, and optional deposit collection that drops no-shows below 12%.",
        },
        {
          question: "What aesthetic treatments do you market?",
          answer:
            "We specialize in high-margin aesthetic procedures including Botox & Dysport, dermal fillers, Morpheus8 & microneedling, laser hair removal, CoolSculpting & body contouring, and medical-grade facials.",
        },
      ]}
      relatedLinks={[
        { label: "Med Spa Local SEO Services", href: "/us/med-spa-seo/", badge: "Local SEO" },
        { label: "Med Spa Meta & Instagram Ads", href: "/us/med-spa-ads/", badge: "Meta Ads" },
        { label: "15 Med Spa Marketing Ideas", href: "/blog/med-spa-marketing-15-ideas-that-book-more-consultations/", badge: "Playbook" },
      ]}
    />
  );
}
