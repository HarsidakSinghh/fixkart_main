import { Camera, CheckCircle2, ShieldCheck, Target } from "lucide-react";
import IndustryUseCaseCards from "@/app/components/IndustryUseCaseCards";
import IndustryHardwareShowcase from "@/app/components/IndustryHardwareShowcase";

const pillars = [
  {
    title: "Quality Inspection",
    body: "Vision models detect dimensional errors, surface defects, and packaging issues during production instead of post-production.",
    icon: CheckCircle2,
    image: "/indus/qualinspec.webp",
  },
  {
    title: "Safety Monitoring",
    body: "Real-time scene analysis checks PPE usage, restricted-zone access, and unsafe motion around active equipment.",
    icon: ShieldCheck,
    image: "/indus/worksafe.jpeg",
  },
  {
    title: "Process Optimization",
    body: "Continuous visual tracking highlights bottlenecks, cycle-time drift, and line performance losses.",
    icon: Target,
    image: "/industry/photos/process-card.jpg",
  },
];

const outcomes = [
  {
    title: "Lower Rejection and Rework Rates",
    detail: "Improve first-pass quality with early defect detection and consistent inspection decisions.",
  },
  {
    title: "Reduced Unplanned Downtime",
    detail: "Detect anomalies sooner and schedule corrective actions before breakdowns affect production.",
  },
  {
    title: "Improved Traceability Across Operations",
    detail: "Maintain complete event trails from inspection to dispatch for better control and compliance.",
  },
  {
    title: "Faster Root-Cause Analysis",
    detail: "Use visual evidence and timeline data to quickly isolate process bottlenecks and failure points.",
  },
  {
    title: "Higher OEE and Throughput Stability",
    detail: "Stabilize line performance with real-time monitoring, alerts, and continuous optimization loops.",
  },
];

const metrics = [
  { label: "Inspection Accuracy", value: "99%+" },
  { label: "Downtime Impact", value: "-25%" },
  { label: "Defect Escapes", value: "-40%" },
];

export default async function Industry40Page({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const isHardwareView = view === "hardware";

  if (isHardwareView) {
    return <IndustryHardwareShowcase />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9fc] via-[#f5f8ff] to-[#eef3fb] text-slate-900">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-20">
        <header className="rounded-3xl border border-[#dce6f6] bg-gradient-to-br from-white to-[#f4f8ff] px-8 py-12 md:px-12 md:py-14 shadow-[0_18px_45px_-28px_rgba(0,65,150,0.25)]">
          <p className="text-xs tracking-[0.16em] uppercase font-bold text-[#00529b]">Industry 4.0</p>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
            AI in Manufacturing
          </h1>
          <p className="mt-6 max-w-3xl text-slate-600 leading-8 text-[15px] md:text-base">
            Industry 4.0 combines connected machines, real-time data, and AI-driven decisions. Computer vision plays a central role by
            turning visual production signals into immediate actions for quality, safety, and productivity.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-[#d8e3f5] bg-white/90 px-5 py-4 backdrop-blur shadow-[0_8px_20px_-16px_rgba(0,65,150,0.35)]"
              >
                <p className="text-2xl font-extrabold text-[#00529b]">{metric.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.08em] text-slate-500">{metric.label}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="mt-12 rounded-3xl border border-[#dde6f5] bg-white p-8 md:p-12 shadow-[0_14px_36px_-30px_rgba(20,55,110,0.45)]">
          <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
          <div className="mt-6 space-y-5 text-slate-600 leading-8 text-[15px] md:text-base">
            <p>
              Cameras and sensors capture continuous visual data from lines, workstations, and machine interfaces. AI models on edge
              devices analyze this stream in milliseconds to identify defects, non-compliance, and anomalies.
            </p>
            <p>
              These detections feed directly into operations logic. The system can trigger alerts, stop actions, reroute parts, or raise
              maintenance tasks while also logging each event for traceability in MES and ERP workflows.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold">Core Applications</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#dbe5f7] bg-gradient-to-br from-white to-[#f7faff] p-6 shadow-[0_16px_30px_-26px_rgba(0,65,150,0.6)] hover:shadow-[0_24px_38px_-26px_rgba(0,65,150,0.5)] hover:-translate-y-0.5 transition-all"
              >
                <div className="mb-4 h-36 rounded-xl overflow-hidden border border-[#d9e4f6]">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#cfe0ff] bg-[#eef4ff] px-3 py-1.5 text-[#00529b]">
                  <item.icon size={16} />
                  <p className="font-bold text-sm">{item.title}</p>
                </div>
                <p className="mt-4 text-sm text-slate-600 leading-7">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <IndustryUseCaseCards />

        <section className="mt-12 rounded-3xl bg-gradient-to-br from-[#0f2243] to-[#0a356f] p-8 md:p-12 shadow-[0_18px_40px_-26px_rgba(9,35,78,0.85)]">
          <div className="flex items-center gap-2 text-blue-100">
            <Camera size={18} />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Business Outcomes</h2>
          </div>
          <p className="mt-2 text-blue-100/80 text-sm md:text-base">
            Measurable impact delivered through AI-driven operations intelligence.
          </p>
          <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {outcomes.map((outcome) => (
              <li
                key={outcome.title}
                className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-5 py-4"
              >
                <p className="text-white font-semibold">{outcome.title}</p>
                <p className="mt-1.5 text-blue-100/90 text-sm leading-6">{outcome.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Section - Explore Hardware */}
        <section className="mt-12 rounded-3xl border border-[#d7e7ff] bg-gradient-to-br from-[#f8fbff] to-[#e8f1ff] p-8 md:p-12 shadow-[0_20px_50px_-35px_rgba(0,65,150,0.4)]">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00529b]/10 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#00529b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2 2-2H7 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#123b79]">Ready to Explore Our Hardware?</h2>
            <p className="mt-4 text-[#31537f] leading-7 text-sm md:text-base">
              Discover our cutting-edge AI hardware solutions tailored for industrial applications. 
              From edge computing to enterprise-grade systems, find the perfect hardware to power your Industry 4.0 initiatives.
            </p>
            <a 
              href="/industry-4-0?view=hardware"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#00529b] text-white font-semibold rounded-full hover:bg-[#004a8f] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Explore Hardware</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
