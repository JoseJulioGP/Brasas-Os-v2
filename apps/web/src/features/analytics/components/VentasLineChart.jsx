import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";

const fmt = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP",
    maximumFractionDigits: 0, notation: "compact",
  }).format(v);

const TooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const esReal = payload[0]?.name === "real";
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-xs font-body space-y-1">
      <p className="text-[#f5f0eb] font-semibold">{label}</p>
      {payload.map((p) => p.value != null && (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "real" ? "✓ Vendido" : "~ Estimado"}: {fmt(p.value)}
        </p>
      ))}
      {!esReal && (
        <p className="text-white/25 pt-1 border-t border-white/10">Proyección basada en tu historial</p>
      )}
    </div>
  );
};

export const VentasLineChart = ({ meses = [] }) => {
  const mesesReales = meses.filter((m) => m.tipo === "real");
  const primerProy  = meses.find((m) => m.tipo === "proyectado");

  const data = meses.map((m, i) => {
    const esReal   = m.tipo === "real";
    const esPuente = !esReal && i > 0 && meses[i - 1].tipo === "real";
    return {
      nombre:     m.nombre,
      real:       esReal || esPuente ? m.ingresos : null,
      proyectado: !esReal ? m.ingresos : null,
    };
  });

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-base font-heading font-bold text-[#f5f0eb] mb-0.5">
        Ventas por mes
      </h3>
      <p className="text-xs text-white/40 font-body mb-4">
        {mesesReales.length === 0
          ? "Aún no hay ventas registradas — el gráfico mostrará datos al completar pedidos"
          : `${mesesReales.length} mes${mesesReales.length > 1 ? "es" : ""} con ventas reales · línea punteada = estimación`}
      </p>

      {mesesReales.length === 0 ? (
        <div className="h-[260px] flex flex-col items-center justify-center text-center">
          <p className="text-3xl mb-2">📊</p>
          <p className="text-sm text-white/30 font-body">Completá tu primer pedido<br />para ver el gráfico</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gradReal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#34d399" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradProy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f97316" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="nombre" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} width={72} />
            <Tooltip content={<TooltipCustom />} />
            <Legend formatter={(v) => (
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                {v === "real" ? "✓ Real" : "~ Estimado"}
              </span>
            )} />

            {primerProy && (
              <ReferenceLine
                x={primerProy.nombre}
                stroke="rgba(255,255,255,0.12)"
                strokeDasharray="4 4"
                label={{ value: "Proyección →", fill: "rgba(255,255,255,0.25)", fontSize: 9, position: "insideTopRight" }}
              />
            )}

            <Area type="monotone" dataKey="real" stroke="#34d399" strokeWidth={2}
              fill="url(#gradReal)" connectNulls dot={false} activeDot={{ r: 4, fill: "#34d399", strokeWidth: 0 }} />
            <Area type="monotone" dataKey="proyectado" stroke="#f97316" strokeWidth={2} strokeDasharray="5 4"
              fill="url(#gradProy)" connectNulls dot={false} activeDot={{ r: 4, fill: "#f97316", strokeWidth: 0 }} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
