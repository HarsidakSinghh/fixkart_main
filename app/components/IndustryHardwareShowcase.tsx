import Link from "next/link";
import { ArrowLeft, Cpu, Gauge, HardDrive, MemoryStick, Network, Sparkles } from "lucide-react";

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
      "Compact edge system accelerated by NVIDIA AGX Jetson Orin for real-time AI in mobile and disconnected industrial deployments.",
    useCases: [
      "Video analytics and computer vision",
      "Autonomous systems and IoT AI",
      "Audio/video batch inference at the edge",
      "Remote rugged industrial operations",
    ],
    specs: [
      { label: "GPU", value: "64GB, 2048 CUDA cores, up to 275 INT8 TOPS" },
      { label: "CPU", value: "Arm Cortex-A78AE cluster, up to 12 cores" },
      { label: "Memory", value: "Up to 64GB LPDDR5 (~204 GB/s)" },
      { label: "Compute", value: "Up to 5.3 TFLOPS FP32" },
      { label: "Power Profile", value: "Optimized edge profiles with configurable modes" },
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
      { label: "CPU", value: "Intel Xeon W7-2575X, 22 cores / 44 threads" },
      { label: "GPU", value: "2x NVIDIA RTX Pro 6000 Blackwell" },
      { label: "Memory", value: "192GB ECC DDR5 (6x 32GB)" },
      { label: "Storage", value: "2x 2TB SATA + 1TB PCIe NVMe SSD" },
      { label: "Power/Network", value: "2000W PSU, dual-port X550 10GbE" },
    ],
  },
];

function SpecIcon({ index }: { index: number }) {
  const icons = [Cpu, MemoryStick, HardDrive, Network, Gauge, Sparkles];
  const Icon = icons[index % icons.length];
  return <Icon size={14} className="text-[#00529b]" />;
}

export default function IndustryHardwareShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f3f8ff] text-[#133b72]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-5 md:px-8 py-8 md:py-16">
        <Link
          href="/industry-4-0"
          className="inline-flex items-center gap-2 rounded-full border border-[#bfd6fb] bg-white px-4 py-2 text-sm font-semibold text-[#00529b] hover:bg-[#ecf4ff] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Overview
        </Link>

        <header className="mt-4 rounded-3xl border border-[#d7e7ff] bg-gradient-to-r from-white to-[#f1f7ff] p-5 sm:p-7 md:p-10 shadow-[0_25px_55px_-35px_rgba(0,65,150,0.35)]">
          <p className="text-xs tracking-[0.2em] uppercase text-[#5f7eac] font-semibold">Industry 4.0 Hardware</p>
          <h1 className="mt-3 text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight text-[#123b79]">
            Edge to Datacenter AI Systems
          </h1>
          <p className="mt-3 max-w-4xl text-[#2f517e] leading-7 text-sm sm:text-base">
            Production-ready hardware stack for AI in manufacturing, from compact edge deployments to private datacenter-grade systems.
          </p>
        </header>

        <section className="mt-6 md:mt-10 grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {HARDWARE_ITEMS.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-[#d3e4ff] bg-gradient-to-b from-white to-[#f5f9ff] p-4 sm:p-5 md:p-6 shadow-[0_20px_36px_-30px_rgba(0,65,150,0.4)]"
            >
              <div className="h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#ccdeff] bg-[#f3f8ff]">
                <img src={item.image} alt={item.name} className="h-full w-full object-contain p-3" />
              </div>

              <h2 className="mt-4 text-xl sm:text-2xl font-bold text-[#123b79]">{item.name}</h2>
              <p className="text-[#00529b] font-semibold text-sm sm:text-base">{item.subtitle}</p>
              <p className="mt-2.5 text-[#31537f] text-sm leading-6">{item.description}</p>

              <div className="mt-4 rounded-2xl border border-[#d8e7ff] bg-[#f2f8ff] p-3.5 sm:p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#5f7eac] font-semibold">Typical Use Cases</p>
                <ul className="mt-2.5 space-y-2 text-sm text-[#224a85]">
                  {item.useCases.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00529b] shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3.5 rounded-2xl border border-[#d8e7ff] bg-[#f2f8ff] p-3.5 sm:p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#5f7eac] font-semibold">Specifications</p>
                <ul className="mt-2.5 space-y-2">
                  {item.specs.map((spec, index) => (
                    <li key={spec.label} className="flex items-start gap-2 text-sm">
                      <SpecIcon index={index} />
                      <p className="text-[#224a85] leading-6">
                        <span className="font-semibold text-[#123b79]">{spec.label}: </span>
                        {spec.value}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
