import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/locations/visakhapatnam")({
  head: () =>
    buildSeoMeta({
      title: "Digital Marketing Agency in Visakhapatnam | Lumen & Co",
      description:
        "Vizag's creative digital marketing agency — reels, ads, SEO and websites for local brands. Talk to us today.",
      canonicalPath: "/locations/visakhapatnam/",
      keywords: [
        "digital marketing agency in Visakhapatnam",
        "digital marketing agency Visakhapatnam",
        "SEO company in Vizag",
        "social media marketing Vizag",
        "video editing agency Visakhapatnam",
        "digital marketing agency Andhra Pradesh",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Locations", item: "/#about" },
        { name: "Visakhapatnam", item: "/locations/visakhapatnam/" },
      ],
      serviceSchema: {
        serviceType: "Digital Marketing & Local Growth Agency",
        name: "Digital Marketing Agency in Visakhapatnam",
        description:
          "Vizag's creative digital marketing agency delivering Gen AI ads, video editing, local SEO, and Meta ads for businesses in Andhra Pradesh and global clients.",
      },
      faqs: [
        {
          question: "Where is Lumen & Co located in Visakhapatnam?",
          answer:
            "Lumen & Co is headquartered in Visakhapatnam, Andhra Pradesh. We operate as an agile digital agency working with leading regional businesses in Vizag and scaling international brands in the US.",
        },
        {
          question: "Do you meet clients in-person in Vizag?",
          answer:
            "Yes! For Visakhapatnam and Andhra Pradesh businesses, founder Sahit Sai Pothala and our strategy team are available for in-person strategy sessions, content capture days, and campaign kickoffs.",
        },
        {
          question: "What industries do you work with in Andhra Pradesh?",
          answer:
            "We work with local healthcare clinics, hospitals, educational institutions, real estate developers, hospitality brands, retail chains, and fast-growing Indian D2C e-commerce startups.",
        },
        {
          question: "How can Visakhapatnam brands get started?",
          answer:
            "Simply book a free 30-minute discovery call through our website, call +91-7842410691, or email sahitsai6@gmail.com. We will review your digital footprint and present an actionable growth plan.",
        },
      ],
    }),
  component: VisakhapatnamPage,
});

function VisakhapatnamPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • Visakhapatnam Headquarters"
      h1="Digital Marketing Agency in Visakhapatnam"
      heroSubtitle="Based in the City of Destiny, Lumen & Co is Visakhapatnam's premier creative and AI-powered digital marketing agency, helping local brands, healthcare practices, and regional enterprises scale with reels, paid ads, SEO, and modern web platforms."
      targetMarket="India"
      metrics={[
        { value: "Vizag", label: "Creative Headquarters", sub: "Andhra Pradesh, India" },
        { value: "180+", label: "Brands Scaled Globally", sub: "from our Vizag studio" },
        { value: "Local + Global", label: "Market Reach", sub: "serving Andhra Pradesh & the US" },
        { value: "100%", label: "Direct Founder Access", sub: "with Sahit Sai Pothala" },
      ]}
      problemTitle="Why Vizag Brands Struggle with Generic Marketing"
      problemDescription="Many local businesses in Visakhapatnam rely on outdated agencies that charge monthly fees for posting generic stock photos with zero commercial engagement. In a competitive and rapidly expanding economic hub like Vizag, your brand needs thumb-stopping video content, local Google Maps dominance, and profitable paid advertising."
      problemPoints={[
        "Generic static social posts that receive minimal local engagement and zero leads",
        "Websites that are invisible on Google when customers search for services in Visakhapatnam",
        "Wasting ad spend on unqualified clicks due to poor local targeting and weak offer design",
        "Lack of high-quality video production and motion graphics tailored for modern mobile consumers",
      ]}
      solutionTitle="Global Agency Quality, Local Vizag Understanding"
      solutionDescription="We bring Silicon Valley and Metro-level creative strategies directly to Visakhapatnam businesses at competitive regional pricing."
      solutionPoints={[
        {
          title: "Local Google Maps & Search SEO",
          description:
            "Dominate local Visakhapatnam search queries and rank in the Google Maps Local 3-Pack for high-intent terms across Vizag, Madhurawada, Gajuwaka, and MVP Colony.",
        },
        {
          title: "Regional Video Production & Reels",
          description:
            "High-impact short-form video reels, doctor/founder interviews, and store walkthroughs produced in Telugu and English with dynamic motion graphics.",
        },
        {
          title: "Targeted Meta & Google Ad Campaigns",
          description:
            "Hyper-local geographic paid ad targeting that drives physical store visits, high-ticket clinic appointments, and qualified commercial inquiries.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Local Market & Competitor Audit",
          description: "Analyze your local competitors in Vizag, current Google ranking, and customer sentiment.",
          timeline: "Week 1",
        },
        {
          number: "Step 02",
          title: "Content & SEO Strategy",
          description: "Map high-volume local search keywords, plan monthly video reel shoots, and build localized landing pages.",
          timeline: "Week 2",
        },
        {
          number: "Step 03",
          title: "Campaign Launch & Local SEO",
          description: "Deploy localized Meta ad campaigns and optimize your Google Business Profile for city-wide reach.",
          timeline: "Weeks 3–4",
        },
        {
          number: "Step 04",
          title: "Review & Scaling",
          description: "Monthly performance reviews tracking real store visits, calls, and qualified customer leads.",
          timeline: "Monthly",
        },
      ]}
      deliverables={[
        "Complete Google Business Profile (GBP) and local SEO optimization for Visakhapatnam",
        "Monthly video reels production, editing, and motion graphics tailored for regional audiences",
        "Full management of Meta (Facebook/Instagram) and Google Ads with local radius targeting",
        "High-converting landing page design and technical performance optimization",
        "Direct strategy calls with founder Sahit Sai Pothala and dedicated account support",
      ]}
      pricingHint={{
        badge: "Local Business Packages",
        headline: "High-ROI Marketing Tailored for Vizag Businesses",
        details:
          "Transparent monthly plans designed for local clinics, retail, hospitality, and growing enterprises in Andhra Pradesh. No long-term lock-ins.",
      }}
      faqs={[
        {
          question: "Where is Lumen & Co located in Visakhapatnam?",
          answer:
            "Lumen & Co is headquartered in Visakhapatnam, Andhra Pradesh. We operate as an agile digital agency working with leading regional businesses in Vizag and scaling international brands in the US.",
        },
        {
          question: "Do you meet clients in-person in Vizag?",
          answer:
            "Yes! For Visakhapatnam and Andhra Pradesh businesses, founder Sahit Sai Pothala and our strategy team are available for in-person strategy sessions, content capture days, and campaign kickoffs.",
        },
        {
          question: "What industries do you work with in Andhra Pradesh?",
          answer:
            "We work with local healthcare clinics, hospitals, educational institutions, real estate developers, hospitality brands, retail chains, and fast-growing Indian D2C e-commerce startups.",
        },
        {
          question: "How can Visakhapatnam brands get started?",
          answer:
            "Simply book a free 30-minute discovery call through our website, call +91-7842410691, or email sahitsai6@gmail.com. We will review your digital footprint and present an actionable growth plan.",
        },
      ]}
      relatedLinks={[
        { label: "SEO Services for Small Business", href: "/services/seo/", badge: "Service" },
        { label: "Video Editing & Reels Agency", href: "/services/video-editing/", badge: "Service" },
        { label: "Contact Us in Visakhapatnam", href: "/contact/", badge: "Contact" },
      ]}
    />
  );
}
