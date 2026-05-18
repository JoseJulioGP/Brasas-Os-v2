const metrics = [
  { value: "+15%", label: "Aumento de margen bruto" },
  { value: "-30%", label: "Reducción de desperdicio" },
  { value: "100%", label: "Control de costos reales" },
  { value: "24/7", label: "Disponibilidad de datos" },
];

export const ImpactMetrics = () => (
  <section className="relative border-t border-white/[0.06] py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="glass rounded-2xl p-6 text-center">
            <p className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-b from-[#f5f0eb] to-white/40 bg-clip-text text-transparent">
              {m.value}
            </p>
            <p className="text-sm text-white/40 font-body mt-2">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
