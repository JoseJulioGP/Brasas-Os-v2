import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP",
    maximumFractionDigits: 0, notation: "compact",
  }).format(v);

const TooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-xs font-body">
      <p className="text-[#f5f0eb] font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }}>
          {p.name}: {formatCOP(p.value)}
        </p>
      ))}
    </div>
  );
};

export const IngresoCostoBarChart = ({ meses = [] }) => {
  const data = meses.map((m) => ({
    nombre:   m.nombre,
    Ingresos: m.ingresos,
    Costos:   m.costos,
    tipo:     m.tipo,
  }));

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-base font-heading font-bold text-[#f5f0eb] mb-0.5">
        Ingresos vs Costos
      </h3>
      <p className="text-xs text-white/40 font-body mb-4">
        Barras semitransparentes = meses proyectados
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 8, left: 0, bottom: 5 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

          <XAxis
            dataKey="nombre"
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={formatCOP}
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
            axisLine={false} tickLine={false} width={72}
          />

          <Tooltip content={<TooltipCustom />} />

          <Legend
            formatter={(v) => (
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{v}</span>
            )}
          />

          <Bar dataKey="Ingresos" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill="#34d399" opacity={entry.tipo === "real" ? 1 : 0.45} />
            ))}
          </Bar>

          <Bar dataKey="Costos" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill="#f87171" opacity={entry.tipo === "real" ? 1 : 0.45} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
