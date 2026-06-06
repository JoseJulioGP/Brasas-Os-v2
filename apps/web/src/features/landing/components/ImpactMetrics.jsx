const metrics = [
  { value: "3 roles",  label: "Admin · Jefe · Empleado",    sub: "Accesos diferenciados por función" },
  { value: "100%",     label: "Multi-tenancy",               sub: "Datos aislados por restaurante"    },
  { value: "Real-time",label: "Stock actualizado",           sub: "Al completar cada pedido"          },
  { value: "JWT",      label: "Autenticación segura",        sub: "Tokens con expiración automática"  },
];

export const ImpactMetrics = () => (
  <section className="relative border-t border-white/[0.06] py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-sm text-white/30">Diseñado para la operación real de un restaurante</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <div key={i}
            className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 text-center hover:border-white/[0.1] transition-colors">
            <p className="text-3xl md:text-4xl font-bold text-[#f5f0eb] mb-1"
              style={{ fontFamily: "Georgia, serif" }}>
              {m.value}
            </p>
            <p className="text-xs font-semibold text-orange-400/80 mb-1">{m.label}</p>
            <p className="text-[11px] text-white/25">{m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
