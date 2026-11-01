import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/us/")({
  head: () =>
    buildSeoMeta({
      title: "Offshore Digital Marketing Agency from India | Lumen & Co",
      description:
        "US-quality creative and marketing at a smarter cost. Dedicated team, US-hours calls, plans from $600/month.",
      canonicalPath: "/us/",
      keywords: [
        "offshore digital marketing agency India",
        "outsource marketing to India",
        "white label marketing agency India",
        "creative offshore team India",
        "US marketing agency outsourcing",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "US Hub", item: "/us/" },
      ],
      serviceSchema: {
        serviceType: "Offshore Digital Marketing & Creative Production",
        name: "Offshore Digital Marketing Agency",
        description:
          "Dedicated offshore growth teams and creative production for US businesses and aesthetic clinics.",
      },
      faqs: [
        {
          question: "How does Lumen & Co handle US time zones?",
          answer:
            "Our account directors and senior strategists work overlapping US business hours (EST, CST, and PST) for live strategy meetings, weekly sprint reviews, and emergency communications via Slack.",
        },
        {
          question: "How much can a US agency or business save by partnering with Lumen & Co?",
          answer:
            "Hiring a full in-house US creative and media team (video editor, designer, media buyer, copywriter) costs upwards of $22,000 to $30,000/month in salaries and benefits. Lumen & Co provides an entire embedded team starting at just $600 to $2,500/month.",
        },
        {
          question: "How is communication handled?",
          answer:
            "We integrate directly into your workflow: dedicated Slack channels, Frame.io for video reviews, ClickUp/Asana for task tracking, and weekly Zoom calls with zero account manager telephone games.",
        },
        {
          question: "Do you sign non-disclosure agreements (NDAs)?",
          answer:
            "Yes, absolutely. We sign strict US-enforceable NDAs protecting all client data, creatives, strategy decks, and intellectual property. White-label partnerships remain 100% confidential.",
        },
      ],
    }),
  component: UsHubPage,
});

function UsHubPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • United States Operations"
      h1="Your Offshore Creative Marketing Team"
      heroSubtitle="Lumen & Co serves ambitious US businesses and aesthetic clinics as a high-velocity offshore digital marketing agency from India, delivering Silicon Valley creative quality and scientific media buying with plans starting from $600/month."
      targetMarket="US"
      metrics={[
        { value: "From $600", label: "Monthly US Plans", sub: "predictable fixed retainers" },
        { value: "US Hours", label: "Dedicated Call Windows", sub: "EST / CST / PST availability" },
        { value: "70%", label: "Average Payroll Savings", sub: "vs domestic US agency rates" },
        { value: "24/7", label: "Overnight Production Cycles", sub: "brief in evening, review in morning" },
      ]}
      problemTitle="Domestic US Agency Fees Are Strangling Growth"
      problemDescription="US boutique agencies routinely bill $8,000 to $15,000 per month for basic media management, while outsourcing the actual work to unvetted freelancers. Meanwhile, building an in-house team carries massive overhead, recruitment friction, and payroll taxes."
      problemPoints={[
        "Astronomical US agency retainer fees with bloated non-working overhead",
        "Junior staff assigned to accounts after senior partners pitch the sale",
        "Slow creative delivery where simple video revisions take 10+ business days",
        "Lack of transparency on ad spend margins and closed-door attribution",
      ]}
      solutionTitle="Top 1% Indian Creative Talent Embedded in Your Business"
      solutionDescription="Get direct access to senior motion designers, direct-response copywriters, and performance media buyers who operate as an agile extension of your company."
      solutionPoints={[
        {
          title: "Overnight Production Advantage",
          description:
            "Drop video footage or new creative requests at 5:00 PM EST, and wake up at 8:00 AM EST with draft cuts and variants waiting in your inbox.",
        },
        {
          title: "Native English & US Cultural Fluency",
          description:
            "Our writers and editors study US consumer psychology, trending audio, and cultural nuances to ensure every creative resonates natively with American buyers.",
        },
        {
          title: "US-Hours Slack & Zoom Access",
          description:
            "No 24-hour delays waiting for email responses. We jump on live calls during your operating hours for sprint planning and performance reviews.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Discovery & Workflow Mapping",
          description: "Establish communication channels (Slack, Google Drive), brand tokens, and target KPIs.",
          timeline: "Days 1–3",
        },
        {
          number: "Step 02",
          title: "Initial Asset Sprint",
          description: "Ship first batch of video reels, static ad variants, and copy frameworks for immediate review.",
          timeline: "Days 4–7",
        },
        {
          number: "Step 03",
          title: "Campaign Deployment",
          description: "Launch campaigns in Meta and Google Ads with server-side CAPI attribution verification.",
          timeline: "Days 8–14",
        },
        {
          number: "Step 04",
          title: "Weekly Scaling Loops",
          description: "Weekly US-hours Zoom calls reviewing pipeline contribution and scheduling fresh creative batches.",
          timeline: "Weekly",
        },
      ]}
      deliverables={[
        "Dedicated senior creative team (video editor, graphic designer, copywriter)",
        "Weekly batch deliveries of short-form Reels/TikToks and static ad creatives",
        "Full-funnel Meta & Google Ads campaign management with conversion tracking",
        "Overnight creative turnaround for rapid ad set testing",
        "White-label agency deliverables with 100% confidential NDA protection",
      ]}
      pricingHint={{
        badge: "US Dollar Retainers",
        headline: "US Quality at Offshore Economics",
        details:
          "Predictable monthly retainers starting from $600/month. No payroll taxes, healthcare overhead, or long-term lock-in after 90 days. Invoiced cleanly in USD.",
      }}
      faqs={[
        {
          question: "How does Lumen & Co handle US time zones?",
          answer:
            "Our account directors and senior strategists work overlapping US business hours (EST, CST, and PST) for live strategy meetings, weekly sprint reviews, and emergency communications via Slack.",
        },
        {
          question: "How much can a US agency or business save by partnering with Lumen & Co?",
          answer:
            "Hiring a full in-house US creative and media team (video editor, designer, media buyer, copywriter) costs upwards of $22,000 to $30,000/month in salaries and benefits. Lumen & Co provides an entire embedded team starting at just $600 to $2,500/month.",
        },
        {
          question: "How is communication handled?",
          answer:
            "We integrate directly into your workflow: dedicated Slack channels, Frame.io for video reviews, ClickUp/Asana for task tracking, and weekly Zoom calls with zero account manager telephone games.",
        },
        {
          question: "Do you sign non-disclosure agreements (NDAs)?",
          answer:
            "Yes, absolutely. We sign strict US-enforceable NDAs protecting all client data, creatives, strategy decks, and intellectual property. White-label partnerships remain 100% confidential.",
        },
      ]}
      relatedLinks={[
        { label: "US Med Spa Marketing Agency", href: "/us/med-spa-marketing/", badge: "Specialty Niche" },
        { label: "Med Spa Local SEO Services", href: "/us/med-spa-seo/", badge: "Local SEO" },
        { label: "Med Spa Facebook Ads", href: "/us/med-spa-ads/", badge: "Meta Ads" },
      ]}
    />
  );
}
