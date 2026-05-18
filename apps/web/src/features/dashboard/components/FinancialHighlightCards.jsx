import { FaPercentage } from "react-icons/fa";

export const FinancialHighlightCards = ({ ingresos, costos }) => {
  const ganancia = ingresos - costos;
  const margen = ingresos > 0 ? (ganancia / ingresos) * 100 : 0;

  const cards = [
    { label: "Ingresos", value: `$${(ingresos || 0).toLocaleString()}`, color: "text-emerald-400" },
    { label: "Costos", value: `$${(costos || 0).toLocaleString()}`, color: "text-red-400" },
    { label: "Ganancia Neta", value: `$${Math.round(ganancia).toLocaleString()}`, color: ganancia >= 0 ? "text-emerald-400" : "text-red-400" },
    {
      label: "Margen Bruto",
      value: (
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold font-number ${margen > 30 ? "text-emerald-400" : margen > 15 ? "text-amber-400" : "text-red-400"}`}>
            {margen.toFixed(1)}%
          </span>
          <FaPercentage className={`text-lg ${margen > 30 ? "text-emerald-400" : margen > 15 ? "text-amber-400" : "text-red-400"}`} />
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => (
        <div key={i} className="glass rounded-2xl p-5 glass-hover">
          <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-2">{c.label}</p>
          <div className={c.color}>{typeof c.value === "string" ? <span className="text-2xl font-bold font-number">{c.value}</span> : c.value}</div>
        </div>
      ))}
    </div>
  );
};
