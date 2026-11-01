import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/us/med-spa-seo")({
  head: () =>
    buildSeoMeta({
      title: "Med Spa SEO Services | Rank on Google Maps – Lumen & Co",
      description:
        "Local SEO for med spas: Google Business Profile, treatment pages and reviews that bring bookings. Free SEO audit.",
      canonicalPath: "/us/med-spa-seo/",
      keywords: [
        "med spa SEO",
        "medical spa SEO services",
        "local SEO for aesthetic clinics",
        "med spa Google Maps ranking",
        "Botox SEO agency",
        "aesthetic clinic search marketing",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "US Hub", item: "/us/" },
        { name: "Med Spa SEO", item: "/us/med-spa-seo/" },
      ],
      serviceSchema: {
        serviceType: "Local SEO & Google Maps Optimization for Medical Spas",
        name: "Med Spa SEO Services",
        description:
          "Local SEO for medical spas: Google Business Profile optimization, procedure landing pages, and review generation that drive patient bookings.",
      },
      faqs: [
        {
          question: "Why is Google Maps Local 3-Pack so critical for med spas?",
          answer:
            "Over 68% of patients searching for treatments like 'Botox near me' or 'laser hair removal' click on one of the top three clinics featured in Google Maps. Ranking in the Local 3-Pack generates the highest-intent phone calls and booking requests without paying for clicks.",
        },
        {
          question: "How long does it take for a med spa to rank on Google Maps?",
          answer:
            "Google Business Profile optimization and citation cleanups typically yield noticeable Local 3-Pack ranking improvements within 45 to 90 days, depending on city size and competitor review counts.",
        },
        {
          question: "Do you build individual treatment pages for each procedure?",
          answer:
            "Yes. Having dedicated, in-depth pages for Botox, dermal fillers, microneedling, and laser treatments allows your clinic to rank for long-tail commercial searches that competitors with generic one-page websites completely miss.",
        },
        {
          question: "How do you help us collect more 5-star Google reviews?",
          answer:
            "We install an automated post-treatment SMS flow that asks happy patients for a Google review right after checkout, making it seamless for your staff and dramatically increasing your monthly review velocity.",
        },
      ],
    }),
  component: MedSpaSeoPage,
});

function MedSpaSeoPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • Aesthetic Practice SEO"
      h1="Med Spa SEO That Gets You Found Locally"
      heroSubtitle="Lumen & Co provides specialized med spa SEO services designed to help medical spas and aesthetic clinics dominate local Google Maps, outrank nearby competitors, and attract high-paying patients searching for cosmetic treatments in your city."
      targetMarket="US"
      metrics={[
        { value: "Top 3", label: "Google Maps Local Pack Target", sub: "for primary treatment keywords" },
        { value: "+180%", label: "Average Local Inbound Calls", sub: "after full GBP and citation audit" },
        { value: "45 Days", label: "Timeline to Initial Keyword Movement", sub: "across local geographic grids" },
        { value: "100%", label: "HIPAA Compliant SEO Strategies", sub: "zero private patient data exposure" },
      ]}
      problemTitle="Invisible on Google Maps While Competitors Book Out"
      problemDescription="When patients in your city search for 'best Botox near me' or 'lip filler clinic', do they see your practice or the med spa down the street? If your Google Business Profile is incomplete, lacks review velocity, or your website only has a single generic 'Services' page, you are handing hundreds of thousands of dollars in high-margin procedures to local competitors."
      problemPoints={[
        "Failing to rank in the Google Maps Local 3-Pack where over two-thirds of local clicks go",
        "A single generic services page instead of dedicated pages for each procedure",
        "Outdated or inconsistent NAP (Name, Address, Phone) citations across medical directories",
        "Low review velocity with no automated system to capture reviews from satisfied patients",
      ]}
      solutionTitle="The Local Dominance Aesthetic SEO Architecture"
      solutionDescription="We optimize every technical and local signal to position your aesthetic clinic as the undisputed authority in your metropolitan area."
      solutionPoints={[
        {
          title: "Google Business Profile (GBP) Optimization",
          description:
            "Complete category optimization, secondary aesthetic services, weekly geotagged clinic photo uploads, and FAQ schema integration.",
        },
        {
          title: "Procedure-Specific Commercial Pages",
          description:
            "Dedicated, medically accurate treatment pages optimized for high-intent searches like 'Botox for forehead lines', 'jawline filler', and 'Morpheus8 recovery'.",
        },
        {
          title: "Automated 5-Star Review Generation",
          description:
            "Seamless post-checkout SMS review requests that systematically build social proof and boost your local ranking algorithm weight.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Local Grid & Ranking Audit",
          description: "Analyze your ranking radius across a 15-mile geographic heat map and audit competitor citations.",
          timeline: "Week 1",
        },
        {
          number: "Step 02",
          title: "GBP & Citation Alignment",
          description: "Claim and synchronize medical directories (Healthgrades, WebMD, RealSelf, Yelp) with identical NAP data.",
          timeline: "Weeks 2–3",
        },
        {
          number: "Step 03",
          title: "Treatment Page Creation",
          description: "Author and deploy high-converting landing pages for Botox, fillers, lasers, and body contouring.",
          timeline: "Weeks 4–6",
        },
        {
          number: "Step 04",
          title: "Review Velocity & Authority Building",
          description: "Deploy automated patient review loops and secure high-authority local and healthcare press mentions.",
          timeline: "Ongoing",
        },
      ]}
      deliverables={[
        "Complete Google Business Profile (GBP) management and weekly geotagged updates",
        "Creation of 5 to 10 dedicated high-converting procedure pages with MedicalBusiness schema",
        "Healthcare directory citation clean-up and synchronisation across 50+ local portals",
        "Automated post-treatment review collection workflow via SMS",
        "Monthly local ranking heat map reports tracking calls, directions, and website clicks",
      ]}
      pricingHint={{
        badge: "Specialized Med Spa SEO",
        headline: "Long-Term Patient Pipeline Without Ongoing Ad Costs",
        details:
          "Monthly retainers starting from $600/month. No setup fees and no long-term lock-in after the initial 90-day foundational sprint.",
      }}
      faqs={[
        {
          question: "Why is Google Maps Local 3-Pack so critical for med spas?",
          answer:
            "Over 68% of patients searching for treatments like 'Botox near me' or 'laser hair removal' click on one of the top three clinics featured in Google Maps. Ranking in the Local 3-Pack generates the highest-intent phone calls and booking requests without paying for clicks.",
        },
        {
          question: "How long does it take for a med spa to rank on Google Maps?",
          answer:
            "Google Business Profile optimization and citation cleanups typically yield noticeable Local 3-Pack ranking improvements within 45 to 90 days, depending on city size and competitor review counts.",
        },
        {
          question: "Do you build individual treatment pages for each procedure?",
          answer:
            "Yes. Having dedicated, in-depth pages for Botox, dermal fillers, microneedling, and laser treatments allows your clinic to rank for long-tail commercial searches that competitors with generic one-page websites completely miss.",
        },
        {
          question: "How do you help us collect more 5-star Google reviews?",
          answer:
            "We install an automated post-treatment SMS flow that asks happy patients for a Google review right after checkout, making it seamless for your staff and dramatically increasing your monthly review velocity.",
        },
      ]}
      relatedLinks={[
        { label: "US Med Spa Marketing Agency", href: "/us/med-spa-marketing/", badge: "Overview" },
        { label: "Med Spa Meta & Instagram Ads", href: "/us/med-spa-ads/", badge: "Paid Ads" },
        { label: "15 Med Spa Marketing Ideas", href: "/blog/med-spa-marketing-15-ideas-that-book-more-consultations/", badge: "Blog Guide" },
      ]}
    />
  );
}
