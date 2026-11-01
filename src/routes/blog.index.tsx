import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, Clock, Calendar, Sparkles } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { Footer, Eyebrow } from "@/app/components/HomeSections";
import LeadFormDialog, { openLeadForm } from "@/app/components/LeadForm";
import { buildSeoMeta } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/")({
  head: () =>
    buildSeoMeta({
      title: "Digital Marketing & AI Growth Blog | Lumen & Co",
      description:
        "Actionable insights on Gen AI ads, video editing, SEO, and marketing costs for India and US businesses. Practical guides written by practitioners.",
      canonicalPath: "/blog/",
      keywords: [
        "digital marketing blog India",
        "AI ads guides",
        "video marketing tips",
        "med spa marketing blog",
        "marketing costs India",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Blog", item: "/blog/" },
      ],
    }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  return (
    <div
      className="relative min-h-screen w-full bg-[#f8f9fa] text-[#111] p-3 sm:p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <Navbar />

        {/* Hero */}
        <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 text-center px-4">
          <div className="flex justify-center mb-4">
            <Eyebrow>Insights &amp; Playbooks</Eyebrow>
          </div>
          <h1
            className="mt-4 max-w-3xl mx-auto text-balance tracking-tight"
            style={{
              fontSize: "clamp(32px, 5.5vw, 56px)",
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing: "-0.025em",
            }}
          >
            Tactics and Data From the Agency Floor
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-neutral-600 text-sm sm:text-base leading-relaxed">
            No generic fluff. Direct playbooks on video production, Gen AI ad testing, cost benchmarks, and localized growth for Indian brands and US clinics.
          </p>
        </section>

        {/* Posts Grid */}
        <section className="mb-20 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-neutral-300 transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
                      style={{ backgroundColor: "#ef4d23" }}
                    >
                      {post.market}
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {post.readingTime}
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {post.displayDate}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-3 tracking-tight leading-snug">
                    <Link
                      to={`/blog/${post.slug}/` as any}
                      className="hover:text-[#ef4d23] transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    {post.summary}
                  </p>

                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 text-xs text-neutral-700 leading-snug mb-6">
                    <span className="font-semibold text-neutral-900 block mb-1">Quick Take:</span>
                    {post.directAnswer}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-medium">By {post.author}</span>
                  <Link
                    to={`/blog/${post.slug}/` as any}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ef4d23] hover:underline"
                  >
                    Read full guide
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 bg-[#0b0f1a] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
              Want Custom Growth Modeling for Your Brand?
            </h2>
            <p className="text-neutral-300 text-sm mb-6">
              Skip the reading and get a tailored audit of your creative hooks, ad accounts, and conversion funnels.
            </p>
            <button
              onClick={openLeadForm}
              className="rounded-full px-6 py-2.5 text-sm font-medium text-white shadow-lg"
              style={{ backgroundColor: "#ef4d23" }}
            >
              Book a free strategy call
            </button>
          </div>
        </section>

        <Footer />
        <LeadFormDialog />
      </div>
    </div>
  );
}

