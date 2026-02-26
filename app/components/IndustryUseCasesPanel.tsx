"use client";

import { useState } from "react";

type UseCaseItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  summary: string;
  points: string[];
};

const useCaseItems: UseCaseItem[] = [
  {
    id: "predict-ai",
    title: "Predict.AI",
    subtitle: "Predictive Maintenance",
    image: "/industry/photos/contactless-monitoring.jpg",
    summary: "Detect machine wear patterns early and prevent unplanned failures.",
    points: [
      "Identify abnormal vibration and thermal signatures.",
      "Schedule maintenance only when needed.",
      "Reduce emergency stoppages and spare-part waste.",
    ],
  },
  {
    id: "trust-ai",
    title: "Trust.AI",
    subtitle: "Quality Assurance",
    image: "/industry/photos/defect-inspection.jpg",
    summary: "Vision-based inspection for defect detection and process consistency.",
    points: [
      "Surface defect and dimensional checks in real time.",
      "Automated pass/fail classification with traceability.",
      "Lower rejection, rework, and customer returns.",
    ],
  },
  {
    id: "conserve-ai",
    title: "Conserve.AI",
    subtitle: "Energy Optimization",
    image: "/industry/photos/sustainable-edge-ai.jpg",
    summary: "Optimize energy-intensive operations using visual and sensor intelligence.",
    points: [
      "Monitor equipment utilization against production output.",
      "Flag high-energy process deviations.",
      "Support sustainability and cost reduction targets.",
    ],
  },
  {
    id: "track-ai",
    title: "Track.AI",
    subtitle: "Asset & Flow Visibility",
    image: "/industry/photos/llm-data-management.jpg",
    summary: "Track assets, material movement, and logistics status across sites.",
    points: [
      "Locate critical tools, pallets, and inventory quickly.",
      "Improve line-side replenishment and dispatch flow.",
      "Increase operational visibility with fewer manual updates.",
    ],
  },
  {
    id: "spot-ai",
    title: "Spot.AI",
    subtitle: "Safety & Compliance",
    image: "/industry/photos/safety-security.jpg",
    summary: "Protect workers and enforce policy with real-time scene intelligence.",
    points: [
      "Detect PPE non-compliance in high-risk zones.",
      "Alert on unsafe proximity to moving equipment.",
      "Maintain audit-ready compliance records.",
    ],
  },
];

export default function IndustryUseCasesPanel() {
  const [activeId, setActiveId] = useState(useCaseItems[0].id);
  const activeItem = useCaseItems.find((item) => item.id === activeId) ?? useCaseItems[0];

  return (
    <section className="mt-14 rounded-3xl border border-[#dde6f5] bg-white p-6 md:p-8 shadow-[0_14px_36px_-30px_rgba(20,55,110,0.45)]">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Industry AI Solutions</h2>
      <p className="mt-2 text-slate-600 text-sm md:text-base">
        Select a solution to view detailed use cases.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="space-y-2">
            {useCaseItems.map((item) => {
              const isActive = item.id === activeItem.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                    isActive
                      ? "border-[#b9d0f8] bg-[#edf4ff] shadow-sm"
                      : "border-transparent bg-white hover:border-slate-200"
                  }`}
                >
                  <p className={`font-bold ${isActive ? "text-[#00529b]" : "text-slate-800"}`}>{item.title}</p>
                  <p className="text-xs mt-0.5 text-slate-500">{item.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8 rounded-2xl border border-slate-200 overflow-hidden bg-white">
          <div className="h-56 md:h-72 bg-slate-100">
            <img src={activeItem.image} alt={activeItem.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-5 md:p-6">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">{activeItem.title}</h3>
            <p className="mt-2 text-slate-600 leading-7">{activeItem.summary}</p>
            <ul className="mt-4 space-y-2">
              {activeItem.points.map((point) => (
                <li key={point} className="text-slate-700 text-sm md:text-base">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
