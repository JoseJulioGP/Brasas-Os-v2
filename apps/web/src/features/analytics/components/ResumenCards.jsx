export const ResumenCards = ({ totalProductos, totalIngresos, totalCostos, margenPromedio }) => {
  const formatCurrency = (v) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

  const pct = margenPromedio || 0;
  const pctColor = pct > 30 ? "text-emerald-400" : pct > 15 ? "text-amber-400" : "text-red-400";

  const cards = [
    { label: "Productos activos",      value: totalProductos,            color: "text-[#f5f0eb]" },
    { label: "Ingreso total potencial", value: formatCurrency(totalIngresos), color: "text-emerald-400" },
    { label: "Costo total producción",  value: formatCurrency(totalCostos),   color: "text-red-400" },
    {
      label: "Margen promedio",
      value: <span className={`text-2xl font-bold font-number ${pctColor}`}>{pct.toFixed(1)}%</span>,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in-up opacity-0 stagger-1">
      {cards.map((c, i) => (
        <div key={i} className="glass rounded-2xl p-5">
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-2">{c.label}</p>
          <div className={c.color}>{typeof c.value === "string" ? <span className="text-2xl font-bold font-number">{c.value}</span> : c.value}</div>
        </div>
      ))}
    </div>
  );
};
