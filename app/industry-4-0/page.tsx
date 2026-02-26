import { Activity, Camera, CheckCircle2, Cpu, Factory, ShieldCheck, Sparkles, Target } from "lucide-react";

const useCases = [
  {
    title: "Automated Quality Inspection",
    description:
      "Cameras validate dimensions, surface defects, assembly integrity, and packaging accuracy in real time.",
    impact: "Lower rejection rates and faster root-cause detection.",
    icon: CheckCircle2,
  },
  {
    title: "Predictive Maintenance",
    description:
      "Vision systems monitor vibration signatures, thermal patterns, and machine wear indicators before failure.",
    impact: "Reduced unplanned downtime and improved asset life.",
    icon: Activity,
  },
  {
    title: "Worker Safety & Compliance",
    description:
      "AI models detect PPE usage, unsafe proximity to moving machines, and restricted-area violations.",
    impact: "Safer operations with auditable compliance records.",
    icon: ShieldCheck,
  },
  {
    title: "Process Intelligence",
    description:
      "Computer vision tracks cycle times, line bottlenecks, and station-level throughput with actionable analytics.",
    impact: "Higher OEE and better production planning.",
    icon: Target,
  },
];

const workflow = [
  {
    step: "1. Data Capture",
    detail: "Industrial cameras acquire images/video from production lines, conveyors, and critical machines.",
  },
  {
    step: "2. AI Inference",
    detail: "Edge AI models classify defects, detect anomalies, and evaluate compliance in milliseconds.",
  },
  {
    step: "3. Decision Layer",
    detail: "Rules trigger pass/fail actions, alerts, machine stops, or maintenance tickets automatically.",
  },
  {
    step: "4. Feedback Loop",
    detail: "Results are logged to MES/ERP for traceability, analytics, and model retraining.",
  },
];

const kpis = [
  "First Pass Yield (FPY)",
  "Overall Equipment Effectiveness (OEE)",
  "Mean Time Between Failures (MTBF)",
  "Scrap and Rework Percentage",
  "Downtime Reduction",
  "Cycle-Time Variance",
];

export default function Industry40Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-70" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-100 blur-3xl opacity-60" />

          <div className="relative p-7 md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs md:text-sm font-bold text-[#00529b]">
              <Sparkles size={14} />
              Industry 4.0 Overview
            </div>

            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Smart Manufacturing Powered by
              <span className="text-[#00529b]"> Computer Vision</span>
            </h1>

            <p className="mt-4 max-w-3xl text-slate-600 text-sm md:text-base leading-7">
              Industry 4.0 connects machines, sensors, data, and AI to build adaptive factories. Computer vision is a core enabler:
              it converts visual signals from production lines into instant decisions for quality, safety, maintenance, and productivity.
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-[#00529b] font-bold">
                  <Camera size={16} />
                  Vision Nodes
                </div>
                <p className="mt-2 text-sm text-slate-600">High-speed cameras + edge AI models on the line.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-[#00529b] font-bold">
                  <Cpu size={16} />
                  Edge Intelligence
                </div>
                <p className="mt-2 text-sm text-slate-600">Low-latency decisions directly at the machine level.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-[#00529b] font-bold">
                  <Factory size={16} />
                  Factory Integration
                </div>
                <p className="mt-2 text-sm text-slate-600">Connected with MES/ERP for full digital traceability.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Computer Vision in Industry</h2>
            <p className="mt-2 text-slate-600 text-sm md:text-base">
              Practical use cases that deliver measurable operational value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {useCases.map((item) => (
              <article
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-[#00529b] border border-blue-100">
                    <item.icon size={18} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                </div>

                <p className="mt-3 text-slate-600 leading-7 text-sm">{item.description}</p>
                <p className="mt-3 text-sm font-semibold text-emerald-700">{item.impact}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">Computer Vision Workflow in Smart Factories</h3>
            <p className="mt-2 text-slate-600 text-sm md:text-base">
              A scalable deployment combines hardware, AI models, and operations systems into one continuous loop.
            </p>

            <div className="mt-6 space-y-4">
              {workflow.map((item) => (
                <div key={item.step} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-[#00529b]">{item.step}</p>
                  <p className="mt-1 text-sm text-slate-600 leading-7">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-900">Key Outcomes & KPI Tracking</h3>
            <p className="mt-2 text-slate-600 text-sm leading-7">
              High-performing Industry 4.0 programs are measured by operational reliability, quality consistency, and speed.
            </p>

            <ul className="mt-4 space-y-2">
              {kpis.map((kpi) => (
                <li key={kpi} className="text-sm text-slate-700 rounded-lg bg-white border border-slate-200 px-3 py-2">
                  {kpi}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">Technology Stack for Industry 4.0 Vision Systems</h3>
          <p className="mt-2 text-slate-600 text-sm md:text-base leading-7">
            A production-ready setup blends edge computing, industrial networking, and cloud analytics. Typical architecture includes:
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="font-bold text-slate-900">Sensing Layer</p>
              <p className="mt-2 text-sm text-slate-600">2D/3D cameras, thermal imaging, line scanners, and synchronized lighting.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="font-bold text-slate-900">Edge Layer</p>
              <p className="mt-2 text-sm text-slate-600">Industrial PCs/edge GPUs running low-latency inspection and detection models.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="font-bold text-slate-900">Integration Layer</p>
              <p className="mt-2 text-sm text-slate-600">PLC, SCADA, MES, and ERP integration for automated control and traceability.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="font-bold text-slate-900">Analytics Layer</p>
              <p className="mt-2 text-sm text-slate-600">Dashboards for defect trends, throughput insights, and predictive optimization.</p>
            </div>
          </div>
        </section>

        <section className="mt-10 mb-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">Implementation Roadmap</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-blue-100 p-4">
              <p className="text-xs font-bold text-[#00529b]">PHASE 01</p>
              <p className="mt-1 font-semibold text-slate-900">Assess</p>
              <p className="mt-2 text-sm text-slate-600">Identify high-defect, high-downtime stations and define business goals.</p>
            </div>
            <div className="rounded-xl bg-white border border-blue-100 p-4">
              <p className="text-xs font-bold text-[#00529b]">PHASE 02</p>
              <p className="mt-1 font-semibold text-slate-900">Pilot</p>
              <p className="mt-2 text-sm text-slate-600">Deploy one line with edge inference, validate model accuracy and cycle impact.</p>
            </div>
            <div className="rounded-xl bg-white border border-blue-100 p-4">
              <p className="text-xs font-bold text-[#00529b]">PHASE 03</p>
              <p className="mt-1 font-semibold text-slate-900">Scale</p>
              <p className="mt-2 text-sm text-slate-600">Replicate patterns across plants with centralized monitoring standards.</p>
            </div>
            <div className="rounded-xl bg-white border border-blue-100 p-4">
              <p className="text-xs font-bold text-[#00529b]">PHASE 04</p>
              <p className="mt-1 font-semibold text-slate-900">Optimize</p>
              <p className="mt-2 text-sm text-slate-600">Retrain models from live feedback and continuously improve KPIs.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
