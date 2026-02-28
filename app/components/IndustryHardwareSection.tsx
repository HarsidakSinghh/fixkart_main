"use client";

import { useState } from "react";
import { Cpu, HardDrive, MemoryStick, Network, Sparkles } from "lucide-react";

type HardwareItem = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  description: string;
  useCases: string[];
  specs: Array<{ label: string; value: string }>;
};

const HARDWARE_ITEMS: HardwareItem[] = [
  {
    id: "s",
    name: "FIXKART EDGE",
    subtitle: "Agentic Edge AI",
    image: "/gpu/1.png",
    description:
      "Compact edge system accelerated by NVIDIA AGX Jetson Orin for real-time AI in mobile and disconnected deployments.",
    useCases: [
      "Video analytics and computer vision",
      "Autonomous systems and IoT AI",
      "Audio/video batch inference at the edge",
      "Remote rugged industrial operations",
    ],
    specs: [
      { label: "GPU", value: "64GB | 2048 CUDA cores | Up to 275 INT8 TOPS" },
      { label: "CPU", value: "Arm Cortex-A78AE cluster, up to 12 cores" },
      { label: "Memory", value: "Up to 64GB LPDDR5 (~204 GB/s)" },
      { label: "Compute", value: "Up to 5.3 TFLOPS FP32" },
      { label: "Power", value: "Optimized edge profiles with configurable modes" },
    ],
  },
  {
    id: "m",
    name: "FIXKART CORE",
    subtitle: "Desktop Private AI",
    image: "/gpu/2.png",
    description:
      "Desktop-scale AI platform powered by NVIDIA Grace-Blackwell Superchip GB10 for secure enterprise workloads.",
    useCases: [
      "Department-level analytics",
      "Local LLM inference and fine-tuning",
      "R&D and simulation without cloud dependency",
      "Batch processing for audio/video/sentiment pipelines",
    ],
    specs: [
      { label: "Architecture", value: "NVIDIA Grace-Blackwell (GB10) Superchip" },
      { label: "CPU", value: "20-core Arm Grace (10x Cortex-X925 + 10x Cortex-A725)" },
      { label: "AI", value: "Up to 1 PFLOP FP4, supports models up to 200B" },
      { label: "Memory", value: "128GB unified memory" },
      { label: "Storage/Network", value: "Up to 4TB NVMe, NVIDIA ConnectX NIC" },
    ],
  },
  {
    id: "xl",
    name: "FIXKART TITAN",
    subtitle: "Datacenter-Grade Private Agentic AI",
    image: "/gpu/3.png",
    description:
      "High-performance on-prem AI infrastructure for large-model inference, orchestration, governance, and mission-critical operations.",
    useCases: [
      "Enterprise process automation engines",
      "Real-time intelligence and monitoring platforms",
      "Large model inference and fine-tuning",
      "AI governance and red-teaming environments",
    ],
    specs: [
      { label: "CPU", value: "Intel Xeon W7-2575X | 22 cores / 44 threads" },
      { label: "GPU", value: "2x NVIDIA RTX Pro 6000 Blackwell" },
      { label: "Memory", value: "192GB ECC DDR5 (6x 32GB)" },
      { label: "Storage", value: "2x 2TB SATA + 1TB PCIe NVMe SSD" },
      { label: "Power/Network", value: "2000W PSU, dual-port X550 10GbE" },
    ],
  },
];

function SpecIcon({ index }: { index: number }) {
  const icons = [Cpu, MemoryStick, HardDrive, Network, Sparkles];
  const Icon = icons[index % icons.length];
  return <Icon size={14} className="text-[#00529b]" />;
}

export default function IndustryHardwareSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mt-10 md:mt-12">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="inline-flex items-center rounded-full border border-[#bcd6ff] bg-white px-4 py-2 text-sm font-semibold text-[#00529b] shadow-sm hover:bg-[#eaf2ff] transition-colors"
      >
        {expanded ? "Hide Hardware" : "Explore Hardware"}
      </button>

      {expanded && (
        <div className="mt-6 rounded-3xl border border-[#d8e6ff] bg-gradient-to-b from-white to-[#f2f8ff] p-5 md:p-8 shadow-[0_20px_40px_-28px_rgba(0,65,150,0.3)]">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0b2e66]">Edge & Private AI Hardware</h2>
            <p className="mt-2 text-[#2e4f80] text-sm md:text-base">
              Recommended deployment systems for industrial AI, from rugged edge devices to datacenter-grade platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {HARDWARE_ITEMS.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[#d3e4ff] bg-white p-4 md:p-5 shadow-[0_14px_28px_-24px_rgba(0,65,150,0.45)]"
              >
                <div className="h-44 rounded-xl overflow-hidden border border-[#cddfff] bg-[#f3f8ff]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#123b79]">{item.name}</h3>
                <p className="text-sm font-medium text-[#00529b]">{item.subtitle}</p>
                <p className="mt-3 text-sm leading-6 text-[#31537f]">{item.description}</p>

                <div className="mt-4">
                  <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#5875a4]">Typical Use Cases</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-[#224a85]">
                    {item.useCases.map((line) => (
                      <li key={line} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00529b] shrink-0" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 rounded-xl border border-[#d8e7ff] bg-[#f2f8ff] p-3">
                  <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#5875a4]">Specifications</p>
                  <ul className="mt-2 space-y-2">
                    {item.specs.map((spec, index) => (
                      <li key={spec.label} className="flex items-start gap-2 text-sm">
                        <SpecIcon index={index} />
                        <p className="text-[#224a85] leading-5">
                          <span className="font-semibold text-[#123b79]">{spec.label}: </span>
                          {spec.value}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
