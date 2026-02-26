const useCases = [
  {
    title: "Decrease Unplanned Downtime",
    description:
      "AI-powered monitoring predicts failures early, helping teams intervene before critical stoppages impact production.",
    image: "/indus/predic.png",
  },
  {
    title: "Avoid Reputation-Damaging Outages",
    description:
      "Anomaly detection and continuous diagnostics reduce unexpected breakdowns and improve service reliability.",
    image: "/indus/predict-ai-damaging-outages.png",
  },
  {
    title: "Improve Employee Productivity",
    description:
      "Smarter workflows and real-time insights help operators focus on high-value tasks with fewer manual checks.",
    image: "/indus/emplye.png",
  },
  {
    title: "Reduce Field Service Costs",
    description:
      "Remote diagnostics and condition-based service planning reduce unnecessary visits and maintenance overhead.",
    image: "/indus/1.png",
  },
  {
    title: "Increase Asset Quality",
    description:
      "Unified dashboards track health and performance across assets, extending lifecycle and improving utilization.",
    image: "/indus/assetqual.png",
  },
  {
    title: "Improve Worker Safety",
    description:
      "Vision-led safety checks in hazardous zones strengthen compliance, reduce risk exposure, and support safer operations.",
    image: "/indus/safety.webp",
  },
  {
    title: "Enhancing Worker Safety in Robotic Cells",
    description:
      "Integrated machine vision with robotics helps detect intrusion events and enforce safe zones around robotic cells.",
    image: "/indus/defect_detect.png",
  },
  {
    title: "Workforce Safety",
    description:
      "Real-time monitoring and tracking reduce hazards across factories, construction zones, and industrial sites.",
    image: "/indus/worksafe.jpeg",
  },
  {
    title: "Security Enhancement",
    description:
      "Video intelligence enhances visibility and incident response across warehouses, plants, and commercial campuses.",
    image: "/indus/securityenhance.png",
  },
  {
    title: "Quality Control",
    description:
      "Automated object detection and classification improve consistency and accelerate root-cause discovery in production.",
    image: "/indus/qualcontrol.png",
  },
  {
    title: "Audience / Visitor Analytics",
    description:
      "Behavior and footfall analytics support queue management, anomaly detection, and visitor experience optimization.",
    image: "/indus/visiter.png",
  },
  {
    title: "Energy Management",
    description:
      "Optimize plant energy consumption with AI-driven insights for higher efficiency and lower operating costs.",
    image: "/indus/mans.png",
  },
  {
    title: "Reduce Carbon Emission",
    description:
      "Improve resource efficiency and sustainability by tracking emission-heavy operations and reducing wasteful patterns.",
    image: "/indus/reducecarbon.jpg",
  },
  {
    title: "Energy Asset Monitoring",
    description:
      "Continuously monitor critical power assets for early anomaly detection and predictive maintenance planning.",
    image: "/indus/energyasset.png",
  },
  {
    title: "Inventory Optimization",
    description:
      "Gain supply-chain visibility to reduce stock costs while improving inventory availability and turnover.",
    image: "/indus/spot-inventory-optimization.png",
  },
  {
    title: "Fleet Planning",
    description:
      "Improve fleet utilization and route efficiency with real-time status intelligence and proactive planning.",
    image: "/indus/fleet.png",
  },
  {
    title: "Warehouse Optimization",
    description:
      "Streamline warehouse operations through smarter planning, movement visibility, and workload balancing.",
    image: "/indus/warehouseoptimize.png",
  },
  {
    title: "Predictive Maintenance",
    description:
      "IoT and vision-based condition tracking generates maintenance timelines that reduce breakdowns and downtime.",
    image: "/indus/predic.png",
  },
];

export default function IndustryUseCaseCards() {
  return (
    <section className="mt-14 rounded-3xl border border-[#d8e3f5] bg-white p-6 md:p-8 shadow-[0_14px_36px_-30px_rgba(20,55,110,0.45)]">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Use Cases</h2>
      <p className="mt-2 text-slate-600 text-sm md:text-base">
        Practical outcomes delivered by computer vision and Industry 4.0 intelligence.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {useCases.map((item) => (
          <article
            key={item.title}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all"
          >
            <div className="h-52 bg-slate-100">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-slate-900 leading-tight">{item.title}</h3>
              <p className="mt-3 text-slate-600 leading-7 text-sm md:text-base">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
