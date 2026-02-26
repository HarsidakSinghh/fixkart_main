import { Camera, CheckCircle2, ShieldCheck, Target } from "lucide-react";
import IndustryUseCasesPanel from "@/app/components/IndustryUseCasesPanel";

const pillars = [
  {
    title: "Quality Inspection",
    body: "Vision models detect dimensional errors, surface defects, and packaging issues during production instead of post-production.",
    icon: CheckCircle2,
    image:
      "https://images.unsplash.com/photo-1581092921461-39b9d08a9b2a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Safety Monitoring",
    body: "Real-time scene analysis checks PPE usage, restricted-zone access, and unsafe motion around active equipment.",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1581093450021-4a7360e9a6f6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Process Optimization",
    body: "Continuous visual tracking highlights bottlenecks, cycle-time drift, and line performance losses.",
    icon: Target,
    image:
      "https://images.unsplash.com/photo-1565799557186-1c6f441b7794?auto=format&fit=crop&w=1200&q=80",
  },
];

const outcomes = [
  "Lower rejection and rework rates",
  "Reduced unplanned downtime",
  "Improved traceability across operations",
  "Faster root-cause analysis",
  "Higher OEE and throughput stability",
];

const metrics = [
  { label: "Inspection Accuracy", value: "99%+" },
  { label: "Downtime Impact", value: "-25%" },
  { label: "Defect Escapes", value: "-40%" },
];

export default function Industry40Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9fc] via-[#f5f8ff] to-[#eef3fb] text-slate-900">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-20">
        <header className="rounded-3xl border border-[#dce6f6] bg-gradient-to-br from-white to-[#f4f8ff] px-8 py-12 md:px-12 md:py-14 shadow-[0_18px_45px_-28px_rgba(0,65,150,0.25)]">
          <p className="text-xs tracking-[0.16em] uppercase font-bold text-[#00529b]">Industry 4.0</p>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
            Computer Vision for
            <span className="text-[#00529b]"> Smart Manufacturing</span>
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

        <section className="mt-10 overflow-hidden rounded-3xl border border-[#dde6f5] bg-white shadow-[0_14px_36px_-30px_rgba(20,55,110,0.45)]">
          <div className="relative h-52 md:h-72">
            <img
              src="https://images.unsplash.com/photo-1581092786450-7ef25f140997?auto=format&fit=crop&w=1800&q=80"
              alt="Industry 4.0 automation floor"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b2344]/75 via-[#0b2344]/55 to-transparent" />
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
              <p className="text-white text-xs md:text-sm tracking-[0.14em] uppercase font-semibold">Computer Vision Platform</p>
              <h2 className="mt-2 text-white text-2xl md:text-4xl font-extrabold max-w-2xl">
                Real-time visibility for quality, safety, and production performance
              </h2>
            </div>
          </div>
        </section>

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

        <IndustryUseCasesPanel />

        <section className="mt-12 rounded-3xl border border-[#dde6f5] bg-white p-8 md:p-12 shadow-[0_14px_36px_-30px_rgba(20,55,110,0.45)]">
          <div className="flex items-center gap-2 text-[#00529b]">
            <Camera size={18} />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Business Outcomes</h2>
          </div>
          <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-slate-700">
            {outcomes.map((outcome) => (
              <li key={outcome} className="rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3">
                {outcome}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
