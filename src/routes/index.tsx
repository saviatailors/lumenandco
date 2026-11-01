import { createFileRoute } from "@tanstack/react-router";
import App from "@/app/App";
import { buildSeoMeta, ORGANIZATION_SCHEMA } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoMeta({
      title: "Lumen & Co | Creative Digital Marketing Agency in India",
      description:
        "AI-powered creative agency from India. Gen AI ads, reels, SEO, Meta ads and CRO for brands in India and the US. Book a free strategy call.",
      canonicalPath: "/",
      keywords: [
        "creative digital marketing agency in India",
        "AI marketing agency India",
        "Gen AI ad agency India",
        "video editing agency India",
        "Meta ads agency India",
        "SEO services India for small business",
        "CRO agency India",
        "digital marketing agency Visakhapatnam",
      ],
      customSchema: [ORGANIZATION_SCHEMA],
      faqs: [
        {
          question: "How much does Lumen & Co charge?",
          answer:
            "US plans start at $600/month. India and custom packages are quoted after a free strategy call.",
        },
        {
          question: "Do you work with clients outside India?",
          answer:
            "Yes. We are fully online and work with US businesses, including med spas, on US-hours calls.",
        },
        {
          question: "What services does Lumen & Co provide?",
          answer:
            "We provide Generative AI ads, video editing & reels, high-converting social creatives, Meta & Google performance advertising, SEO, and CRO for brands in India and the United States.",
        },
        {
          question: "Where is Lumen & Co based?",
          answer:
            "Lumen & Co is based in Visakhapatnam, Andhra Pradesh, India, serving national Indian brands and international clients across the US.",
        },
      ],
    }),
  component: App,
});
