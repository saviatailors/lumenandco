import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, User, Share2, CheckCircle2 } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { Footer, Eyebrow } from "@/app/components/HomeSections";
import LeadFormDialog, { openLeadForm } from "@/app/components/LeadForm";
import { buildSeoMeta, SITE_URL } from "@/lib/seo";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) {
      return buildSeoMeta({
        title: "Article Not Found | Lumen & Co",
        description: "The requested marketing guide could not be found.",
        canonicalPath: `/blog/${params.slug}/`,
      });
    }

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.metaDescription,
      "datePublished": post.publishDate,
      "dateModified": post.publishDate,
      "author": {
        "@type": "Person",
        "name": post.author,
        "url": `${SITE_URL}/about/`,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Lumen & Co",
        "url": `${SITE_URL}/`,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/lumen-and-co-logo.png`,
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${SITE_URL}/blog/${post.slug}/`,
      },
      "articleSection": post.market === "US" ? "Med Spa Marketing" : "Digital Agency Pricing & Growth",
      "keywords": post.primaryKeyword,
    };

    return buildSeoMeta({
      title: `${post.seoTitle} | Lumen & Co`,
      description: post.metaDescription,
      canonicalPath: `/blog/${post.slug}/`,
      type: "article",
      author: post.author,
      publishedTime: post.publishDate,
      keywords: [post.primaryKeyword, "Lumen and Co", "marketing strategy", post.market],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Blog", item: "/blog/" },
        { name: post.title, item: `/blog/${post.slug}/` },
      ],
      customSchema: [articleSchema],
    });
  },
  component: BlogPostComponent,
});

function BlogPostComponent() {
  const { slug } = Route.useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-neutral-500 mb-4">The article you requested could not be located.</p>
          <Link to="/blog/" className="text-[#ef4d23] underline font-medium">
            ← Return to Blog Index
          </Link>
        </div>
      </div>
    );
  }

  // Related posts
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug);

  return (
    <div
      className="relative min-h-screen w-full bg-[#f8f9fa] text-[#111] p-3 sm:p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        <Navbar />

        {/* Back Link & Breadcrumbs */}
        <div className="pt-8 sm:pt-12 px-4 flex items-center justify-between text-xs text-neutral-500">
          <Link
            to="/blog/"
            className="inline-flex items-center gap-1.5 hover:text-black transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all articles
          </Link>
          <span className="uppercase tracking-wider font-semibold text-[#ef4d23]">
            {post.market} Focus
          </span>
        </div>

        {/* Article Header */}
        <header className="pt-6 pb-8 px-4 text-left">
          <h1
            className="text-3xl sm:text-5xl font-semibold text-neutral-900 tracking-tight leading-tight text-balance"
            style={{ letterSpacing: "-0.02em" }}
          >
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-neutral-500 border-b border-neutral-200 pb-6">
            <span className="inline-flex items-center gap-1.5 font-medium text-neutral-800">
              <User className="w-4 h-4 text-[#ef4d23]" /> {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {post.displayDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {post.readingTime}
            </span>
          </div>

          {/* AI Search Featured Snippet Box (Direct Answer) */}
          <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
            <div className="text-xs font-semibold text-[#ef4d23] uppercase tracking-wider mb-1.5">
              Summary / Direct Answer
            </div>
            <p className="text-sm sm:text-base text-neutral-800 font-medium leading-relaxed">
              {post.directAnswer}
            </p>
          </div>
        </header>

        {/* Article Body */}
        <main className="px-4 pb-16">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm prose prose-neutral max-w-none text-neutral-700 leading-relaxed">
            <div
              className="space-y-6 text-sm sm:text-base"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/## (.*)/g, '<h2 class="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight mt-8 mb-4">$1</h2>')
                  .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-neutral-900 tracking-tight mt-6 mb-3">$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#ef4d23] font-medium underline underline-offset-2 hover:opacity-80">$1</a>')
                  .replace(/---/g, '<hr class="my-6 border-neutral-200" />'),
              }}
            />
          </div>

          {/* Related Service Box */}
          <div className="mt-8 p-6 rounded-3xl bg-[#0b0f1a] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <div className="text-xs uppercase font-semibold text-[#ef4d23] tracking-wider mb-1">
                Take Action
              </div>
              <h3 className="text-lg font-semibold text-white">
                Ready to Implement This in Your Business?
              </h3>
              <p className="text-xs text-neutral-300 mt-1">
                Schedule a 30-minute growth session with our senior strategists.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to={post.relatedServiceUrl as any}
                className="rounded-full bg-white text-neutral-900 text-xs font-semibold px-4 py-2 hover:bg-neutral-100 transition-colors"
              >
                {post.relatedServiceLabel}
              </Link>
              <button
                onClick={openLeadForm}
                className="rounded-full text-white text-xs font-semibold px-4 py-2 shadow"
                style={{ backgroundColor: "#ef4d23" }}
              >
                Book a call
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {otherPosts.length > 0 ? (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Related Guides</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherPosts.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/blog/${p.slug}/` as any}
                    className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-[#ef4d23] uppercase">
                        {p.market}
                      </span>
                      <h4 className="text-sm font-semibold text-neutral-900 mt-1 mb-2 leading-snug">
                        {p.title}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-2">{p.summary}</p>
                    </div>
                    <div className="mt-3 text-xs text-[#ef4d23] font-medium flex items-center gap-1">
                      Read article <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </main>

        <Footer />
        <LeadFormDialog />
      </div>
    </div>
  );
}
