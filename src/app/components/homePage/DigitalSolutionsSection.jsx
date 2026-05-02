import {
  Code2,
  ShoppingCart,
  Globe,
  Server,
  Search,
  Palette,
  Smartphone,
  Wrench,
} from "lucide-react";

const services = [
  {
    title: "Web Development",
    description:
      "Custom, high-performance websites built with modern frameworks to drive conversions.",
    icon: <Code2 size={26} />,
    color: "group-hover:bg-[#ca202f]/10 group-hover:text-[#ca202f]",
  },
  {
    title: "Ecommerce Development",
    description:
      "Robust online stores tailored for seamless payment integrations.",
    icon: <ShoppingCart size={26} />,
    color: "group-hover:bg-[#ca202f]/10 group-hover:text-[#ca202f]",
  },
  {
    title: "Domain Registration",
    description:
      "Secure your brand identity with .in, .co.in and global domains instantly.",
    icon: <Globe size={26} />,
    color: "group-hover:bg-[#ca202f]/10 group-hover:text-[#ca202f]",
  },
  {
    title: "Premium Hosting",
    description:
      "Lightning-fast secure hosting built for performance and uptime.",
    icon: <Server size={26} />,
    color: "group-hover:bg-[#ca202f]/10 group-hover:text-[#ca202f]",
  },
  {
    title: "SEO Services",
    description: "Data-driven SEO strategies to dominate search results.",
    icon: <Search size={26} />,
    color: "group-hover:bg-[#ca202f]/10 group-hover:text-[#ca202f]",
  },
  {
    title: "Brand Identity",
    description: "Memorable branding that resonates with your audience.",
    icon: <Palette size={26} />,
    color: "group-hover:bg-[#ca202f]/10 group-hover:text-[#ca202f]",
  },
  {
    title: "UI/UX Design",
    description: "Intuitive interfaces designed for modern users.",
    icon: <Smartphone size={26} />,
    color: "group-hover:bg-[#ca202f]/10 group-hover:text-[#ca202f]",
  },
  {
    title: "Maintenance",
    description:
      "24/7 support and regular updates to keep everything smooth.",
    icon: <Wrench size={26} />,
    color: "group-hover:bg-[#ca202f]/10 group-hover:text-[#ca202f]",
  },
];

export default function DigitalSolutionsSection() {
  return (
    <section className="py-24 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <p className="text-[#ca202f] font-semibold tracking-[3px] uppercase mb-4">
            Our Expertise
          </p>

          {/* 36px heading */}
          <h2 className="text-[36px] font-bold text-slate-900 mb-5">
            Comprehensive Digital Solutions
          </h2>

          <p className="max-w-3xl mx-auto text-lg text-slate-500 leading-8">
            Everything your business needs to establish, scale, and secure its
            online presence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
          {services.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-[28px] border border-gray-200 bg-white p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-[#fff8f8]"
            >
              {/* top line */}
              <div className="absolute top-0 left-0 h-1 w-0 bg-[#ca202f] rounded-full transition-all duration-500 group-hover:w-full" />

              {/* icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gray-100 text-gray-700 transition-all duration-500 group-hover:scale-110 ${item.color}`}
              >
                {item.icon}
              </div>

              {/* title */}
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#ca202f] transition-colors">
                {item.title}
              </h3>

              {/* description */}
              <p className="text-slate-500 leading-8 text-lg">
                {item.description}
              </p>

              {/* hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_right,_rgba(202,32,47,.08),transparent_45%)] pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}