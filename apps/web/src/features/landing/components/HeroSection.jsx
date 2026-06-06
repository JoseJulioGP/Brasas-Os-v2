import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaFire, FaShoppingCart, FaUtensils, FaBox } from "react-icons/fa";
import { FiTrendingUp, FiAlertCircle } from "react-icons/fi";

/* ── Mini dashboard mockup ── */
const DashboardMockup = () => (
  <div className="relative w-full max-w-[520px] mx-auto">
    {/* Glow behind */}
    <div className="absolute inset-0 bg-orange-600/10 blur-[60px] rounded-3xl" />

    <div className="relative bg-[#0f0f0e] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
            <FaFire className="text-orange-400 text-[10px]" />
          </div>
          <span className="text-xs font-semibold text-white/60" style={{ fontFamily: "Georgia, serif" }}>Brasas OS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400/60" />
          <span className="text-[10px] text-white/30">En vivo</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Ingresos hoy",  value: "$284.500", up: true  },
            { label: "Margen bruto",  value: "38.4%",    up: true  },
            { label: "Stock crítico", value: "2 items",  up: false },
          ].map(({ label, value, up }) => (
            <div key={label} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
              <p className="text-[9px] text-white/30 mb-1">{label}</p>
              <p className={`text-sm font-bold font-mono ${up ? "text-[#f5f0eb]" : "text-red-400"}`}>{value}</p>
              <div className={`flex items-center gap-1 mt-1 text-[9px] ${up ? "text-emerald-400" : "text-red-400"}`}>
                <FiTrendingUp className={up ? "" : "rotate-180"} />
                <span>{up ? "+12% vs ayer" : "Reponer pronto"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pedidos recientes */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Pedidos activos</span>
            <span className="text-[9px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">3 en curso</span>
          </div>
          <div className="space-y-1.5">
            {[
              { id: "#A1B2", producto: "Hamburguesa + Papas", estado: "preparando", color: "text-amber-400 bg-amber-500/10" },
              { id: "#C3D4", producto: "Bife de chorizo",     estado: "pendiente",  color: "text-blue-400 bg-blue-500/10"  },
              { id: "#E5F6", producto: "Entraña + Chimich.",  estado: "entregado",  color: "text-green-400 bg-green-500/10"},
            ].map(({ id, producto, estado, color }) => (
              <div key={id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaShoppingCart className="text-[9px] text-white/20" />
                  <span className="text-[10px] text-white/50 font-mono">{id}</span>
                  <span className="text-[10px] text-white/40">{producto}</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${color}`}>{estado}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top productos */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Top rentabilidad</span>
          <div className="mt-2 space-y-1.5">
            {[
              { nombre: "Bife de Chorizo", margen: "52%", bar: 90 },
              { nombre: "Hamburguesa Clásica", margen: "44%", bar: 75 },
              { nombre: "Entraña con guarnición", margen: "38%", bar: 63 },
            ].map(({ nombre, margen, bar }) => (
              <div key={nombre}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-white/40 flex items-center gap-1">
                    <FaUtensils className="text-[8px] text-orange-400/50" /> {nombre}
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">{margen}</span>
                </div>
                <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: `${bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert */}
        <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/15 rounded-xl px-3 py-2">
          <FiAlertCircle className="text-red-400 text-xs shrink-0" />
          <p className="text-[10px] text-red-300/80">
            <strong>Carne de res</strong> por debajo del stock mínimo — quedan 1.2 kg
          </p>
        </div>
      </div>
    </div>
  </div>
);

/* ── Hero ── */
export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(234,88,12,0.12),transparent)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-orange-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: copy ── */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400/80 text-xs font-medium mb-8 animate-fade-in-up">
              <FaFire className="text-[10px]" />
              Sistema de gestión para restaurantes
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-[#f5f0eb] leading-[1.05] mb-6 animate-fade-in-up stagger-1"
              style={{ fontFamily: "Georgia, serif" }}>
              Gestioná tu<br />
              restaurante con<br />
              <span className="text-orange-400">datos reales.</span>
            </h1>

            <p className="text-base text-white/45 leading-relaxed mb-10 max-w-md animate-fade-in-up stagger-2">
              Pedidos, inventario, menú y márgenes en un solo lugar.
              Sabé exactamente qué plato rinde más y cuándo reponer stock —
              en tiempo real.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-10 animate-fade-in-up stagger-2">
              {["Control de pedidos", "Inventario inteligente", "Margen por plato", "Multi-rol"].map(f => (
                <span key={f} className="text-xs text-white/40 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full">
                  {f}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-3">
              <button onClick={() => navigate("/register")}
                className="group px-7 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2">
                Crear mi restaurante
                <FaArrowRight className="text-sm group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => navigate("/login")}
                className="px-7 py-3.5 border border-white/[0.1] text-white/60 hover:text-white hover:border-white/20 rounded-xl font-medium transition-all">
                Iniciar sesión
              </button>
            </div>
          </div>

          {/* ── Right: mockup ── */}
          <div className="animate-fade-in-up stagger-2 lg:stagger-1">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
};
