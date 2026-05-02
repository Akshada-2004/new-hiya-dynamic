export default function StatsStrip() {
  const stats = [
    {
      number: "1000+",
      label: "Cities Covered",
    },
    {
      number: "50+",
      label: "Digital Services",
    },
    {
      number: "10K+",
      label: "Happy Clients",
    },
    {
      number: "99%",
      label: "Satisfaction Rate",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#003b8e] via-[#00439d] to-[#243b8f] py-16 lg:py-20">
      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,.12),transparent_35%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`text-center py-6 ${
                index !== stats.length - 1
                  ? "lg:border-r lg:border-white/10"
                  : ""
              }`}
            >
              <h2 className="text-white text-5xl md:text-6xl font-bold tracking-tight">
                {item.number}
              </h2>

              <p className="mt-3 text-white/80 text-lg md:text-xl font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}