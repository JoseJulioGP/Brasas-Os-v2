import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";

const fmt = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP",
    maximumFractionDigits: 0, notation: "compact",
  }).format(v);

const TooltipCustom = ({ active, payload, label, data }) => {
  if (!active || !payload?.length) return null;
  const mes  = data?.find((d) => d.nombre === label);
  const esReal = mes?.tipo === "real";
  const ingresos = payload.find((p) => p.name === "Vendido")?.value ?? 0;
  const costos   = payload.find((p) => p.name === "Costos")?.value  ?? 0;
  const ganancia = ingresos - costos;

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-xs font-body space-y-1 min-w-[160px]">
      <p className="text-[#f5f0eb] font-semibold">{label} {!esReal && <span className="text-white/30">(estimado)</span>}</p>
      <p className="text-emerald-400">Vendido: {fmt(ingresos)}</p>
      <p className="text-red-400">Costos: {fmt(costos)}</p>
      <p className={`pt-1 border-t border-white/10 font-semibold ${ganancia >= 0 ? "text-emerald-300" : "text-red-300"}`}>
        Ganancia: {fmt(ganancia)}
      </p>
    </div>
  );
};

export const IngresoCostoBarChart = ({ meses = [] }) => {
  const mesesReales = meses.filter((m) => m.tipo === "real");
  const data = meses.map((m) => ({
    nombre:  m.nombre,
    Vendido: m.ingresos,
    Costos:  m.costos,
    tipo:    m.tipo,
  }));

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-base font-heading font-bold text-[#f5f0eb] mb-0.5">
        Vendido vs Costos
      </h3>
      <p className="text-xs text-white/40 font-body mb-4">
        {mesesReales.length === 0
          ? "Sin datos reales aún — aparecerán cuando completes pedidos"
          : "Verde = lo que cobrás · Rojo = lo que te cuesta producir · Diferencia = ganancia"}
      </p>

      {mesesReales.length === 0 ? (
        <div className="h-[260px] flex flex-col items-center justify-center text-center">
          <p className="text-3xl mb-2">💰</p>
          <p className="text-sm text-white/30 font-body">Completá pedidos para<br />ver la comparación</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 8, left: 0, bottom: 5 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="nombre" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} width={72} />
            <Tooltip content={<TooltipCustom data={data} />} />
            <Legend formatter={(v) => (
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                {v === "Vendido" ? "✓ Vendido" : "Costos producción"}
              </span>
            )} />

            <Bar dataKey="Vendido" radius={[3, 3, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill="#34d399" opacity={entry.tipo === "real" ? 1 : 0.35} />
              ))}
            </Bar>
            <Bar dataKey="Costos" radius={[3, 3, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill="#f87171" opacity={entry.tipo === "real" ? 1 : 0.35} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
