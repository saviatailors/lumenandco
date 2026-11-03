import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { Footer, Eyebrow } from "@/app/components/HomeSections";
import LeadFormDialog, { openLeadForm } from "@/app/components/LeadForm";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildSeoMeta({
      title: "Book a Free Strategy Call | Lumen & Co",
      description:
        "Tell us about your business and we'll plan your growth on a free call. India and US time zones.",
      canonicalPath: "/contact/",
      keywords: [
        "book marketing strategy call",
        "contact Lumen and Co",
        "digital agency Visakhapatnam contact",
        "hire digital marketing agency India",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Contact", item: "/contact/" },
      ],
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div
      className="relative min-h-screen w-full bg-[#f8f9fa] text-[#111] p-3 sm:p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <Navbar />

        {/* Hero */}
        <section className="pt-12 sm:pt-20 pb-12 text-center px-4">
          <div className="flex justify-center mb-4">
            <Eyebrow>Direct Access</Eyebrow>
          </div>
          <h1
            className="mt-4 max-w-3xl mx-auto text-balance tracking-tight"
            style={{
              fontSize: "clamp(34px, 6vw, 60px)",
              lineHeight: 1.08,
              fontWeight: 600,
              letterSpacing: "-0.025em",
            }}
          >
            Let's Talk Growth
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-neutral-600 text-sm sm:text-base leading-relaxed">
            Tell us about your business and we'll plan your next growth phase on a free, 30-minute strategy call. Serving clients in India and US time zones.
          </p>
        </section>

        {/* Contact Info & Direct Form Grid */}
        <section className="mb-20 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Direct Contact Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-neutral-500 tracking-wider">
                  Direct Inquiries
                </span>
                <h2 className="text-xl font-bold text-neutral-900 mt-2 mb-4">
                  Speak Directly with Leadership
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  No junior gatekeepers. Every inquiry is personally reviewed by founder Sahit Sai Pothala and our senior growth directors.
                </p>

                <div className="space-y-4 text-xs text-neutral-700">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-150">
                    <Mail className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-neutral-900">Email Address</div>
                      <a href="mailto:sahitsai6@gmail.com" className="text-neutral-600 hover:text-[#ef4d23]">
                        sahitsai6@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-150">
                    <Phone className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-neutral-900">Phone &amp; WhatsApp</div>
                      <a href="tel:+917842410691" className="text-neutral-600 hover:text-[#ef4d23]">
                        +91-7842410691
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-150">
                    <MapPin className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-neutral-900">Headquarters</div>
                      <span className="text-neutral-600">
                        Visakhapatnam, Andhra Pradesh, India (IN)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-150">
                    <Clock className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-neutral-900">Operating Windows</div>
                      <span className="text-neutral-600">
                        India (IST: Mon–Fri, 9–6) &amp; United States (EST / CST / PST hours)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-100">
                <div className="text-[11px] text-neutral-400">
                  Average response time: &lt; 2 business hours
                </div>
              </div>
            </div>

            {/* Strategy Call Scheduling Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-[#ef4d23] tracking-wider">
                  Fastest Way to Start
                </span>
                <h2 className="text-xl font-bold text-neutral-900 mt-2 mb-2">
                  Book Your 30-Min Strategy Call
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  Click below to open our interactive intake form. Tell us your website, ad spend, and biggest bottleneck, and we will prepare a custom audit before our call.
                </p>

                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-xs text-neutral-700 space-y-2.5 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23]" />
                    <span>Free 30-minute growth &amp; creative audit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23]" />
                    <span>Review of your historical ROAS and cost-per-lead</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23]" />
                    <span>Concrete creative hook recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23]" />
                    <span>Zero high-pressure pitch decks</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => openLeadForm("calendar")}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-full text-white py-3 text-sm font-semibold shadow hover-lift transition-transform cursor-pointer"
                  style={{ backgroundColor: "#ef4d23" }}
                >
                  Schedule 30-Min Call
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <LeadFormDialog />
      </div>
    </div>
  );
}
