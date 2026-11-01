import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/us/med-spa-ads")({
  head: () =>
    buildSeoMeta({
      title: "Med Spa Facebook & Instagram Ads | Lumen & Co",
      description:
        "Meta ads for Botox, fillers and laser treatments with compliant creatives and lead follow-up. Get more consults.",
      canonicalPath: "/us/med-spa-ads/",
      keywords: [
        "med spa Facebook ads",
        "med spa Meta ads",
        "Instagram ads for med spas",
        "Botox Facebook advertising",
        "aesthetic clinic lead generation",
        "med spa paid social agency",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "US Hub", item: "/us/" },
        { name: "Med Spa Ads", item: "/us/med-spa-ads/" },
      ],
      serviceSchema: {
        serviceType: "Paid Advertising & Lead Generation for Medical Spas",
        name: "Med Spa Facebook & Instagram Ads",
        description:
          "Targeted Meta and Instagram campaigns built to book paid consultations for aesthetic injectables, laser procedures, and body contouring.",
      },
      faqs: [
        {
          question: "How do you prevent ad accounts from getting disabled by Meta?",
          answer:
            "Meta's advertising policies strictly regulate personal health and appearance claims. We avoid policy triggers like extreme close-ups of body parts, needles piercing skin, or before-and-after photos with dramatic lighting shifts. Instead, we use lifestyle video reels, patient journey walkthroughs, and injector education that comply 100% with Meta's healthcare advertising policies.",
        },
        {
          question: "Should we use native Meta Lead Forms or send traffic to a landing page?",
          answer:
            "We typically run a hybrid strategy: high-intent custom landing pages with financing calculators (Cherry, CareCredit) for high-ticket procedures (like Morpheus8 or body sculpting), and streamlined Instant Forms with qualifier questions for popular treatments like Botox.",
        },
        {
          question: "How much ad budget does a single-location med spa need?",
          answer:
            "We recommend starting with an ad spend of $1,500 to $3,500/month dedicated to Meta platforms to give the algorithm enough conversion volume to optimize within your local geographic radius.",
        },
        {
          question: "What is a good cost per consultation for aesthetic clinics?",
          answer:
            "Across our US med spa accounts, cost per booked consultation typically ranges between $25 and $45 for injectables, and $60 to $110 for high-ticket body contouring or laser resurfacing packages.",
        },
      ],
    }),
  component: MedSpaAdsPage,
});

function MedSpaAdsPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • Aesthetic Lead Generation"
      h1="Meta Ads That Book More Consultations"
      heroSubtitle="Lumen & Co engineers high-converting Facebook and Instagram ad campaigns for US medical spas, combining policy-compliant video creatives, local zip code targeting, and instant 2-minute SMS follow-ups to fill your consultation schedule."
      targetMarket="US"
      metrics={[
        { value: "$28–$45", label: "Average Cost Per Consultation", sub: "for Botox and dermal fillers" },
        { value: "0 Bans", label: "Policy Compliance Record", sub: "100% compliant medical ad copy" },
        { value: "2 Mins", label: "Automated Lead Response Time", sub: "capturing patients before they bounce" },
        { value: "4.2x", label: "Average First-Month ROAS", sub: "based on consultation cash collected" },
      ]}
      problemTitle="Stop Burning Ad Spend on Unqualified Leads"
      problemDescription="Most agencies generate 50 leads that turn out to be disconnected numbers, people who thought treatment was free, or prospects who ghost when you call. Low-quality leads burn out your front desk staff and waste marketing dollars."
      problemPoints={[
        "Cheap lead form ads that attract bargain hunters who never attend consultations",
        "Meta ad accounts repeatedly restricted due to healthcare policy non-compliance",
        "Slow, manual email follow-up from front desk staff while leads go cold",
        "Lack of procedure-specific targeting, lumping Botox and surgical lasers together",
      ]}
      solutionTitle="The High-Ticket Aesthetic Funnel"
      solutionDescription="We pre-qualify prospects inside the ad unit, position your injectors as clinical authorities, and automate appointment booking."
      solutionPoints={[
        {
          title: "Compliant Video Hook Creative",
          description:
            "High-retention Reels featuring licensed injectors explaining patient comfort, natural results, and safety protocols that pass Meta review effortlessly.",
        },
        {
          title: "Pre-Qualifying Consultation Funnels",
          description:
            "Custom lead filters requiring prospects to confirm treatment timeline, budget readiness, and preferred appointment time before submitting.",
        },
        {
          title: "Instant 2-Minute SMS Confirmation",
          description:
            "Immediate two-way automated SMS triggers that offer convenient calendar booking slots while the patient's buying intent is highest.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Treatment & Offer Selection",
          description: "Select 2 to 3 high-margin hero treatments (e.g. Lip Filler, Morpheus8, Botox) with clear pricing tiers.",
          timeline: "Days 1–3",
        },
        {
          number: "Step 02",
          title: "Creative Scripting & Editing",
          description: "Script educational talking-head reels and design high-contrast carousel ads showcasing clinic authority.",
          timeline: "Days 4–7",
        },
        {
          number: "Step 03",
          title: "Campaign & Automation Setup",
          description: "Deploy local radius targeting (10–15 miles) and connect automated SMS booking triggers.",
          timeline: "Days 8–12",
        },
        {
          number: "Step 04",
          title: "Lead Quality Optimization",
          description: "Analyze consultation attendance rates weekly with your front desk team to refine ad messaging.",
          timeline: "Ongoing",
        },
      ]}
      deliverables={[
        "Complete setup and daily optimization of Meta (Facebook & Instagram) ads",
        "Monthly batch of 8 to 16 compliant video ad reels and static carousel cards",
        "Custom high-converting consultation booking landing page with financing integration",
        "Automated 2-minute SMS lead follow-up and appointment reminder system",
        "Weekly reporting on cost per consultation, qualified rate, and treatment revenue",
      ]}
      pricingHint={{
        badge: "Med Spa Media Management",
        headline: "Predictable Patient Acquisition for Aesthetic Practices",
        details:
          "Monthly retainers starting from $600/month. No setup fees, no long-term contracts after the first 90 days. Transparent weekly reporting.",
      }}
      faqs={[
        {
          question: "How do you prevent ad accounts from getting disabled by Meta?",
          answer:
            "Meta's advertising policies strictly regulate personal health and appearance claims. We avoid policy triggers like extreme close-ups of body parts, needles piercing skin, or before-and-after photos with dramatic lighting shifts. Instead, we use lifestyle video reels, patient journey walkthroughs, and injector education that comply 100% with Meta's healthcare advertising policies.",
        },
        {
          question: "Should we use native Meta Lead Forms or send traffic to a landing page?",
          answer:
            "We typically run a hybrid strategy: high-intent custom landing pages with financing calculators (Cherry, CareCredit) for high-ticket procedures (like Morpheus8 or body sculpting), and streamlined Instant Forms with qualifier questions for popular treatments like Botox.",
        },
        {
          question: "How much ad budget does a single-location med spa need?",
          answer:
            "We recommend starting with an ad spend of $1,500 to $3,500/month dedicated to Meta platforms to give the algorithm enough conversion volume to optimize within your local geographic radius.",
        },
        {
          question: "What is a good cost per consultation for aesthetic clinics?",
          answer:
            "Across our US med spa accounts, cost per booked consultation typically ranges between $25 and $45 for injectables, and $60 to $110 for high-ticket body contouring or laser resurfacing packages.",
        },
      ]}
      relatedLinks={[
        { label: "US Med Spa Marketing Hub", href: "/us/med-spa-marketing/", badge: "Overview" },
        { label: "Med Spa Local SEO Services", href: "/us/med-spa-seo/", badge: "Local SEO" },
        { label: "15 Med Spa Marketing Ideas", href: "/blog/med-spa-marketing-15-ideas-that-book-more-consultations/", badge: "Playbook" },
      ]}
    />
  );
}
