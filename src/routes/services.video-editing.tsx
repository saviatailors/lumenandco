import { createFileRoute } from "@tanstack/react-router";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/video-editing")({
  head: () =>
    buildSeoMeta({
      title: "Video & Reels Editing Agency India | Lumen & Co",
      description:
        "Reels, YouTube and ad edits with hooks, captions and motion graphics. Fast turnaround for creators and brands in India and the US.",
      canonicalPath: "/services/video-editing/",
      keywords: [
        "video editing agency India",
        "reels editing services India",
        "reels editing for brands",
        "short form video agency India",
        "white label video editing services",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Services", item: "/#services" },
        { name: "Video Editing", item: "/services/video-editing/" },
      ],
      serviceSchema: {
        serviceType: "Video Editing & Production",
        name: "Video & Reels Editing",
        description:
          "Short-form edits, motion graphics, and platform-native cuts built for retention, not just views.",
      },
      faqs: [
        {
          question: "What types of video editing does Lumen & Co handle?",
          answer:
            "We specialize in high-retention short-form video for Instagram Reels, TikTok, YouTube Shorts, Meta paid ads, YouTube long-form, podcasts, and video sales letters (VSLs). All edits include dynamic subtitles, motion graphics, sound design, and hook pacing.",
        },
        {
          question: "How do we share raw footage with your team?",
          answer:
            "We set up a dedicated shared Google Drive or Frame.io workspace with structured folders. You drop raw footage or A-roll, and our editing team delivers polished cuts within 48 to 72 hours.",
        },
        {
          question: "Do you offer white label video editing for US agencies?",
          answer:
            "Yes. We operate as the backend white-label video production hub for creative agencies in the US and UK, maintaining strict NDAs and using your Slack channels and project management workflows.",
        },
        {
          question: "What is your revision policy?",
          answer:
            "All retainers include unlimited minor revisions within the scope of the original brief to ensure every video meets your exact brand guidelines before going live.",
        },
      ],
    }),
  component: VideoEditingPage,
});

function VideoEditingPage() {
  return (
    <ServicePageTemplate
      eyebrow="lumen&co • Post-Production Studio"
      h1="Video Editing That Keeps People Watching"
      heroSubtitle="As a specialized video editing agency in India, Lumen & Co transforms raw creator footage, podcast cuts, and brand assets into high-retention Reels, TikToks, and Meta video ads that stop scroll fatigue and boost conversions."
      targetMarket="India"
      metrics={[
        { value: "82%", label: "Average 3-Second Hook Retention", sub: "on paid video ad reels" },
        { value: "48 Hrs", label: "Standard Turnaround Time", sub: "per short-form batch" },
        { value: "2.1M+", label: "Highest Single Reel Views", sub: "for scaled partner brands" },
        { value: "100%", label: "Motion Graphics & Subtitles", sub: "custom kinetic typography" },
      ]}
      problemTitle="90% of Viewers Drop Off in the First 3 Seconds"
      problemDescription="Standard video editors focus on cinematic transitions that look pretty but fail to hold viewer attention. In 2026, social algorithms prioritize completion rate and watch time. Without psychological pacing, dynamic b-roll, and aggressive hook testing, your media budget disappears on ghost impressions."
      problemPoints={[
        "Slow, boring introductions that lose 70% of viewers before the offer is made",
        "Generic auto-generated subtitles with zero emphasis or kinetic movement",
        "Unreliable freelance editors who miss delivery dates and require hand-holding",
        "High cost of in-house editors ($5,000+/mo in the US) without ad testing skills",
      ]}
      solutionTitle="Edits Engineered for Algorithmic Retention"
      solutionDescription="Every frame is intentionally cut to maintain dopamine spikes, reinforce brand authority, and push viewers down your sales funnel."
      solutionPoints={[
        {
          title: "Retention Pacing & Kinetic Sound",
          description:
            "Frame-by-frame cuts, custom sound effects, risers, and whooshes that guide the viewer through your narrative seamlessly.",
        },
        {
          title: "Hook Variations for Paid Ad Sets",
          description:
            "We cut 3 to 5 unique opening hooks for each video, letting media buyers test multiple entry points inside Meta Ads Manager.",
        },
        {
          title: "Branded Styling & Kinetic Captions",
          description:
            "Custom font treatments, highlight animations, and on-brand color palettes that instantly identify your company in the feed.",
        },
      ]}
      processSteps={[
        {
          number: "Step 01",
          title: "Asset Drop & Briefing",
          description: "Upload raw footage, talking-head takes, and b-roll to your private cloud vault.",
          timeline: "Day 1",
        },
        {
          number: "Step 02",
          title: "Rough Cut & Hook Design",
          description: "We assemble the narrative arc, eliminate pauses, and build 3 distinct opening hooks.",
          timeline: "Day 2",
        },
        {
          number: "Step 03",
          title: "Motion Graphics & SFX",
          description: "Apply custom kinetic typography, sound design, sound leveling, and color grading.",
          timeline: "Day 3",
        },
        {
          number: "Step 04",
          title: "Final Export & Storage",
          description: "Deliver platform-ready vertical (9:16) and square exports ready to schedule.",
          timeline: "Day 3–4",
        },
      ]}
      deliverables={[
        "12 to 24 Polished Reels, TikToks, or YouTube Shorts per month",
        "Multiple 3-second hook variations per asset for ad testing",
        "Full kinetic typography and custom emoji accents",
        "Sound design, licensed background audio, and audio normalization",
        "Raw project files or white-label deliveries for US agencies",
      ]}
      pricingHint={{
        badge: "Video Retainer Packages",
        headline: "Predictable Monthly Post-Production Capacity",
        details:
          "US plans start from $600/month for dedicated editing bandwidth. Indian creators and brands receive custom volume pricing in INR. No long-term lock-ins.",
      }}
      faqs={[
        {
          question: "What types of video editing does Lumen & Co handle?",
          answer:
            "We specialize in high-retention short-form video for Instagram Reels, TikTok, YouTube Shorts, Meta paid ads, YouTube long-form, podcasts, and video sales letters (VSLs). All edits include dynamic subtitles, motion graphics, sound design, and hook pacing.",
        },
        {
          question: "How do we share raw footage with your team?",
          answer:
            "We set up a dedicated shared Google Drive or Frame.io workspace with structured folders. You drop raw footage or A-roll, and our editing team delivers polished cuts within 48 to 72 hours.",
        },
        {
          question: "Do you offer white label video editing for US agencies?",
          answer:
            "Yes. We operate as the backend white-label video production hub for creative agencies in the US and UK, maintaining strict NDAs and using your Slack channels and project management workflows.",
        },
        {
          question: "What is your revision policy?",
          answer:
            "All retainers include unlimited minor revisions within the scope of the original brief to ensure every video meets your exact brand guidelines before going live.",
        },
      ]}
      relatedLinks={[
        { label: "Review Video Reel Samples", href: "/work/", badge: "Portfolio" },
        { label: "Gen AI Ads Production", href: "/services/gen-ai-ads/", badge: "Service" },
        { label: "US Offshore Agency Hub", href: "/us/", badge: "White Label" },
      ]}
    />
  );
}
