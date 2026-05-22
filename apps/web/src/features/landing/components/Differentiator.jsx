import { useNavigate } from "react-router-dom";
import { FiPieChart } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

export const Differentiator = () => {
  const navigate = useNavigate();

  return (
    <section className="relative border-t border-white/[0.06] py-24">
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/8 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div className="glass rounded-3xl p-12 md:p-16 border border-orange-500/10">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
            <FiPieChart className="text-3xl text-orange-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#f5f0eb] mb-6">
            No es un sistema de pedidos. <br />
            <span className="text-orange-400">Es tu director financiero digital.</span>
          </h2>
          <p className="text-lg text-white/50 font-body max-w-2xl mx-auto mb-10 leading-relaxed">
            La mayoría del software para restaurantes se enfoca en tomar pedidos rápido.
            Brasas OS se enfoca en una pregunta más importante:{" "}
            <strong className="text-white/70">¿estás ganando o perdiendo plata con cada plato que vendés?</strong>
          </p>
          <button
            onClick={() => navigate("/register")}
            className="group px-10 py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/25 hover:shadow-orange-600/40 inline-flex items-center gap-3"
          >
            Descubrí tu rentabilidad real
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
