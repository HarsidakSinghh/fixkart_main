const useCases = [
  {
    title: "Decrease Unplanned Downtime",
    description:
      "AI-powered monitoring predicts failures early, helping teams intervene before critical stoppages impact production.",
    image: "/industry/usecases/decrease-unplanned-downtime.jpg",
  },
  {
    title: "Avoid Reputation-Damaging Outages",
    description:
      "Anomaly detection and continuous diagnostics reduce unexpected breakdowns and improve service reliability.",
    image: "/industry/usecases/avoid-outages.jpg",
  },
  {
    title: "Improve Employee Productivity",
    description:
      "Smarter workflows and real-time insights help operators focus on high-value tasks with fewer manual checks.",
    image: "/industry/usecases/improve-employee-productivity.jpg",
  },
  {
    title: "Reduce Field Service Costs",
    description:
      "Remote diagnostics and condition-based service planning reduce unnecessary visits and maintenance overhead.",
    image: "/industry/usecases/reduce-field-service-costs.jpg",
  },
  {
    title: "Increase Asset Quality",
    description:
      "Unified dashboards track health and performance across assets, extending lifecycle and improving utilization.",
    image: "/industry/usecases/increase-asset-quality.jpg",
  },
  {
    title: "Improve Worker Safety",
    description:
      "Vision-led safety checks in hazardous zones strengthen compliance, reduce risk exposure, and support safer operations.",
    image: "/industry/usecases/improved-worker-safety.jpg",
  },
  {
    title: "Enhancing Worker Safety in Robotic Cells",
    description:
      "Integrated machine vision with robotics helps detect intrusion events and enforce safe zones around robotic cells.",
    image: "/industry/usecases/robotic-cell-safety.jpg",
  },
  {
    title: "Workforce Safety",
    description:
      "Real-time monitoring and tracking reduce hazards across factories, construction zones, and industrial sites.",
    image: "/industry/usecases/workforce-safety.jpg",
  },
  {
    title: "Security Enhancement",
    description:
      "Video intelligence enhances visibility and incident response across warehouses, plants, and commercial campuses.",
    image: "/industry/usecases/security-enhancement.jpg",
  },
  {
    title: "Quality Control",
    description:
      "Automated object detection and classification improve consistency and accelerate root-cause discovery in production.",
    image: "/industry/usecases/quality-control.jpg",
  },
  {
    title: "Audience / Visitor Analytics",
    description:
      "Behavior and footfall analytics support queue management, anomaly detection, and visitor experience optimization.",
    image: "/industry/usecases/visitor-analytics.jpg",
  },
  {
    title: "Energy Management",
    description:
      "Optimize plant energy consumption with AI-driven insights for higher efficiency and lower operating costs.",
    image: "/industry/usecases/energy-management.jpg",
  },
  {
    title: "Reduce Carbon Emission",
    description:
      "Improve resource efficiency and sustainability by tracking emission-heavy operations and reducing wasteful patterns.",
    image: "/industry/usecases/reduce-carbon-emission.jpg",
  },
  {
    title: "Energy Asset Monitoring",
    description:
      "Continuously monitor critical power assets for early anomaly detection and predictive maintenance planning.",
    image: "/industry/usecases/energy-asset-monitoring.jpg",
  },
  {
    title: "Inventory Optimization",
    description:
      "Gain supply-chain visibility to reduce stock costs while improving inventory availability and turnover.",
    image: "/industry/usecases/inventory-optimization.jpg",
  },
  {
    title: "Fleet Planning",
    description:
      "Improve fleet utilization and route efficiency with real-time status intelligence and proactive planning.",
    image: "/industry/usecases/fleet-planning.jpg",
  },
  {
    title: "Warehouse Optimization",
    description:
      "Streamline warehouse operations through smarter planning, movement visibility, and workload balancing.",
    image: "/industry/usecases/warehouse-optimization.jpg",
  },
  {
    title: "Predictive Maintenance",
    description:
      "IoT and vision-based condition tracking generates maintenance timelines that reduce breakdowns and downtime.",
    image: "/industry/usecases/predictive-maintenance.jpg",
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
