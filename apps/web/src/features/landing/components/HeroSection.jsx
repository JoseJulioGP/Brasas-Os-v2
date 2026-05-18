import { useNavigate } from "react-router-dom";
import { FiBarChart2 } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

const FloatingParticle = () => (
  <div
    className="absolute rounded-full bg-orange-500/20"
    style={{
      width: `${Math.random() * 6 + 2}px`,
      height: `${Math.random() * 6 + 2}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 5}s`,
    }}
  />
);

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/15 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-600/8 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-700/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-[2px] h-[200px] bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute bottom-1/3 left-1/3 w-[2px] h-[150px] bg-gradient-to-b from-transparent via-amber-500/15 to-transparent" />
      {Array.from({ length: 25 }).map((_, i) => (
        <FloatingParticle key={i} />
      ))}

      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[300px] opacity-[0.04] pointer-events-none hidden lg:block">
        <svg viewBox="0 0 400 300" fill="none">
          <path d="M0 250 L40 200 L80 220 L120 150 L160 180 L200 100 L240 130 L280 80 L320 110 L360 40 L400 70" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 270 L40 230 L80 240 L120 180 L160 200 L200 130 L240 150 L280 100 L320 120 L360 70 L400 90" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <path d="M0 280 L40 260 L80 265 L120 220 L160 230 L200 180 L240 195 L280 150 L320 160 L360 120 L400 135" stroke="#fed7aa" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        </svg>
      </div>

      <div className="flex-1 flex items-center z-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-sm font-medium mb-8 font-body animate-fade-in-up">
              <FiBarChart2 className="text-xs" />
              Inteligencia financiera para tu restaurante
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-[#f5f0eb] leading-[1.05] mb-8 animate-fade-in-up stagger-1">
              Convertí datos de tu restaurante en{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                ganancias reales
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 font-body max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up stagger-2">
              Brasas OS analiza costos, márgenes e inventario para mostrarte exactamente
              dónde invertir cada peso. No solo administrés —{" "}
              <strong className="text-white/70">optimizá tu rentabilidad</strong>{" "}
              por plato, por corte, por día.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
              <button
                onClick={() => navigate("/register")}
                className="group px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/25 hover:shadow-orange-600/40 flex items-center gap-3"
              >
                Empezá a medir tu rentabilidad
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 border border-white/[0.12] text-white/70 rounded-2xl font-medium text-lg hover:bg-white/[0.04] hover:text-white transition-all font-body"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-8 animate-fade-in-up stagger-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/30 font-body font-medium tracking-widest uppercase">Descubrí más</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-orange-400 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
