import { Camera, CheckCircle2, ShieldCheck, Target } from "lucide-react";

const pillars = [
  {
    title: "Quality Inspection",
    body: "Vision models detect dimensional errors, surface defects, and packaging issues during production instead of post-production.",
    icon: CheckCircle2,
  },
  {
    title: "Safety Monitoring",
    body: "Real-time scene analysis checks PPE usage, restricted-zone access, and unsafe motion around active equipment.",
    icon: ShieldCheck,
  },
  {
    title: "Process Optimization",
    body: "Continuous visual tracking highlights bottlenecks, cycle-time drift, and line performance losses.",
    icon: Target,
  },
];

const outcomes = [
  "Lower rejection and rework rates",
  "Reduced unplanned downtime",
  "Improved traceability across operations",
  "Faster root-cause analysis",
  "Higher OEE and throughput stability",
];

export default function Industry40Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <header className="rounded-2xl border border-slate-200 bg-white px-7 py-10 md:px-10 md:py-12 shadow-sm">
          <p className="text-xs tracking-[0.14em] uppercase font-bold text-[#00529b]">Industry 4.0</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
            Computer Vision for
            <span className="text-[#00529b]"> Smart Manufacturing</span>
          </h1>
          <p className="mt-5 max-w-3xl text-slate-600 leading-8 text-[15px] md:text-base">
            Industry 4.0 combines connected machines, real-time data, and AI-driven decisions. Computer vision plays a central role by
            turning visual production signals into immediate actions for quality, safety, and productivity.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-7 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
          <div className="mt-5 space-y-4 text-slate-600 leading-8 text-[15px] md:text-base">
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

        <section className="mt-10">
          <h2 className="text-2xl md:text-3xl font-bold">Core Applications</h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {pillars.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#00529b]">
                  <item.icon size={18} />
                  <p className="font-bold">{item.title}</p>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-7">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-7 md:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-[#00529b]">
            <Camera size={18} />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Business Outcomes</h2>
          </div>
          <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-slate-700">
            {outcomes.map((outcome) => (
              <li key={outcome} className="border-b border-slate-100 pb-2">
                {outcome}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
