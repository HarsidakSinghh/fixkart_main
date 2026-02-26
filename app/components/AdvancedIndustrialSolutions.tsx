"use client";

import { useMemo, useState } from "react";

type Solution = {
  key: string;
  title: string;
  image: string;
  summary: string;
  useCases: string[];
};

const solutions: Solution[] = [
  {
    key: "defect",
    title: "Automated Defect Inspection",
    image: "/industry/defect-inspection.svg",
    summary: "AI-driven inspection that detects product and process defects early with consistent quality decisions.",
    useCases: [
      "Surface crack, dent, and coating detection",
      "Dimensional tolerance and profile validation",
      "Label, print, and packaging verification",
    ],
  },
  {
    key: "llm",
    title: "LLMs for Industrial Data Management",
    image: "/industry/llm-data-management.svg",
    summary: "Use domain-tuned LLMs to search, summarize, and operationalize complex plant data across teams.",
    useCases: [
      "SOP and maintenance manual Q&A assistant",
      "Production incident summarization and reporting",
      "Cross-system data query in natural language",
    ],
  },
  {
    key: "contactless",
    title: "Advanced Contactless Machine Monitoring",
    image: "/industry/contactless-monitoring.svg",
    summary: "Remote machine health tracking using vision and sensor streams without physical contact instrumentation.",
    useCases: [
      "Thermal drift and motion anomaly alerts",
      "Bearing and belt condition trend monitoring",
      "Continuous health scores for critical assets",
    ],
  },
  {
    key: "sustainable",
    title: "Sustainable Edge-AI Compute Solutions",
    image: "/industry/sustainable-edge-ai.svg",
    summary: "Energy-efficient edge deployment for real-time AI in factories while controlling compute cost and carbon impact.",
    useCases: [
      "Low-power line-side inference architectures",
      "Adaptive model scheduling by production load",
      "Hybrid edge-cloud optimization pipelines",
    ],
  },
  {
    key: "safety",
    title: "Industrial Safety & Security",
    image: "/industry/safety-security.svg",
    summary: "Continuous monitoring for workforce safety, site compliance, and perimeter/zone security events.",
    useCases: [
      "PPE compliance and unsafe-behavior alerts",
      "Restricted area intrusion detection",
      "Shift-level audit trail and incident evidence",
    ],
  },
];

export default function AdvancedIndustrialSolutions() {
  const [activeKey, setActiveKey] = useState(solutions[0].key);
  const active = useMemo(
    () => solutions.find((item) => item.key === activeKey) ?? solutions[0],
    [activeKey]
  );

  return (
    <section className="mt-14 rounded-3xl border border-[#d8e3f5] bg-white p-6 md:p-8 shadow-[0_14px_36px_-30px_rgba(20,55,110,0.45)]">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Advanced Industrial Solutions</h2>
      <p className="mt-2 text-slate-600 text-sm md:text-base">
        Click any solution card to view detailed use cases.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        {solutions.map((item) => {
          const isActive = item.key === active.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              className={`rounded-xl border text-left transition-all overflow-hidden ${
                isActive ? "border-[#acc7f3] shadow-md bg-[#f4f8ff]" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="h-24 bg-slate-100">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <p className={`text-sm font-semibold leading-5 ${isActive ? "text-[#0a4f9f]" : "text-slate-800"}`}>{item.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl border border-slate-200 overflow-hidden">
        <div className="lg:col-span-7 h-64 md:h-80 bg-slate-100">
          <img src={active.image} alt={active.title} className="h-full w-full object-cover" />
        </div>
        <div className="lg:col-span-5 p-5 md:p-6 bg-gradient-to-b from-white to-[#f8fbff]">
          <h3 className="text-xl font-bold text-slate-900">{active.title}</h3>
          <p className="mt-3 text-slate-600 leading-7 text-sm md:text-base">{active.summary}</p>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[#00529b] font-semibold">Use Cases</p>
            <ul className="mt-2 space-y-2">
              {active.useCases.map((useCase) => (
                <li key={useCase} className="text-slate-700 text-sm md:text-base rounded-lg bg-white border border-slate-200 px-3 py-2">
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
