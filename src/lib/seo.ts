export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  canonicalPath: string; // e.g. "/services/gen-ai-ads/"
  keywords?: string[];
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  faqs?: FaqItem[];
  breadcrumbs?: BreadcrumbItem[];
  serviceSchema?: {
    serviceType: string;
    name: string;
    description: string;
  };
  customSchema?: Record<string, unknown>[];
}

export const SITE_URL = "https://www.lumenandco.com";
export const BRAND_NAME = "Lumen & Co";
export const BRAND_COLOR = "#EF4D23";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/lumen-and-co-logo.png`;

/**
 * Builds the TanStack Router head object containing meta tags, canonical link,
 * Open Graph, Twitter cards, and structured JSON-LD schemas.
 */
export function buildSeoMeta(config: SeoConfig) {
  // Normalize canonical path: ensure starting slash and trailing slash
  let cleanPath = config.canonicalPath.startsWith("/")
    ? config.canonicalPath
    : `/${config.canonicalPath}`;
  if (cleanPath !== "/" && !cleanPath.endsWith("/")) {
    cleanPath = `${cleanPath}/`;
  }
  const canonicalUrl = `${SITE_URL}${cleanPath === "/" ? "/" : cleanPath}`;
  const ogImageUrl = config.ogImage
    ? config.ogImage.startsWith("http")
      ? config.ogImage
      : `${SITE_URL}${config.ogImage}`
    : DEFAULT_OG_IMAGE;

  const meta: Array<Record<string, string>> = [
    { title: config.title },
    { name: "description", content: config.description },
    { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
    { name: "theme-color", content: BRAND_COLOR },
    { property: "og:site_name", content: BRAND_NAME },
    { property: "og:type", content: config.type || "website" },
    { property: "og:title", content: config.title },
    { property: "og:description", content: config.description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: config.title },
    { name: "twitter:description", content: config.description },
    { name: "twitter:image", content: ogImageUrl },
  ];

  if (config.keywords && config.keywords.length > 0) {
    meta.push({ name: "keywords", content: config.keywords.join(", ") });
  }

  if (config.publishedTime) {
    meta.push({ property: "article:published_time", content: config.publishedTime });
  }
  if (config.author) {
    meta.push({ property: "article:author", content: config.author });
  }

  const links = [
    { rel: "canonical", href: canonicalUrl },
  ];

  // Assemble JSON-LD schemas
  const scripts: Array<{ type: string; children: string }> = [];

  // 1. Service schema if applicable
  if (config.serviceSchema) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": config.serviceSchema.serviceType,
        "name": config.serviceSchema.name,
        "provider": { "@id": `${SITE_URL}/#org` },
        "areaServed": ["IN", "US"],
        "url": canonicalUrl,
        "description": config.serviceSchema.description,
      }),
    });
  }

  // 2. FAQPage schema if applicable
  if (config.faqs && config.faqs.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": config.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      }),
    });
  }

  // 3. BreadcrumbList schema if applicable
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": config.breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": b.name,
          "item": b.item.startsWith("http") ? b.item : `${SITE_URL}${b.item.endsWith("/") || b.item.includes("#") ? b.item : b.item + "/"}`,
        })),
      }),
    });
  }

  // 4. Custom schemas
  if (config.customSchema && config.customSchema.length > 0) {
    for (const schema of config.customSchema) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(schema),
      });
    }
  }

  return {
    meta,
    links,
    scripts,
  };
}

/**
 * Master Organization & ProfessionalService schema for Lumen & Co
 */
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#org`,
  "name": "Lumen & Co",
  "alternateName": "Lumen and Co Agency",
  "url": `${SITE_URL}/`,
  "logo": `${SITE_URL}/lumen-and-co-logo.png`,
  "image": `${SITE_URL}/lumen-and-co-logo.png`,
  "description": "Creative, AI-powered digital marketing agency from India offering Gen AI ads, video editing, creatives, performance ads, SEO and CRO for brands in India and the US.",
  "founder": {
    "@type": "Person",
    "name": "Sahit Sai Pothala"
  },
  "email": "sahitsai6@gmail.com",
  "telephone": "+91-7842410691",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Visakhapatnam",
    "addressRegion": "Andhra Pradesh",
    "addressCountry": "IN"
  },
  "areaServed": ["IN", "US"],
  "priceRange": "$$",
  "sameAs": [
    "https://www.instagram.com/lumenandco",
    "https://www.linkedin.com/company/lumenandco"
  ],
  "knowsAbout": [
    "Generative AI advertising",
    "Video editing",
    "Social media marketing",
    "Meta ads",
    "Google ads",
    "SEO",
    "Conversion rate optimization",
    "Med spa marketing"
  ]
};

